import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { persistStore, autoRehydrate } from 'redux-persist';
import { asyncSessionStorage } from 'redux-persist/storages';

// import { browserHistory } from 'react-router';
// import { routerMiddleware } from 'react-router-redux';
import reducer from '../reducer';
// import { appStorageKey } from '../constant/app';

// console.log('WARNING: for dev, clearing localStorage...');

// localStorage.clear();
// sessionStorage.clear();

// Sync dispatched route actions to the history
// const reduxRouterMiddleware = routerMiddleware(browserHistory);
const createStoreWithMiddleware = applyMiddleware(
//  reduxRouterMiddleware,
  thunkMiddleware,
//  createLogger({ predicate: (getState, action) =>
//    process.env.NODE_ENV !== 'test' && !/^SPINNER/.test(action.type) })
)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState, autoRehydrate());

  persistStore(store, { whitelist: ['appMenu', 'filter'] }, () => {
//      console.log('rehydration complete');
    });
  persistStore(store, { whitelist: ['auth'], storage: asyncSessionStorage }, () => {
//      console.log('rehydration complete 2');
    });
 
/*
  , () => {
        console.log('rehydration complete');
      }
    );
*/
//    .purge();

// if things get out of wack, just purge the storage
// persistStore(store, config, callback).purge()

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('../reducer', () => {
//      const nextRootReducer = require('../reducer').default;
//      window.store.replaceReducer(nextRootReducer);
      store.replaceReducer(reducer);
    });
  }

  return store;
}
