import {combineReducers} from 'redux';
import contactReducer from './contactReducer';
import profileReducer from './profileReducer';

export default combineReducers({
  contactReducer:contactReducer,
  profileReducer:profileReducer
});