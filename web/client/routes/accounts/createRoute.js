if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store) => {
  /* eslint global-require: "off" */
  return {
    path: 'accounts',
    name: 'Accounts',
    getComponent(location, cb) {
      require.ensure([
        './index',
      ], (require) => {
        const Accounts = require('./index').default;
        cb(null, Accounts);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);