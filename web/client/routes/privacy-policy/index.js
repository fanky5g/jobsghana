if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const  createRoutes = (store) => {
  /* eslint global-require: "off" */
  return {
    path: 'privacy-policy',
    name: 'Privacy Policy',
    getComponent(location, cb) {
      require.ensure([
          './components/PrivacyPolicy',
        ], (require) => {
        const PrivacyPolicy = require('./components/PrivacyPolicy').default;
        cb(null, PrivacyPolicy);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);