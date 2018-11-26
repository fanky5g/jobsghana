import Immutable from 'immutable';

const initialState = Immutable.Map({
  tos: '',
  privacy: '',
  visitedRoutes: [],
  routeLoading: false,
});

export default function App(state = initialState, action) {
  switch (action.type) {
    case 'GET_TOS':
      return state.set('tos', action.res);
    case 'GET_PRIVACY_POLICY':
      return state.set('privacy', action.res);
    case 'SHOW_LOADING':
      return state.set('routeLoading', true);
    case 'HIDE_LOADING':
      if (state.get('routeLoading')) {
        return state.set('routeLoading', false);
      }
      return state;
    default:
      return state;
  }
}
