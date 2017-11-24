/* eslint no-console: 0 */

import {
  URL,
  JOIN,
  SWITCH,
  COMMAND_SEPARATOR,
  VIDEO,
  GENLOCKED,
  FAST_SWITCHED,
  CONNECT,
  DISCONNECT,
  NO_CHANGE,
  NONE,
  HDMI,
  HDMI_DOWNMIX,
  ANALOG,
  USB,
  IR,
  RS232
} from '../../constant/app';
import {
  DECODER_IN,
  USB_IN,
  IR_IN,
  RS232_IN,
} from '../../constant/joinCommands';
// import { onSignIn } from '../../action/auth';
// import fetchMock from 'fetch-mock';

// sourceName: name of source
// displayName: name of display
// joinConfigDetails:
//   video: genlocked, fast-switched, none, noChange
//   digitalAudio: analog, hdmiDownmix, none, noChange
//   analogAudio: hdmi, analog, hdmiDownmix, none, noChange
//   usb: usb, none, noChange
//   ir: ir, none, noChange
//   rs232: rs232, none, noChange
// analogAudioConnection:
//   audioSourceType: analog, hdmi-downmix
// If there is not currently a connection to analog audio, then analogAudioConnection is undefined.
function buildCommand(sourceName, displayName, joinConfigDetails, oldVideoConnection, analogAudioConnection, singleCmd = true) {
  let cmd = singleCmd ? 'commands=' : '';

  // Join a device to video out.
  if (joinConfigDetails.hasOwnProperty('video') && joinConfigDetails.video.value !== NO_CHANGE) {
    switch (joinConfigDetails.video.value) {
      case GENLOCKED:
        // fall through
      case FAST_SWITCHED:
        cmd += `join ${sourceName} `;
        cmd += `${displayName} `;
        cmd += `${joinConfigDetails.video.value}`;
        cmd += `${COMMAND_SEPARATOR}`;
        break;
      case NONE:
        // When disconnecting video, the API requires a video mode.
        // For non-HD, it doesn't matter which one is supplied.
        // We supply fast-switched, so it works with HD.
        cmd += `join none ${displayName} fast-switched`;
        cmd += `${COMMAND_SEPARATOR}`;
        break;
      default: {
        const error = `Unknown join video type of ${joinConfigDetails.video.value}`;
        throw error;
      }
    }
  }

  // Note: Even if the user sets audio to follow video
  // in the CLI with the video-source command,
  // the GUI never uses video-source.
  // For example in the CLI, these commands are the same.
  //
  //   join 0:1e:c0:f6:43:80 dc-4k-d2 hdmi-downmix-audio
  //   set decoder dc-4k-d2 hdmi-audio-out source hdmi-downmix
  //
  //   join video-source dc-4k-d2 hdmi-downmix-audio hdmi-out
  //
  // The GUI will use the first commands, which will break the "follow".

  // Join a device to digital audio out.
  // If there is a request for HDMI in to digital audio out, skip the join.
  // The only way to get HDMI in to digital audio out is with genlocked video.
  // Sending the genlocked video command to the device
  // automatically joins HDMI in to digital audio out.
  if (joinConfigDetails.hasOwnProperty('digitalAudio') && joinConfigDetails.digitalAudio.value !== NO_CHANGE) {
    let digitalAudioSet = `set decoder ${displayName} `;
    digitalAudioSet += `hdmi-audio-out source ${DECODER_IN[joinConfigDetails.digitalAudio.value]}`;
    switch (joinConfigDetails.digitalAudio.value) {
      case HDMI:
        cmd += digitalAudioSet;
        cmd += `${COMMAND_SEPARATOR}`;
        break;
      case HDMI_DOWNMIX:
        if (joinConfigDetails.analogAudio.value === NONE) {
          // Since "join none" is not guaranteed to turn the audio off by itself,
          // also set the audio on the decoder.
          cmd += `join none ${displayName} analog-audio`;
          cmd += `${COMMAND_SEPARATOR}`;
          cmd += `set decoder ${displayName} analog-audio-out source analog`;
          cmd += `${COMMAND_SEPARATOR}`;
        }
        cmd += `join ${sourceName} `;
        cmd += `${displayName} hdmi-downmix-audio`;
        cmd += `${COMMAND_SEPARATOR}`;
        cmd += digitalAudioSet;
        cmd += `${COMMAND_SEPARATOR}`;
        break;
      case ANALOG:
        if (joinConfigDetails.analogAudio.value === NONE) {
          // Since "join none" is not guaranteed to turn the audio off by itself,
          // also set the audio on the decoder.
          cmd += `join none ${displayName} analog-audio`;
          cmd += `${COMMAND_SEPARATOR}`;
          cmd += `set decoder ${displayName} analog-audio-out source hdmi-audio`;
          cmd += `${COMMAND_SEPARATOR}`;
        }
        cmd += `join ${sourceName} `;
        cmd += `${displayName} hdmi-downmix-audio`;
        cmd += `${COMMAND_SEPARATOR}`;
        cmd += digitalAudioSet;
        cmd += `${COMMAND_SEPARATOR}`;
        break;
      case NONE:
        // If analog audio is not also changing,
        // decide what to do by looking at the state of the current analog audio connection. 
        if (joinConfigDetails.analogAudio.value === NO_CHANGE) {
          if (!analogAudioConnection) {
            cmd += `join none ${displayName} hdmi-downmix-audio`;
            cmd += `${COMMAND_SEPARATOR}`;
            cmd += `join none ${displayName} analog-audio`;
            cmd += `${COMMAND_SEPARATOR}`;
          } else if (analogAudioConnection.audioSourceType === ANALOG) {
            cmd += `join none ${displayName} hdmi-downmix-audio`;
            cmd += `${COMMAND_SEPARATOR}`;
            cmd += `set decoder ${displayName} hdmi-audio-out source hdmi-downmix`;
            cmd += `${COMMAND_SEPARATOR}`;
          } else {
            cmd += `join none ${displayName} analog-audio`;
            cmd += `${COMMAND_SEPARATOR}`;
            cmd += `set decoder ${displayName} hdmi-audio-out source analog`;
            cmd += `${COMMAND_SEPARATOR}`;
          }
        } else {
          // If analog audio is also changing, decide what to do by looking at the analog chnages. 
          if (joinConfigDetails.analogAudio.value === NONE) {
            cmd += `join none ${displayName} hdmi-downmix-audio`;
            cmd += `${COMMAND_SEPARATOR}`;
            cmd += `join none ${displayName} analog-audio`;
            cmd += `${COMMAND_SEPARATOR}`;
          } else if (joinConfigDetails.analogAudio.value === ANALOG) {
            cmd += `join none ${displayName} hdmi-downmix-audio`;
            cmd += `${COMMAND_SEPARATOR}`;
            cmd += `set decoder ${displayName} hdmi-audio-out source hdmi-downmix`;
            cmd += `${COMMAND_SEPARATOR}`;
          } else {
            cmd += `join none ${displayName} analog-audio`;
            cmd += `${COMMAND_SEPARATOR}`;
            cmd += `set decoder ${displayName} hdmi-audio-out source analog`;
            cmd += `${COMMAND_SEPARATOR}`;
          }
        }
        break;
      default: {
        const error = `Unknown join digital audio type of ${joinConfigDetails.digitalAudio.value}`;
        throw error;
      }
    }
  }

  // Join a device to analog audio out.
  if (joinConfigDetails.hasOwnProperty('analogAudio') && joinConfigDetails.analogAudio.value !== NO_CHANGE) {
    let analogAudioSet = `set decoder ${displayName} `;
    analogAudioSet += `analog-audio-out source ${DECODER_IN[joinConfigDetails.analogAudio.value]}`;
    switch (joinConfigDetails.analogAudio.value) {
      case HDMI_DOWNMIX:
        cmd += `join ${sourceName} `;
        cmd += `${displayName} hdmi-downmix-audio`;
        cmd += `${COMMAND_SEPARATOR}`;
        cmd += analogAudioSet;
        cmd += `${COMMAND_SEPARATOR}`;
        break;
      case ANALOG:
        cmd += `join ${sourceName} `;
        cmd += `${displayName} analog-audio`;
        cmd += `${COMMAND_SEPARATOR}`;
        cmd += analogAudioSet;
        cmd += `${COMMAND_SEPARATOR}`;
        break;
      case NONE:
        if (joinConfigDetails.digitalAudio.value === ANALOG) {
          cmd += `join none ${displayName} hdmi-downmix-audio`;
          cmd += `${COMMAND_SEPARATOR}`;
          cmd += `set decoder ${displayName} analog-audio-out source hdmi-downmix`;
          cmd += `${COMMAND_SEPARATOR}`;
        } else {
          cmd += `join none ${displayName} analog-audio`;
          cmd += `${COMMAND_SEPARATOR}`;
          cmd += `set decoder ${displayName} analog-audio-out source analog`;
          cmd += `${COMMAND_SEPARATOR}`;
        }
        break;
      default: {
        const error = `Unknown join analog audio type of ${joinConfigDetails.analogAudio.value}`;
        throw error;
      }
    }
  }

  // Join a device to USB out.
  if (joinConfigDetails.hasOwnProperty('usb') && joinConfigDetails.usb.value !== NO_CHANGE) {
    switch (joinConfigDetails.usb.value) {
      case CONNECT:
        // This is a work-around for a current limitation of the API.
        // Disconnect first, and then connect.
        cmd += `join none ${displayName} usb`;
        cmd += `${COMMAND_SEPARATOR}`;
        cmd += `join ${sourceName} ${displayName} usb`;
        cmd += `${COMMAND_SEPARATOR}`;
        break;
      case NONE:
        // Because of a bug in the API, the unjoins must be done in this order.
        cmd += `join none ${displayName} usb`;
        cmd += `${COMMAND_SEPARATOR}`;
        cmd += `join ${sourceName} none usb`;
        cmd += `${COMMAND_SEPARATOR}`;
        break;
      default: {
        // TODO - Improve error handling.
        console.error(`Unknown USB join type of ${joinConfigDetails.usb.value}`);
      }
    }
  }

  // Join a device to infrared out.
  if (joinConfigDetails.hasOwnProperty('ir') && joinConfigDetails.ir.value !== NO_CHANGE) {
    switch (joinConfigDetails.ir.value) {
      case CONNECT:
        cmd += `switch ${sourceName} ${displayName} ir`;
        cmd += `${COMMAND_SEPARATOR}`;
        // Always make a two way connection.
        cmd += `switch ${displayName} ${sourceName} ir`;
        cmd += `${COMMAND_SEPARATOR}`;
        break;
      case NONE:
        cmd += `switch ${joinConfigDetails.ir.sourceMac ? joinConfigDetails.ir.sourceMac : sourceName} none ir`;
        cmd += `${COMMAND_SEPARATOR}`;
        // Remove both parts of the two way connection.
        cmd += `switch ${displayName} none ir`;
        cmd += `${COMMAND_SEPARATOR}`;
        break;
      default: {
        // TODO - Improve error handling.
        console.error(`Unknown join infrared type of ${joinConfigDetails.ir.value}`);
      }
    }
  }

  // Join a device to RS232 out.
  if (joinConfigDetails.hasOwnProperty('rs232') && joinConfigDetails.rs232.value !== 'noChange') {
    switch (joinConfigDetails.rs232.value) {
      case CONNECT:
        cmd += `switch ${sourceName} ${displayName} rs232`;
        cmd += `${COMMAND_SEPARATOR}`;
        // Always make a two way connection.
        cmd += `switch ${displayName} ${sourceName} rs232`;
        cmd += `${COMMAND_SEPARATOR}`;
        break;
      case NONE:
        cmd += `switch ${joinConfigDetails.rs232.sourceMac ? joinConfigDetails.rs232.sourceMac : sourceName} none rs232`;
        cmd += `${COMMAND_SEPARATOR}`;
        // Remove both parts of the two way connection.
        cmd += `switch ${displayName} none rs232`;
        cmd += `${COMMAND_SEPARATOR}`;
        break;
      default: {
        console.error(`Unknown join RS232 type of ${joinConfigDetails.rs232.value}`);
      }
    }
  }

  // Remove extra command separator character from the end, if it exists.
  // Notice the last dollar sign is a literal dollar sign character
  // signifying end of string in the regular expression.
  if (singleCmd) {
    const separatorAtEnd = new RegExp(`${COMMAND_SEPARATOR}$`);
    cmd = cmd.replace(separatorAtEnd, '');
  }

//  console.log(`buildCommand: ${cmd}`);
  return cmd;
}

// sourceName: name of source
// displayName: name of display
// joinConfigDetails:
//   video: genlocked, fast-switched, none, noChange
//   digitalAudio: analog, hdmiDownmix, none, noChange
//   analogAudio: hdmi, analog, hdmiDownmix, none, noChange
//   usb: usb, none, noChange
//   ir: ir, none, noChange
//   rs232: rs232, none, noChange
// analogAudioConnection:
//   audioSourceType: analog, hdmi-downmix
// If there is not currently a connection to analog audio, then analogAudioConnection is undefined.
export function joinDevices(sourceName, displayName, joinConfigDetails, oldVideoConnection, analogAudioConnection) {
  //  console.log(`joinDevices inputs - sourceName: ${sourceName} displayName: ${displayName} joinConfigDetails:`, joinConfigDetails);
  if (joinConfigDetails === undefined) {
    const error = `Joining devices ${sourceName} and ${displayName} without joinConfigDetails.`;
    throw error;
  }
  const url = URL;
  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    method: 'POST',
    body: buildCommand(sourceName, displayName, joinConfigDetails, oldVideoConnection, analogAudioConnection)
  };

  return fetch(url, options);
}

function buildZoneVideoWallCommand(sourceName, wallName, joinConfigDetails, analogAudioConnection) {

  let cmd = '';

  if (joinConfigDetails.hasOwnProperty('video') && joinConfigDetails.video.value !== NO_CHANGE) {
    switch (joinConfigDetails.video.value) {
      case FAST_SWITCHED:
        cmd = `set video-wall-encoder ${sourceName} "${wallName}"`;
        cmd += `${COMMAND_SEPARATOR}`;
        break;
      case NONE:
        cmd = `set video-wall-encoder none "${wallName}"`;
        cmd += `${COMMAND_SEPARATOR}`;
        break;
      default: {
        /* do nothing */
      }
    }
  }

//  console.log('buildZoneVideoWallCommand', cmd);

  return cmd;
}


function buildZoneCommand(sourceName, zone, joinConfigDetails, analogAudioConnection) {

  let cmd = 'commands=';

  // When connecting to an entire zone, do not use video-source.
  // In order to use video-source, perhpas move this function up a level
  // where oldVideoConnection is available.
  const oldVideoConnection = 'none';

  zone.displayMacs.forEach((displayMac) => {
    cmd += buildCommand(sourceName, displayMac, joinConfigDetails, oldVideoConnection, analogAudioConnection, false);
  });
  
  zone.wallNames.forEach((wallName) => {
    cmd += buildZoneVideoWallCommand(sourceName, wallName, joinConfigDetails, analogAudioConnection, false);
  });
  
  const separatorAtEnd = new RegExp(`${COMMAND_SEPARATOR}$`);
  cmd = cmd.replace(separatorAtEnd, '');

//  console.log('buildZoneCommand', cmd);

  return cmd;
}

export function joinZone(sourceName, zone, joinConfigDetails, analogAudioConnection) {
  // console.log(`joinZone inputs - sourceName: ${sourceName} displayName: ${displayName} joinConfigDetails:`, joinConfigDetails);
  if (joinConfigDetails === undefined) {
    const error = `Joining zone ${sourceName} and ${zone.name} without joinConfigDetails.`;
    throw error;
  }
  const url = URL;
  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    method: 'POST',
    body: buildZoneCommand(sourceName, zone, joinConfigDetails, analogAudioConnection)
  };

  return fetch(url, options);
}
