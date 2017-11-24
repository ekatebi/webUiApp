/* eslint no-console: 0 */

import { serverPath, signInTokenKey,
  URL,
  URL_UPDATE_SERVER,
  GET,
  SET,
  ACTION,
  STATUS,
  CONFIG,
  REDUNDANCY,
  EDID,
  IGMP,
  LICENSE,
  PREFERRED,
  RESTART,
  REBOOT,
  SHUTDOWN,
  TROUBLE,
  SWITCHOVER,
} from '../../constant/app';
// import { onSignIn } from '../../action/auth';
import { spinUp, spinDown } from '../../action/spinner';
// import fetchMock from 'fetch-mock';

// command: get, set, action
// details:
//   getType: status, config
//   setType: edid, igmp
//   action: restart, reboot, shutdown, trouble
function buildCommand(command, details) {
  let cmd = 'commands=';
  switch (command) {
    case GET:
      switch (details.getType) {
        case STATUS:
          cmd += 'show server info';
          break;
        case CONFIG:
          cmd += 'show server config';
          break;
        case REDUNDANCY:
          cmd += 'show server redundancy';
          break;
        default: {
          const error = `Unknown get type of ${details.getType}`; 
          throw error;    
        }
      }
      break;
    case SET:
      switch (details.setType) {
        case EDID:
          cmd += `set server auto-edid-mode ${details.edid}`;
          break;
        case IGMP:
          cmd += `set server igmp-querier-mode ${details.igmp}`;
          break;
        case LICENSE:
          cmd += `set server license ${details.license}`;
          break;
        case PREFERRED:
          cmd += 
            details.preferred === 'master' ?
              'set server redundancy this-server preferred-master true preferred-slave false'
              :
              'set server redundancy this-server preferred-master false preferred-slave true'
          ;
          break;
        default: {
          const error = `Unknown set type of ${details.setType}`; 
          throw error;    
        }
      }
      break;
    case ACTION:
      switch (details.action) {
        case RESTART:
          cmd += 'restart server';
          break;
        case REBOOT:
          cmd += 'shutdown server reboot';
          break;
        case SHUTDOWN:
          cmd += 'shutdown server';
          break;
        case TROUBLE:
          cmd += 'trouble-report';
          break;
        case SWITCHOVER:
          cmd += 'redundancy switchover';
          break;
        default: {
          const error = `Unknown action of ${details.action}`; 
          throw error;    
        }
      }
      break;
    default: {
      const error = `Unknown command of ${command}`; 
      throw error;    
    }
  }
  // console.log(`buildCommand: ${cmd}`);
  return cmd;
}

// command: get, set, action
// details:
//   getType: status, config
//   action: restart, reboot, shutdown
export function fetchServer(command, details) {
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

export function fetchUpdateServer(file) {
  const formData = new FormData();
  formData.append('updateFile', file);
  const url = URL_UPDATE_SERVER;
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
