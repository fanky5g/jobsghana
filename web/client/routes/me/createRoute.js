if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store) => {
  /* eslint global-require: "off" */
  return {
    path: 'me',
    name: 'My Profile',
    getComponent(location, cb) {
      require.ensure([
        './index',
      ], (require) => {
        const Me = require('./index').default;
        cb(null, Me);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);