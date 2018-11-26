if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store) => {
  return {
    path: 'cv-alert',
    name: 'CV Alert',
    getComponent(location, cb) {
      require.ensure([
          './components/ResumeAlerts',
        ], (require) => {
          const ResumeAlerts = require('./components/ResumeAlerts').default;
          cb(null, ResumeAlerts);
        });
    },
  };
};

export default withLoadingFeedback(createRoutes);