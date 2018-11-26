if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = () => {
  return {
    path: 'resume_alerts',
    name: 'Resume Alerts',
    getComponent(location, cb) {
      require.ensure([
          './index',
        ], (require) => {
          const ResumeAlerts = require('./index').default;
          cb(null, ResumeAlerts);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);