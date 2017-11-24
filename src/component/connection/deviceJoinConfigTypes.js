/* eslint indent: 0 */

/*
Video (source to display only, one to many)
Digital Audio (source to display only, one to many) 
Analog Audio (source to display only, one to many)
Infrared (bidirectional, point to point)
RS232 (bidirectional, point to point)
USB (bidirectional, point to point)
*/

const prefix = 'DEVICE_JOIN_CONFIG_TYPES__';

module.exports.DeviceJoinConfigTypes = {
  VIDEO: { id: `${prefix}VIDEO`, name: 'Video' },
  DIGITAL_AUDIO: { id: `${prefix}DIGITAL_AUDIO`, name: 'Digital Audio' },
  ANALOG_AUDIO: { id: `${prefix}ANALOG_AUDIO`, name: 'Analog Audio' },
  INFRARED: { id: `${prefix}INFRARED`, name: 'Infrared' },
  RS232: { id: `${prefix}RS232`, name: 'RS232' },
  USB: { id: `${prefix}USB`, name: 'USB' }
};

module.exports.VideoJoinModes = {
  'fast-switched': 'Fast Switched',
  genlocked: 'Genlocked',
  multiview: 'Multiview',
};

// The audio source type reports how the audio was "set" on the decoder.
module.exports.AudioSourceTypes = {
  hdmi: 'HDMI',
  'hdmi-downmix': 'HDMI Downmix',
  analog: 'Analog'
};
