import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ImageBackground, ScrollView, Image, TouchableOpacity, TextInput, Alert, PermissionsAndroid, ActivityIndicator ,Linking,FlatList,Share} from 'react-native';
import styles from './styles';
import HeaderwithArrow from '@components/HeaderwithArrow';
import { invite_friends, whatsapp_icon, copy_icon, network_icon, networkadded, search_icon } from '@constants/Images';
import SearchInput from '@components/SearchInput';
import Contacts from 'react-native-contacts';
import ThemedButton from '@components/ThemedButton';
import { colorLightBlue, colorsearchbar } from '@constants/Colors';
import { font10, font12 } from '@constants/Fonts';
import { useNavigation, useRoute } from "@react-navigation/native";
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';
import {
    SearchContactNav
} from '@navigation/NavigationConstant';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
const InviteFriends = () => {
    const navigation = useNavigation();
    var caontactList = [{ id: 1, aliasName: 'DS', contactName: 'Danielle Stanley', contactNumber: 9876543210, backgroundColor: '#6AB5D8', remainder: true, invited: true }, { id: 2, aliasName: 'TE', contactName: 'Tom Evans', contactNumber: 9876543210, backgroundColor: '#72BFA9', remainder: false, invited: false }, { id: 3, aliasName: 'RE', contactName: 'Ryan Ellis', contactNumber: 9876543210, backgroundColor: '#AE98D2', remainder: true, invited: true }, { id: 3, aliasName: 'RE', contactName: 'Ryan Ellis', contactNumber: 9876543210, backgroundColor: '#AE98D2', remainder: false, invited: false }, { id: 3, aliasName: 'RE', contactName: 'Ryan Ellis', contactNumber: 9876543210, backgroundColor: '#AE98D2', remainder: false, invited: false }, { id: 3, aliasName: 'RE', contactName: 'Ryan Ellis', contactNumber: 9876543210, backgroundColor: '#AE98D2', remainder: false, invited: false }, { id: 3, aliasName: 'RE', contactName: 'Ryan Ellis', contactNumber: 9876543210, backgroundColor: '#AE98D2', remainder: false, invited: false }]
    const [searchvalue, setSearchvalue] = useState(null);
    const [contactlist, setContactlist] = useState([]);
    const [newContactList, setNewContactlist] = useState(null);
    const [loading, setloading] = useState(false);



    const searchClick = (screen) => {
        navigation.navigate(screen);
    }
    const contactpermission = () => {
        if (Platform.OS === "android") {
            try {
                PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                    title: "Contacts",
                    message: "This app would like to view your contacts."
                }).then((res) => {
                    if (res == 'granted') {
                        loadContacts();
                    } else {
                        Alert.alert('permission denied for contact list')
                    }
                });
            }
            catch (e) {
                console.log("contact err", e);
            }
        } else {

            loadContacts();
        }
    }
    const loadContacts = () => {
        Contacts.getAll().then(async (contacts) => {
            const getToken = await AsyncStorage.getItem("loginToken");
            let filterrecords = [];
            let framecontacts = contacts && contacts.length > 0 && contacts.map((obj) => {
                if (obj.phoneNumbers.length > 0) {
                    filterrecords.push({ name: obj.displayName, phone_number: obj.phoneNumbers[0].number.replace("+91", "") });
                } else {
                    console.log("unliste record", obj)
                }
            })
            const payload = { 'contacts': filterrecords };
            let ApiInstance = await new APIKit().init(getToken);
            let awaitresp = await ApiInstance.post(constants.postContacts, payload);
            if (awaitresp.status == 1) {
                console.log("success contact")
            } else {
                console.log("failure contact");
            }
            // setContactlist(contacts);
        })
    }
    const loadContactList = async (limit,next) => {
        const getToken = await AsyncStorage.getItem("loginToken");
        let ApiInstance = await new APIKit().init(getToken);
        let awaitresp = await ApiInstance.get(constants.listContacts);
        if (awaitresp.status == 1) {
            let contactDatas=awaitresp.data.data;
            let possibilities=contactDatas.length/10;
            setNewContactlist(contactDatas);
            
        } else {
            Alert.alert('No contacts Found');
        }
    }
    useEffect(() => {
        contactpermission();
        loadContactList(10);
    }, []);
    useEffect(()=>{
       
        if(newContactList&&newContactList.length>0){
            if(contactlist.length!=newContactList.length){
              
                if(contactlist.length==0){

                    setContactlist([...contactlist,...newContactList.slice(contactlist.length,contactlist.length+10)])
                }else{
                }
            }
            // setContactlist([...newContactList].slice(0,10))
        }
    },[newContactList,contactlist])
    const InviteFriends =async(number)=>{

        const getToken = await AsyncStorage.getItem("loginToken");
        const payload={phone_number:number};
        let ApiInstance = await new APIKit().init(getToken);
        let awaitresp = await ApiInstance.post(constants.inviteContact,payload);
    }
    useEffect(()=>{
    },[contactlist])
    const updateContactList=()=>{
        setloading(true)
        if(contactlist.length!=newContactList.length){
        setContactlist([...contactlist,...newContactList.slice(contactlist.length,contactlist.length+10)])
        setTimeout(()=>{
            setloading(false)
        },2000)
        }
    }
    const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
        const paddingToBottom = 20;
        return layoutMeasurement.height + contentOffset.y >=
          contentSize.height - paddingToBottom;
      };
      const renderContactStatus=(contact)=>{
          if(contact.is_user){
            return <TouchableOpacity><Image source={networkadded} style={styles.netword_added_icon} /></TouchableOpacity>
          }else if (contact.is_already_invited){
              return <TouchableOpacity  disabled={contact.is_already_invited} style={styles.invitesentBtn} onPress={()=>{}}><Text style={styles.invitesent}>Invite Sent</Text></TouchableOpacity>
          }else if(contact.is_requested){
            return <ThemedButton title="Accept" onPress={()=>InviteFriends(contact.phone_number)} color={colorLightBlue} labelStyle={{fontSize:font12}} buttonStyle={{padding:0,margin:0}}></ThemedButton>;
          }else{
            return <ThemedButton title="Invite" mode="outlined" onPress={()=>InviteFriends(contact.phone_number)} buttonStyle={{ padding: 0, margin: 0 }} labelStyle={{ fontSize: font12 }} color={colorLightBlue}></ThemedButton>
            
            //  
          }
      }
    const copyToClipboard = () => {
        const content="Hi, I am finding Azzetta very useful to manage all appliances and gadgets. Refer www.myhomeassets.in or www.azzetta.com for details. Do download and install at your convenience. Here is the link for your download."
        Clipboard.setString(content);
        Toast.show('Link Copied.', Toast.LONG);

      }
    const shareWhatsapp =()=>{
        const content="Hi, I am finding Azzetta very useful to manage all appliances and gadgets. Refer www.myhomeassets.in or www.azzetta.com for details. Do download and install at your convenience. Here is the link for your download."
        Linking.openURL('whatsapp://send?text=' + content);
    }
    const renderItem =({item,index})=>{
        return(
        <View style={styles.contactGroup} key={`contact_index_${index+1}`}>
                                <View style={{ flex: 0.2 }}>
                                    <View style={[styles.contactIcon, { backgroundColor:'#6AB5D8' }]}><Text style={styles.contactIconText}>{item.name.charAt(0)}</Text></View>
                                    {/* {contact.remainder&&<Image source={network_icon} style={styles.network_icon} />} */}
                                 </View>
                                <View style={{ flex: 0.55 }}>
                                    <View style={{ flexDirection: 'column' }}><Text style={styles.contactName}>{item.name}</Text>
                                        <Text style={styles.contactnumber}>{item.phone_number}</Text></View></View>
                                <View style={{ flex: 0.25, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                    {renderContactStatus(item)}
                                    
                                </View>
                            </View>
        )
    }
    return (
        <View style={styles.container}>

            <View style={styles.firstSection}>
                <HeaderwithArrow title="Invite Friends" />
                <View style={styles.invitegroup}>
                    <View style={{ flex: 0.5 }}>
                        <Image source={invite_friends} style={styles.inviteImg} />
                    </View>
                    <View style={styles.invitePara}>
                        <Text style={styles.invitepara}>Earn 5 Coins For Each Invite You Send And 50 Coins If They Install Azzetta.</Text>
                        <Text style={styles.knowtext}>know more</Text>
                    </View>
                </View>
            </View>
            <View style={styles.secondSection}>
                    <View style={{ flexDirection: 'row', paddingTop: 12 }}>
                        <TouchableOpacity onPress={() => shareWhatsapp()} style={styles.icongroup}>
                            <Image source={whatsapp_icon} style={styles.smallIcons} />
                            <Text style={styles.sharediconText}>Whatsapp</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.icongroup} onPress={() => copyToClipboard()}>
                            <Image source={copy_icon} style={styles.smallIcons} />
                            <Text style={styles.sharediconText}>Copy Link</Text>
                        </TouchableOpacity>

                    </View>
                    
                    <View style={styles.bottomBorder}></View>
                    <Text style={styles.phoneTitle}>Phone Contacts</Text>
                    <TouchableOpacity onPress={()=>searchClick(SearchContactNav)}><SearchInput disableInput={true} placeholder="search for name,number" value={searchvalue} onChangeText={(data) => { setSearchvalue(data), navigation.navigate(SearchContactNav) }} editable_text={false} backgroundColor={colorsearchbar} icon={search_icon} /></TouchableOpacity>
                    <ScrollView 
    scrollEventThrottle={400}>
                    {contactlist&&
                    <FlatList 
                    data={newContactList}
                    renderItem={renderItem}
                    />
}
</ScrollView>
                        {loading&&
                        <View style={{flex:1,flexDirection:'row',alignItems:'center',justifyContent:'center'}}><ActivityIndicator color={colorLightBlue} size="large"/></View>} 
                       {(contactlist && contactlist.length == 0) &&
                        <Text style={styles.norecords}>No Contacts Found</Text>
                    }


            </View>

        </View>
    )
}
export default InviteFriends;