export function createPost(post) {
  return {
    type: 'CREATE_POST',
    promise: (client) => client.POST('/api/v1/blog/posts', {
      data: post,
      contentType: 'form',
    }),
  };
}

export function editPost(post) {
  return {
    type: 'EDIT_POST',
    promise: (client) => client.PUT('/api/v1/blog/posts', {
      data: post,
      contentType: 'form',
    }),
  };
}

export function delPost(shorturl) {
  return {
    type: 'DELETE_POST',
    promise: (client) => client.DELETE(`/api/v1/blog/posts/${shorturl}`),
  };
}

export function publishPost(shorturl) {
  return {
    type: 'PUBLISH_POST',
    promise: (client) => client.POST(`/api/v1/blog/posts/publish/${shorturl}`),
  };
}

export function unpublishPost(shorturl) {
  return {
    type: 'UNPUBLISH_POST',
    promise: (client) => client.POST(`/api/v1/blog/posts/unpublish/${shorturl}`),
  };
}
