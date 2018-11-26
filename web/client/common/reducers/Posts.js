import Immutable from 'immutable';

const defaultState = Immutable.Map({
  isWaiting: false,
  loaded: false,
  message: '',
  postSuccess: false,
  data: [],
  grouped: {},
  typeLoading: false,
  types: [],
});

export default function PostsReducer(state = defaultState, action) {
  switch (action.type) {
  case 'GET_POSTS_REQUEST':
    return state.set('isWaiting', true);
  case 'GET_POSTS':
    return state.withMutations((stateIns) => {
      stateIns
        .update('data', arr => arr.concat(action.res.posts))
        .update('types', arr => arr.concat(action.res.types))
        .update('grouped', () => action.res.grouped)
        .merge({
          loaded: true,
          isWaiting: false,
        });
    });

  case 'GET_POSTS_FAILURE':
    return state.merge({
      loaded: false,
      isWaiting: false,
    });
  case 'CREATE_POST_REQUEST':
    return state.set('isWaiting', true);
  case 'CREATE_POST':
    return state.withMutations((stateIns) => {
      stateIns
        .update('data', arr => arr.concat(action.res.body.post))
        .merge({
          isWaiting: false,
          postSuccess: true,
          message: action.res.message,
        });
    });
  case 'CREATE_POST_FAILURE':
    return state.merge({
      isWaiting: false,
      postSuccess: false,
      message: action.error,
    });
  case 'RESET_MESSAGES':
    return state.merge({
      isWaiting: false,
      postSuccess: false,
      message: '',
    });
  case 'DELETE_POST_REQUEST':
    return state.set('loading', true);
  case 'DELETE_POST':
    return state.withMutations((stateIns) => {
      stateIns.update('data', arr => {
          const index = arr.findIndex((item) => {
            if (typeof item.toJSON === 'function') {
              return item.toJSON().ID === action.res.pid;
            }
            return item.ID === action.res.pid;
          });
          return index !== -1 ? arr.remove(index) : arr;
        })
        .merge({
          loading: false,
          message: 'Delete successful',
        });
    });
  case 'DELETE_POST_FAILURE':
    return state.merge({
      loading: false,
      message: 'Delete failed',
    });
  case 'EDIT_POST_REQUEST':
  case 'PUBLISH_POST_REQUEST':
  case 'UNPUBLISH_POST_REQUEST':
    return state.set('loading', true);
  case 'EDIT_POST':
  case 'PUBLISH_POST':
  case 'UNPUBLISH_POST':
    return state.withMutations((stateIns) => {
      stateIns.update('data', arr => {
          const index = arr.findIndex((item) => {
            if (typeof item.toJSON === 'function') {
              return item.toJSON().ID === action.res.ID;
            }
            return item.ID === action.res.ID;
          });
          return index !== -1 ? arr.set(index, Immutable.fromJS(action.res)) : arr;
        })
        .merge({
          message: action.res.message,
          loading: false,
        });
    });
  case 'EDIT_POST_FAILURE':
    return state.merge({
      loading: false,
      message: action.error || 'Edit failed',
    });
  case 'PUBLISH_POST_FAILURE':
    return state.merge({
      loading: false,
      message: 'Post failed to publish',
    });
  case 'UNPUBLISH_POST_FAILURE':
    return state.merge({
      loading: false,
      message: 'Post failed to unpublish',
    });
  case 'ADD_TYPE_REQUEST':
    return state.set('typeLoading', true);
  case 'ADD_TYPE':
    return state.withMutations((stateIns) => {
      stateIns
        .set('message', 'Type added successfully')
        .update('types', arr => {
          return arr.concat(action.res);
        });
    });
  case 'ADD_TYPE_FAILURE':
    return state.set('message', action.error || 'Type add failed');
  case 'DELETE_TYPE_REQUEST':
    return state.set('typeLoading', true);
  case 'DELETE_TYPE':
    if (typeof action.res.body == 'object' && Array.isArray(action.res.body.ids)) {
      const ids = action.res.body.ids; // deleted array of ids
      if (ids && ids.length) {
        return state.withMutations(stateIns => {
          return stateIns.update('types', arr => {
            return arr.filter(item => ids.indexOf(item.ID) !== -1);
          }).set('message', 'Type deleted successfully');
        });
        return state;
      }
    } else if (typeof action.res.body === 'object' && action.res.body.hasOwnProperty('id')) {
      return state.withMutations((stateIns) => {
        return stateIns
          .update('types', arr => {
            const index = arr.findIndex(item => item.ID === action.res.body.id);
            return index !== -1 ? arr.remove(index) : arr;
          })
          .set('message', 'Type deleted successfully');
      });
    }
    return state;
  case 'DELETE_TYPE_FAILURE':
    return state.set('message', action.error || 'Type delete failed');
  default:
    return state;
  }
}
