// Note: When displaying join information, only use config fields, and not status fields, 
// since status lastChangeMaxId is not updated following a join.

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button, Overlay, Label, Grid, Row, Col, Accordion, Panel } from 'react-bootstrap';
import { ContextMenu, MenuItem, ContextMenuTrigger } from 'react-contextmenu';
import { findDOMNode } from 'react-dom';
import Touchable from 'rc-touchable';

import DevicePopupPanel from '../DevicePopupPanel';
import DeviceDetailSummary from './DeviceDetailSummary';
import DeviceDetailConnection from './DeviceDetailConnection';
import DeviceDetailId from './DeviceDetailId';
import DeviceDetailStatus from './DeviceDetailStatus';
import DeviceDetailConfig from './DeviceDetailConfig';
import DeviceDetailAction from './DeviceDetailAction';
import { getPosition } from '../../service/dom';
import { DropTarget as dropTarget } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';

import DeviceJoinConfig from './DeviceJoinConfig';
import DeviceJoins from './DeviceJoins';
import ConnectionList from '../connection/ConnectionList';
import { CONNECTION_VERSION } from '../connection/constants';
import { DeviceSettings } from './service/DeviceSettings';
import {
  itemBackgroundColor,
  DEVICE_COLOR_GREEN,
  DEVICE_COLOR_YELLOW,
  DEVICE_COLOR_RED
} from '../../constant/app';
import * as mvActionsEx from '../multiview/actions';
import * as filterActionsEx from '../filter/actions';
import * as deviceActionsEx from './actions';
import _flow from 'lodash/flow';
import ToolTip from '../ToolTip';
import keydown from 'react-keydown';

const deviceDropTarget = {
  canDrop: (props, monitor) => {
    // You can disallow drop based on props or item

    const item = monitor.getItem();
    const itemType = monitor.getItemType();

    if (itemType === DndItemTypes.MVITEM) {
      return props.settings.status.gen.type === 'decoder' &&
      props.settings.capabilities && props.settings.capabilities['join-video'] &&
      props.settings.capabilities['join-video'].values &&
      props.settings.capabilities['join-video'].values.indexOf('multiview') >= 0;
    }

    if ((item.settings && item.settings.gen.type === 'decoder' && 
        props.settings.status.gen.type === 'decoder') || 
      (item.settings && item.settings.gen.type === 'encoder' && 
        props.settings.status.gen.type === 'encoder')) {
      return true;
    }

    if (item && props.settings.status.gen.model !== item.model) {
      return false;
    }

    return (props.settings.status.gen.type === 'decoder' && 
      item.settings && item.settings.gen.type === 'encoder') ||
      (props.settings.status.gen.type === 'decoder' && 
        item.item && item.item.video && item.item.video.value !== 'videoWall');
  },

  drop: (props, monitor, component) => {

    const item = monitor.getItem();
    const itemType = monitor.getItemType();

    if (DndItemTypes.MVITEM === itemType) {

      props.mvActions.onRequestJoinMvToDisplay(monitor.getItem().gen.name,
        props.settings.config);

      return;
    }

    if ((item.settings && item.settings.gen.type === 'decoder' && 
        props.settings.status.gen.type === 'decoder') || 
      (item.settings && item.settings.gen.type === 'encoder' && 
        props.settings.status.gen.type === 'encoder')) {

      props.filterActions.onSetSortOrder(item.config.gen.type,
        item.config.gen.mac, props.settings.config.gen.mac);

    } else {
      props.deviceActions.joinTwoDevices(monitor.getItem(), props.settings);
    }
  }
};

function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType(),
    draggedItem: monitor.getItem()
    // mousePosition: getClientOffset()
  };
}

// const KEYS = ['esc', 'up', 'ctrl+z', 'shift+up', 'shift+down', 'enter', 'j', 'k', 'h', 'l'];
const KEYS = ['esc'];
 
@keydown(KEYS)
class Device extends Component {

  static propTypes = {
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    settings: {}
  };

  constructor(props) {
    super(props);
    this.updatePosition = this.updatePosition.bind(this);
    this.devicePopupToggle = this.devicePopupToggle.bind(this);
    this.deviceRawPopupToggle = this.deviceRawPopupToggle.bind(this);
    this.joinConfigPanelToggle = this.joinConfigPanelToggle.bind(this);
    this.summaryExpandToggle = this.summaryExpandToggle.bind(this);
    this.connectionExpandToggle = this.connectionExpandToggle.bind(this);
    this.idExpandToggle = this.idExpandToggle.bind(this);
    this.statusExpandToggle = this.statusExpandToggle.bind(this);
    this.configExpandToggle = this.configExpandToggle.bind(this);
    this.actionExpandToggle = this.actionExpandToggle.bind(this);
    this.animateEx = this.animateEx.bind(this);
    this.joinTwoDevices = this.joinTwoDevices.bind(this);
    this.deviceColor = this.deviceColor.bind(this);
    this.tabletJoin = this.tabletJoin.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.keyHandler = this.keyHandler.bind(this);
    this.simulateClick = this.simulateClick.bind(this);

    this.state = { showDevicePopup: false,
      showDeviceRawPopup: false,
      showJoinConfigPanel: false,
      isSummaryExpanded: false,
      isConnectionExpanded: false,
      isIdExpanded: false,
      isStatusExpanded: false,
      isConfigExpanded: false,
      isActionExpanded: false,
      animate: false,
      animationValue: 0,
      popupPanelPosition: { x: 100, y: 100 },
      popupPanelConfigPosition: { x: 100, y: 100 },
      popupPanelRawPosition: { x: 100, y: 100 },
      popupPanelMouseDown: false,
      videoUrl: undefined,
      showSortOrder: false,
      sortOrderIndex: -1,
      longPress: false
    };
    this.compName = 'Device';
    this.elemId = '';
    this.elemCm = '';
    this.elemCmJoins = '';
    this.nameId = '';
    this.width = 100;
    this.height = 100;
  }

  componentWillMount() {
    const { settings } = this.props;
    if (settings.status) {
      this.elemId = `${this.compName}-${settings.status.gen.type}-${settings.status.gen.mac}`;
    } else {
      this.elemId = '';
    }
    this.elemCm = `${this.elemId}-cm`;
    this.elemCmJoins = `${this.elemId}-cmJoins`;
    this.nameId = `${this.elemId}-name`;
  }

  componentDidMount() {
    this.elem = document.getElementById(this.elemId);
  }

  componentWillReceiveProps(nextProps) {
    const { keydown, animate } = nextProps;

/*
    const { keydown, animate, settings, sortOrder } = nextProps;
 
    if (settings.config.gen.mac === '34:1b:22:80:26:77') {
      console.log(settings.config.gen.mac, 
        this.props.sortOrder.index,
        'componentWillReceiveProps');
    }
*/
    if (keydown.event) {
      // inspect the keydown event and decide what to do 
      console.log('Device', keydown.event.which);
    }

    if (this.props.sortOrderEdit && !nextProps.sortOrderEdit) {

      if (this.state.sortOrderIndex !== this.props.sortOrder.index) {
        this.props.filterActions.onSetSortOrder(this.props.settings.config.gen.type, 
          this.props.settings.config.gen.mac, this.state.sortOrderIndex);
      }

      this.setState({ showSortOrder: false });      
    } else if (!this.props.sortOrderEdit && nextProps.sortOrderEdit) {
      this.setState({ sortOrderIndex: nextProps.sortOrder.index });
    }

    if (animate) {
      
//      console.log('animate', this.props.settings.status.gen.mac);

      setTimeout(() => {
        this.animateEx(true, window.isMobile ? 3 : 2);
      }, 100);

      this.props.deviceActions.animateDeviceBorder(this.props.settings.status.gen.mac, false);
    }

    if (this.props.settings && this.props.settings.status.gen.type === 'decoder' && this.props.selected && 
      !this.props.disconnectSelectedDisplays && nextProps.disconnectSelectedDisplays) {
        const item = this.deviceSettings.getDisconnects();
        if (item) {
          this.joinTwoDevices({ item });
        }
    }

  }

  joinTwoDevices(item) {
    const { deviceActions } = this.props;

    setTimeout(() => {
      this.animateEx(true, window.isMobile ? 3 : 2);
    }, 100);

    const sourceMac = item.sourceMac;
    const displayName = this.props.settings.config.gen.name;
    const oldVideoConnection = this.props.settings.config.connectedEncoder.macAddr;

    deviceActions.joinDevicesEx(sourceMac, displayName, item, oldVideoConnection);
  }

  tabletJoin(e) {
    const {
      settings, deviceActions, mvActions,
      connectDropTarget, itemType, canDrop, selected,
      isOverCurrent, draggedItem, connectionData, selectedSource, selectedMultiview,
    } = this.props;

    const { model } = settings.status.gen;
    const { list, defaultIndex } = connectionData[model];
    const item = list[defaultIndex];

    const selectSource = { 
      sourceMac: settings.status.gen.mac, 
      item, 
      model,
      // TODO - remove settings, after we are sure it is no longer used.
      settings: settings.status,

      status: settings.status,
      config: settings.config,
      capabilities: settings.capabilities 
    };

    if (settings.status.gen.type === 'encoder') {
      deviceActions.onSelectDevices(selectSource, e.ctrlKey);
    } else if (selectedSource && settings.status.gen.type === 'decoder' &&
      selectedSource.model === settings.status.gen.model) {
        this.joinTwoDevices({ ...selectedSource });
    } else if (selectedMultiview) {

      if (settings.status.gen.type === 'decoder' &&
        settings.capabilities && settings.capabilities['join-video'] &&
        settings.capabilities['join-video'].values &&
        settings.capabilities['join-video'].values.indexOf('multiview') >= 0) {

          setTimeout(() => {
            this.animateEx(true, window.isMobile ? 3 : 2);
          }, 100);

          mvActions.onRequestJoinMvToDisplay(selectedMultiview.gen.name,
            settings.config);

      }
    } if (!selectedSource && settings.status.gen.type === 'decoder') {
      deviceActions.onSelectDevices(selectSource, e.ctrlKey, settings.status.gen.type);      
    }
  }

  simulateClick(id, rightClick = false) {
    const event = new MouseEvent('click', {
      button: rightClick ? 2 : 0,
      view: window,
      bubbles: true,
      cancelable: true
    });
    const elem = document.getElementById(id);
    const cancelled = !elem.dispatchEvent(event);
/*
    if (cancelled) {
      // A handler called preventDefault.
      alert('cancelled');
    } else {
      // None of the handlers called preventDefault.
      alert('not cancelled');
    }
*/
  }

  clickHandler(e) {

    if (this.state.longPress) {
      this.setState({ longPress: false });
      return;
    }

//    console.log('clickHandler', e.shiftKey, e.ctrlKey);

    if (e.target.id === this.nameId) {
      this.devicePopupToggle();
    } else if (e.target.id === 'devModel') {
      const {
        settings, deviceActions, selectedSource
      } = this.props;

      if (!this.state.showSortOrder) {
        this.setState({ sortOrderIndex: this.props.sortOrder.index });
        this.props.filterActions.onEditSortOrder(settings.config.gen.type, settings.config.gen.mac);
      } else {

        this.props.filterActions.onEditSortOrder(settings.config.gen.type);

        if (this.state.sortOrderIndex !== this.props.sortOrder.index) {
          this.props.filterActions.onSetSortOrder(settings.config.gen.type, 
            settings.config.gen.mac, this.state.sortOrderIndex);
        }

        this.setState({ sortOrderIndex: -1 });
      }

      this.setState({ showSortOrder: !this.state.showSortOrder });

      if (settings.status.gen.type === 'encoder' &&
          selectedSource && selectedSource.sourceMac === settings.status.gen.mac) {
          deviceActions.onSelectDevices();
      }

      e.stopPropagation();
    } else if (e.target.id === 'sortOrder') {
//      console.log('showSortOrder', this.state.showSortOrder);
      e.stopPropagation();
    } else if (!this.state.showSortOrder) {
      this.tabletJoin(e);
    }
    e.stopPropagation();

  }


  keyHandler(e) {
    console.log('keyHandler', e.keyCode);
  }

  updatePosition() {
    const position = getPosition(this.elem);
    position.y = 0;
    position.x += this.width + 5;
    // Make sure that device details pop up on the screen.
    position.x = Math.max(0, Math.min(position.x, window.innerWidth - 450));
    const { x, y } = this.state.popupPanelPosition;
    if (x !== position.x || y !== position.y) {
      this.setState({ popupPanelPosition: position });
    }
  }

  devicePopupToggle() {
    this.setState({
      showDevicePopup: !this.state.showDevicePopup,
    });
    if (!this.state.showDevicePopup) {
      this.setState({
        isSummaryExpanded: false,
        isConnectionExpanded: false,
        isIdExpanded: false,
        isStatusExpanded: false,
        isConfigExpanded: false,
        isActionExpanded: false
      });
    }
  }

  deviceRawPopupToggle() {
    this.setState({ showDeviceRawPopup: !this.state.showDeviceRawPopup });
  }

  joinConfigPanelToggle() {
    const { settings } = this.props;
    if (settings.status.gen.type === 'encoder') {
      this.setState({ showJoinConfigPanel: !this.state.showJoinConfigPanel });
    }
  }

  summaryExpandToggle(event) {
    // Only toggle when the link or image within the header is selected.
    if (event.target.tagName === 'A' || event.target.tagName === 'I') {
      this.setState({ isSummaryExpanded: !this.state.isSummaryExpanded });
    }
    event.stopPropagation();
  }

  connectionExpandToggle(event) {
    // Only toggle when the link or image within the header is selected.
    if (event.target.tagName === 'A' || event.target.tagName === 'I') {
      this.setState({ isConnectionExpanded: !this.state.isConnectionExpanded });
    }
    event.stopPropagation();
  }

  idExpandToggle(event) {
    // Only toggle when the link or image within the header is selected.
    if (event.target.tagName === 'A' || event.target.tagName === 'I') {
      this.setState({ isIdExpanded: !this.state.isIdExpanded });
    }
    event.stopPropagation();
  }

  statusExpandToggle(event) {
    // Only toggle when the link or image within the header is selected.
    if (event.target.tagName === 'A' || event.target.tagName === 'I') {
      this.setState({ isStatusExpanded: !this.state.isStatusExpanded });
    }
    event.stopPropagation();
  }

  configExpandToggle(event) {
    // Only toggle when the link or image within the header is selected.
    if (event.target.tagName === 'A' || event.target.tagName === 'I') {
      this.setState({ isConfigExpanded: !this.state.isConfigExpanded });
    }
    event.stopPropagation();
  }

  actionExpandToggle(event) {
    // Only toggle when the link or image within the header is selected.
    if (event.target.tagName === 'A' || event.target.tagName === 'I') {
      this.setState({ isActionExpanded: !this.state.isActionExpanded });
    }
    event.stopPropagation();
  }

  animateEx(on, val) {
    const { animate, animationValue } = this.state;
    const newVal = animationValue - 1;

    if (on) {
      this.setState({ animate: true, animationValue: val });
      this.animateEx(false, val);
    } else {
      if (animationValue > 0) {
        setTimeout(() => {
          this.setState({ animate: false, animationValue: newVal });
          this.animateEx(false, newVal);
        }, 400);
      }
    }
  }

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

  render() {
    const {
      settings, deviceActions, dragInfo, isConfig, isAdmin, selected,
      connectDropTarget, itemType, canDrop, sortOrder,
      isOverCurrent, draggedItem, connectionData, selectedSource,
    } = this.props;

    const { popupPanelPosition, popupPanelConfigPosition, sortOrderIndex,
      popupPanelRawPosition, animationValue, animate, videoUrl } = this.state;

    const {
      showDevicePopup,
      showDeviceRawPopup,
      showJoinConfigPanel,
      isSummaryExpanded,
      isConnectionExpanded,
      isIdExpanded,
      isStatusExpanded,
      isConfigExpanded,
      isActionExpanded,
    } = this.state;

    this.deviceSettings = new DeviceSettings(settings);

    // If config exists, it has the most up to date information.
    let name = '';
    if (settings && settings.config && settings.config.gen) {
      name = settings.config.gen.name;
    } else if (settings && settings.status && settings.status.gen) {
      name = settings.status.gen.name;
    }

    const deviceType = this &&
      this.deviceSettings &&
      this.deviceSettings.getDeviceType();
    const model = this &&
      this.deviceSettings &&
      this.deviceSettings.status &&
      this.deviceSettings.status.gen &&
      this.deviceSettings.status.gen.model;

    const width = this.width;
    const height = this.height;

    let borderWidth = 3;

    if (animationValue > 0) {
      if (animationValue === 2) {
        borderWidth *= 2;
      } else {
        borderWidth *= 3;
      }
    }

    let borderStateColor = this.deviceColor(settings);

    let backgroundColor = itemBackgroundColor;
    if (isOverCurrent) {
      backgroundColor = canDrop ? 'lightGreen' : 'pink';
    }

    if (selected) {
      backgroundColor = 'grey';
    }
      
    const deviceFrameStyle = {
      display: 'flex',
      flow: '1 0 auto',
      flexFlow: 'column nowrap',
      justifyContent: 'center',

      float: 'left',
      position: 'relative',
      width: `${width + 5}px`,
      height: `${height + 5}px`,

      borderWidth: 2,
      borderColor: 'black',
//      borderStyle: 'solid'
    };

    const deviceStyle = {
      display: 'flex',
      flow: '1 0 auto',
      flexFlow: 'column nowrap',
      alignItems: 'center',

      borderStyle: 'solid',
      borderWidth: `${borderWidth}px`,
      borderRadius: 10,
      borderColor: borderStateColor,
      width: `${width}px`,
      height: `${height}px`,
      float: 'left',
//      paddingTop: '10px',
      opacity: showDevicePopup || showJoinConfigPanel ? '0.5' : '1',
      backgroundColor
    };

    const mobileDeviceStyle = {
      display: 'flex',
      flex: '1',
      flexFlow: 'row nowrap',
      justifyContent: 'center',
//      alignItems: 'center',
      margin: 'auto',

      borderStyle: animate ? 'solid' : 'hidden',
      borderWidth: `${borderWidth}px`,
      borderRadius: 10,
      borderColor: borderStateColor,
      width: `${width}px`,
      height: `${height}px`,
      float: 'left',
//      paddingTop: '10px',
//      opacity: showDevicePopup || showJoinConfigPanel ? '0.5' : '1',

      backgroundColor
    };

    const deviceNameStyle = {
      display: 'flex',
      flex: '0 0 auto',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',

      whiteSpace: 'nowrap',
      width: '100%',
      overflow: 'hidden',
      textOverflow: 'ellipsis',

      opacity: showDevicePopup ? 0.7 : 1.0,

      cursor: 'pointer',
      fontSize: '9px',

      borderWidth: 2,
      borderColor: 'lightblue',
//      borderStyle: 'solid'
    };

    const bottomRowStyle = {
      display: 'flex',
      flex: '0 0 auto',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',

      height: '25%',
      width: '90%',

      borderWidth: 2,
      borderColor: 'lightgreen',
//      borderStyle: 'solid'
    };

    let videoSourceNameDiv;

    if (settings.status.gen.type === 'decoder') {

      const sourceStyle = {
        textAlign: 'center',
        whiteSpace: 'nowrap',
        width: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    
        borderWidth: 2,
        borderColor: 'lightgreen',
  //      borderStyle: 'solid',
        fontSize: '9px',
//        marginLeft: 7
      };

      const deviceSettings = new DeviceSettings(settings);
      const videoConnection = deviceSettings.getVideo();

      if (videoConnection) {
        videoSourceNameDiv = (
          <span style={sourceStyle}>{videoConnection.name}</span>
          );
      }
    }

    const preStyle = {
      textAlign: 'left',
      overflow: 'auto',
      maxHeight: '400',
    };

    const deviceDetailsStyle = {
      display: 'block',
      overflowY: 'auto',
      width: '100%',
      minHeight: 200,
      maxHeight: window.innerHeight - 200,
      paddingRight: 15
    };

    const rawButtonStyle = {
      display: window.diag ? 'inherit' : 'none',
      margin: '0px 0px 15px',
    };

    const caretStyle = {
      margin: '0px 7px 0px 0px',
    };

    const summaryCaret = isSummaryExpanded ? 'fa fa-lg fa-caret-down' : 'fa fa-lg fa-caret-right';
    const connectionCaret = isConnectionExpanded ? 'fa fa-lg fa-caret-down' : 'fa fa-lg fa-caret-right';
    const idCaret = isIdExpanded ? 'fa fa-lg fa-caret-down' : 'fa fa-lg fa-caret-right';
    const statusCaret = isStatusExpanded ? 'fa fa-lg fa-caret-down' : 'fa fa-lg fa-caret-right';
    const configCaret = isConfigExpanded ? 'fa fa-lg fa-caret-down' : 'fa fa-lg fa-caret-right';
    const actionCaret = isActionExpanded ? 'fa fa-lg fa-caret-down' : 'fa fa-lg fa-caret-right';

    // Collect status, config and capability data for this device
    // and prepare it for display.
    const deviceProcessedDetails = () => {
      const deviceDetailSummary = (
        <DeviceDetailSummary settings={settings} />
      );

      const deviceDetailConnection = (
        <DeviceDetailConnection settings={settings} />
      );

      const deviceDetailId = (
        <DeviceDetailId settings={{ ...settings, isConfig }} />
      );

      const deviceDetailStatus = (
        <DeviceDetailStatus settings={settings} />
      );

      const deviceDetailConfig = (
        <DeviceDetailConfig settings={{ ...settings, popupPanelMouseDown: this.state.popupPanelMouseDown }} />
      );

      const deviceDetailAction = (
        <DeviceDetailAction settings={settings} isConfig={isConfig} isAdmin={isAdmin} />
      );

      const connections = (
        <Accordion>
          <Panel
            header={<div onClick={this.connectionExpandToggle}>
            <i className={connectionCaret} style={caretStyle}></i>Connections</div>}
            eventKey="1">
            {deviceDetailConnection}
          </Panel>
        </Accordion>
      );

      const showRawDetails =
        (<button className="btn" onClick={this.deviceRawPopupToggle} style={rawButtonStyle}>
          Show Raw Details
        </button>);

      return (
        <DevicePopupPanel
          position={popupPanelPosition}
          settings={{
            title: `${name} - ${deviceType}`,
            id: name,
            onToggleItem: this.devicePopupToggle,
            onMouseDown: (down) => {
              this.setState({ popupPanelMouseDown: down });
            } }}>
          <div>
            <div style={deviceDetailsStyle}>
              <Accordion onClick={this.summaryExpandToggle}>
                <Panel
                  header={<div>
                    <i className={summaryCaret} style={caretStyle}></i>Summary</div>}
                  eventKey="1">
                  {deviceDetailSummary}
                </Panel>
              </Accordion>
              {this.deviceSettings.isDisplay() ? connections : ''}
              <Accordion onClick={this.idExpandToggle}>
                <Panel
                  header={<div>
                    <i className={idCaret} style={caretStyle}></i>ID</div>}
                  eventKey="1">
                  {deviceDetailId}
                </Panel>
              </Accordion>
              <Accordion>
                <Panel
                  header={<div onClick={this.statusExpandToggle}>
                    <i className={statusCaret} style={caretStyle}></i>Status</div>}
                  eventKey="1">
                  {deviceDetailStatus}
                </Panel>
              </Accordion>
              {isConfig ? (<Accordion>
                <Panel
                  header={<div onClick={this.configExpandToggle}>
                    <i className={configCaret} style={caretStyle}></i>Config</div>}
                  eventKey="1">
                  {deviceDetailConfig}
                </Panel>
              </Accordion>) : undefined}
              {isAdmin || isConfig ? (<Accordion>
                <Panel
                  header={<div onClick={this.actionExpandToggle}>
                    <i className={actionCaret} style={caretStyle}></i>Actions</div>}
                  eventKey="1">
                  {deviceDetailAction}
                </Panel>
              </Accordion>) : undefined}
              {showRawDetails}
            </div>
          </div>
        </DevicePopupPanel>
      );
    };

    // Collect status, config and capability data for this device
    // and prepare it for display.
    const deviceRawDetails = () => {
      const deviceRawStatus = (
        <div>
          <h4>
            Raw Status
          </h4>
          <pre style={preStyle}>
            {JSON.stringify(settings.status, 0, 2)}
          </pre>
        </div>
      );

      const deviceRawConfig = (
        <div>
          <h4>
            Raw Config
          </h4>
          <pre style={preStyle}>
            {JSON.stringify(settings.config, 0, 2)}
          </pre>
        </div>
      );

      const deviceRawCapabilities = (
        <div>
          <h4>
            Raw Capabilities
          </h4>
          <pre style={preStyle}>
            {JSON.stringify(settings.capabilities, 0, 2)}
          </pre>
        </div>
      );

      return (
        <DevicePopupPanel
          position={popupPanelRawPosition}
          settings={{
            title: `Raw ${deviceType} - ${name}`,
            id: `raw${name}`,
            onToggleItem: this.deviceRawPopupToggle }}>
          <div style={ { maxHeight: 400, overflow: 'auto' } }>
            <div>
              {deviceRawStatus}
            </div>
            <div>
              {deviceRawConfig}
            </div>
            <div>
              {deviceRawCapabilities}
            </div>
          </div>
        </DevicePopupPanel>
      );
    };

    let shortModel;

    const vid = 'https://www.youtube.com/watch?v=4T9IL0gY7P0';

    if (settings && settings.status && settings.status.gen && settings.status.gen.model === 'Zyper4K') {
      shortModel = '4K';
    } else if (settings && settings.status && settings.status.gen && settings.status.gen.model === 'ZyperUHD') {
      shortModel = 'UHD';
    } else if (settings && settings.status && settings.status.gen && settings.status.gen.model === 'ZyperHD') {
      shortModel = 'HD';
    } else {
      shortModel = '';
    }

    const deviceJoinConfigs = () => {
      const nbsp3 = '\u00a0\u00a0\u00a0';
      return (
        <DevicePopupPanel
          position={popupPanelConfigPosition}
          settings={{
            title: `${name}${nbsp3}(${shortModel})${nbsp3}-${nbsp3}Join Configuration`,
            id: `config${name}`,
            onToggleItem: this.joinConfigPanelToggle }}>
          <ConnectionList key={0} settings={settings.status} />
        </DevicePopupPanel>);
    };
// cursor: selectedSource && selectedSource.model === settings.status.gen.model ? 'pointer' : 'default'

    let contextMenu;
    let contextMenuJoins;

    if (!window.isMobile && isConfig) {

      let configJoinMenu;      
      let clearJoinMenu;      

      configJoinMenu = settings.status.gen.type === 'encoder' ?
        (<MenuItem onClick={(e) => {
          this.joinConfigPanelToggle();
          e.stopPropagation();
        }}>
          <span><i className="fa fa-cog" aria-hidden="true"></i>&nbsp;&nbsp;Configure Join</span>
        </MenuItem>)
        :
        undefined;

      clearJoinMenu = settings.status.gen.type === 'decoder' ?
        (<MenuItem onClick={(e) => {
          this.joinTwoDevices({ item: this.deviceSettings.getDisconnects() });
          e.stopPropagation();
        }}>
          <span><i className="fa fa-trash" aria-hidden="true"></i>&nbsp;&nbsp;Disconnect Joins</span>
        </MenuItem>)
        :
        (<div />);

      const deviceDetailsMenu =
        (<MenuItem onClick={(e) => {
          this.devicePopupToggle();
          e.stopPropagation();
        }}>
          <span><i className="fa fa-pencil" aria-hidden="true"></i>&nbsp;&nbsp;Device Details</span>
        </MenuItem>);

      contextMenu = (
        <div id={'contextMenu'}> 
          <ContextMenu id={this.elemCm}>
            {configJoinMenu}
            {deviceDetailsMenu}
            {/* <MenuItem divider /> */}
          </ContextMenu>
        </div>);

      contextMenuJoins = (
        <div> 
          <ContextMenu id={this.elemCmJoins}>
            {clearJoinMenu}
          </ContextMenu>
        </div>);
    }

    let deviceImageStyle = { 
      WebkitBoxFlex: '1 0 auto',
//      flex: '1 0 auto',
      flex: '1',
      flexFlow: 'column nowrap',
      justifyContent: this.state.showSortOrder ? 'flex-start' : 'center',
      alignItems: this.state.showSortOrder ? 'flex-start' : 'center',

      fontSize: 10, 

//      width: 45,
//      maxHeight: 45,

      borderWidth: 1,
      borderColor: 'green',
//      borderStyle: 'solid',
    }; 

    let deviceImageDiv = (
      <div style={deviceImageStyle}>
        <DeviceJoinConfig settings={{ ...settings, videoUrl }} showName={false} 
          size={ { width: 50, height: 50 } } />
      </div>
      );

    let joinsDiv;
      
    if (!this.state.showSortOrder && settings.status.gen.type === 'decoder') {
      joinsDiv = (<DeviceJoins settings={settings} />);
    }

    if (!window.isMobile) {
      
      joinsDiv = (
        <div>
          <ContextMenuTrigger id={this.elemCmJoins} holdToDisplay={-1} disable={dragInfo !== undefined}>
            {joinsDiv}
            {contextMenuJoins}
          </ContextMenuTrigger>
        </div>);

      deviceImageDiv = (
        <div>
          <ContextMenuTrigger id={this.elemCm} holdToDisplay={-1} disable={dragInfo !== undefined}>
            {deviceImageDiv}
            {contextMenu}
          </ContextMenuTrigger>
        </div>);

      if (this.state.showSortOrder) {
        const sortOrderStyle = { 
          height: 17, 
          width: 55, 
          borderRadius: 5,
        };

        deviceImageDiv = (
          <div style={deviceImageStyle}>
            <div>Sort Order:</div>
            <input id={'sortOrder'} style={sortOrderStyle} type="number" onChange={(e) => {
                let val = e.target.value === '' ? -1 : Number(e.target.value); 
                val = val > sortOrder.max ? sortOrder.max : val;
                this.setState({ sortOrderIndex: val - 1 });
                e.stopPropagation();
              }} 
              value={sortOrderIndex > -1 ? sortOrderIndex + 1 : ''} 
              min={sortOrder.min}
              />              
          </div>
        );
      }
    }

    const devModelStyle = { 
      display: 'flex',
      flex: '1 0 auto',
      flexFlow: 'row nowrap',
      justifyContent: 'space-between',
      alignItems: 'center',

      width: '100%',
      maxHeight: '20%',
//      marginTop: -8, 
//      marginLeft: -11, 
      fontSize: 11, 
      cursor: 'default',

      borderWidth: 2,
      borderColor: 'lightblue',
//      borderStyle: 'solid',
    };

    const topLineStyle = {
      display: 'flex',
      flex: '0 0 auto',
      justifyContent: 'center',
      alignItems: 'center',

      width: '95%',
      height: '20%', 
//      marginLeft: 0,

      borderWidth: 2,
      borderColor: 'lightgreen',
//      borderStyle: 'solid'
    };

    const midSideStyle = { 
      display: 'flex',
      flex: '1 0 auto',
      flexFlow: 'column nowrap',
//      justifyContent: 'center',
//      alignItems: 'flex-start',

//      alignSelf: 'flex-end',

      width: '20%',
      height: '100%', 
//      marginLeft: 0,

      borderWidth: 2,
      borderColor: 'lightgreen',
//      borderStyle: 'solid'
    };

    const midLineStyle = { 
      display: 'flex',
      flex: '1 0 auto',
      flexFlow: 'row nowrap',
      justifyContent: 'center',
      alignItems: 'center',
//      alignSelf: 'flex-end',

      width: '100%',
      height: '55%', 
//      marginLeft: 0,

      borderWidth: 2,
      borderColor: 'lightblue',
//      borderStyle: 'solid'
    };

    const sortOrderTooltip = sortOrder.index > -1 ? `: ${sortOrder.index + 1}` : '';

    let deviceDiv =
    (<div id={this.elemId} style={deviceFrameStyle} onClick={this.clickHandler}>
        <div style={deviceStyle}>
          <div style={{/* topLineStyle */}} className="item top">
            <div style={devModelStyle}>
              <ToolTip placement="right" 
                tooltip={!this.state.showSortOrder ? 
                  `click to show/set sort order ${sortOrderTooltip}` : 'click to hide sort order'}>
                <strong id={window.isMobile ? 'devModelx' : 'devModel'} className="devModel">{shortModel}</strong>
              </ToolTip>
              {videoSourceNameDiv}
            </div>
          </div>
          <div className="item mid">
            <div className="item mid side" />
              {deviceImageDiv}
            <div className="item mid side">
                {joinsDiv}
              </div>
          </div>
          <div style={{/* bottomRowStyle */}} className="item bottom">
            <ToolTip placement="bottom"
              tooltip={name}>
              {window.isMobile ? (
                <Touchable onLongPress={(e) => { 
                  console.log('onLongPress', e.target);
                  this.setState({ longPress: true });
                  this.devicePopupToggle();
                  e.stopPropagation();
                  }}>
                  <span style={deviceNameStyle}><strong>{name}</strong></span>
                </Touchable>
                )
                :
                (<span style={deviceNameStyle}><strong id={this.nameId}>{name}</strong></span>)}

            </ToolTip>
          </div>
        </div>

        <Overlay show={showDevicePopup} onEnter={this.updatePosition}>
          {deviceProcessedDetails()}
        </Overlay>

        <Overlay show={showDeviceRawPopup} onEnter={this.updatePosition}>
          {deviceRawDetails()}
        </Overlay>

        <Overlay show={showJoinConfigPanel} onEnter={this.updatePosition}>
          {deviceJoinConfigs()}
        </Overlay>
      </div>
    );

    return connectDropTarget(deviceDiv);
  }
}

function mapStateToProps(state, props) {
  const { settings } = props;
  const { selectedSources, selectedDisplays, dragInfo, animate, 
    disconnectSelectedDisplays, encoders, decoders } = state.device;
  const { selectedMultiview } = state.multiview;
  const { token } = state.auth;

  // Use config.gen if it's available, otherwise use status.gen.
  const gen = settings.config ? settings.config.gen : settings.status.gen;

  const sortOrder = state.filter.sortOrder && state.filter.sortOrder[gen.type] ?
    { ...state.filter.sortOrder[gen.type] } : {};

  const sortOrderIndex = sortOrder[gen.mac] !== undefined ? 
    sortOrder[gen.mac] : -1;

  let sortOrderEdit = false;

  if (state && state.filter &&
    state.filter.sortOrderEdit && state.filter.sortOrderEdit[gen.type] && 
    state.filter.sortOrderEdit[gen.type] === gen.mac) {
    
    sortOrderEdit = true;
//    console.log('sortOrderEdit map', sortOrderEdit);
  }

  const title = gen.type === 'encoder' ? 'Sources' : 'Displays';

  const isConfig = token && token.role && token.role.perms && 
      token.role.perms[title] && token.role.perms[title].Configure;

  const isAdmin = token && token.role && token.role.perms && 
      token.role.perms[title] && token.role.perms[title].Admin;

  // Given the mac, find then index.
  let selectedIndex = -1;
  if (gen.type === 'encoder') {
    selectedIndex = selectedSources.findIndex((device) => {
      if (device) {
        // Use config.gen if it's available, otherwise use status.gen.
        const deviceGen = device.config ? device.config.gen : device.status.gen;
        return deviceGen.mac === gen.mac;
      }
      // No device
      return false;
    });
  } else if (gen.type === 'decoder') {
    selectedIndex = selectedDisplays.findIndex((device) => {
      if (device) {
        // Use config.gen if it's available, otherwise use status.gen.
        const deviceGen = device.config ? device.config.gen : device.status.gen;
        return deviceGen.mac === gen.mac;
      }
      // No device
      return false;
    });    
  }

//  console.log('selectedIndex', selectedIndex);

  let selectedSource;

  if (gen.type === 'encoder') {
    selectedSource = selectedIndex > -1 ? selectedSources[selectedIndex] : undefined;
  } else if (gen.type === 'decoder') {
    selectedSource = selectedSources.length === 1 ? selectedSources[0] : undefined;
  } 

//  console.log('selectedSource', selectedSource);

  let selected = false;

  if (gen.type === 'encoder') {
    selected = selectedIndex > -1;
//  } else if (gen.type === 'decoder' && !selectedSource) {
  } else if (gen.type === 'decoder') {
    selected = selectedIndex > -1;
  }

  let sortOrderMax = 0;

  if (sortOrder && sortOrder.length > 0) {
    sortOrderMax = sortOrder.length;
  } else {
    if (gen.type === 'encoder') {
      sortOrderMax = encoders.config.info.text.length;
    } else if (gen.type === 'decoder') {
      sortOrderMax = decoders.config.info.text.length;
    }
  }

  const joinConfigModels = state &&
    state.joinConfigVersions &&
    state.joinConfigVersions[CONNECTION_VERSION] &&
    state.joinConfigVersions[CONNECTION_VERSION].models;

  return {
    animate: animate[gen.mac] === true,
    sortOrderEdit,
    sortOrder: { index: sortOrderIndex, min: 1, max: sortOrderMax },
    dragInfo,
    selectedMultiview,
    selectedSource,
    selected,
    disconnectSelectedDisplays,
    connectionData: joinConfigModels,
    isConfig,
    isAdmin
  };
}

function mapDispatchToProps(dispatch) {
 return {
      mvActions: bindActionCreators(mvActionsEx, dispatch),
      deviceActions: bindActionCreators(deviceActionsEx, dispatch),
      filterActions: bindActionCreators(filterActionsEx, dispatch)
    };
}

module.exports = _flow(
  dropTarget([DndItemTypes.JOIN, DndItemTypes.MVITEM], deviceDropTarget, collect),
  connect(mapStateToProps, mapDispatchToProps)
)(Device);
