import Immutable from 'immutable';

const defaultState = Immutable.Map({
  loading: false,
  message: '',
});

export default function contactReducer(state = defaultState, action) {
  switch (action.type) {
    case 'SEND_MESSAGE_REQUEST':
      return state.set('loading', true);
    case 'SEND_MESSAGE':
      return state.merge({
        loading: false,
        message: action.res.message || 'Message sent successfully',
      });
    case 'SEND_MESSAGE_FAILURE':
      return state.merge({
        loading: false,
        message: action.error.data || 'Failed to send message',
      });
    case 'CLEAN_MESSAGE':
      return state.set('message', '');
    default:
      return state;
  }
}
