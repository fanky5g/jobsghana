export function markAsRead(id) {
  return {
    type: 'MARK_MESSAGE_AS_READ',
    id,
    promise: (client) => client.PUT('/api/v1/message', {
      data: { id: `${id}` },
    }),
  };
}
