import createReducer from '#app/common/reducers/create';

export default function injectAsyncReducer(store, name, asyncReducer) {
  const asyncReducers = {
    ...store.asyncReducers,
    [name]: asyncReducer,
  };

  store.asyncReducers[name] = asyncReducer;
  store.replaceReducer(createReducer(asyncReducers));
}
