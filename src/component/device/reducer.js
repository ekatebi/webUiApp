import { NOOP, CLEAR_INFO, REQUEST_INFO, RECEIVE_INFO, REFRESH_INFO, FIRMWARE_VERSION,
  RECEIVE_ERROR, RECEIVE_TIMEOUT, SELECT_DISPLAYS, SELECT_SOURCES, RECEIVE_DRAG, INIT_COUNTER,
  REQUEST_MAX_NUMBERS, RECEIVE_MAX_NUMBERS, RECEIVE_MAX_NUMBERS_ERROR,
  ANIMATE_DEVICE_BORDER, DISCONNECT_SELECTED_DISPLAYS } from './constants';

const initState = {

    fetching: false,
    error: undefined,
    lastChangeIdMaxNumbers: { status: -1, config: -1, capabilities: -1 },

    encoders: {
      status: { fetching: false, error: undefined, info: undefined },
      config: { fetching: false, error: undefined, info: undefined },
      capabilities: { fetching: false, error: undefined, info: undefined }
    },

    decoders: {
      status: { fetching: false, error: undefined, info: undefined },
      config: { fetching: false, error: undefined, info: undefined },
      capabilities: { fetching: false, error: undefined, info: undefined }
    },

    refreshing: false,
    selectedSources: [],
    selectedDisplays: [],
    dragInfo: undefined,
    globalCounter: undefined,
    firmwareVer: { encoder: [], decoder: [] },
    animate: {},
    disconnectSelectedDisplays: false
};

export default (state = initState, action) => {

  switch (action.type) {
    case CLEAR_INFO:
      return { ...initState };
    case REQUEST_INFO:
      return { ...state, [action.deviceType]:
        { ...state[action.deviceType], [action.infoType]:
          { ...state[action.deviceType][action.infoType], fetching: true } } };

    case RECEIVE_INFO:
//      console.log('action.info', action.info);
      return { ...state, [action.deviceType]:
        { ...state[action.deviceType], [action.infoType]:
          { ...state[action.deviceType][action.infoType], info: action.info } } };

    case REFRESH_INFO:
      return { ...state, refreshing: action.refreshing };

    case REQUEST_MAX_NUMBERS:
      return { ...state, fetching: true, error: undefined };

    case RECEIVE_MAX_NUMBERS:
      return { ...state, lastChangeIdMaxNumbers: action.lastChangeIdMaxNumbers, fetching: false, error: undefined };

    case RECEIVE_MAX_NUMBERS_ERROR:
      return { ...state, fetching: false, error: action.error };

    case RECEIVE_ERROR:
      return { ...state, [action.deviceType]:
        { ...state[action.deviceType], [action.infoType]:
          { ...state[action.deviceType][action.infoType], fetching: false, error: action.error } } };
    case RECEIVE_TIMEOUT:
      return { ...state, fetching: false, error: undefined };
    case FIRMWARE_VERSION:
      return { ...state, firmwareVer: { ...state.firmwareVer, [action.devType]: action.firmwareVer } };
    case SELECT_SOURCES:
//      console.log('SELECT_SOURCES', action.sources);
      return { ...state, selectedSources: action.sources };
    case SELECT_DISPLAYS:
      return { ...state, selectedDisplays: action.displays };
    case RECEIVE_DRAG:
      return { ...state, dragInfo: action.dragInfo };
    case INIT_COUNTER:
      return { ...state, globalCounter: action.globalCounter };
    case ANIMATE_DEVICE_BORDER:
      return { ...state, animate: { ...state.animate, [action.mac]: action.animate } };
    case DISCONNECT_SELECTED_DISPLAYS:
      return { ...state, disconnectSelectedDisplays: action.disconnect };
    default:
      return state;
  }

};
