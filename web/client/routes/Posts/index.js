if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store) => {
  const root = {
    path: 'posts',
    name: 'Posts',
    nestedRoutes: [{
      name: 'Posts',
      path: 'all',
      default: true,
    }, {
      name: 'Published',
      path: 'published',
    }, {
      name: 'Drafts',
      path: 'drafts',
    }, {
      name: 'Categories',
      path: 'categories',
    }],
    getComponent(location, cb) {
      require.ensure([
          './components/Posts',
        ], (require) => {
          const PostsPage = require('./components/Posts').default;
          cb(null, PostsPage);
      });
    },
    getChildRoutes(location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          require('./children/AllPosts').default(store),
          require('./children/Drafts').default(store),
          require('./children/Published').default(store),
          require('./children/Categories').default(store),
        ]);
      });
    },
  };

  return root;
};

export default withLoadingFeedback(createRoutes);
