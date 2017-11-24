/* eslint no-console: 0 */

import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { fetchServer } from '../../service/apiFetch/server';
import { GET, HeartbeatInterval } from '../../constant/app';
import { confirm } from '../confirm/service/confirm';

const heartbeat = (() => {
  // The heart. A singleton.
  // Make sure that at most, only one heart exists at any one time.
  let heart;

  function createHeart() {
    // This holds the status of the heartbeat loop.
    //
    // Within the heartbeat loop, at any moment in time, we will have several
    // different individual heartbeats sent out to the server, waiting for a response.
    // When the server finally comes up, several of these individual heartbeats
    // may come back successfully. But each time the loop is started,
    // we only want to take the success action one time.
    // Keep track of heartbeat status in order to make sure
    // that the available message and browser refresh
    // only happen once each time heartbeat loop is started.
    let privateHeartbeatStatus = 'done';
    return {
      start: () => { privateHeartbeatStatus = 'checking'; },
      finish: () => { privateHeartbeatStatus = 'done'; },
      isChecking: () => { return privateHeartbeatStatus === 'checking'; },
      value: () => { return privateHeartbeatStatus; },
    };
  }

  return {
    getHeart: () => {
      if (!heart) {
        heart = createHeart();
      }
      return heart;
    }
  };
});

function getOneHeartbeat(heartbeatInstance) {
  fetchServer(GET, { getType: 'status' })
  .then(resp => resp.json())
  .catch((error) => {
    // Quietly do nothing.
    // console.log('Failed to get some server information.', error);
  })
  .then(json => {
    if (json.status === 'Success') {
      if (heartbeatInstance.isChecking()) {
        appAlert.success('Server is available. Refreshing browser now.');
        heartbeatInstance.finish();
        // Refresh the browser, and grab a fresh script from the server.
        if (!window.fetchLongDelay) {
          window.location.reload(true);
        }
      }
    } else {
      // Quietly do nothing.
      // console.log('A heartbeat request failed.');
    }
  })
  .catch(heartbeatError => {
    // Quietly do nothing.
    // console.log('One heartbeat request failed.');
  });
}

const heartbeatSingleton = heartbeat();
const heartbeatInstance = heartbeatSingleton.getHeart();

export function getHeartbeat() {
  
  if (!window.fetchLongDelay) {
    confirm('Error - Server not available.', {
      description: 'Additional details may be available from the log panel.',
      confirmLabel: 'OK',
    }).then(() => {
  //    console.log('Error has been dismissed.');
    }).catch(() => {});
  }
  
  if (!heartbeatInstance.isChecking()) {
    heartbeatInstance.start();
    const heartbeatInterval = window.setInterval(() => {
      getOneHeartbeat(heartbeatInstance);
    }, HeartbeatInterval);
  }
}
