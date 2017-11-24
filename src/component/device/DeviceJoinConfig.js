/* eslint react/prop-types: 0 no-console: 0 */

import React, { Component, PropTypes } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';
import { Button, Overlay, Label, Grid, Row, Col } from 'react-bootstrap';
import _flow from 'lodash/flow';

import { getPosition } from '../../service/dom';
import { DragSource as dragSource } from 'react-dnd';
import { DndItemTypes } from '../../constant/dndItemTypes';
import { iconsObj, decoderIconsObj } from '../../constant/app';
import ReactPlayer from 'react-player';
import ToolTip from '../ToolTip';
import { DeviceSettings } from './service/DeviceSettings';
import { CONNECTION_VERSION } from '../connection/constants';
import * as deviceActions from './actions';

const dndSource = {

  beginDrag: (props, monitor, component) => {
    const { settings, connectionData, deviceActions } = props;
    const { model } = settings.status.gen;
    const { list, defaultIndex } = connectionData[model];
    const item = list[defaultIndex];

    deviceActions.receiveDragInfo({
      status: { ...settings.status },
      config: { ...settings.config },
      capabilities: { ...settings.capabilities },
    });

    return { sourceMac: settings.status.gen.mac,
      item, model,

      // TODO - remove settings, after we are sure it is no longer used.
      settings: settings.status,

      status: settings.status,
      config: settings.config,
      capabilities: settings.capabilities };
  },

  endDrag: (props, monitor, component) => {
    const { deviceActions } = props;

    deviceActions.receiveDragInfo();
  },

  canDrag: (props) => {
    const { settings, connectionData } = props;
    if (!settings || !settings.status || !settings.status.gen) {
      return false;
    }
    const { model } = settings.status.gen;
    if (settings.status.gen.type === 'encoder') {
      if (!connectionData ||
        !connectionData[model] ||
        connectionData[model].defaultIndex === undefined) {
        return false;
      }
      return connectionData[model].defaultIndex > -1;
    } else if (settings.status.gen.type === 'decoder') {
      return true;
    }

    return false;
  }

};

const collect = (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging(),
    canDrag: monitor.canDrag()
  };
};

class DeviceJoinConfig extends Component {

  static propTypes = {
    settings: PropTypes.object.isRequired,
    // configType: PropTypes.object,
    showName: PropTypes.bool,
    size: PropTypes.object
  };

  static defaultProps = {
    settings: {},
    // configType: DeviceJoinConfigTypes.VIDEO,
    showName: true,
    size: { width: 60, height: 80 }
  };

  constructor(props) {
    super(props);
    this.updatePosition = this.updatePosition.bind(this);
    this.getImagePath = this.getImagePath.bind(this);
    this.devicePopupToggle = this.devicePopupToggle.bind(this);
    this.state = { showPopup: false, showJoinConfigPanel: false };
    this.compName = 'Device';
    this.elemId = '';
    this.popupPanelPosition = {};
//    this.width = 42;
//    this.height = 42;
  }

  componentWillMount() {
    const { settings, configType } = this.props;
    this.elemId = `${this.compName}-${settings.status.gen.type}-${settings.status.gen.mac}`;
  }

  componentDidMount() {
    this.elem = document.getElementById(this.elemId);
    this.updatePosition();
  }

  componentDidUpdate(prevProps, prevState) {
    this.updatePosition();
  }

  getImagePath() {
    const { settings, configType, iconImageName } = this.props;
    if (!settings || !settings.status || !settings.status.gen) {
      return 'src/images/sat.jpg';
    }
    switch (settings.status.gen.type) {
      case 'encoder':
        {
          if (settings.config && settings.config.source && iconsObj[settings.config.source.iconImageName]) {
            return iconsObj[settings.config.source.iconImageName];
          }
          return iconsObj.SatelliteReceiver; // 'src/images/sat.jpg';
        }
      case 'decoder':
        // return 'src/images/Computer-monitor.jpg';
        {

          if (iconImageName) {

            if (iconImageName !== 'GenericVideoSource') {
              return iconsObj[iconImageName];
            }

            return iconsObj.SatelliteReceiver; // 'src/images/sat.jpg';
          }

          if (settings.config && settings.config.display && decoderIconsObj[settings.config.display.iconImageName]) {
            return decoderIconsObj[settings.config.display.iconImageName];
          }

          return decoderIconsObj.FlatPanelDisplay; // 'src/images/sat.jpg';
        }
      default:
        return 'src/images/sat.jpg';
    }
  }

  updatePosition() {
    this.popupPanelPosition = getPosition(this.elem);
    this.popupPanelPosition.y += this.height;
    this.popupPanelPosition.x += this.width / 2;
  }

  devicePopupToggle() {
    this.setState({ showPopup: !this.state.showPopup });
  }

  render() {
    const {
      settings, configType, showName, size, connectionData,
      connectDragSource, connectDragPreview, isDragging, canDrag
    } = this.props;

    if (!settings || !settings.status || !settings.status.gen) {
      return false;
    }
    const { model } = settings.status.gen;

    let list = [];
    let defaultIndex = -1;

    if (connectionData && connectionData[model]) {
      list = connectionData[model].list;
      defaultIndex = connectionData[model].defaultIndex;
    }

    const { showPopup, showJoinConfigPanel } = this.state;

    let defaultConnectionName = '';
    if (!settings || !settings.status || !settings.status.gen) {
      defaultConnectionName = ['No default join selected', 'Right click on a source to configure'];
    } else if (settings.status.gen.type === 'encoder') {
      defaultConnectionName = ['No default join selected', 'Right click on a source to configure'];
      if (list && list.length > 0 && defaultIndex > -1 && defaultIndex < list.length) {
        defaultConnectionName = list[defaultIndex].name.value;
      }
    }

    const compStyle = window.isMobile ?

      {
        display: 'flex',
        flex: '1',
        flexFlow: 'column nowrap'
      }
    :
      {
        borderWidth: 1,
        borderColor: 'blue',
//        borderStyle: 'solid',

        // borderStyle: showName ? 'solid' : 'none',
        opacity: isDragging ? '0.5' : '1',

//        width: size.width,
//        height: size.height,

        display: 'flex',
        flex: '1',
//        flex: '0 1 auto',
        flexFlow: 'column nowrap'
      };

    const imageSize = 42; 

    const imageStyle = {

      WebkitTouchCallout: 'none',
      userDrag: 'none',
      userSelect: 'none',

      borderWidth: 1,
//      borderColor: 'gray',
      borderColor: 'red',
//      borderStyle: 'solid',

      width: imageSize,
      height: imageSize,

      // borderStyle: isDragging ? 'solid' : 'none',
      cursor: canDrag ? 'move' : 'default',

      objectFit: 'contain'
//      objectFit: 'scale-down'
      
    };

    const icon = (
      <ToolTip placement="top"
        tooltip={isDragging ? undefined : defaultConnectionName}>
        <img src={this.getImagePath()} alt={this.deviceType}
          height={this.height}
          width={this.width}
          className="nonDraggableImage"
          style={imageStyle}
        />
      </ToolTip>
        );

    const playerStyle = {
//      borderStyle: 'groove',
      borderRadius: 10
    };

    const player = (
      <div style={playerStyle}>
        <ReactPlayer
          url={settings.videoUrl}
          height={this.height} width={this.width}
          volume={0}
          playing={true} />
      </div>
      );

    const image = settings.videoUrl ? player : icon;

    return connectDragPreview(
        <div style={compStyle}>
          {connectDragSource(
            <div>
              {image}
            </div>
          )}
        </div>);
  }
}

const mapStateToProps = (state, props) => {
  const { settings } = props;
  const { encoders } = state.device;

  let iconImageName;

  if (settings.status.gen.type === 'decoder') {
    const deviceSettings = new DeviceSettings(settings);
    const videoConnection = deviceSettings.getVideo();
//    console.log('videoConnection', videoConnection);

    if (videoConnection && videoConnection.name &&
      encoders && encoders.config && encoders.config.info.text) {
      // console.log('encoders', encoders);

      const srcConfig = encoders.config.info.text.find((srcCfg) => {
          return srcCfg.gen.name === videoConnection.name;
        });

      if (srcConfig && srcConfig.source && srcConfig.source.iconImageName) {
        iconImageName = srcConfig.source.iconImageName;
      }
    }
  }

  const joinConfigModels = state &&
    state.joinConfigVersions &&
    state.joinConfigVersions[CONNECTION_VERSION] &&
    state.joinConfigVersions[CONNECTION_VERSION].models;

  return {
    connectionData: joinConfigModels,
    iconImageName
  };
};

function mapDispatchToProps(dispatch) {
  return {
    deviceActions: bindActionCreators(deviceActions, dispatch)
  };
}

module.exports = _flow(
  dragSource(DndItemTypes.JOIN, dndSource, collect),
  connect(mapStateToProps, mapDispatchToProps)
)(DeviceJoinConfig);

