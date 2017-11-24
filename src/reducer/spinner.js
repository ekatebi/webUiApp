import { SPIN_UP, SPIN_DOWN, SPIN_RESET_WARNING, SPIN_RESET_ERROR }
  from '../constant/spinner';

const initState = {
  mocked: [],
  url: [],
  message: {},
  fetching: 0,
};

function spinner(state = initState, action) {
  switch (action.type) {
    case SPIN_UP:
      {
        const fetching = state.fetching + 1;
        const url = [...state.url];
        url.push(action.url);
        // console.log('#####SPINUP', fetching, action.url, url);
        return { ...state, fetching, url };
      }
    case SPIN_DOWN:
      {
        const fetching = state.fetching - 1;
        const url = state.url.filter(url => url !== action.url);
        // console.log('#####SPINDOWN', fetching, action.url, url);
        const message = { ...state.message };
        const msg = action.message || '';
        if (msg) {
          message[action.url] = msg;
        }
        let mocked = [...state.mocked];
        action.mocked.forEach(url => {
          if (mocked.indexOf(url) === -1) {
            mocked.push(url);
          }
        });
        mocked = mocked.sort();
        return { fetching, message, url, mocked };
      }
    case SPIN_RESET_ERROR:
      {
        const url = [];
        const message = {};
        return { ...state, message, url };
      }
    case SPIN_RESET_WARNING:
      {
        const mocked = [];
        return { ...state, mocked };
      }
    default:
      return state;
  }
}

export default spinner;
