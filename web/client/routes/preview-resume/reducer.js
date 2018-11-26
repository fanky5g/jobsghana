import Immutable from 'immutable';

const initialState = Immutable.Map({
  loading: false,
  resume: {},
});

export default function Preview(state = initialState, action) {
  switch (action.type) {
    case 'SET_PREVIEW_RESUME':
      return state.set('resume', action.resume);
    case 'GET_RESUME_REQUEST':
      return state.set('loading', true);
    case 'GET_RESUME':
      return state.merge({
      	loading: false,
      	resume: action.res.resume,
      });
    case 'GET_RESUME_FAILURE':
    	return state.set('loading', false);
    default:
      return state;
  }
}
