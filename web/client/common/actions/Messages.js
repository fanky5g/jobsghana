export function sendMessage(body) {
  return {
    type: 'SEND_MESSAGE',
    promise: (client) => client.POST('/api/v1/message', {
      data: body,
    }),
  };
}

export function getMessages() {
  return {
    type: 'FETCH_MESSAGES',
    promise: (client) => client.GET('/api/v1/message'),
  };
}

export function cleanMeassage() {
  return {
    type: 'CLEAN_MESSAGE',
  };
}
