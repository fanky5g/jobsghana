import {showLoading, hideLoading} from '#app/common/actions/App';

const decorateCb = (cb, onComplete) => {
  return function(error, value) {
    let result = cb(error, value);
    onComplete();
    return result;
  }
};

export const decorateAsyncRoute = ({ onStart, onComplete }) =>
  (asyncRoute) => (store) => {

    const route = asyncRoute(store);

    return {
      ...route,
      getComponent: (nextState, cb) => {
        const { location: {pathname}} = nextState;
        onStart(store, pathname);
        return route.getComponent(
          nextState,
          decorateCb(cb, () => onComplete(store))
        )
      }
    }
  };

export const withLoadingFeedback = (asyncRoute) =>
  decorateAsyncRoute({
    onStart: (store, pathname) => {
      store.dispatch(showLoading(pathname));
    },
    onComplete: (store) => { store.dispatch(hideLoading()) }
  })(asyncRoute);