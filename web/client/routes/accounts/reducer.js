import Immutable from 'immutable';

const initialState = Immutable.Map({
  loading: false,
  moreLoading: false,
  done: false,
  skip: 0,
  data: [],
});

export default function Accounts(state = initialState, action) {
  switch (action.type) {
    case 'GET_ACCOUNTS_LOADING':
      return state.set('loading', true);
    case 'GET_ACCOUNTS':
      var done = false;
      if (Array.isArray(action.res.accounts) && action.res.accounts.length == 0) {
        done = true;
      }
      return state.merge({
        data: state.get('data').concat(action.res.accounts),
        skip: state.get('skip') + action.res.skip,
        done: done,
      })
    case 'GET_ACCOUNTS_FAILURE':
      return state.set('searching', false);
    case 'LOAD_MORE_ACCOUNTS_REQUEST':
      return state.set('moreLoading', true);
    case 'LOAD_MORE_ACCOUNTS':
      return state.withMutations(stateIns => {
        let stateMutated = stateIns.set('moreLoading', false);
        stateMutated = stateMutated.set('skip', stateMutated.get('skip') + action.res.skip);
        if (Array.isArray(action.res.accounts) && action.res.accounts.length == 0) {
          stateMutated = stateMutated.set('done', true);
        }
        if (action.res.message && action.res.message !== 'technical error') {
          stateMutated = stateMutated.update('data', arr => arr.concat(action.res.accounts || []));
        }
        return stateMutated;
      });
    case 'LOAD_MORE_ACCOUNTS_FAILURE':
      return state.set('moreLoading', false);
    case 'APPROVE_ACCOUNT_LOADING':
      return state.update('data', arr => arr.map(item => {
        if (item.ID == action.id) {
          item.approveloading = true;
        }
        return item;
      }));
    case 'APPROVE_ACCOUNT':
      return state.update('data', arr => arr.map(item => {
        if (item.ID == action.id) {
          item.approveloading = false;
          item.approved = true;
        }
        return item;
      }));
    case 'APPROVE_ACCOUNT_FAILURE':
      return state.update('data', arr => arr.map(item => {
        if (item.ID == action.id) {
          item.approveloading = false;
        }
        return item;
      }));
    default:
      return state;
  }
}
