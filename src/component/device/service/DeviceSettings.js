/* eslint indent: 0 no-console: 0 */

// Extract device information based on the device settings: status, config, and capabilities.

// In general, when calculating join information, only use config "connectedEncoder" fields
// and do not use status "connectedEncoder" fields.
// This is because status lastChangeMaxId is not updated following a join.
// The exception is that it's OK to use the "receiving" fields from status "connectedEncoder"
// since when a "receiving" field changes, status lastChangeMaxId is updated.

// For HD devices, do not report audio.

import { NO_CHANGE } from '../../../constant/app';
import { disconnectAll } from '../../connection/connectionDefaults';

export class DeviceSettings {
  constructor(settings) {
    this.status = settings.status;
    this.config = settings.config;
    this.capabilities = settings.capabilities;
  }

  getDeviceType() {
    let type;
    if (this.config && this.config.gen) {
      type = this.config.gen.type;
    } else if (this.status && this.status.gen) {
      type = this.status.gen.type;
    }
    switch (type) {
      case 'encoder':
        return 'Source';
      case 'decoder':
        return 'Display';
      default:
        return type;
    }
  }

  getVideo() {
    if (!this.status) {
      return undefined;
    }
    if (!this.status.connectedEncoder) {
      return undefined;
    }
    if (!this.config) {
      return undefined;
    }
    if (!this.config.connectedEncoder) {
      return undefined;
    }

    const connectedEncoder = this.config.connectedEncoder;

    const receivingVideoFromEncoder = this.status.connectedEncoder.receivingVideoFromEncoder;
    if (connectedEncoder.mac === 'none'
      || connectedEncoder.name === 'N/A'
      || connectedEncoder.connectionMode === 'disconnected') {
      return undefined;
    }
    // The API might report wall-fast-switched or fast-switched.
    // These are the same from the GUI's point of view.
    let connectionMode = connectedEncoder.connectionMode;
    if (connectionMode === 'wall-fast-switched') {
      connectionMode = 'fast-switched';
    }
    return { ...connectedEncoder, receivingVideoFromEncoder, connectionMode };
  }

  getDigitalAudio() {
    // Returns one of:
    //   undefined
    //   { name: <audio source name>,
    //     audioSourceType: hdmi|hdmi-downmix|analog,
    //     receivingAudio: yes|no|undefined }
    if (!this.status) {
      return undefined;
    }
    if (!this.config) {
      return undefined;
    }
    // For HD, do not report audio connection.
    if (this.status.gen.model === 'ZyperHD') {
      return undefined;
    }

    const { connectedEncoderHdmiDownmixAudio } = this.status;
    const statusConnectedEncoder = this.status.connectedEncoder;
    const { audioConnections, audioOutSourceType, connectedEncoder } = this.config;
    if (!audioConnections || !audioOutSourceType) {
      return undefined;
    }
    const audioSourceType = audioOutSourceType.hdmiOutSourceType;

    let name = audioConnections.hdmiDownmixSourceName;

    if (audioSourceType === 'hdmi') {
      // For HDMI audio, get the audio source name from the video source name.
      if (!connectedEncoder) {
        return undefined;
      }
      name = statusConnectedEncoder.name;
    }
    if (name === 'none' || name === 'N/A' || name === undefined) {
      return undefined;
    }

    let receivingAudio;
    if (!connectedEncoderHdmiDownmixAudio) {
      // For HD, if we are receiving video, we are also receiving downmixed audio.
      receivingAudio = statusConnectedEncoder.receivingVideoFromEncoder;
    } else {
      receivingAudio = connectedEncoderHdmiDownmixAudio.receivingAudioFromEncoder;
      if (audioSourceType === 'hdmi') {
        // For HDMI audio, if we are getting video, then we are also getting audio.
        receivingAudio = statusConnectedEncoder.receivingVideoFromEncoder;
      }
    }

    return { name, audioSourceType, receivingAudio };
  }

  getAnalogAudio() {
    if (!this.status) {
      return undefined;
    }
    if (!this.config) {
      return undefined;
    }
    // For HD, do not report audio connection.
    if (this.status.gen.model === 'ZyperHD') {
      return undefined;
    }

    const { connectedEncoderAnalogAudio, connectedEncoderHdmiDownmixAudio } = this.status;
    const { audioConnections, audioOutSourceType, connectedEncoder } = this.config;
    // For analog audio out, the result of the "set" can be hdmi-downmix or analog.
    const audioSourceType = audioOutSourceType.analogOutSourceType;
    // Based on how it was "set", look at the analog or hdmi-downmix join information.
    let name;
    let receivingAudio;
    if (audioSourceType === 'hdmi-downmix') {
      name = audioConnections.hdmiDownmixSourceName;
      if (name === 'none' || name === 'N/A' || name === undefined) {
        return undefined;
      }
      receivingAudio = connectedEncoderHdmiDownmixAudio ?
        connectedEncoderHdmiDownmixAudio.receivingAudioFromEncoder :
        connectedEncoder.receivingVideoFromEncoder;
      return { name, audioSourceType, receivingAudio };
    }
    // Else 'analog'
    name = audioConnections.analogSourceName;
    if (name === 'none' || name === 'N/A') {
      return undefined;
    }
    receivingAudio = connectedEncoderHdmiDownmixAudio ?
      connectedEncoderHdmiDownmixAudio.receivingAudioFromEncoder :
      connectedEncoder.receivingVideoFromEncoder;
    return { name, audioSourceType, receivingAudio };
  }

  getUsb() {
    if (this.config === undefined) {
      return undefined;
    }
    const { usbUplink } = this.config;
    if (!usbUplink) {
      return undefined;
    }
    if (usbUplink.name === 'none') {
      return undefined;
    }
    return usbUplink;
  }

  getIr() {
    if (this.config === undefined) {
      return undefined;
    }
    const { ir } = this.config;
    if (!ir || !ir.sendingToMacOrIp) {
      return undefined;
    }
    // The string sendingToMacOrIp is the format:
    //   name(ipAddress)
    // Parse the name and IP address.
    // Split when you find a character in the class: open parenthesis, close parenthesis.
    const parensRe = new RegExp('[\(\)]');
    const nameIpList = ir.sendingToMacOrIp.split(parensRe);
    ir.name = nameIpList[0];
    ir.ipAddress = nameIpList[1];
    if (ir.name === 'none') {
      return undefined;
    }
    return ir;
  }

  getRs232() {
    if (this.config === undefined) {
      return undefined;
    }
    const { rs232 } = this.config;
    if (!rs232 || !rs232.sendingToMacOrIp) {
      return undefined;
    }
    // The string sendingToMacOrIp is the format:
    //   name(ipAddress)
    // Parse the name and IP address.
    // Split when you find a character in the class: open parenthesis, close parenthesis.
    const parensRe = new RegExp('[\(\)]');
    const nameIpList = rs232.sendingToMacOrIp.split(parensRe);
    rs232.name = nameIpList[0];
    rs232.ipAddress = nameIpList[1];
    if (rs232.name === 'none') {
      return undefined;
    }
    return rs232;
  }

  isSource() {
    let type;
    if (this.config && this.config.gen) {
      type = this.config.gen.type;
    } else if (this.status && this.status.gen) {
      type = this.status.gen.type;
    }
    if (type === 'encoder') {
      return true;
    }
    return false;
  }

  isDisplay() {
    let type;
    if (this.config && this.config.gen) {
      type = this.config.gen.type;
    } else if (this.status && this.status.gen) {
      type = this.status.gen.type;
    }
    if (type === 'decoder') {
      return true;
    }
    return false;
  }

  getJoins() {

    if (this.isSource()) {
      return undefined;
    }

    const videoConnection = this.getVideo();
    const analogAudioConnection = this.getAnalogAudio();
    const digitalAudioConnection = this.getDigitalAudio();
    const usbConnection = this.getUsb();
    const irConnection = this.getIr();
    const rs232Connection = this.getRs232();

//    const joins = [];
    let joins = {};

    if (videoConnection) {
//      joins.push({ ...videoConnection });
      joins.video = { ...videoConnection };
    }
 
    if (analogAudioConnection) {
//      joins.push({ ...analogAudioConnection });      
      joins.analogAudio = { ...analogAudioConnection };
    }
     
    if (digitalAudioConnection) {
//      joins.push({ ...digitalAudioConnection });      
      joins.digitalAudio = { ...digitalAudioConnection };
    }

    if (usbConnection) {
//      joins.push({ ...usbConnection });      
      joins.usb = { ...usbConnection };
    }

    if (irConnection) {
//      joins.push({ ...irConnection });
      joins.ir = { ...irConnection };
    }

    if (rs232Connection) {
//      joins.push({ ...rs232Connection });
      joins.rs232 = { ...rs232Connection };
    }

    return Object.keys(joins).length > 0 ? { ...joins } : undefined;
  }

  getDisconnects() {
    let disconnects = { ...disconnectAll };
    const joins = this.getJoins();

//    console.log('joins', joins);

    if (joins) {
      if (!joins.video) {
        disconnects.video.value = NO_CHANGE;
      } else {
  //      console.log('video', joins.video);      
        disconnects.video.sourceMac = joins.video.macAddr;
      }

      if (!joins.analogAudio) {
        disconnects.analogAudio.value = NO_CHANGE;
      } else {
        disconnects.analogAudio.sourceMac = joins.analogAudio.macAddr;
      }

      if (!joins.digitalAudio) {
        disconnects.digitalAudio.value = NO_CHANGE;
      } else {
        disconnects.digitalAudio.sourceMac = joins.digitalAudio.macAddr;
      }

      if (!joins.usb) {
        disconnects.usb.value = NO_CHANGE;
      } else {
        disconnects.usb.sourceMac = joins.usb.macAddr;
      }

      if (!joins.ir) {
        disconnects.ir.value = NO_CHANGE;
      } else {
        disconnects.ir.sourceMac = joins.ir.name;
      }

      if (!joins.rs232) {
        disconnects.rs232.value = NO_CHANGE;
      } else {
        disconnects.rs232.sourceMac = joins.rs232.name;
      }
    }
    return Object.keys(disconnects).length > 0 ? disconnects : undefined;
  }

  isModel(...modelList) {
    // This function can be called with any number of arguments.
    // Examples:
    //   Is this device's model Zyper4K?
    //   isModel('Zyper4K')
    //   Is this device's model Zyper4K or ZyperUHD?
    //   isModel('Zyper4K', 'ZyperUHD')
    let model;
    if (this.config && this.config.gen) {
      model = this.config.gen.model;
    } else if (this.status && this.status.gen) {
      model = this.status.gen.model;
    }

    // Is the model on the list?
    const onList = modelList.indexOf(model) !== -1;
    return onList;
  }

  supportsFactoryDefaults() {
    let supports = false;
    if (this.capabilities &&
      this.capabilities['factory-defaults'] &&
      this.capabilities['factory-defaults'].values &&
      this.capabilities['factory-defaults'].values === 'supported') {
      supports = true;
    }
    return supports;
  }
}
