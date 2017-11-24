/* eslint react/prop-types: 0 no-console: 0 */

import {
  URL_DB as strUrl
} from '../../constant/app';

export function fetchZones(parentId) {

//  console.log('fetchZones', parentId);

  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    method: 'POST'
  };

  if (parentId) {
    options.body = parentId.toString();
  }

  const cmd = parentId ? 'sub_zone' : 'get_zone';

  const url = new URL(strUrl);
  const params = { cmd };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

//  console.log('fetchZones url', url);

  return fetch(url, options);
}

export function saveZone(formData) {

//  console.log('saveZone', formData);

  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/json'
    }),
    method: 'POST',
    body: JSON.stringify(formData)
  };

  const cmd = 'save_zone';

  const url = new URL(strUrl);
  const params = { cmd };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

//  console.log('saveZone url', url);

  return fetch(url, options);
}

export function removeZone(id) {

  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    }),
    method: 'POST',
    body: id.toString()
  };

  const cmd = 'remove_zone';

  const url = new URL(strUrl);
  const params = { cmd };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  return fetch(url, options);
}

export function removeItemFromZone(displayMac, wallName, zoneId) {

//  console.log('removeItemFromZone', displayMac, wallName, zoneId);

  let body;

  if (displayMac) {
    body = JSON.stringify({ zone_id: zoneId, display_mac: displayMac });
  } else if (wallName) {
    body = JSON.stringify({ zone_id: zoneId, wall_name: wallName });    
  }

  const options = {
    headers: new Headers({
      Accept: 'application/json, text/plain, */*',
      'Accept-Language': 'en-US,en;q=0.8',
      'Content-Type': 'application/json'
    }),
    method: 'POST',
    body
  };

  let cmd;

  if (displayMac) {
    cmd = 'removedisplay_zone';
  } else if (wallName) {
    cmd = 'removevideowall_zone';
  }

  const url = new URL(strUrl);
  const params = { cmd };
  Object.keys(params).forEach(key => url.searchParams.append(key, params[key]));

  return fetch(url, options);
}

export function clearItemsFromZone(zone) {

//  console.log('clearItemsFromZone', zone);

  return new Promise((resolve, reject) => {

    if (zone) {

      const displayMac = zone.displays.pop();

      if (displayMac) {
        removeItemFromZone(displayMac, undefined, zone.id)
          .then(resp => resp.json())
          .then(json => {
            if (json.success === true) {
              clearItemsFromZone(zone)
                .then(() => {
                  resolve();
                })
                .catch(error => {
                  reject(error);
                });    
            } else {
              const error = json.status;
              reject(error);
            }
          })
          .catch(error => {
            reject(error);
          });    

      } else {
        const wallName = zone.walls.pop();
        if (wallName) {
          removeItemFromZone(undefined, wallName, zone.id)
          .then(resp => resp.json())
          .then(json => {
            if (json.success === true) {
              clearItemsFromZone(zone)
                .then(() => {
                  resolve();
                })
                .catch(error => {
                  reject(error);
                });    
            } else {
              const error = json.status;
              reject(error);
            }
          })
          .catch(error => {
            reject(error);
          });    
        } else {
          resolve();
        }
      }
    } else {
      resolve();
    }
  });
}

export function fetchDeepDisplaysAndWallsOfZone(zone) {

//  console.log('fetchDeepDisplaysAndWallsOfZone', zone);

  function getZoneItems(zone) {
    const zone2 = {
      displayMacs: zone && zone.display_macs ? zone.display_macs.split(',') : [],
      wallNames: zone && zone.wall_names ? zone.wall_names.split(',') : []
    };
//    console.log('getZoneItems', zone2, zone);
    return zone2;
  }

  // get list
  return new Promise((resolve, reject) => {

//    console.log('fetchZones', id);
    fetchZones(zone.id)
    .then(resp => resp.json())
    .catch((err) => {
      reject(err);
    })
    .then(json => {

      if (json.success === true) {
        const list = json.result;

        // process list

        if (list.length > 0) {

          const displaysAndWallsOfZonePromises = list.map((subZone) => {
            return fetchDeepDisplaysAndWallsOfZone(subZone);
          });

          // wait for children
          Promise.all(displaysAndWallsOfZonePromises)
            .then((results) => {

              const item = getZoneItems(zone);

//              console.log('item before', item, results);

              results.forEach((result) => {
                item.displayMacs = item.displayMacs.concat(result.displayMacs);
                item.wallNames = item.wallNames.concat(result.wallNames);
              });

//              console.log('item after', item);

              resolve(item);

            })
            .catch((err) => {
              // Will catch failure of first failed promise
//              throw new Error(err); // same as rejection
//              console.log('removeZoneDeep fetchZone catch reject', id);
              reject(err);
            });
        } else {
          // no children
          resolve(getZoneItems(zone));
        }

      } else {
//        console.log('fetchZones error', json);
        const err = json.status;
        reject(err);
      }

    })
    .catch(err => {
      // throw new Error(err); // same as rejection
      reject(err);
    });    
  });
}
