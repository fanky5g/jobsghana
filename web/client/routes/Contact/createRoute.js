if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default function createRoutes(store) {
  return {
    path: 'contact',
    name: 'Contact Us',
    getComponent(location, cb) {
      require.ensure([
          './components/Contact',
        ], (require) => {
          const ContactPage = require('./components/Contact').default;
          cb(null, ContactPage);
      });
    },
  };
}