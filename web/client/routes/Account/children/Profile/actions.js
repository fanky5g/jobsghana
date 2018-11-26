export function deleteImage() {
  return {
    type: 'DELETE_IMAGE',
    promise: (client) => client.POST('/api/accounts/resetImage'),
  };
}

export function editAccount(fields) {
  return {
    type: 'EDIT_ACCOUNT',
    promise: (client) => client.put('/api/accounts/user', {
      data: fields,
    }),
  };
}