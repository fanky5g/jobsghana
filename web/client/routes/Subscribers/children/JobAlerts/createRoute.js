if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = () => {
  return {
    path: 'job_alerts',
    name: 'Job Alerts',
    getComponent(location, cb) {
      require.ensure([
          './index',
        ], (require) => {
          const JobAlerts = require('./index').default;
          cb(null, JobAlerts);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);