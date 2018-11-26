export function sendMessage(body) {
  return {
    type: 'SEND_MESSAGE',
    promise: (client) => client.POST('/api/v1/message', {
      data: body,
    }),
  };
}

export function clearResponse() {
  return {
    type: 'CLEAN_MESSAGE',
  };
}
