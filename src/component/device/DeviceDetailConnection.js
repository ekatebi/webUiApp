/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { VideoJoinModes, AudioSourceTypes } from '../connection/deviceJoinConfigTypes';
import { DeviceSettings } from './service/DeviceSettings';

export default class DeviceDetailConnection extends Component {
  static propTypes = {
    settings: PropTypes.object.isRequired
  };

  static defaultProps = {
    settings: {}
  };

  constructor(props) {
    super(props);
    const { settings } = this.props;
  }

  componentWillMount() {
    const { settings } = this.props;
  }

  render() {
    // console.log('In DeviceDetailConnection render()');
    const { settings } = this.props;

    const deviceSettings = new DeviceSettings(settings);

    if (deviceSettings.isSource()) {
      return (<div />);
    }

    const labelStyle = {
      textAlign: 'right',
    };

    const showStyle = { display: 'block' };
    const hideStyle = { display: 'none' };

    const videoConnection = deviceSettings.getVideo();
    const analogAudioConnection = deviceSettings.getAnalogAudio();
    const digitalAudioConnection = deviceSettings.getDigitalAudio();
    const usbConnection = deviceSettings.getUsb();
    const irConnection = deviceSettings.getIr();
    const rs232Connection = deviceSettings.getRs232();

    let videoName = 'None';
    let videoMode = '';
    if (videoConnection) {
      videoName = videoConnection.name;
      videoMode = `, ${VideoJoinModes[videoConnection.connectionMode]}`;
    }

    let digitalAudioName = 'None';
    let digitalAudioType = '';
    if (digitalAudioConnection) {
      digitalAudioName = digitalAudioConnection.name;
      digitalAudioType = `, ${AudioSourceTypes[digitalAudioConnection.audioSourceType]}`;
    }

    let analogAudioName = 'None';
    let analogAudioType = '';
    if (analogAudioConnection) {
      analogAudioName = analogAudioConnection.name;
      analogAudioType = `, ${AudioSourceTypes[analogAudioConnection.audioSourceType]}`;
    }

    let usbName = 'None';
    if (usbConnection) {
      usbName = usbConnection.name;
    }

    let irName = 'None';
    if (irConnection) {
      irName = irConnection.name;
    }

    let rs232Name = 'None';
    if (rs232Connection) {
      rs232Name = rs232Connection.name;
    }

    const deviceProcessed = (
      <div style={{ minWidth: 300 }}>
        <div className="row">
          <div className="col-sm-4" style={labelStyle}>Video:</div>
          <div className="col-sm-8">{videoName}{videoMode}</div>
        </div>
        <div className="row" style={deviceSettings.isModel('Zyper4K') ? showStyle : hideStyle}>
          <div className="col-sm-4" style={labelStyle}>Digital Audio:</div>
          <div className="col-sm-8">{digitalAudioName}{digitalAudioType}</div>
        </div>
        <div className="row" style={deviceSettings.isModel('Zyper4K') ? showStyle : hideStyle}>
          <div className="col-sm-4" style={labelStyle}>Analog Audio:</div>
          <div className="col-sm-8">{analogAudioName}{analogAudioType}</div>
        </div>
        <hr />
        <div className="row" style={deviceSettings.isModel('Zyper4K') ? showStyle : hideStyle}>
          <div className="col-sm-4" style={labelStyle}>IR:</div>
          <div className="col-sm-8">{irName}</div>
        </div>
        <div className="row">
          <div className="col-sm-4" style={labelStyle}>RS232:</div>
          <div className="col-sm-8">{rs232Name}</div>
        </div>
        <div className="row" style={deviceSettings.isModel('Zyper4K') ? showStyle : hideStyle}>
          <div className="col-sm-4" style={labelStyle}>USB:</div>
          <div className="col-sm-8">{usbName}</div>
        </div>
      </div>
    );
    return deviceProcessed;
  }
}
