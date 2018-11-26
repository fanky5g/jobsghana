import Immutable from 'immutable';

const initialState = Immutable.Map({
  loading: false,
  loaded: false,
  moreLoading: false,
  done: false,
  skip: 0,
  data: [],
});

export default function ResumeAlerts(state = initialState, action) {
  switch (action.type) {
    case 'GET_RESUMEALERT_SUBSCRIBERS_LOADING':
      return state.set('loading', true);
    case 'GET_RESUMEALERT_SUBSCRIBERS':
      var done = false;
      if (Array.isArray(action.res.resume_alerts) && action.res.resume_alerts.length == 0) {
        done = true;
      }
      return state.merge({
        data: state.get('data').concat(action.res.resume_alerts),
        skip: state.get('skip') + action.res.skip,
        loaded: true,
        done: done,
      })
    case 'GET_RESUMEALERT_SUBSCRIBERS_FAILURE':
      return state.set('searching', false);
    case 'LOAD_MORE_RESUMEALERT_SUBSCRIBERS_REQUEST':
      return state.set('moreLoading', true);
    case 'LOAD_MORE_RESUMEALERT_SUBSCRIBERS':
      return state.withMutations(stateIns => {
        let stateMutated = stateIns.set('moreLoading', false);
        stateMutated = stateMutated.set('skip', stateMutated.get('skip') + action.res.skip);
        if (Array.isArray(action.res.resume_alerts) && action.res.resume_alerts.length == 0) {
          stateMutated = stateMutated.set('done', true);
        }
        if (action.res.message && action.res.message !== 'technical error') {
          stateMutated = stateMutated.update('data', arr => arr.concat(action.res.resume_alerts || []));
        }
        return stateMutated;
      });
    case 'LOAD_MORE_RESUMEALERT_SUBSCRIBERS_FAILURE':
      return state.set('moreLoading', false);
    default:
      return state;
  }
}
