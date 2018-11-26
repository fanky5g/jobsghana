if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default function createRoutes(store) {
  return {
    path: 'search',
    name: 'Search Results',
    getComponent(location, cb) {
      require.ensure([
        './components/Search',
      ], (require) => {
        const Search = require('./components/Search').default;
        cb(null, Search);
      });
    },
  };
}
