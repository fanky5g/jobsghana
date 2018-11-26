if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store, first) => {
  /* eslint global-require: "off" */
  return {
    path: 'find-job',
    name: 'Find Job',
    getComponent(location, cb) {
      require.ensure([
          './index',
        ], (require) => {
          const FindJob = require('./index').default;
          cb(null, FindJob);
        });
    },
  };
};

export default withLoadingFeedback(createRoutes);