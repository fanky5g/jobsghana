if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store) => {
  /* eslint global-require: "off" */
  return {
    path: 'find-resume',
    name: 'Find Resume',
    getComponent(location, cb) {
      require.ensure([
          './index',
        ], (require) => {
          const FindResume = require('./index').default;
          cb(null, FindResume);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);