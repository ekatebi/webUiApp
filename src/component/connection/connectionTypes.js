/* eslint indent: 0 */

module.exports.VideoTypes = [
  { value: 'noChange', label: 'No Change' },
  { value: 'fast-switched', label: 'Fast Switched' },
  { value: 'genlocked', label: 'Genlocked' },
  { value: 'none', label: 'Disconnect' }
//  { value: 'videoWall', label: 'Source' }
];

module.exports.DigitalAudioTypes = [
  { value: 'noChange', label: 'No Change' },
  { value: 'hdmi', label: 'HDMI' },
  { value: 'hdmiDownmix', label: 'Downmix' },
  { value: 'analog', label: 'Analog' },
  { value: 'none', label: 'Disconnect' }
];

module.exports.AnalogAudioTypes = [
  { value: 'noChange', label: 'No Change' },
  { value: 'hdmiDownmix', label: 'Downmix' },
  { value: 'analog', label: 'Analog' },
  { value: 'none', label: 'Disconnect' }
];

module.exports.Rs232Types = [
  { value: 'noChange', label: 'No Change' },
  { value: 'connect', label: 'Connect' },
  { value: 'none', label: 'Disconnect' }
];

module.exports.IrTypes = [
  { value: 'noChange', label: 'No Change' },
  { value: 'connect', label: 'Connect' },
  { value: 'none', label: 'Disconnect' }
];

module.exports.UsbTypes = [
  { value: 'noChange', label: 'No Change' },
  { value: 'connect', label: 'Connect' },
  { value: 'none', label: 'Disconnect' }
];
