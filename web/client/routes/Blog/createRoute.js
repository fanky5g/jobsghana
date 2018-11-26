if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store) => {
  const root = {
    path: 'career-advice',
    name: 'Career Advice',
    getComponent(location, cb) {
      require.ensure([
        './index',
      ], (require) => {
        const CareerAdvice = require('./index').default;
        cb(null, CareerAdvice);
      });
    },
  };

  return root;
};

export default withLoadingFeedback(createRoutes);