if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoute = (store) => {
  return {
    path: 'preview',
    name: 'Preview',
    getComponent(location, cb) {
      require.ensure([
          './components/Preview',
        ], (require) => {
          const Preview = require('./components/Preview').default;
          cb(null, Preview);
      });
    },
  };
};

export default withLoadingFeedback(createRoute);