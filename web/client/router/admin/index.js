console.warn = console.log;

import React from 'react';
import { render } from 'react-dom';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import { Promise } from 'when';
import createRoutes from './routes';
import createStore from '#app/common/store/create';
import ReactGA from 'react-ga';
import immutifyState from '#app/util/immutifyState';
import ApiClient from '#app/util/ApiClient';
import { trigger } from 'redial';
import browserHistory from 'react-router/lib/browserHistory';
import useScroll from 'scroll-behavior/lib/useStandardScroll';
import match from 'react-router/lib/match';
import { LocaleProvider } from 'antd';
import enUS from 'antd/lib/locale-provider/en_US';

function logPageView() {
  ReactGA.set({ page: window.location.pathname + window.location.search });
  ReactGA.pageview(window.location.pathname + window.location.search);
}

function hashLinkScroll() {
  const { hash } = window.location;
  if (hash !== '') {
    setTimeout(() => {
      const id = hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) element.scrollIntoView();
    }, 0);
  }
}

export function run() {
  ReactGA.initialize('UA-100448215-1');
  if (typeof Raven !== 'undefined' && process.env.NODE_ENV == 'production') {
    Raven.config('https://96f65d4f6ed64f4fa178a991837b07b1@sentry.io/239521').install();
  }

  // console.log(this.RequireFunc);
  // init promise polyfill
  window.Promise = window.Promise || Promise;
  // init fetch polyfill
  window.self = window;
  require('whatwg-fetch');

  const history = useScroll(() => browserHistory)();
  const { pathname, search, hash } = window.location;
  const $location = `${pathname}${search}${hash}`;
  const initialState = immutifyState(window['--app-initial']);
  const client = new ApiClient({includeAuthHeader: true});
  const store = createStore(client, initialState);
  const routes = createRoutes({store, first: { time: true }});
  const container = document.getElementById('App');
  const { dispatch } = store;


  match({ routes, location: $location }, () => {
  render((
      <Provider store={store}>
        <LocaleProvider locale={enUS}>
          <Router history={history} routes={routes} onUpdate={() => {
            logPageView();
            hashLinkScroll();
          }} />
        </LocaleProvider>
      </Provider>
    ), container);
  });

  browserHistory.listen(location => {
    match({ routes, location }, (error, redirectLocation, renderProps) => {
      const { components } = renderProps;
      const locals = {
        path: renderProps.location.pathname,
        query: renderProps.location.query,
        params: renderProps.params,
        state: renderProps.location.state,
        dispatch,
        client,
        store,
      };

      if (window['--app-initial']) {
        delete window['--app-initial'];
      } else {
        trigger('fetch', components, locals);
      }
      trigger('defer', components, locals);
    });
  });
};

require('#app/styles/admin.scss');

if (module.hot) {
  const reporter = window.__webpack_hot_middleware_reporter__;
  const success = reporter.success;
  reporter.success = function () {
    document.querySelectorAll('link[href][rel=stylesheet]').forEach((link) => {
      const nextStyleHref = link.href.replace(/(\?\d+)?$/, `?${Date.now()}`);
      link.href = nextStyleHref;
    });
    success();
  };
}