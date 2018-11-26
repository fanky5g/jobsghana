if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = () => {
  return {
    path: 'published',
    name: 'Published',
    getComponent(location, cb) {
      require.ensure([
          './components/Published',
        ], (require) => {
          const PublishedPage = require('./components/Published').default;
          cb(null, PublishedPage);
        });
    },
  };
};

export default withLoadingFeedback(createRoutes);