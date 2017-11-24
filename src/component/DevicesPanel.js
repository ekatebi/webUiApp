import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Overlay, DropdownButton, MenuItem as MenuItemBs } from 'react-bootstrap';
import Loader from 'react-loader';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import * as deviceActionsRaw from './device/actions';
import * as filterActionsRaw from './filter/actions';
import * as epgActionsRaw from './epg/actions';
import Panel from './Panel';
import Device from './device/Device';
import { fetchDevice } from '../service/apiFetch/device';
import {
  TOGGLE_MENU_ITEM,
  MENU_ITEM_SOURCES,
  MENU_ITEM_DISPLAYS
} from './appMenu/constants';
import {
  GET,
  SET,
  DEVICE_COLOR_GREEN,
  DEVICE_COLOR_YELLOW,
  DEVICE_COLOR_RED,
  PAGINATION
} from '../constant/app';
import keydown from 'react-keydown';
import DevicePopupPanel from './DevicePopupPanel';
import { getPosition } from '../service/dom';
import EpgHome from './epg/EpgHome';
import PlayerHome from './epg/PlayerHome';

const KEYS = ['esc'];
 
@keydown(KEYS)
class DevicesPanel extends Component {

  static propTypes = {
    settings: PropTypes.object.isRequired,
    connectDropTarget: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      isInfoCleared: false,
      activePage: 1,
      sortedDeviceListSettings: [],
      firmwareVerShow: false,
      popupPanelPosition: { x: 100, y: 100 }, 
    };  
    this.deviceColor = this.deviceColor.bind(this);
    this.prepDeviceList = this.prepDeviceList.bind(this);
    this.fetchInfo = this.fetchInfo.bind(this);
    this.firmwareVerDiv = this.firmwareVerDiv.bind(this);
    this.firmwareRevPopupToggle = this.firmwareRevPopupToggle.bind(this);
  }

  fetchInfo(props) {
    const { requestForInfo, deviceActions } = props;
    const { onRequestInfo } = deviceActions;

    if (requestForInfo) {
      onRequestInfo();
    }
  }

  componentWillMount() {
    // Get information on all the devices via the API, and start the long polling loop.
//    console.log('DevicesPanel Mount');

    this.fetchInfo(this.props);
    this.prepDeviceList(this.props);


    if (window.epg) {
      const { epgActions } = this.props;
      epgActions.onRequestEpg();
    }

  }
/*
  componentWillUnmount() {
    console.log('DevicesPanel Unmount');    
  }
*/
  componentWillReceiveProps(nextProps) {
    // Not needed.    this.fetchInfo(nextProps);

    const { keydown, firmwareVerSource } = nextProps;

    if (keydown.event) {
      // inspect the keydown event and decide what to do 
      console.log('DevicesPanel', keydown.event.which);
    }

    this.prepDeviceList(nextProps);
  }

  // Used for filtering
  deviceColor(deviceSettings) {
    // Force virtual devices green in demo mode, "virtual".
    if (window.virtual) {
      if (deviceSettings.status.gen.mac.substring(0, 2) === 'ff') {
        return DEVICE_COLOR_GREEN;
      }
    }
    if (!deviceSettings.status) {
      return DEVICE_COLOR_RED;
    }
    if (deviceSettings.status.gen.state !== 'Up') {
      return DEVICE_COLOR_RED;
    }
    if (deviceSettings.status.gen.type === 'encoder' &&
      deviceSettings.status.hdmiInput.cableConnected === 'disconnected') {
      return DEVICE_COLOR_YELLOW;
    }
    if (deviceSettings.status.gen.type === 'decoder' &&
      deviceSettings.status.hdmiOutput &&
      deviceSettings.status.hdmiOutput.cableConnected === 'disconnected') {
      return DEVICE_COLOR_YELLOW;
    }
    if (deviceSettings.status.gen.type === 'decoder' &&
      deviceSettings.status.connectedEncoder.receivingVideoFromEncoder === 'no') {
      return DEVICE_COLOR_YELLOW;
    }
    return DEVICE_COLOR_GREEN;
  }

  isUsb(deviceSettings) {
    if (!deviceSettings.capabilities) {
      return false;
    }
    if (deviceSettings.capabilities['join-usb']) {
      return true;
    }
    return false;
  }

  prepDeviceList(props) {
    // "device" here actually contains the raw information on all devices,
    // grouped by status, config and capabilities.
    // Store this on the state, grouped by each device.
    const { settings, device, filter, loaded, sortOrder } = props;
    const { id, title, onToggleItem } = settings;

    // TODO If we don't have a complete set of information, do not process.
    // if (!props.device.status.info) {
    //  return;
    // }
    // if (!props.device.config.info) {
    //   return;
    // }
    // if (!props.device.capabilities.info) {
    //   return;
    // }

    const itemsCountPerPage = window.maxLength ? window.maxLength : PAGINATION.itemsCountPerPage;
    let deviceList = [];
    let statusLength = 0;
    let configLength = 0;
    let capabilitiesLength = 0;
    let maxLength = 0;
    const deviceListSettings = [];
    let sortedDeviceListSettings = [];

    switch (id) {
      case MENU_ITEM_SOURCES:
        // fall through
      case MENU_ITEM_DISPLAYS:
        if (device.status.info && device.status.info.text) {
          statusLength = device.status.info.text.length;
        }
        if (device.config.info && device.config.info.text) {
          configLength = device.config.info.text.length;
        }
        if (device.capabilities.info && device.capabilities.info.text) {
          capabilitiesLength = device.capabilities.info.text.length;
        }

        maxLength = Math.max(statusLength, configLength, capabilitiesLength);

        // Loop through each device, and combine the status, config and capabilities
        // information for that one device into one deviceSettings.
        for (let i = 0; i < maxLength; i++) {
          let deviceSettings = {};

          if (device.status.info && device.status.info.text && device.status.info.text[i]) {
            deviceSettings.status = device.status.info.text[i];
          }
          if (device.config.info && device.config.info.text && device.config.info.text[i]) {
            deviceSettings.config = device.config.info.text[i];
          }
          if (device.capabilities.info && device.capabilities.info.text && device.config.info.text[i]) {
            deviceSettings.capabilities = device.capabilities.info.text[i];
          }
          if (deviceSettings.status || deviceSettings.config || deviceSettings.capabilities) {
            deviceSettings.allDevices = device;
          }

          // Save the combined deviceSettings for one device onto a list of devices.
          if (filter && filter.show) {
            if (filter.name) {
              if (deviceSettings.config && deviceSettings.config.gen && deviceSettings.config.gen.name) {
                if (
                  (deviceSettings.config.gen.name.indexOf(filter.name) > -1)
                  && ((filter.statusGreen && this.deviceColor(deviceSettings) === DEVICE_COLOR_GREEN) || 
                    (filter.statusYellow && this.deviceColor(deviceSettings) === DEVICE_COLOR_YELLOW) || 
                    (filter.statusRed && this.deviceColor(deviceSettings) === DEVICE_COLOR_RED))
                  && (deviceSettings.status && 
                    ((filter.model4k && deviceSettings.status.gen.model === 'Zyper4K') || 
                    (filter.modelUhd && deviceSettings.status.gen.model === 'ZyperUHD') || 
                    (filter.modelHd && deviceSettings.status.gen.model === 'ZyperHD')))
                  && ((filter.usbYes && this.isUsb(deviceSettings)) || 
                    (filter.usbNo && !this.isUsb(deviceSettings)))
                ) {
                  deviceListSettings.push(deviceSettings);
                }
              }
            } else if (
              ((filter.statusGreen && this.deviceColor(deviceSettings) === DEVICE_COLOR_GREEN) || 
                (filter.statusYellow && this.deviceColor(deviceSettings) === DEVICE_COLOR_YELLOW) || 
                (filter.statusRed && this.deviceColor(deviceSettings) === DEVICE_COLOR_RED))
              && (deviceSettings.status && 
                ((filter.model4k && deviceSettings.status.gen.model === 'Zyper4K') || 
                (filter.modelUhd && deviceSettings.status.gen.model === 'ZyperUHD') || 
                (filter.modelHd && deviceSettings.status.gen.model === 'ZyperHD')))
              && ((filter.usbYes && this.isUsb(deviceSettings)) || 
                (filter.usbNo && !this.isUsb(deviceSettings)))
              ) {
                  deviceListSettings.push(deviceSettings);
            } 
          } else {
            deviceListSettings.push(deviceSettings);
          }
        }

        if (maxLength === 0) {
            this.setState({ sortedDeviceListSettings: [], activePage: 1 });
        } else {

//          console.log('sortOrder', sortOrder, Object.keys(sortOrder).length);

          if (Object.keys(sortOrder).length > 0) {
            sortedDeviceListSettings = deviceListSettings.sort((a, b) => {
              if (!a || !a.config || !a.config.gen || !b || !b.config || !b.config.gen) {
                return -1;
              }

              const orderA = sortOrder[a.config.gen.mac];
              const orderB = sortOrder[b.config.gen.mac];
              
              if (orderA < orderB) {
                return -1;
              }
              
              if (orderA > orderB) {
                return 1;
              }

              // names must be equal
              return 0;
            });

          } else {

            sortedDeviceListSettings = deviceListSettings.sort((a, b) => {
              if (!a || !a.config || !a.config.gen || !b || !b.config || !b.config.gen) {
                return -1;
              }

              const nameA = a.config.gen.name.toUpperCase(); // ignore upper and lowercase
              const nameB = b.config.gen.name.toUpperCase(); // ignore upper and lowercase
              
              if (nameA < nameB) {
                return -1;
              }
              
              if (nameA > nameB) {
                return 1;
              }

              // names must be equal
              return 0;
            });
          }

          if (this.state.sortedDeviceListSettings.length > sortedDeviceListSettings.length) { // got to first if the new set is smaller
            this.setState({ sortedDeviceListSettings, activePage: 1 });
          } else { // if the new set is larger or equal stay on the same page
            this.setState({ sortedDeviceListSettings });
          }

        }

        break;
      default: {
        this.setState({ sortedDeviceListSettings: [], activePage: 1 });
        break;
      }
    }
  }

  firmwareRevPopupToggle(val) {
    this.setState({
      firmwareVerShow: val === true
    });
  }

  firmwareVerDiv() {

    const { firmwareVer, deviceActions, deviceSortOrderType } = this.props;
    const { popupPanelPosition } = this.state;

    const popupStyle = {
      display: 'flex',
      flex: '1 0 auto',
      flexFlow: 'row wrap',
//      flexFlow: 'row wrap',
      alignContent: 'flex-start',

//      borderWidth: 2,
//      borderColor: 'green',
//      borderStyle: 'solid',
      maxHeight: 250,

      overflow: 'auto',
    };

    let title = 'Firmware Versions - ';

    if (deviceSortOrderType === 'encoder') {
      title += 'Sources';
    } else if (deviceSortOrderType === 'decoder') {
      title += 'Displays';
    }

    // Turn the data structure containing versions and devices for each version into a string.
    const devicesForVersion = JSON.stringify(firmwareVer[deviceSortOrderType], 0, 2)
            .replace(/({\n)|(})|(])|(,)|(\")|(\[)|(:\s)/g, '');
    return (
      <DevicePopupPanel
        position={popupPanelPosition}
        settings={{
          title,
          id: `firmwareVer${deviceSortOrderType}`,
          onToggleItem: this.firmwareRevPopupToggle
        }}>
        <pre style={popupStyle}>
          {
            devicesForVersion
          }
        </pre>
      </DevicePopupPanel>
    );
  }

  render() {
    const { settings, device, filter, fetching, loaded, isConfig,
      sortOrder, deviceSortOrderType, filterActions, selectedDevices, 
      firmwareVerSource, deviceActions, dragInfo } = this.props;

    const { activePage, sortedDeviceListSettings, popupPanelPosition } = this.state;

    const { id, title, onToggleItem } = settings;

    const itemsCountPerPage = window.maxLength ? window.maxLength : PAGINATION.itemsCountPerPage;
    let deviceList = [];

    const start = (activePage - 1) * itemsCountPerPage;
    const end = Math.min(start + itemsCountPerPage, sortedDeviceListSettings.length);

    const firmwareVerOverlay = (
      <Overlay show={this.state.firmwareVerShow}>
        {this.firmwareVerDiv()}
      </Overlay>);

    let indx = 0;

    for (let i = start; i < end; i++) {
      deviceList.push(
        <Device
          settings={{ ...sortedDeviceListSettings[i], index: indx }}
          key={indx++} />
        );
    }

    const listStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'row wrap',
//      flexFlow: 'row wrap',
      alignContent: 'flex-start',

      borderWidth: 2,
      borderColor: 'green',
      borderStyle: 'solid',

      overflow: 'auto',
    };

    let contextMenu;
    
//    if (isConfig) {
      const clearSortOrderMenuStyle = {
  //      textDecoration: Object.keys(sortOrder).length > 0 ? 'none' : 'line-through',
        opacity: Object.keys(sortOrder).length > 0 ? 1 : 0.5,
        cursor: Object.keys(sortOrder).length > 0 ? 'pointer' : 'not-allowed'
      };

      const clearSortOrderMenu = (
        <MenuItem
          onClick={(e) => {
            filterActions.setSortOrder(deviceSortOrderType);
            e.stopPropagation();
          }}
        >
          <span style={clearSortOrderMenuStyle}><i className="fa fa-trash" aria-hidden="true"></i>&nbsp;&nbsp;Clear Sort Order</span>
        </MenuItem>
      );

      const firmwareVersionsMenu = (
        <MenuItem
          onClick={(e) => {
            this.setState({ popupPanelPosition: { x: e.nativeEvent.clientX - 100, y: e.nativeEvent.clientY - 150 } });
            deviceActions.onFirmwareVersion(selectedDevices, deviceSortOrderType, sortedDeviceListSettings);
            this.firmwareRevPopupToggle(true);
            e.stopPropagation();
          }}
        >
          <span><i className="fa fa-file-code-o" aria-hidden="true"></i>&nbsp;&nbsp;Firmware Version</span>
        </MenuItem>
      );

      const clearJoinMenu = deviceSortOrderType === 'decoder' && selectedDevices.length > 0 ?
        (
          <MenuItem
            onClick={(e) => {
              deviceActions.onDisconnectSelectedDisplays();
              e.stopPropagation();
            }}
          >
            <span><i className="fa fa-trash" aria-hidden="true"></i>&nbsp;&nbsp;Disconnect Joins</span>
          </MenuItem>
        )
        :
        (
          <div />
        );

      contextMenu = (
        <div> 
          <ContextMenu id={`contextMenu-${deviceSortOrderType}`}>
            {clearSortOrderMenu}
            {firmwareVersionsMenu}
            {clearJoinMenu}
          </ContextMenu>
        </div>);
//    }

    let content = (
      <div className="appList">
        {deviceList}
        {firmwareVerOverlay}
      </div>);

//    if (isConfig) {
      if (!window.isMobile) {
        content = (
          <ContextMenuTrigger id={`contextMenu-${deviceSortOrderType}`} holdToDisplay={-1}>
            {content}
            {contextMenu}
          </ContextMenuTrigger>
        );
      } else {    
        const shellStyle = {
          display: 'flex',
          flex: '1',
          flexFlow: 'column nowrap',
    //      flexFlow: 'row wrap',
          alignContent: 'flex-start',
  /*
          borderWidth: 2,
          borderColor: 'green',
          borderStyle: 'solid',
  */
          overflow: 'auto',
        };

        const mobileContextMenuTargetStyle = {
          display: 'flex',
  //        flex: '1 0 auto',
          flexFlow: 'row nowrap',
          justifyContent: 'center',
  //        alignItems: 'center',
          alignContent: 'center',
          height: 40,
  /*
          borderWidth: 2,
          borderColor: 'pink',
          borderStyle: 'solid',
  */
          borderRadius: 5,
          
          backgroundColor: '#e7c4ff',

          marginBottom: 5
        };

        const mobileActionsMenuStyle = {
          display: 'flex',
  //        flex: '1 0 auto',
          flexFlow: 'row nowrap',
          justifyContent: 'center',
  //        alignItems: 'center',
          alignContent: 'center',
          height: 40,
          width: '100%',
  /*        
          borderWidth: 2,
          borderColor: 'pink',
          borderStyle: 'solid',
  */
          borderRadius: 5,
          
          background: '#e7c4ff',

          marginBottom: 5
        };

        const titleStyle = {
          display: 'flex',
          flexFlow: 'row nowrap',
          alignItems: 'center',
  //        backgroundColor: 'yellow',
        };

        const shell = (<div style={shellStyle}>
            <DropdownButton className="btn btn-link" bsSize="small" 
              style={mobileActionsMenuStyle} title={'Actions...'} noCaret pullRight
              id={`dropdownButton-${deviceSortOrderType}`}>
              {clearSortOrderMenu}
              {clearJoinMenu}
            </DropdownButton>
            {content}      
          </div>);
    
        content = shell;
      }
//    }

    if (window.epg && window.player) {
      content = (<PlayerHome />);
    } else if (window.epg) {
      content = (<EpgHome />);
    }

    const title2 = `${title} (${sortedDeviceListSettings.length})`;

    return (
      <Panel settings={ { id, title: title2, onToggleItem, 
        filter: { status: true }, 
        pagination: { 
          activePage,
          itemsCountPerPage,
          totalItemsCount: sortedDeviceListSettings.length,
          handleChange: (pageNumber) => {
//            console.log(`active page is ${pageNumber}`);
            this.setState({ activePage: pageNumber });
            } }
        } } 
        loaded={loaded} >
          {content}
        </Panel>
    );
  }
}

function mapStateToProps(state, props) {

  const { id } = props.settings;
  const { encoders, decoders, fetching, 
    lastChangeIdMaxNumbers, selectedSources, selectedDisplays, 
    firmwareVer, dragInfo } = state.device;
  const { fetching: epgFetching } = state.epgp;
  const { sortOrder } = state.filter;
  const { token } = state.auth;

  let permKey = '';

//  console.log('settings', props.settings);

  let device;  
  let deviceSortOrder;
  let deviceSortOrderType;
  let selectedDevices;

  if (id === MENU_ITEM_SOURCES) {    
    device = encoders;
    deviceSortOrder = sortOrder.encoder ? { ...sortOrder.encoder } : {};
    deviceSortOrderType = 'encoder';
    selectedDevices = selectedSources;
    permKey = 'Sources';
  } else if (id === MENU_ITEM_DISPLAYS) {
    device = decoders;
    deviceSortOrder = sortOrder.decoder ? { ...sortOrder.decoder } : {};
    deviceSortOrderType = 'decoder';
    selectedDevices = selectedDisplays;
    permKey = 'Displays';
  }

  const isConfig = token && token.role && token.role.perms && 
      token.role.perms[permKey] && 
      token.role.perms[permKey].Configure && token.role.perms[permKey].Configure === true; 

//  const epgFetching = false;
  
/*  
  if (epgFetching) {
    console.log('epgFetching', epgFetching);
  }
*/

//  console.log('isConfig', isConfig);

  return {
    requestForInfo: lastChangeIdMaxNumbers.status === -1 && lastChangeIdMaxNumbers.config === -1 && lastChangeIdMaxNumbers.capabilities === -1,
    device,

//    loaded: !fetching || (lastChangeIdMaxNumbers && lastChangeIdMaxNumbers.status > -1 && 
//      lastChangeIdMaxNumbers.config > -1 && lastChangeIdMaxNumbers.capabilities > -1),

    loaded: window.epg ? !epgFetching : (!fetching || (lastChangeIdMaxNumbers && lastChangeIdMaxNumbers.status > -1 && 
      lastChangeIdMaxNumbers.config > -1 && lastChangeIdMaxNumbers.capabilities > -1)), // !epgFetching,

    filter: state.filter[id],
    sortOrder: deviceSortOrder,
    deviceSortOrderType,
    selectedDevices,
    firmwareVer,
    dragInfo,
    isConfig
  };
}

function mapDispatchToProps(dispatch) {
 return {
      deviceActions: bindActionCreators(deviceActionsRaw, dispatch),
      filterActions: bindActionCreators(filterActionsRaw, dispatch),
      epgActions: bindActionCreators(epgActionsRaw, dispatch)      
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(DevicesPanel);
