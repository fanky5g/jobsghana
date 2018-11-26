if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store) => {
  /* eslint global-require: "off" */
  return {
    path: 'preview',
    name: 'Resume Preview',
    getComponent(location, cb) {
      require.ensure([
        './index',
      ], (require) => {
        const Preview = require('./index').default;
        cb(null, Preview);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);
