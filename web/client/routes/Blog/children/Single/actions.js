export function getSingle(shorturl) {
  return {
    type: 'GET_SINGLE',
    promise: (client) => client.GET(`/api/v1/blog/posts/${shorturl}`),
  };
}

export function getRelated(shorturl) {
  return {
    type: 'GET_RELATED',
    promise: (client) => client.GET(`/api/v1/blog/posts/related/${shorturl}`),
  };
}