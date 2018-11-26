if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store) => {
  /* eslint global-require: "off" */
  return {
    path: 'unauthorized',
    name: 'Restricted Access',
    getComponent(location, cb) {
      require.ensure([
          './components/unauthorized',
        ], (require) => {
        const Unauthorized = require('./components/unauthorized').default;
        cb(null, Unauthorized);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);