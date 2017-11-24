/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { DeviceSettings } from './service/DeviceSettings';
import { capitalize } from './service/Format';

export default class DeviceDetailStatus extends Component {
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

  render() {
    // console.log('In DeviceDetailStatus render()');
    const { settings } = this.props;

    if (!settings || !settings.status || !settings.status.gen || !settings.config) {
      const deviceDetailStatusEmpty = (
        <div></div>
      );
      return deviceDetailStatusEmpty;
    }

    const statusGen = settings.status.gen;
    const configGen = settings.config.gen;

    const labelStyle = {
      textAlign: 'right',
    };

    const showStyle = { display: 'block' };
    const hideStyle = { display: 'none' };

    const deviceSettings = new DeviceSettings(settings);

    const hdmiInput = settings.status.hdmiInput;
    const hdmiOutput = settings.status.hdmiOutput;
    const videoStream = settings.config.videoStream;
    const audioDownmixIpMcast = settings.config.audioDownmixIpMcast;
    const analogAudioIpMcast = settings.config.analogAudioIpMcast;

    const isEncoder = (statusGen.type === 'encoder');
    const isDecoder = (statusGen.type === 'decoder');

    const hdmiInputProcessed = (
      <div>
        <div className="row" style={deviceSettings.isModel('Zyper4K', 'ZyperUHD') ? showStyle : hideStyle}>
          <div className="col-sm-8" style={labelStyle}>HDMI Cable:</div>
          <div className="col-sm-4">{capitalize(hdmiInput ? hdmiInput.cableConnected : '')}</div>
        </div>
        <div className="row" style={deviceSettings.isModel('Zyper4K', 'ZyperUHD') ? showStyle : hideStyle}>
          <div className="col-sm-8" style={labelStyle}>HDMI HDCP:</div>
          <div className="col-sm-4">{capitalize(hdmiInput ? hdmiInput.hdcp : '')}</div>
        </div>
        <div className="row" style={deviceSettings.isModel('Zyper4K', 'ZyperUHD') ? showStyle : hideStyle}>
          <div className="col-sm-8" style={labelStyle}>HDMI Horizontal Resolution:</div>
          <div className="col-sm-4">{hdmiInput ? hdmiInput.horizontalSize : ''}</div>
        </div>
        <div className="row" style={deviceSettings.isModel('Zyper4K', 'ZyperUHD') ? showStyle : hideStyle}>
          <div className="col-sm-8" style={labelStyle}>HDMI Vertical Resolution:</div>
          <div className="col-sm-4">{hdmiInput ? hdmiInput.verticalSize : ''}</div>
        </div>
        <div className="row" style={deviceSettings.isModel('Zyper4K', 'ZyperUHD') ? showStyle : hideStyle}>
          <div className="col-sm-8" style={labelStyle}>HDMI Refresh Rate:</div>
          <div className="col-sm-4">{hdmiInput ? hdmiInput.fps : ''}</div>
        </div>
      </div>
    );
    const hdmiOutputProcessed = (
      <div>
        <div className="row" style={deviceSettings.isModel('Zyper4K', 'ZyperUHD') ? showStyle : hideStyle}>
          <div className="col-sm-8" style={labelStyle}>HDMI Cable:</div>
          <div className="col-sm-4">{capitalize(hdmiOutput ? hdmiOutput.cableConnected : '')}</div>
        </div>
        <div className="row" style={deviceSettings.isModel('Zyper4K', 'ZyperUHD') ? showStyle : hideStyle}>
          <div className="col-sm-8" style={labelStyle}>HDMI HDCP:</div>
          <div className="col-sm-4">{capitalize(hdmiOutput ? hdmiOutput.hdcp : '')}</div>
        </div>
        <div className="row" style={deviceSettings.isModel('Zyper4K', 'ZyperUHD') ? showStyle : hideStyle}>
          <div className="col-sm-8" style={labelStyle}>HDMI Horizontal Resolution:</div>
          <div className="col-sm-4">{hdmiOutput ? hdmiOutput.horizontalSize : ''}</div>
        </div>
        <div className="row" style={deviceSettings.isModel('Zyper4K', 'ZyperUHD') ? showStyle : hideStyle}>
          <div className="col-sm-8" style={labelStyle}>HDMI Vertical Resolution:</div>
          <div className="col-sm-4">{hdmiOutput ? hdmiOutput.verticalSize : ''}</div>
        </div>
        <div className="row" style={deviceSettings.isModel('Zyper4K', 'ZyperUHD') ? showStyle : hideStyle}>
          <div className="col-sm-8" style={labelStyle}>HDMI Refresh Rate:</div>
          <div className="col-sm-4">{hdmiOutput ? hdmiOutput.fps : ''}</div>
        </div>
      </div>
    );

    const mcastProcessed = (
      <div>
        <div className="row" style={deviceSettings.isModel('ZyperHD', 'ZyperUHD') ? showStyle : hideStyle}>
          <div className="col-sm-8" style={labelStyle}>Multicast Address:</div>
          <div className="col-sm-4">{videoStream && videoStream.ipMcastAddr ? videoStream.ipMcastAddr : 'Unknown'}</div>
        </div>
        <div className="row" style={deviceSettings.isModel('Zyper4K') ? showStyle : hideStyle}>
          <div className="col-sm-8" style={labelStyle}>Video Multicast Address:</div>
          <div className="col-sm-4">{videoStream && videoStream.ipMcastAddr ? videoStream.ipMcastAddr : 'Unknown'}</div>
        </div>
        <div className="row" style={deviceSettings.isModel('Zyper4K') ? showStyle : hideStyle}>
          <div className="col-sm-8" style={labelStyle}>Downmix Audio Multicast Address:</div>
          <div className="col-sm-4">{audioDownmixIpMcast && audioDownmixIpMcast.ipAddr ? audioDownmixIpMcast.ipAddr : 'Unknown'}</div>
        </div>
        <div className="row" style={deviceSettings.isModel('Zyper4K') ? showStyle : hideStyle}>
          <div className="col-sm-8" style={labelStyle}>Analog Audio Multicast Address:</div>
          <div className="col-sm-4">{analogAudioIpMcast && analogAudioIpMcast.ipAddr ? analogAudioIpMcast.ipAddr : 'Unknown'}</div>
        </div>
      </div>
    );

    const deviceProcessed = (
      <div style={{ minWidth: 340 }}>
        <div className="row">
          <div className="col-sm-8" style={labelStyle}>State:</div>
          <div className="col-sm-4">{statusGen.state}</div>
        </div>
        {isDecoder ? hdmiOutputProcessed : ''}
        {isEncoder ? hdmiInputProcessed : ''}
        {isEncoder ? mcastProcessed : ''}
        <div className="row">
          <div className="col-sm-8" style={labelStyle}>Firmware:</div>
          <div className="col-sm-4">{configGen.firmware}</div>
        </div>
      </div>
    );
    return deviceProcessed;
  }
}
