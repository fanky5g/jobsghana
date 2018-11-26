import Immutable from 'immutable';

const initialState = Immutable.Map({
  isMobile: false,
  screenHeight: null,
  screenWidth: null,
});

export default function environment(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_IS_MOBILE':
      return state.set('isMobile', action.isMobile);
    case 'CHANGE_WIDTH_AND_HEIGHT':
      return state.merge({
        screenHeight: parseInt(action.screenHeight, 10),
        screenWidth: parseInt(action.screenWidth, 10),
      });
    default:
      return state;
  }
}
