import Immutable from 'immutable';

const defaultState = Immutable.Map({
  type: 'user',
  actionWaiting: false,
  authPages: [],
  registerSuccess: false,
  online: false,
  isAuthenticated: false,
  activePageAuthenticated: false,
  doneAuth: false,
  user: null,
  token: null,
});

const Account = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_USER_AUTHENTICATED':
      return state.withMutations(state => {
        let stateMutated = state.merge({
          isAuthenticated: true,
          token: action.token,
          type: action.actype,
        });

        if (typeof action.res == 'object' && action.res.hasOwnProperty('account_type')) {
          stateMutated = stateMutated.set('user', action.res);
        }

        return stateMutated;
      });
    case 'SET_USER_UNAUTHENTICATED':
      return state.merge({
        isAuthenticated: false,
        user: null,
        token: null,
      });
    case 'GET_AUTHENTICATED_USER':
      return state.merge({
        user: action.res,
      });
    case 'GET_AUTHENTICATED_USER_FAILURE':
      return state.merge({
        isAuthenticated: false,
        user: null,
      });
    case 'RESET_ACTIVE_PAGE_AUTHENTICATED':
      return state.set('activePageAuthenticated', true);
    case 'ACTIVE_PAGE_UNAUTHENTICATED':
      return state.merge({
        activePageAuthenticated: false,
        doneAuth: true,
      });
    case 'ACTIVE_PAGE_AUTHENTICATED':
      return state.set('activePageAuthenticated', true);
    case 'SET_DONE_AUTH':
      return state.set('doneAuth', true);
    case 'SET_ONLINE':
      return state.set('online', true);
    case 'SET_OFFLINE':
      return state.set('online', false);
    case 'LOGOUT_SUCCESS':
      return state.merge({
        isAuthenticated: false,
        token: null,
        user: null,
      });
    case 'JOIN_REQUEST':
      return state.set('actionWaiting', true);
    case 'JOIN':
      return state.set('registerSuccess', true);
    case 'JOIN_FAILURE':
      return state.set('actionWaiting', false);
    case 'RESET_REGISTRATION':
      return state.set('registerSuccess', false);
    case 'EDIT_RESUME_REQUEST':
      return state.set('actionWaiting', true);
    case 'EDIT_RESUME':
      return state.withMutations(state => {
        let stateMutated = state.set('actionWaiting', false);
        stateMutated = stateMutated.update('user', obj => obj.set('resume', action.resume));
        return stateMutated;
      });
    case 'EDIT_RESUME_FAILURE':
      return state.set('actionWaiting', false);
    case 'ADD_AUTHENTICATED_PAGE':
      return state.update('authPages', arr => {
        return arr.concat(action.page);
      });
    default:
      return state;
  }
};

export default Account;
