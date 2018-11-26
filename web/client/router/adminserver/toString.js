require('es6-promise').polyfill();
console.log = console.warn = console.error = () => {};

import React from 'react';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';
import Helmet from 'react-helmet';
import createRoutes from './routes';
import createStore from '#app/common/store/create';
import ApiClient from '#app/util/ApiClient';
import { trigger } from 'redial';
import { Map } from 'immutable';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

/**
 * Handle HTTP request at Golang server
 *
 * @param   {Object}   options  request options
 * @param   {Function} cbk      response callback
 */
export default function(options, cbk) {
    cbk = global[cbk];
    let result = {
        uuid: options.uuid,
        app: null,
        title: null,
        meta: null,
        initial: null,
        error: null,
        redirect: null,
        token: options.token,
        type: options.type,
    };

    if (typeof options.user !== 'undefined') {
      result.user = JSON.parse(options.user);
    } else {
      result.user = null;
    }

    const client = new ApiClient({includeAuthHeader: true, ...result});
    const store = createStore(client, {
      Account: Map({
        isAuthenticated: result.token !== '',
        type: result.type,
        activePageAuthenticated: false,
        doneAuth: false,
        user: result.user,
        authPages: [],
      }),
    });

    const routes = createRoutes({ store, first: { time: true } });

    try {
        match({ routes, location: options.url }, (error, redirectLocation, renderProps) => {
            try {
                if (error) {
                    result.error = error;

                } else if (redirectLocation) {
                    result.redirect = redirectLocation.pathname + redirectLocation.search;

                } else {
                  const { components } = renderProps;
                  const { dispatch } = store;
                  const locals = {
                      dispatch,
                      store,
                      client,
                      path: renderProps.location.pathname,
                      query: renderProps.location.query,
                      params: renderProps.params,
                  };

                  trigger('fetch', components, locals)
                  .then(() => {
                      result.app = renderToString(
                      <Provider store={store}>
                        <LocaleProvider locale={enUS}>
                          <RouterContext {...renderProps}/>
                        </LocaleProvider>
                      </Provider>
                    );
                    
                    const { title, meta } = Helmet.rewind();
                    result.title = title.toString();
                    result.meta = meta.toString();
                    result.initial = JSON.stringify(store.getState());
                    return cbk(result);
                  });
                }
            } catch (e) {
                result.error = e;
            }
        });
    } catch (e) {
        result.error = e;
        return cbk(result);
    }
}
