if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = () => {
  return {
    path: 'view_alerts',
    name: 'Review Alerts',
    getComponent(location, cb) {
      require.ensure([
          './index',
        ], (require) => {
          const ReviewAlerts = require('./index').default;
          cb(null, ReviewAlerts);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);