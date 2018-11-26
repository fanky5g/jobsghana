import Immutable from 'immutable';

const initialState = Immutable.Map({
  elapsed: '',
  searching: false,
  skip: 0,
  take: 15,
  searchResults: [],
});

export default function ResumeSearch(state = initialState, action) {
  switch (action.type) {
    case 'SEARCH_RESUME_REQUEST':
      return state.set('searching', true);
    case 'SEARCH_RESUME':
      return state.withMutations(state => {
        let stateMutated = state.set('searching', false);
        stateMutated = stateMutated.set('searchResults', []);
        if (Array.isArray(action.res.profiles) && action.res.profiles.length > 0) {
          stateMutated = stateMutated.update('searchResults', arr => arr.concat(action.res.profiles))
        }

        stateMutated = stateMutated.set('elapsed', action.res.elapsed);
        stateMutated = stateMutated.set('skip', 0);
        return stateMutated;
      });
    case 'SEARCH_JOB_FAILURE':
      return state.set('searching', false);
    case 'SET_RESUME_TAKE':
      return state.set('take', action.value);
    case 'SET_RESUME_SKIP':
      return state.set('skip', action.value);
    default:
      return state;
  }
}
