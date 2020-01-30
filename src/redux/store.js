import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from "./reducers";

const enhancers = [];
const middleware = [thunk];
const { devToolsExtension } = window;

const localStorageMiddleware = ({ getState }) => {
  return next => action => {
      const result = next(action);
      localStorage.setItem('app_state', JSON.stringify(getState()))
      return result;
  };
};

const reHydrateStore = () => {
  const data = localStorage.getItem('app_state');
  if (data) {
      return JSON.parse(data);
  }
  return undefined;
};

if (typeof devToolsExtension === 'function') {
   enhancers.push(devToolsExtension());
}

const composedEnhancers = compose(
  applyMiddleware(...middleware, localStorageMiddleware),
  ...enhancers
);

const store = createStore(rootReducer,reHydrateStore(), composedEnhancers);

store.subscribe(() => {
  console.log(store.getState());
})

export default store;
