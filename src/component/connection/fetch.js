import {
  URL_STORE as strUrl
} from '../../constant/app';

export function fetchConn() {

  const options = {
    headers: new Headers({
      Accept: 'application/json, charset=utf-8, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/json'  
    }),
    method: 'POST'
  };

//  const cmd = 'get_conn';


  const url = new URL(`${strUrl}?cmd=get_conn`);

/*
  const url = new URL(strUrl);
  const params = { cmd: 'get_conn' };

  Object.keys(params).forEach((key) => { 
    console.log('key', key, params[key], url);  
    if (key && params[key]) {
      url.searchParams.append(key, params[key]); 
    }
  });
*/
//  console.log('fetch', url, options);

  return fetch(url, options);
}

export function saveConn(connState) {

  const options = {
    method: 'POST',
    body: JSON.stringify(connState)
  };

  const cmd = 'save_conn';

  const url = new URL(strUrl);
  const params = { cmd };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  return fetch(url, options);
}

export function removeConn() {

  const options = {
    method: 'POST',
  };

  const cmd = 'rm_conn';

  const url = new URL(strUrl);
  const params = { cmd };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  return fetch(url, options);
}
