if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
import requireAuthentication from '#app/common/components/AuthenticatedComponent';

import React from 'react';
import App from '#app/containers/Dash';
import Overview from '#app/routes/overview';

export default ({ store }) => {
  return [{
      path: '/',
      component: requireAuthentication(App, ['superadmin', 'admin'], true),
      getChildRoutes(location, cb) {
        require.ensure([], (require) => {
          cb(null, [
            require('#app/routes/accounts/createRoute').default(store),
            require('#app/routes/Post').default(store),
            require('#app/routes/Posts').default(store),
            require('#app/routes/Subscribers').default(store),
            require('#app/routes/Message').default(store),
            require('#app/routes/Messages').default(store),
          ]);
        });
      },
      indexRoute: {
        name: 'Overview',
        component: Overview,
      },
    }, {
      path: 'resume-preview',
      name: 'Resume Preview',
      getComponent(location, cb) {
        require.ensure([
          '#app/routes/preview-resume',
        ], (require) => {
          const Preview = require('#app/routes/preview-resume').default;
          cb(null, Preview);
        });
      },
    },
    require('#app/routes/adminLogin/createRoute').default(store),
    require('#app/routes/unauthorized').default(store),
    require('#app/routes/not-found/createRoute').default(store),
  ];
};