if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoute = (store) => {
  return {
    path: 'login',
    name: 'Login',
    getComponent(location, cb) {
      require.ensure([
          './components/Login',
        ], (require) => {
          const LoginPage = require('./components/Login').default;
          cb(null, LoginPage);
      });
    },
  };
};

export default withLoadingFeedback(createRoute);