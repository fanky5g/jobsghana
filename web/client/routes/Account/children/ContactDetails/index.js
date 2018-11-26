if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default function createRoutes() {
  return {
    path: 'contact-details',
    name: 'Contact Details',
    getComponents(location, cb) {
      require.ensure([
        './components/ContactDetails',
      ], (require) => {
        const ContactDetailsPage = require('./components/ContactDetails').default;
        cb(null, ContactDetailsPage);
      });
    },
  };
}
