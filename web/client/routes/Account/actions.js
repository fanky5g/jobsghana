export function create(user) {
  return {
    type: 'CREATE_ACCOUNT',
    promise: (client) => client.POST('/api/accounts/user', {
      data: user,
    }),
  };
}

export function resetPass(email) {
  return {
    type: 'INITIATE_PASSWORD_RESET',
    promise: (client) => client.POST('/api/accounts/resetpass', {
      data: email,
    }),
  };
}

export function verifyPasswordRet(credentials) {
  return {
    type: 'RESET_PASSWORD',
    promise: (client) => client.POST(`/api/accounts/resetpass/${credentials.id}/${credentials.token}`),
  };
}