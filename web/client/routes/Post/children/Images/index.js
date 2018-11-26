if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoute = (store) => {
  return {
    path: 'images',
    name: 'Images',
    getComponent(location, cb) {
      require.ensure([
        './components/Images',
      ], (require) => {
        const Images = require('./components/Images').default;
        cb(null, Images);
      });
    },
  };
};

export default withLoadingFeedback(createRoute);