import Immutable from 'immutable';

const defaultState = Immutable.Map({
  loading: false,
  loaded: false,
  message: '',
  data: [],
});

export default function MessageReducer(state = defaultState, action) {
  switch (action.type) {
    case 'FETCH_MESSAGES_REQUEST':
      return state.set('loading', true);
    case 'FETCH_MESSAGES':
      return state.withMutations((stateIns) => {
        stateIns
          .update('data', arr => arr.concat(action.res))
          .merge({
            loading: false,
            loaded: true,
          });
      });
    case 'FETCH_MESSAGES_FAILURE':
      return state.merge({
        loading: false,
      });
    case 'MARK_MESSAGE_AS_READ':
      return state.update('data', arr => {
        const index = arr.findIndex((item) => {
          if (Immutable.Map.isMap(item)) {
            return item.toJSON().ID === action.id;
          }
          return item.ID === action.id;
        });
        if (index !== -1) {
          return Immutable.Map.isMap(arr.get(index)) ?
            arr.set(index, arr.get(index).set('read', true)) :
            arr.set(index, { ...arr.get(index), read: true });
        }
        return arr;
      });
    default:
      return state;
  }
}
