import {
  HDMI,
  HDMI_DOWNMIX,
  ANALOG,
  NONE
} from './app';

// Parts used to build API commands
export const DECODER_IN = {
  [HDMI]: 'hdmi',
  [HDMI_DOWNMIX]: 'hdmi-downmix',
  [ANALOG]: 'analog',
  [NONE]: 'none'
};
