import React, {useEffect,createContext,useState} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View
} from 'react-native';
import PouchDB from 'pouchdb-react-native';
export const PouchDBContext=createContext();
PouchDB.plugin(require('pouchdb-adapter-asyncstorage').default);
const PouchDBHandler =(props)=>{
    let applicant_db=new PouchDB('appliance_list_local', { adapter: 'asyncstorage' }),
    document_db=new PouchDB('document_list_local', { adapter: 'asyncstorage' }),
    [applicant_list,set_applicant_list] = useState(null),
    [document_list,set_document_list] = useState(null),
    getApplicatnDocs=async(callback)=>{
      let awaitresults=null;
      try{
       awaitresults= await applicant_db.allDocs();
          if(callback){
            callback(awaitresults);
          }
        }catch(e){
          console.log('err',e)
          }
        //   set_applicant_list(awaitresults.rows);
          return awaitresults;
    },
    get_document_collections=async(callback)=>{
      let awaitresults=null;
      try{
         awaitresults= await document_db.allDocs();
            if(callback){
              callback(awaitresults);
            }
          }catch(e){
            console.log('err',e)
            }
          //   set_applicant_list(awaitresults.rows);
            return awaitresults;
      },
    resetApplicatnDB=(callback)=>{
      try{
    applicant_db.destroy().then(function (response) {
        // success
        applicant_db=new PouchDB('appliance_list_local', { adapter: 'asyncstorage' });
        if(callback){
            callback(null,"destoryed..")
        }
      }).catch(function (err) {
        // console.log(err);
        if(callback){
        callback(err,null);
        }
      });
    }catch(e){
      console.log('err',e)
      }
    },
    resetDocumentDB=(callback)=>{
      try{
        document_db.destroy().then(function (response) {
            // success
            document_db=new PouchDB('document_list_local', { adapter: 'asyncstorage' });
            if(callback){
                callback(null,"destoryed..")
            }
          }).catch(function (err) {
            // console.log(err);
            if(callback){
            callback(err,null);
            }
          });
        }catch(e){
          console.log('err',e)
          }
        },
    update_applicant_db=async(document)=>{
        // console.log("newresultdocs1",document[0]);
       try{
            applicant_db.bulkDocs([...document]).then((response)=>{
                console.log("response",response);
                // getApplicatnDocs();
            }).catch(function (err) {
                console.log("err",err);
            });
          }catch(e){
            console.log('err',e)
            }
        
    },
    update_document_db=async(document)=>{
      try{
        document_db.bulkDocs([...document]).then((response)=>{
            console.log("response",response);
            // get_document_collections();
        }).catch(function (err) {
            console.log("err",err);
        });
      }catch(e){
        console.log('err',e)
        }
    },
    
    pouchDBAPI= {
        API:{
            set_applicant_list:set_applicant_list,
            applicant_list:applicant_list,
            set_document_list:set_document_list,
            document_list:document_list,
            update_applicant_db:update_applicant_db,
            update_document_db:update_document_db,
            get_document_collections:get_document_collections,
            getApplicatnDocs:getApplicatnDocs,
            resetApplicantDB:resetApplicatnDB,
            resetDocumentDB:resetDocumentDB
        }
    };
    return(
        <PouchDBContext.Provider value={pouchDBAPI}>
            {props.children}
        </PouchDBContext.Provider>
    )
}
export default PouchDBHandler;

// const db = new PouchDB('appliance_list_local', { adapter: 'asyncstorage' })
// const db1 = new PouchDB('document_list_local', { adapter: 'asyncstorage' })
// useEffect(()=>{
//     db.post({
//         title: 'Ziggy Stardust'
//       }).then(function (response) {
//           console.log("offline response",response);
//         // handle response
//       }).catch(function (err) {
//         console.log(err);
//       });
// },[])
// return(
// <View>
// <Text>
// Offline check
// </Text>
// </View>
// )