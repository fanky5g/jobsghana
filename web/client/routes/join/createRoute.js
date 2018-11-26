if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store, first) => {
  /* eslint global-require: "off" */
  return {
    path: 'join',
    name: 'Create Account',
    getComponent(location, cb) {
      require.ensure([
          './index',
        ], (require) => {
          const Join = require('./index').default;
          cb(null, Join);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);