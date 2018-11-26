import Immutable from 'immutable';

const defaultState = Immutable.Map({
  post: {},
  related: [],
  rloading: false,
  rloaded: false,
  loading: false,
});

export default function PostReducer(state = defaultState, action) {
  switch (action.type) {
    case 'GET_SINGLE_REQUEST':
      return state.set('loading', true);
    case 'GET_SINGLE':
      return state.merge({
        loading: false,
        post: action.res,
      });
    case 'GET_SINGLE_FAILURE':
      return state.set('loading', false);
    case 'GET_RELATED_REQUEST':
      return state.set('rloading', true);
    case 'GET_RELATED':
      return state.withMutations((stateIns) => {
        stateIns
          .set('related', action.res)
          .merge({
            rloading: false,
            rloaded: true,
          });
      });
    case 'GET_RELATED_FAILURE':
      return state.set('rloading', false);
    default:
      return state;
  }
}
