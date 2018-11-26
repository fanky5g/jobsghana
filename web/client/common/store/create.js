import { createStore, applyMiddleware, compose } from 'redux';
import createReducers from '#app/common/reducers/create';
import configurePromise from '#app/common/middleware/promise';
import thunk from 'redux-thunk';
import DevTools from '#app/common/middleware/DevTools';
import RavenMiddleware from 'redux-raven-middleware';

export default function create(client, data) {
  const middleware = [configurePromise(client), thunk, RavenMiddleware('https://96f65d4f6ed64f4fa178a991837b07b1@sentry.io/239521')];
  // const middleware = [configurePromise(client), thunk];

  const enhancer = compose(
    applyMiddleware(...middleware),
    DevTools.instrument()
  );

  const asyncReducers = {};
  const reducers = createReducers(asyncReducers);
  const store = createStore(reducers, data, enhancer);
  store.asyncReducers = asyncReducers;

  if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
      module.hot.accept('#app/common/reducers/create',
        () => store.replaceReducer(createReducers));
    }
  }

  return store;
}
