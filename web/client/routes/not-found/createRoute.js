if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store) => {
  /* eslint global-require: "off" */
  return {
    path: '*',
    name: 'Page Not Found',
    getComponent(location, cb) {
      require.ensure([
        './index',
      ], (require) => {
        const NotFound = require('./index').default;
        cb(null, NotFound);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);