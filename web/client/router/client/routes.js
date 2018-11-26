if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import React from 'react';
import App from '#app/containers/App';

export default ({ store }) => {
  return [{
    path: '/',
    component: App,
    getChildRoutes(location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          require('#app/routes/About/createRoute').default(store),
          require('#app/routes/privacy-policy').default(store),
          require('#app/routes/Login').default(store),
          require('#app/routes/find-resume/createRoute').default(store),
          require('#app/routes/find-job/createRoute').default(store),
          require('#app/routes/preview-resume/createRoute').default(store),
          require('#app/routes/resume/createRoute').default(store),
          require('#app/routes/join/createRoute').default(store),
          require('#app/routes/join-success/createRoute').default(store),
          require('#app/routes/me/createRoute').default(store),
          require('#app/routes/ResumeAlerts/createRoute').default(store),
          require('#app/routes/Search/createRoute').default(store),
          require('#app/routes/Blog/createRoute').default(store),
          require('#app/routes/Blog/children/Single').default(store),
          require('#app/routes/Contact/createRoute').default(store),
        ]);
      });
    },
    indexRoute: {
      name: 'Home',
      getComponent: require('#app/routes/Home/createRoute').default(store),
    },
  }, {
    component: App,
    getChildRoutes(location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          require('#app/routes/unauthorized').default(store),
          require('#app/routes/not-found/createRoute').default(store),
        ]);
      });
    },
  },];
};