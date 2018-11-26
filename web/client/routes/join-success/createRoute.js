if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store, first) => {
  /* eslint global-require: "off" */
  return {
    path: 'welcome',
    name: 'Welcome',
    getComponent(location, cb) {
      require.ensure([
          './index',
      ], (require) => {
        const Success = require('./index').default;
        cb(null, Success);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);