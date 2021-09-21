import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View, ImageBackground, ScrollView, Image, TouchableOpacity, TextInput, Alert,PermissionsAndroid } from 'react-native';
import styles from './styles';
import HeaderwithArrow from '@components/HeaderwithArrow';
import { invite_friends, whatsapp_icon, copy_icon } from '@constants/Images';
import SearchInput from '@components/SearchInput';
import Contacts from 'react-native-contacts';
const InviteFriends = () => {
    const [searchvalue,setSearchvalue]=useState('');
    const searchClick =()=>{
        Alert.alert('search clicked');
    }
    const contactpermission = ()=>{
        if (Platform.OS === "android") {
            console.log("contact coming inside android")
            try{
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
              title: "Contacts",
              message: "This app would like to view your contacts."
            }).then((res) => {
                console.log("contact coming...",res)
                if(res=='granted'){
                    loadContacts();
                }else{
                    Alert.alert('permission denied for contact list')
                }
            //   
            });}
            catch(e){
                console.log("permisssion not given")
            }
          } else {
              
           //loadContacts();
          }
    }
   const  loadContacts =()=> {
       console.log("load contact function")
       Contacts.getAll().then(contacts => {
           console.log("contacts form",contacts.length)
        // contacts returned
      })
        // Contacts.getAll()
        //   .then(contacts => {
        //       console.log("contact",contacts)
        //     // this.setState({ contacts, loading: false });
        //   })
        //   .catch(e => {
        //     // this.setState({ loading: false });
        //   });
    
        // // Contacts.getCount().then(count => {
        // //   this.setState({ searchPlaceholder: `Search ${count} contacts` });
        // // });
    
        //  Contacts.checkPermission();
      }
    useEffect(()=>{
        contactpermission();
    },[])
    return (
        <View style={styles.container}>

            <View style={styles.firstSection}>
                <HeaderwithArrow title="Invite Friends" />
                <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ flex: 0.5 }}>
                        <Image source={invite_friends} style={styles.inviteImg} />
                    </View>
                    <View style={{ flex: 0.5, paddingRight: 40 }}>
                        <Text style={styles.invitepara}>Earn 5 Coins For Each Invite You Send And 50 Coins If They Install Azzetta.</Text>
                        <Text style={styles.knowtext}>know more</Text>
                    </View>
                </View>
            </View>
            <View style={styles.secondSection}>

                <View style={{ flexDirection: 'row', paddingTop: 12 }}>
                    <TouchableOpacity onPress={()=>contactpermission()} style={styles.icongroup}>
                       <Image source={whatsapp_icon} style={styles.smallIcons} />
                        <Text style={styles.sharediconText}>Whatsapp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.icongroup}>
                       <Image source={copy_icon} style={styles.smallIcons} />
                        <Text style={styles.sharediconText}>Copy Link</Text>
                        </TouchableOpacity>
                        
                </View>
                <View style={styles.bottomBorder}></View>
                <Text style={styles.phoneTitle}>Phone Contacts</Text>
                <SearchInput placeholder="search for name,number" value={searchvalue} onChangeText={(data)=>setSearchvalue(data)} onPress={()=>searchClick()}/>
                <ScrollView>
                </ScrollView>
            </View>

        </View>
    )
}
export default InviteFriends;