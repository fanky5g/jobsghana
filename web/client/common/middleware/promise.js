import { logout } from '#app/common/actions/Auth';
import { notification } from 'antd';
import AppLoading from '#app/util/loading';

// tap into xhr requests...show app loading effect
export default function promiseMiddleware(client) {
  return ({ dispatch, getState }) => next => action => {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    }
    const { promise, type, ...rest } = action;

    if (!promise) return next(action);

    let IAppLoading;
    if (process.env.BROWSER && typeof document !== 'undefined') {
      IAppLoading = new AppLoading({ color: '#F20664' });
      IAppLoading.start();
    }

    const SUCCESS = type;

    const REQUEST = `${type}_REQUEST`;
    const FAILURE = `${type}_FAILURE`;

    const actionPromise = promise(client);
    next({ ...rest, type: REQUEST, cancel: actionPromise.abort });

    actionPromise
      .then((response) => {
        if (process.env.BROWSER && IAppLoading) IAppLoading.stop();
        const contentType = response.headers.get('Content-Type');
        const isText = contentType.toLowerCase() === 'text/plain; charset=utf-8' || contentType === 'text/plain';
        const isJSON = contentType.toLowerCase() === 'application/json; charset=utf-8'.toLowerCase() || contentType === 'application/json';

        if (response.ok) {
          if (typeof response.json == "function" && isJSON) {
            return response.json();
          } else if (typeof response.text == "function" && isText) {
            return response.text();
          }

          return response;
        }

        if (!response.ok) {
          if (isJSON) {
            response.json().then(res => {
            if (res && res.message && res.message != "") {
                notification.error({message: res.message, duration: 5});
              }
            })
          }
        }

        throw ({
          status: response.status,
          body: response.body ? response.body: response,
        });
      })
      .then(res => {
        try {
          if (res && res.message && res.message != "" && !res.hasOwnProperty('subject')) {//subject skip temporary..just to skip contact messages
            notification.success({message: res.message, duration: 5});
            console.log(res.message);
          }

        next({ ...rest, res, type: SUCCESS });  
        } catch(err) {
          console.log(err);
        }
        
      })
      .catch(error => {
        if (process.env.BROWSER && IAppLoading) IAppLoading.stop();
        if (error.message && typeof error.message == 'string' && error.message.toLowerCase() == 'failed to fetch') {
          return;
        }

        if (error.message && typeof error.message == 'string' && error.message.toLowerCase() == 'the operation was aborted.') {
          return;
        }

        if (typeof error.body === 'string') {
          error = {};
          try {
            error.body = JSON.parse(error.body);
          } catch(e) {
            console.log(e);
          }
        }

        if (error.body && typeof error.body.message == 'string') {
          notification.error({message: error.body.message, duration: 5});
        }

        if (error && typeof error == 'object' && typeof error.message == 'string') {
          if (error.message === 'Internal Server Error') {
            notification.error({message: 'Failed to complete request. Error code 202', duration: 5});
            return;
          }

          notification.error({message: error.message, duration: 5});
        }

        if (error.status === 401) {
          dispatch(logout());
        }

        return next({ ...rest, error, type: FAILURE });
      });
    return actionPromise;
  };
}
