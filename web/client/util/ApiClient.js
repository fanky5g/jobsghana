require('whatwg-fetch');

const methods = ['GET', 'POST', 'PUT', 'PATCH', 'OPTIONS', 'DELETE'];

function formatUrl(path, config) {
  const adjustedPath = path[0] !== '/' ? `/${path}` : path;
  if (!Object.hasOwnProperty(config, 'host')) {
    return adjustedPath;
  }
  return `${config.host}${adjustedPath}`;
}

class _ApiClient {
  constructor(config) {
    methods.forEach((method) => {
      this[method] = (path, { params, data, contentType } = {}) => {
        let defaultHeaders = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        };

        if (contentType && contentType == 'form') {
          delete defaultHeaders['Content-Type'];
        }

        if (!data) {
          delete defaultHeaders['Content-Type'];
        }

        if (typeof config == 'object' && config.hasOwnProperty('includeAuthHeader')) {
             if (typeof config !== 'undefined' && config.token) {
              defaultHeaders.Authorization = `Bearer ${config.token}`;
            } else if (process.env.BROWSER && typeof window !== 'undefined' && !!window.localStorage.getItem('token')) {
              defaultHeaders.Authorization = `Bearer ${JSON.parse(window.localStorage.getItem('token'))}`;
            }
        }

        return fetch(formatUrl(path, config), {
          method: method,
          credentials: 'same-origin',
          headers: defaultHeaders,
          body: contentType !== 'form' ? JSON.stringify(data): data,
          ...params,
        });
      };
    });
  }
}

const ApiClient = _ApiClient;

export default ApiClient;
