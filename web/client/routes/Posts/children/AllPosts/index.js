if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = () => {
  return {
    path: 'all',
    name: 'All',
    getComponent(location, cb) {
      require.ensure([
          './components/AllPosts',
        ], (require) => {
          const AllPosts = require('./components/AllPosts').default;
          cb(null, AllPosts);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);