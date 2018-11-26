if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = () => {
  return {
    path: 'newsletter',
    name: 'Newsletter Subscribers',
    getComponent(location, cb) {
      require.ensure([
          './index',
        ], (require) => {
          const NewsletterSubscribers = require('./index').default;
          cb(null, NewsletterSubscribers);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);