if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = () => {
  return {
    path: 'categories',
    name: 'Categories',
    getComponent(location, cb) {
      require.ensure([
        './components/Types',
      ], (require) => {
        const Types = require('./components/Types').default;
        cb(null, Types);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);