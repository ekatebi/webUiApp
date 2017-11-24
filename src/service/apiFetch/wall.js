/* eslint no-console: 0 */

import {
  URL
} from '../../constant/app';

export function fetchWalls() {
  // console.log(`fetchDevice inputs - command: ${command} details: ${details}`);
  const url = URL;
  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    method: 'POST',
//    body: buildCommand(command, details)
    body: 'commands=show video-walls'
//     serverSocketName:rcServerSocket
  };

  return fetch(url, options);
}

export function updateWall(cmd) {
  const url = URL;
  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    method: 'POST',
    body: cmd
  };

  return fetch(url, options);
}

export function deleteWall(name) {
  const url = URL;
  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    method: 'POST',
    body: `commands=delete video-wall \"${name}\"`
  };

  return fetch(url, options);
}

// commands:set video-wall-encoder 0:1e:c0:f6:c2:f dc33
export function joinSrcToWall(srcMac, wallName) {
  const url = URL;
  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    method: 'POST',
    body: `commands=set video-wall-encoder ${srcMac} \"${wallName}\"`
  };

  return fetch(url, options);
}
