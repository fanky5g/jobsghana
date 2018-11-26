if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = () => {
  return {
    path: 'drafts',
    name: 'Drafts',
    getComponent(location, cb) {
      require.ensure([
          './components/Drafts',
        ], (require) => {
          const DraftsPage = require('./components/Drafts').default;
          cb(null, DraftsPage);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);