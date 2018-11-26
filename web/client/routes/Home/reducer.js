import Immutable from 'immutable';

const initialState = Immutable.Map({
  elapsed: '',
  searching: false,
  skip: 0,
  take: 15,
  searchResults: [],
});

export default function Search(state = initialState, action) {
  switch (action.type) {
    case 'SEARCH_JOB_REQUEST':
      return state.set('searching', true);
    case 'SEARCH_JOB':
      return state.withMutations(state => {
        let stateMutated = state.set('searching', false);
        stateMutated = stateMutated.set('searchResults', []);
        if (Array.isArray(action.res.body.jobs) && action.res.body.jobs.length > 0) {
          stateMutated = stateMutated.update('searchResults', arr => arr.concat(action.res.body.jobs))
        }
        
        stateMutated = stateMutated.set('elapsed', action.res.body.elapsed)
        stateMutated = stateMutated.set('skip', 0);
        return stateMutated;
      });
    case 'SEARCH_JOB_FAILURE':
      return state.set('searching', false);
    case 'SET_JOB_TAKE':
      return state.set('take', action.value);
    case 'SET_JOB_SKIP':
      return state.set('skip', action.value);
    default:
      return state;
  }
}
