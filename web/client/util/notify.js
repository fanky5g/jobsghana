export const notify = (message, label) => {
  return {
    type: 'SET_NOTIFICATION_MESSAGE',
    message: message,
    acceptLabel: label,
  };
};

export const clearAction = () => {
  return {
    type: 'DISABLE_NOTIFICATION',
  };
};