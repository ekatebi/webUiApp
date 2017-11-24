
import {
  URL as strUrl
} from '../../constant/app';

export function fetchMvs() {
  // console.log(`fetchDevice inputs - command: ${command} details: ${details}`);
  const url = strUrl;
  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    method: 'POST',
    body: 'commands=show multiviews config'
  };

  return fetch(url, options);
}

export function updateMv(cmd) {
  const url = strUrl;
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

export function deleteMv(name) {
  const url = strUrl;
  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    method: 'POST',
    body: `commands=delete multiview ${name}`
  };

  return fetch(url, options);
}

export function joinMvToDisplay(mvName, decoderName) {
  const url = strUrl;
  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    method: 'POST',
    body: `commands=join ${mvName} ${decoderName} multiview`
  };

  return fetch(url, options);
}
