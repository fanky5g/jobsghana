if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store) => {
  return {
    path: 'career-advice/:shorturl',
    name: 'Blog Post',
    getComponent(location, cb) {
      require.ensure([
          './components/Single',
        ], (require) => {
        const BlogPost = require('./components/Single').default;
        // const BlogPostReducer = require('./reducer').default;
        // injectAsyncReducer(store, 'Post', BlogPostReducer);
        cb(null, BlogPost);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);