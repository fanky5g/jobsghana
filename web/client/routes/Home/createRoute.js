if (typeof require.ensure !== 'function') require.ensure = (d, c) => c(require);

export default function createRoutes() {
  return (location, cb) => {
    require.ensure([
      './index.js',
    ], (require) => {
      const Search = require('./index').default;
      cb(null, Search);
    });
  };
}
