if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);
import Profile from './children/Profile';

const createRoutes = (store) => {
  const root = {
    path: 'account',
    getComponents(location, cb) {
      require.ensure([
        './components/Account',
      ], (require) => {
        const AccountPage = require('./components/Account').default;
        cb(null, AccountPage);
      });
    },
    getChildRoutes(location, cb) {
      require.ensure([], (require) => {
        cb(null, [
          require('./children/ContactDetails').default(store),
        ]);
      });
    },
    indexRoute: {
      name: 'Profile',
      component: Profile,
    },
  };

  return root;
};

export default createRoutes;
