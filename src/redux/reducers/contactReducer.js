import {CONTACT_DATA} from '../actions/types';

const InitialState={contactData:[]};
export default (state=InitialState,action)=>{
  if(action.type==CONTACT_DATA){
    // eslint-disable-next-line unused-imports/no-unused-vars
    const payload = action.payload || {},
      contactData = payload.contactData || [];
    return {
      ...state,
      contactData
    };
  }
  return state;
};