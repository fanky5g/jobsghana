import { combineReducers } from 'redux';
import * as defaultReducers from '#app/common/reducers';

export default function createReducer(asyncReducers) {
  return combineReducers({
    ...defaultReducers,
    ...asyncReducers,
  });
}
