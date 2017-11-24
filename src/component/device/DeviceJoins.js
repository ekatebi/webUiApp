/* eslint react/prop-types: 0 no-console: 0 */

// Display information on one devcie's joins on the device icon.

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Overlay, Row, Col } from 'react-bootstrap';
import DevicePopupPanel from '../DevicePopupPanel';
import { getPosition } from '../../service/dom';
import { VideoJoinModes, AudioSourceTypes } from '../connection/deviceJoinConfigTypes';
import { DeviceSettings } from './service/DeviceSettings';
import ToolTip from '../ToolTip';

export default class DeviceJoins extends Component {

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
    this.joinConfigPanelToggle = this.joinConfigPanelToggle.bind(this);
    this.state = { showDevicePopup: false, showJoinConfigPanel: false,
      popupPanelPosition: { x: 100, y: 100 } };
    this.elemId = '';
//    this.width = 100;
//    this.height = 100;
  }

  componentWillMount() {
    const { settings } = this.props;
    this.elemId = `${this.compName}-${settings.status.gen.type}-${settings.status.gen.mac}`;
  }

  componentDidMount() {
    this.elem = document.getElementById(this.elemId);
  }

  updatePosition() {
    const position = getPosition(this.elem);
    position.y += this.height + 5;

    const { x, y } = this.state.popupPanelPosition;

    if (x !== position.x || y !== position.y) {
      this.setState({ popupPanelPosition: position });
    }
  }

  devicePopupToggle() {
    this.setState({ showDevicePopup: !this.state.showDevicePopup });
  }

  joinConfigPanelToggle() {
    const { settings } = this.props;
    if (settings.status.gen.type === 'encoder') {
      this.setState({ showJoinConfigPanel: !this.state.showJoinConfigPanel });
    }
  }

  render() {
    const {
      settings,
      connectDropTarget, itemType, canDrop
    } = this.props;

    const { popupPanelPosition } = this.state;

    const { showDevicePopup, showJoinConfigPanel } = this.state;

    const deviceSettings = new DeviceSettings(settings);

    // Collect information on this device's connections
    // and prepare them for display.

      if (deviceSettings.isSource()) {
        return (<div />);
      }

      const videoConnection = deviceSettings.getVideo();
      const analogAudioConnection = deviceSettings.getAnalogAudio();
      const digitalAudioConnection = deviceSettings.getDigitalAudio();
      const usbConnection = deviceSettings.getUsb();
      const irConnection = deviceSettings.getIr();
      const rs232Connection = deviceSettings.getRs232();

      if (!videoConnection &&
        !analogAudioConnection &&
        !digitalAudioConnection &&
        !usbConnection &&
        !irConnection &&
        !rs232Connection) {
        return (<div />);
      }

//      console.log('joins', this.deviceSettings.getJoins());

      // If there is a connection, display the link icon with the number of links and
      // build a tooltip with detailed join information.
      let count = 0;
      const joinDetailTooltip = [];

      if (videoConnection && videoConnection.connectionMode !== 'disconnected') {
        const mode = VideoJoinModes[videoConnection.connectionMode];
        joinDetailTooltip.push(`Video: ${videoConnection.name}, ${mode}`);
        count++;
      }

      if (digitalAudioConnection) {
        const audioSourceType = AudioSourceTypes[digitalAudioConnection.audioSourceType];
        joinDetailTooltip.push(`Digital Audio: ${digitalAudioConnection.name}, ${audioSourceType}`);
        count++;
      }

      if (analogAudioConnection) {
        const audioSourceType = AudioSourceTypes[analogAudioConnection.audioSourceType];
        joinDetailTooltip.push(`Analog Audio: ${analogAudioConnection.name}, ${audioSourceType}`);
        count++;
      }

      if (usbConnection) {
        joinDetailTooltip.push(`USB: ${usbConnection.name}`);
        count++;
      }

      if (irConnection) {
        joinDetailTooltip.push(`IR: ${irConnection.name}`);
        count++;
      }

      if (rs232Connection) {
        joinDetailTooltip.push(`RS232: ${rs232Connection.name}`);
        count++;
      }

      let countDiv = (
          <span />
        );

      if (count > 1) {
        countDiv = (
          <div>{count}</div>
          );
      }

      const compStyle = {

        display: 'flex',
        flex: '1 0 auto',
        flexFlow: 'column nowrap',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',

        width: '100%',
        height: '100%',

        paddingTop: 10,

        borderWidth: 2,
        borderColor: 'pink',
//        borderStyle: 'solid',
      };

      return (
        <ToolTip placement={showDevicePopup || showJoinConfigPanel ? 'top' : 'bottom'}
            tooltip={joinDetailTooltip}>
          <div style={compStyle} className="devModel">
            <span>
              <i className="fa fa-link fa-lg" aria-hidden="true"></i>
            </span>
            {countDiv}
          </div>
        </ToolTip>
      );
  }
}
