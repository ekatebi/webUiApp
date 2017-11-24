/* eslint no-console: 0 */

import {
  URL,
  URL_LONG,
  URL_UPDATE_DEVICE,
  GET,
  SET,
  ACTION,
  STATUS,
  CONFIG,
  CAPABILITIES,
  WALL,
  MODE,
  IP,
  RS232,
  VIDEO_PORT,
  DHCP,
  STATIC,
  LINK_LOCAL,
  REBOOT,
  RESET,
  DELETE,
  NAME,
  MANUFACTURER,
  MODEL,
  SERIAL_NUMBER,
  LOCATION,
  ICON_IMAGE_NAME,
  COMMAND_SEPARATOR
} from '../../constant/app';
import {
  DATA_BIT_IN,
  STOP_BIT_IN
} from '../../constant/deviceCommands';
// import { onSignIn } from '../../action/auth';
// import fetchMock from 'fetch-mock';

// command: status, config
// details:
//   deviceType: encoders, decoders
//   lastChangeIdMax: 0 or any number - optional
//   deviceName: name of source
function buildCommand(command, details) {
  // console.log('buildCommand', ', command', command, ', details', details);
  let cmd = 'commands=';
  let since = details.lastChangeIdMax;
  // The API fails if "since" is less than zero.
  if (since < 0) {
    since = 0;
  }
  switch (command) {
    case GET:
      switch (details.getType) {
        case STATUS:
          cmd += `show device status ${details.deviceType} since ${since}`;
          break;
        case CONFIG:
          cmd += `show device config ${details.deviceType} since ${since}`;
          break;
        case CAPABILITIES:
          cmd += `show device capabilities ${details.deviceType} since ${since}`;
          break;
        case WALL:
          cmd += `show ${WALL}`;
          break;
        default: {
          const error = `Unknown get type of ${details.getType}`;
          throw error;
        }
      }
      if (details.lastChangeIdMax !== undefined) {
        cmd += `&lastChangeIdMax=${details.lastChangeIdMax}`;
      }
      break;
    case SET:
      switch (details.setType) {
        case MODE:
          cmd += `set device ${details.deviceName} general mode ${details.mode}`;
          break;
        case IP:
          switch (details.ip.ipMode) {
            case DHCP:
              cmd += `set device ${details.deviceName} ip ${details.ip.ipMode}`;
              break;
            case STATIC:
              cmd += `set device ${details.deviceName} ip `;
              cmd += `${details.ip.ipMode} `;
              cmd += `${details.ip.ipAddress} `;
              cmd += `${details.ip.ipMask} `;
              cmd += `${details.ip.ipGateway}`;
              break;
            case LINK_LOCAL:
              cmd += `set device ${details.deviceName} ip ${details.ip.ipMode}`;
              break;
            default: {
              const error = `Unknown set IP mode of ${details.ip.ipMode}`;
              throw error;
            }
          }
          break;
        case RS232:
          cmd += `set device ${details.deviceName} rs232 `;
          cmd += `${details.rs232.baudrate} `;
          cmd += `${DATA_BIT_IN[details.rs232.dataBit]} `;
          cmd += `${STOP_BIT_IN[details.rs232.stopBit]} `;
          cmd += `${details.rs232.parity}`;
          break;
        case VIDEO_PORT:
          cmd += `set device ${details.deviceName} video-port ${details.videoPort}`;
          break;
        case NAME:
          cmd += `set device ${details.mac} general name ${details.name}`;
          break;
        case MANUFACTURER:
          cmd += `set device ${details.mac} source-display manufacturer ${details.manufacturer}`;
          break;
        case MODEL:
          cmd += `set device ${details.mac} source-display model ${details.model}`;
          break;
        case SERIAL_NUMBER:
          cmd += `set device ${details.mac} source-display serialNumber ${details.serialNumber}`;
          break;
        case LOCATION:
          cmd += `set device ${details.mac} source-display location ${details.location}`;
          break;
        case ICON_IMAGE_NAME:
          cmd += `set device ${details.mac} source-display iconImageName "${details.iconImageName}"`;
          break;
        default: {
          const error = `Unknown set type of ${details.setType}`;
          throw error;
        }
      }
      if (details.lastChangeIdMax !== undefined) {
        cmd += `&lastChangeIdMax=${details.lastChangeIdMax}`;
      }
      break;
    case ACTION:
      switch (details.actionType) {
        case REBOOT:
          cmd += `restart device ${details.deviceName}`;
          break;
        case RESET:
          cmd += `factory-defaults device ${details.deviceName}`;
          break;
        case DELETE:
          cmd += `delete device ${details.deviceName}`;
          break;
        default: {
          const error = `Unknown action type of ${details.getType}`;
          throw error;
        }
      }
      break;
    default: {
      const error = `unknown command of ${command}`;
      throw error;
    }
  }

  return cmd;
}

function buildLongCommand(lastChangeIdMaxNumbers = { status: -1, config: -1, capabilities: -1 }) {
  // console.log('buildCommand', ', command', command, ', details', details);
  let cmd = 'commands=';

  cmd += `show device status encoders since ${lastChangeIdMaxNumbers.status}`;
  cmd += `${COMMAND_SEPARATOR}`;
  cmd += `show device status decoders since ${lastChangeIdMaxNumbers.status}`;
  cmd += `${COMMAND_SEPARATOR}`;

  cmd += `show device config encoders since ${lastChangeIdMaxNumbers.config}`;
  cmd += `${COMMAND_SEPARATOR}`;
  cmd += `show device config decoders since ${lastChangeIdMaxNumbers.config}`;
  cmd += `${COMMAND_SEPARATOR}`;

  cmd += `show device capabilities encoders since ${lastChangeIdMaxNumbers.capabilities}`;
  cmd += `${COMMAND_SEPARATOR}`;
  cmd += `show device capabilities decoders since ${lastChangeIdMaxNumbers.capabilities}`;
//  console.log(`buildCommand: ${cmd}`);
  return cmd;
}

// command: status, config
// details:
//   deviceType: encoders, decoders
//   lastChangeIdMax: 0 or any number - optional
//   deviceName: name of source
export function fetchDevice(command, details) {
  // console.log(`fetchDevice inputs - command: ${command} details: ${details}`);
  const url = URL;
  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    method: 'POST',
    body: buildCommand(command, details)
  };

  return fetch(url, options);
}

export function fetchLong(lastChangeIdMaxNumbers = { status: -1, config: -1, capabilities: -1 }) {
  // console.log('fetchLong:', lastChangeIdMaxNumbers);
  const url = URL_LONG;
  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    method: 'POST',
    body: buildLongCommand(lastChangeIdMaxNumbers)
  };

  return fetch(url, options);
}

export function fetchUpdateDevice(deviceName, file) {
  const formData = new FormData();
  formData.append('updateFile', file);
  formData.append('deviceName', deviceName);
  const url = URL_UPDATE_DEVICE;
  const options = {
    header: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'multipart/form-data'
    }),
    method: 'POST',
    body: formData,
  };

  return fetch(url, options);
}
