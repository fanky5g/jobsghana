if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = () => {
  return {
    path: 'messages',
    name: 'Messages',
    getComponent(location, cb) {
      require.ensure([
          './components/Messages',
        ], (require) => {
          const Messages = require('./components/Messages').default;
          cb(null, Messages);
        });
    },
  };
};

export default withLoadingFeedback(createRoutes);
