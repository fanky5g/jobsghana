import Immutable from 'immutable';

const initialState = Immutable.Map({
  searching: false,
  loaded: false,
  jobs: [],
});

export default function Jobs(state = initialState, action) {
  switch (action.type) {
    case 'GET_RANDOM_JOBS_REQUEST':
      return state.set('searching', true);
    case 'GET_RANDOM_JOBS':
      return state.merge({
        jobs: action.res.jobs,
        loaded: true,
      });
    case 'GET_RANDOM_JOBS_FAILURE':
      return state.set('searching', false);
    default:
      return state;
  }
}
