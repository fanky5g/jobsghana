if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

import { withLoadingFeedback } from '#app/common/middleware/withLoadingFeedback';

const createRoutes = (store) => {
  return {
    path: 'about',
    name: 'About Us',
    getComponent(location, cb) {
      require.ensure([
        './components/About',
      ], (require) => {
        const About = require('./components/About').default;
        cb(null, About);
      });
    },
  };
};

export default withLoadingFeedback(createRoutes);