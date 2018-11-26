import Immutable from 'immutable';

const initialState = Immutable.Map({
  processing: false,
  actionComplete: false,
  message: '',
  popupActive: false,
  popupLength: 0,
  visitedPopups: [],
  activePopup: undefined,
});

export default function PopupReducer(state = initialState, action) {
  switch (action.type) {
    case 'OPEN_POPUP':
      return state.set('popupActive', true);
    case 'SET_POPUP_LENGTH':
      return state.set('popupLength', action.count);
    case 'CLOSE_POPUP':
      return state.merge({popupActive: false, processing: false, actionComplete: false, message: ''});
    case 'ADD_VISITED_POPUP':
      return state.withMutations(stateIns => {
        stateIns = stateIns.update('visitedPopups', arr => {
          const position = arr.findIndex(item => item == action.popupIndex);

          if (position == -1 || arr.size == 0) {
            return arr.concat(action.popupIndex);
          }

          return arr;
        });

        if (action.popupIndex < state.get('popupLength')) {
          stateIns = stateIns.set('activePopup', action.popupIndex + 1);
        }

        return stateIns;
      });
    case 'SUBSCRIBE_REVIEW_ALERT_REQUEST':
    case 'SUBSCRIBE_RESUME_ALERT_REQUEST':
      return state.set('processing', true);
    case 'SUBSCRIBE_REVIEW_ALERT':
    case 'SUBSCRIBE_RESUME_ALERT':
    case 'SUBSCRIBE_JOB_ALERT':
      return state.merge({
        processing: false,
        actionComplete: true,
        message: action.res.body.subscription_message,
      });
    case 'SUBSCRIBE_REVIEW_ALERT_FAILURE':
    case 'SUBSCRIBE_RESUME_ALERT_FAILURE':
      if (action.error && action.error.message && action.error.message.toLowerCase().indexOf('resume does not exist for') != -1) {
        return state.merge({
          processing: false,
          actionComplete: true,
          message: 'SEND_TO_BUILD_RESUME',
        })
      }
      return state.set('processing', false);
    case 'clearPopupMessage':
      return state.merge({message: '', actionComplete: false, processing: false});
    default:
      return state;
  }
}
