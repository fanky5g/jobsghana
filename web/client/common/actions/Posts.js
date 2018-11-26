export function getPosts() {
  return {
    type: 'GET_POSTS',
    promise: (client) => client.GET('/api/v1/blog/posts'),
  };
}

export function resetMessages() {
  return {
    type: 'RESET_MESSAGES',
  };
}

export function addType(type) {
  return {
    type: 'ADD_TYPE',
    promise: (client) => client.POST('/api/v1/blog/posts/types', {
      data: { type },
    }),
  };
}

export function deleteType(id) {
  return {
    type: 'DELETE_TYPE',
    promise: (client) => client.DELETE(`/api/v1/blog/posts/types/${id}`),
  };
}