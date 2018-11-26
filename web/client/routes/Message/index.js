if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = () => {
  return {
    path: 'message',
    name: 'Message',
    getComponent(location, cb) {
      require.ensure([
          './components/Message',
        ], (require) => {
          const MessagePage = require('./components/Message').default;
          cb(null, MessagePage);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);
