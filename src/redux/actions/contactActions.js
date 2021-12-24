import {CONTACT_DATA} from '../actions/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const updateContactData = (data=null) => dispatch =>{
  let contactData=data,
  arrayOfContacts=contactData||[];
  if(arrayOfContacts.length>0){
   let alphanumbers=[...arrayOfContacts].filter((obj)=>new RegExp(/^[a-zA-Z]/g).test(obj.name.toLowerCase())).sort((a,b)=>a.name.toLowerCase()>b.name.toLowerCase());
   let numbericDatas=[...arrayOfContacts].filter((obj)=>new RegExp(/^[^a-zA-Z]/g).test(obj.name.toLowerCase()));
   arrayOfContacts=[...alphanumbers,...numbericDatas];
  }
  try{
    AsyncStorage.setItem('contactDatas',JSON.stringify(contactData));
    dispatch({
      type:CONTACT_DATA,
      payload:{contactData:arrayOfContacts}
    });
  // eslint-disable-next-line no-empty
  }catch(e){

  }
};

export const getContactData = () =>(async(dispatch)=>{
  let contactData=await AsyncStorage.getItem('contactDatas'),
    arrayOfContacts=contactData?JSON.parse(contactData):[];
    if(arrayOfContacts.length>0){
     let alphanumbers=[...arrayOfContacts].filter((obj)=>new RegExp(/^[a-zA-Z]/g).test(obj.name.toLowerCase())).sort((a,b)=>a.name.toLowerCase()>b.name.toLowerCase());
     let numbericDatas=[...arrayOfContacts].filter((obj)=>new RegExp(/^[^a-zA-Z]/g).test(obj.name.toLowerCase()));
     arrayOfContacts=[...alphanumbers,...numbericDatas];
    }
  try{
    dispatch({
      type:CONTACT_DATA,
      payload:{contactData:arrayOfContacts}
    });
  // eslint-disable-next-line no-empty
  }catch(e){

  }
});