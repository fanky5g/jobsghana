if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoute = (store) => {
  return {
    name: 'Editor',
    getComponent(location, cb) {
      require.ensure([
          './components/Editor',
        ], (require) => {
          const Editor = require('./components/Editor').default;
          cb(null, Editor);
      });
    },
  };
};

export default withLoadingFeedback(createRoute);