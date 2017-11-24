import {
  CONNECTION_LIST_INIT,
  CONNECTION_LIST_CHANGED,
  DEFAULT_CONNECTION_CHANGED,
  CONNECTION_FORM_CHANGED,
  CONNECTION_VERSION,
} from './constants';

// Store the join configurations of all models to state.
export default (state = {}, action) => {
  switch (action.type) {
    case CONNECTION_LIST_INIT:
    // Add all join configuration versions to state.
      return { ...state, ...action.joinConfigVersions };
    case CONNECTION_LIST_CHANGED:
      return {
        ...state,
        [CONNECTION_VERSION]: {
          models: {
            ...state[CONNECTION_VERSION].models,
            [action.model]: {
              ...state[CONNECTION_VERSION].models[action.model],
              list: action.list
            }
          }
        }
      };
    case DEFAULT_CONNECTION_CHANGED:
      // Change just the default index.
      return {
        ...state,
        [CONNECTION_VERSION]: {
          models: {
            ...state[CONNECTION_VERSION].models,
            [action.model]: {
              ...state[CONNECTION_VERSION].models[action.model],
              defaultIndex: action.index
            }
          }
        }
      };
    case CONNECTION_FORM_CHANGED:
      // Take the current state which contains all the versions of join configurations.
      // Add form data to the current version.
      // TODO - Move formData down two levels to inside one of the models/list.
      // TODO - This will allow the user to edit two different join configurations at the same time.
      return { ...state, [CONNECTION_VERSION]: { models: { ...state[CONNECTION_VERSION].models, formData: action.formData } } };
    default:
      return state;
  }
};
