if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store) => {
  const root = {
    path: 'subscribers',
    name: 'Subscribers',
    nestedRoutes: [{
      name: 'Newsletter Subscribers',
      path: 'newsletter',
      default: true,
    }, {
      name: 'Job Alerts',
      path: 'job_alerts',
    }, {
      name: 'Review Alerts',
      path: 'view_alerts',
    }, {
      name: 'Resume Alerts',
      path: 'resume_alerts',
    }],
    getComponent(location, cb) {
      require.ensure([
          './components/Subscribers',
        ], (require) => {
          const Subscribers = require('./components/Subscribers').default;
          cb(null, Subscribers);
      });
    },
    getChildRoutes(location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          require('./children/Newsletter/createRoute').default(store),
          require('./children/JobAlerts/createRoute').default(store),
          require('./children/ReviewAlerts/createRoute').default(store),
          require('./children/ResumeAlerts/createRoute').default(store),
        ]);
      });
    },
  };

  return root;
};

export default withLoadingFeedback(createRoutes);