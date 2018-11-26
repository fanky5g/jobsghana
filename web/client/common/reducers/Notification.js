import Immutable from 'immutable';

const initialState = Immutable.Map({
  isActive: false,
  message: '',
  acceptLabel: 'Ok',
  timeout: 5000,
});

export default function Notification(state = initialState, action) {
  switch (action.type) {
    case 'SET_NOTIFICATION_MESSAGE':
      return state.merge({
        message: action.message,
        acceptLabel: action.acceptLabel || 'Ok',
        isActive: true,
      });
    case 'DISABLE_NOTIFICATION':
      return state.merge({
        isActive: false,
        message: '',
      });
    default:
      return state;
  }
}
