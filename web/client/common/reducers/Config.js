import Immutable from 'immutable';

const initialState = Immutable.Map({
  isLoaded: false,
  config: {},
});

export default function environment(state = initialState, action) {
  switch (action.type) {
    case 'SET_CONFIG':
      return state.merge({
        isLoaded: true,
        config: action.res,
      });
    default:
      return state;
  }
}
