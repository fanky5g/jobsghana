import Immutable from 'immutable';

const defaultState = {
	waiting: false,
  exists: false,
	response: {},
	success: false,
};

const initialState = Immutable.Map(defaultState);


export default function MailList(state = initialState, action) {
  switch (action.type) {
  	case 'ADD_TO_MAILLIST_REQUEST':
  		return state.set('waiting', true);
    case 'ADD_TO_MAILLIST':
      if (action.res.exists) {
        return state.merge({
          waiting: false,
          response: action.res,
          success: false,
          exists: true,
        });
      }
    	return state.merge({
    		waiting: false,
    		response: action.res,
    		success: true,
    	});
    case 'ADD_TO_MAILLIST_FAILURE':
  		return state.set('waiting', false);
  	case 'RESET_MAILLIST':
  		return state.merge(defaultState)
    default:
      return state;
  }
}