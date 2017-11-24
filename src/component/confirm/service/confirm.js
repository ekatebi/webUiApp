/* eslint react/prop-types: 0 no-console: 0 */

import React from 'react';
import ReactDOM from 'react-dom';
import Confirm from '../Confirm';

export function confirm(message, options) {
    
  if (!options) {
    options = {};
  }

  let wrapper;

  let promise = new Promise((resolve, reject) => {

    const props = { message, ...options, resolve, reject };

    wrapper = document.body.appendChild(document.createElement('div'));
    ReactDOM.render(<Confirm {...props} />, wrapper);
        
  });

  promise.then(() => {
//    console.log('resolve...');
  }).catch(() => {
//    console.log('reject...');
  }).then(() => {
//    console.log('cleanup...');

    ReactDOM.unmountComponentAtNode(wrapper);
    return setTimeout(() => {
      return wrapper.remove();
    }, 500);

  });

  return promise;
}
