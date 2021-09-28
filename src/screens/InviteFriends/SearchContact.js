import React, { useState, useEffect, useRef } from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator, FlatList } from 'react-native';
import HomeHeader from '@components/HomeHeader';
import SearchInput from '@components/SearchInput';
import styles from '@screens/InviteFriends/styles';
import { colorWhite, colorLightBlue } from '@constants/Colors';
import { search_icon, close, networkadded } from '@constants/Images';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ThemedButton from '@components/ThemedButton';
import { font12 } from '@constants/Fonts';
const Searchcontact = () => {
    const [searchvalue, setSearchvalue] = useState('');
    const [contactlist, setContactlist] = useState(null);
    const [duplicateContactlist, setduplicateContactlist] = useState([]);

    const [loading, setloading] = useState(false);
    const inputRef = useRef(null);
    const loadContactList = async () => {
        const getToken = await AsyncStorage.getItem("loginToken");
        let ApiInstance = await new APIKit().init(getToken);
        let awaitresp = await ApiInstance.get(constants.listContacts);
        if (awaitresp.status == 1) {
            setContactlist([...awaitresp.data.data])
            setduplicateContactlist([...awaitresp.data.data])


        } else {
            Alert.alert('No contacts Found');
        }
    }
    useEffect(() => {
        loadContactList();
    }, [])
    const searchContactList = (data) => {
        if (data.length > 7) {
            inputRef.current.clear();
        }
        setSearchvalue(data);
        setloading(true);
        let filterdata = [...duplicateContactlist].filter((item) => (item.name.toLowerCase().includes(data.toLowerCase()) || item.phone_number.includes(data)))
        setContactlist([...filterdata]);
        setTimeout(() => {
            setloading(false);
        }, 1000);


    }
    const renderContactStatus = (contact) => {
        if (contact.is_user) {
            return <TouchableOpacity><Image source={networkadded} style={styles.netword_added_icon} /></TouchableOpacity>
        } else if (contact.is_already_invited) {
            return <TouchableOpacity disabled={contact.is_already_invited} style={styles.invitesentBtn} onPress={() => { }}><Text style={styles.invitesent}>Invite Sent</Text></TouchableOpacity>
        } else if (contact.is_requested) {
            return <ThemedButton title="Accept" onPress={() => InviteFriends(contact.phone_number)} color={colorLightBlue} labelStyle={{ fontSize: font12 }} buttonStyle={{ padding: 0, margin: 0 }}></ThemedButton>;
        } else {
            return <ThemedButton title="Invite" mode="outlined" onPress={() => InviteFriends(contact.phone_number)} buttonStyle={{ padding: 0, margin: 0 }} labelStyle={{ fontSize: font12 }} color={colorLightBlue}></ThemedButton>

            //  
        }
    }
    const renderItem = ({ item }) => {
        return (
            <View style={styles.contactGroup}>
                <View style={{ flex: 0.2 }}>
                    <View style={[styles.contactIcon, { backgroundColor: '#6AB5D8' }]}><Text style={styles.contactIconText}>{item.name.charAt(0)}</Text></View>
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
        <View style={[styles.container, { backgroundColor: colorWhite }]}>
            <HomeHeader title="Search" />
            <View style={styles.searchView}>
                <SearchInput inputRef={inputRef} placeholder="search for name,number" value={searchvalue} onChangeText={(data) => searchContactList(data)} backgroundColor={colorWhite} icon={searchvalue.length == '' ? search_icon : close} onPress={() => searchContactList("")} />
            </View>
            <View style={styles.searchsection}>
                {contactlist == null &&
                    <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colorLightBlue} size="large" /></View>}
                <ScrollView scrollEventThrottle={400}>


                    {contactlist &&
                        <FlatList
                            data={contactlist}
                            renderItem={renderItem}
                        />
                    }
                    {loading &&
                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}><ActivityIndicator color={colorLightBlue} size="large" /></View>}
                    {(contactlist && contactlist.length == 0) &&
                        <Text style={styles.norecords}>No Contacts Found</Text>
                    }
                </ScrollView></View>
        </View>
    )
}
export default Searchcontact;