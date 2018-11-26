if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store) => {
  return {
    path: 'post',
    name: 'Post',
    getComponent(location, cb) {
      require.ensure([
          './components/Post',
        ], (require) => {
          const Post = require('./components/Post').default;
          cb(null, Post);
      });
    },
    indexRoute: require('./children/Editor').default(store),
    getChildRoutes(location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          require('./children/Images').default(store),
          require('./children/Settings').default(store),
          require('./children/Preview').default(store),
        ]);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);
