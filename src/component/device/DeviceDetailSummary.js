/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { DeviceSettings } from './service/DeviceSettings';
import { capitalize } from './service/Format';

export default class DeviceDetailSummary extends Component {
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
    // console.log('In DeviceDetailSummary render()');
    const { settings } = this.props;

    const labelStyle = {
      textAlign: 'right',
    };

    const deviceSettings = new DeviceSettings(settings);

    if (!settings
      || !settings.status
      || settings.status.gen === undefined
      || settings.status.gen === null) {
      const deviceDetailSummaryEmpty = (
        <div></div>
      );
      return deviceDetailSummaryEmpty;
    }

    const hdmiInput = settings.status.hdmiInput;
    const hdmiOutput = settings.status.hdmiOutput;

    const inputCableConnected = capitalize(hdmiInput ? hdmiInput.cableConnected : '');
    const outputCableConnected = capitalize(hdmiOutput ? hdmiOutput.cableConnected : '');

    const showStyle = { display: 'block' };
    const hideStyle = { display: 'none' };

    let encoder = (<div></div>);
    if (deviceSettings.isSource()) {
      encoder = (
        <div>
          <div className="row">
            <div className="col-sm-7" style={labelStyle}>HDMI Cable:</div>
            <div className="col-sm-5">{inputCableConnected}</div>
          </div>
          <div className="row">
            <div className="col-sm-7" style={labelStyle}>HDMI Horizontal Resolution:</div>
            <div className="col-sm-5">{hdmiInput ? hdmiInput.horizontalSize : '' }</div>
          </div>
          <div className="row">
            <div className="col-sm-7" style={labelStyle}>HDMI Vertical Resolution:</div>
            <div className="col-sm-5">{hdmiInput ? hdmiInput.verticalSize : '' }</div>
          </div>
        </div>
      );
    }

    let decoder = (<div></div>);
    if (deviceSettings.isDisplay()) {
      const videoConnection = deviceSettings.getVideo();
      const digitalAudioConnection = deviceSettings.getDigitalAudio();
      const analogAudioConnection = deviceSettings.getAnalogAudio();
      decoder = (
        <div>
          <div className="row">
            <div className="col-sm-7" style={labelStyle}>HDMI Cable:</div>
            <div className="col-sm-5">{outputCableConnected}</div>
          </div>
          <div className="row">
            <div className="col-sm-7" style={labelStyle}>HDMI Horizontal Resolution:</div>
            <div className="col-sm-5">{hdmiOutput ? hdmiOutput.horizontalSize : '' }</div>
          </div>
          <div className="row">
            <div className="col-sm-7" style={labelStyle}>HDMI Vertical Resolution:</div>
            <div className="col-sm-5">{hdmiOutput ? hdmiOutput.verticalSize : '' }</div>
          </div>
          <div className="row">
            <div className="col-sm-7" style={labelStyle}>Video Source Name:</div>
            <div className="col-sm-5">{videoConnection ? videoConnection.name : ''}</div>
          </div>
          <div className="row">
            <div className="col-sm-7" style={labelStyle}>Receiving Video:</div>
            <div className="col-sm-5">{videoConnection ? videoConnection.receivingVideoFromEncoder : ''}</div>
          </div>
          <div className="row" style={deviceSettings.isModel('Zyper4K') ? showStyle : hideStyle}>
            <div className="col-sm-7" style={labelStyle}>Digital Audio Source Name:</div>
            <div className="col-sm-5">{digitalAudioConnection ? digitalAudioConnection.name : ''}</div>
          </div>
          <div className="row" style={deviceSettings.isModel('Zyper4K') ? showStyle : hideStyle}>
            <div className="col-sm-7" style={labelStyle}>Receiving Digital Audio:</div>
            <div className="col-sm-5">{digitalAudioConnection ? digitalAudioConnection.receivingAudio : ''}</div>
          </div>
          <div className="row" style={deviceSettings.isModel('Zyper4K') ? showStyle : hideStyle}>
            <div className="col-sm-7" style={labelStyle}>Analog Audio Source Name:</div>
            <div className="col-sm-5">{analogAudioConnection ? analogAudioConnection.name : ''}</div>
          </div>
          <div className="row" style={deviceSettings.isModel('Zyper4K') ? showStyle : hideStyle}>
            <div className="col-sm-7" style={labelStyle}>Receiving Analog Audio:</div>
            <div className="col-sm-5">{analogAudioConnection ? analogAudioConnection.receivingAudio : ''}</div>
          </div>
        </div>
      );
    }

    const deviceProcessed = (
      <div style={{ minWidth: 320 }}>
        <div className="row">
          <div className="col-sm-7" style={labelStyle}>Name:</div>
          <div className="col-sm-5">{settings.config.gen.name}</div>
        </div>
        <div className="row">
          <div className="col-sm-7" style={labelStyle}>State:</div>
          <div className="col-sm-5">{settings.status.gen.state}</div>
        </div>
        {encoder}
        {decoder}
      </div>
    );
    return deviceProcessed;
  }
}
