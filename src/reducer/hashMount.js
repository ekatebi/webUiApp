import { getPath } from '../service/path';
import { UPDATE_LOCATION } from 'react-router-redux';

// mounts a single reducer state on a hash object
function hashMount(reducer, urlLength) {
  const initCurrent = reducer(undefined, { type: '' });
  const pathname = location.pathname;
  const path = getPath(pathname, urlLength);
  const initState = {
    path,
    current: initCurrent,
    hash: {},
  };
  return function hashFunc(state = initState, action) {
    switch (action.type) {
      case UPDATE_LOCATION:
        {
          const pathname = action.payload.pathname;
          const path = getPath(pathname, urlLength);
          const hash = state.hash;
          const current = hash[path] ? hash[path] : initCurrent;
          return { ...state, current, path };
        }
      default:
        {
          const current = reducer(state.current, action);
          const hash = { ...state.hash };
          hash[state.path] = current;
          return { ...state, current, hash };
        }
    }
  };
}

export default hashMount;
