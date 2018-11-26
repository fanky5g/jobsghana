if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoute = (store) => {
  return {
    path: 'settings',
    name: 'Settings',
    getComponent(location, cb) {
      require.ensure([
          './components/Settings',
        ], (require) => {
          const Settings = require('./components/Settings').default;
          cb(null, Settings);
      });
    },
  };
};

export default withLoadingFeedback(createRoute);