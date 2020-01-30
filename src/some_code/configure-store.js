/**
 * # configureStore.js
 *
 * A Redux boilerplate setup
 *
 */
import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import rootReducer from '../reducers';

export default function getNewStore(dashboardMiddlewareAdapter) {
  const store = configureStore({
    reducer: rootReducer,
    middleware: [...getDefaultMiddleware(), dashboardMiddlewareAdapter]
  });

  if (process.env.NODE_ENV === 'development' && module.hot) {
    module.hot.accept('../reducers', () => {
      // eslint-disable-next-line global-require
      const newRootReducer = require('../reducers').default;
      store.replaceReducer(newRootReducer);
    });
  }

  // const composedEnhancers = compose(
  //   applyMiddleware(...middleware, dashboardMiddlewareAdapter),
  //   ...enhancers
  // );
  return store;
}

// export default store;
