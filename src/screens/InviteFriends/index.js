/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState, useEffect, useRef } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  FlatList,
  Platform,
} from 'react-native';
import styles from './styles';
import HeaderwithArrow from '@components/HeaderwithArrow';
import {
  invite_friends,
  whatsapp_icon,
  copy_icon,
  networkadded,
  search_icon,
  message,
} from '@constants/Images';
import SearchInput from '@components/SearchInput';
import Contacts from 'react-native-contacts';
import ThemedButton from '@components/ThemedButton';
import { colorLightBlue, colorsearchbar } from '@constants/Colors';
import { font12 } from '@constants/Fonts';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';
import { request, PERMISSIONS } from 'react-native-permissions';
import { alertToSettings, contactText } from '@services/AppPermissions';
import BottomSheetComp from '@components/BottomSheetComp';
import { MyRewardsNav, SearchContactNav } from '@navigation/NavigationConstant';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorBoundary from '@services/ErrorBoundary';

const osContact =
  Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.READ_CONTACTS
    : PERMISSIONS.IOS.CONTACTS;

const InviteFriends = () => {
  const navigation = useNavigation();
  const focused = useIsFocused();
  const [searchvalue, setSearchvalue] = useState(null);
  const [newContactList, setNewContactlist] = useState(null);
  const [loading, setloading] = useState(false);
  const [initialloading, setinitialloading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchButtonVisible, setSearchButtonVisible] = useState(true);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [showMessage, setShowMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(null);
  const [contacUpdate, setContactUpdate] = useState(0);
  const timerHandlerRef = useRef();
  const searchClick = (screen, data) => {
    navigation.navigate(screen, data);
  };
  const getPermission = async () => {
    const contactPermission = request(osContact);
    const contactResult = await contactPermission;
    return contactResult;
  };

  let contactLoader = 0;

  useEffect(() => {
    contact();
  }, []);

  const contact = async () => {
    contactLoader = await AsyncStorage.getItem('contactload');
    if (contactLoader > 0) {
      loadContactList();
      setShowMessage(false);
    }
    else {
      let result = await getPermission();
      if (result === 'granted') {
        setShowMessage(false);
        setNewContactlist([]);
        setinitialloading(true);
        loadContacts();
      } else {
        if (result === 'blocked') {
          setShowAlert(true);
          setShowMessage(true);
        }
        if (result === 'denied') {
          setShowMessage(true);
        }
      }
    }
  };

  useEffect(() => {
    if (showAlert) alertToSettings(contactText);
    else setShowAlert(false);
  }, [showAlert]);

  const loadContacts = () => {
    setContactUpdate(contacUpdate + 1);
    Contacts.getAll().then(async (contacts) => {
      const getToken = await AsyncStorage.getItem('loginToken');
      let filterrecords = [];
      let framecontacts =
        contacts &&
        contacts.length > 0 &&
        contacts.map((obj) => {
          if (obj.phoneNumbers.length > 0) {
            let phoneObj = {
              name:
                (Platform.OS === 'android' ? obj.displayName : obj.givenName) ||
                obj.phoneNumbers[0].number,
              phone_number: obj.phoneNumbers[0].number.replace(
                /([^0-9])+/g,
                ''
              ),
            };
            if (phoneObj.phone_number.length > 10) {
              phoneObj.phone_number = phoneObj.phone_number.replace('91', '');
            }
            filterrecords.push(phoneObj);
          } else {
            console.log('unliste record', obj);
          }
        });

      if (filterrecords.length > 0) {
        const payload = { contacts: filterrecords };
        let ApiInstance = await new APIKit().init(getToken);
        let awaitresp = await ApiInstance.post(constants.syncContacts, payload);
        if (awaitresp.status == 1) {
          console.log('awaitresp', awaitresp);
          setTimeout(() => {
            setinitialloading(true);
            localstore(filterrecords, awaitresp.data);
            AsyncStorage.setItem('contactload', JSON.stringify(contacUpdate));
            loadContactList();
          }, 500);
        } else {
          console.log('failure contact');
        }
      } else {
        setinitialloading(false);
        Toast.show('No contact found', Toast.LONG);
      }
    });
  };
  const localstore = async (records, numbers) => {
    let filteredNumbers = records;
    console.log('filteredNumbers', filteredNumbers);
    AsyncStorage.setItem('filterrecords', JSON.stringify(filteredNumbers));
    AsyncStorage.setItem('numbers', JSON.stringify(numbers));
  };
  const loadContactList = async () => {
    let totalcontactlist = [];
   let  filteredrecord = await AsyncStorage.getItem('filterrecords');
    let numbers = await AsyncStorage.getItem('numbers');
    const finalContactList = JSON.parse(numbers).data.map(
      ({ phone_number, is_already_invited, is_requested, is_user }, index) => {
        const localfilterrecords = JSON.parse(filteredrecord).filter(
          (obj) => obj.phone_number == phone_number
        );
        if (localfilterrecords.length > 0) {
          localfilterrecords.map((newobj) => {
            totalcontactlist.push({
              phone_number: newobj.phone_number,
              localName: newobj.name,
              is_already_invited: is_already_invited,
              is_requested: is_requested,
              is_user: is_user,
            });
          });
        }
      }
    );
    setNewContactlist([...totalcontactlist]);
    setinitialloading(false);
    setSearchButtonVisible(false);
  };

  const sendInvite = async (number, contact, index) => {
    setinitialloading(true);
    const getToken = await AsyncStorage.getItem('loginToken');
    const payload = { phone_number: number };
    let ApiInstance = await new APIKit().init(getToken);
    let contactlistData = [...newContactList];
    contactlistData[index].is_already_invited = true;
    setNewContactlist(contactlistData);
    let awaitresp = await ApiInstance.post(constants.inviteContact, payload);
    if (awaitresp.status == 1) {
      setModalVisible(true);
      setPhoneNumber(number);
      setinitialloading(false);
    } else {
      Alert.alert(awaitresp.err_msg);
    }
  };

  const navigatePage = (data) => {
    setSearchvalue(data);
    navigation.navigate(SearchContactNav);
  };

  const renderContactStatus = (contact, index) => {
    if (contact.is_user) {
      return (
        <TouchableOpacity>
          <Image source={networkadded} style={styles.netword_added_icon} />
        </TouchableOpacity>
      );
    } else if (contact.is_already_invited) {
      return (
        <TouchableOpacity
          disabled={contact.is_already_invited}
          style={styles.invitesentBtn}
          onPress={() => { }}>
          <Text style={styles.invitesent}>Invite Sent</Text>
        </TouchableOpacity>
      );
    } else if (contact.is_requested) {
      return (
        <ThemedButton
          title="Accept"
          onPress={() => sendInvite(contact.phone_number, contact, index)}
          color={colorLightBlue}
          labelStyle={{ fontSize: font12 }}
          buttonStyle={{ padding: 0, margin: 0 }}></ThemedButton>
      );
    } else {
      return (
        <ThemedButton
          title="Invite"
          mode="outlined"
          onPress={() => sendInvite(contact.phone_number, contact, index)}
          buttonStyle={{ padding: 0, margin: 0 }}
          labelStyle={{ fontSize: font12 }}
          color={colorLightBlue}></ThemedButton>
      );
    }
  };
  const copyToClipboard = () => {
    const content =
      '“Hi, I am an Alpha user of Azzetta, a very useful App to manage all appliances and gadgets. You can learn more about this App at www.azzetta.com. I would like to invite you to register as a Beta user of Azzetta and look forward to seeing you soon as a part of my trusted network on Azzetta.”';
    Clipboard.setString(content);
    Toast.show('Link Copied.', Toast.LONG);
  };
  const shareWhatsapp = () => {
    const content =
      '“Hi, I am an Alpha user of Azzetta, a very useful App to manage all appliances and gadgets. You can learn more about this App at www.azzetta.com. I would like to invite you to register as a Beta user of Azzetta and look forward to seeing you soon as a part of my trusted network on Azzetta.”';
    Linking.openURL('whatsapp://send?text=' + content);
  };
  const renderItem = ({ item, index }) => {
    return (
      <ErrorBoundary>
        <View style={styles.contactGroup} key={`contact_index_${index + 1}`}>
          <View style={{ flex: 0.2 }}>
            <View style={[styles.contactIcon, { backgroundColor: '#6AB5D8' }]}>
              <Text style={styles.contactIconText}>
                {item.localName.charAt(0)}
              </Text>
            </View>
          </View>
          <View style={{ flex: 0.53 }}>
            <View style={{ flexDirection: 'column' }}>
              <Text style={styles.contactName}>{item.localName}</Text>
              <Text style={styles.contactnumber}>
                {item.phone_number.replace(/\s/g, '')}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 0.27,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            {renderContactStatus(item, index)}
          </View>
        </View>
      </ErrorBoundary>
    );
  };
  const shareWhatsappLink = () => {
    let numbers = phoneNumber;
    let text =
      '“Hi, I am an Alpha user of Azzetta, a very useful App to manage all appliances and gadgets. You can learn more about this App at www.azzetta.com. I would like to invite you to register as a Beta user of Azzetta and look forward to seeing you soon as a part of my trusted network on Azzetta.”';
    Linking.openURL(
      'whatsapp://send?text=' + text + '&phone=91' + numbers
    ).then((data) => { });
    setModalVisible(false);
  };
  const stopTimer = () => {
    timerHandlerRef.current.stopTimer();
    setShowMessage(false);
  };
  const shareMessageLink = () => {
    console.log('phone number', phoneNumber);
    let numbers = phoneNumber;
    let text =
      '“Hi, I am an Alpha user of Azzetta, a very useful App to manage all appliances and gadgets. You can learn more about this App at www.azzetta.com. I would like to invite you to register as a Beta user of Azzetta and look forward to seeing you soon as a part of my trusted network on Azzetta.”';

    const url =
      Platform.OS === 'android'
        ? `sms:${numbers}?body=${text}`
        : `sms:/open?addresses=${numbers}&body=${text}`;
    return Linking.openURL(url);
    setModalVisible(false);
    // Linking.canOpenURL(url)
    //   .then((supported) => {
    //     if (!supported) {
    //       console.log("Unsupported url: " + url);
    //     } else {
    //       return Linking.openURL(url);
    //     }
    //   })
    //   .catch((err) => console.error("An error occurred", err));
  };

  return (
    <ErrorBoundary>
      <View style={styles.container}>
        <View style={styles.firstSection}>
          <HeaderwithArrow title="Invite Friends" />
          <View style={styles.invitegroup}>
            <View style={{ flex: 0.5 }}>
              <Image source={invite_friends} style={styles.inviteImg} />
            </View>
            <View style={styles.invitePara}>
              <Text style={styles.invitepara}>
                Earn 25 Coins For Each Invite You Send And 500 Coins If They
                Install Azzetta.
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(MyRewardsNav);
                }}>
                <Text style={styles.knowtext}>Know more</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.secondSection}>
          <View style={{ flexDirection: 'row', paddingTop: 12 }}>
            <TouchableOpacity
              onPress={() => shareWhatsapp()}
              style={styles.icongroup}>
              <Image source={whatsapp_icon} style={styles.smallIcons} />
              <Text style={styles.sharediconText}>Whatsapp</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.icongroup}
              onPress={() => copyToClipboard()}>
              <Image source={copy_icon} style={styles.smallIcons} />
              <Text style={styles.sharediconText}>Copy Link</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomBorder}></View>
          <Text style={styles.phoneTitle}>Phone Contacts</Text>
          {showMessage === false && (
            <TouchableOpacity
              disabled={searchButtonVisible}
              onPress={() => searchClick(SearchContactNav, newContactList)}>
              <SearchInput
                disableInput={true}
                placeholder="search for name, number"
                value={searchvalue}
                onChangeText={(data) => navigatePage(data)}
                editable_text={false}
                backgroundColor={colorsearchbar}
                icon={search_icon}
                style={{ padding: 10 }}
              />
            </TouchableOpacity>
          )}
          {showMessage === true && (
            <Text
              style={{
                textAlign: 'justify',
                fontSize: 14,
                fontFamily: 'Rubik-Regular',
                paddingVertical: 25,
                color: '#393939',
              }}>
              To help you invite friends and family on Azzetta, allow Azzetta
              access to your contacts. Go to your device's Settings >
              Permissions, and turn Contacts on.
            </Text>
          )}
          <ScrollView scrollEventThrottle={400}>
            {newContactList && (
              <FlatList
                extraData={newContactList}
                data={newContactList}
                renderItem={renderItem}
              />
            )}
          </ScrollView>
          {(loading || initialloading) && (
            <View
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                top: 0,
                bottom: 0,
                opacity: 0.5,
                backgroundColor: 'black',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <ActivityIndicator color={colorLightBlue} size="large" />
            </View>
          )}
          {/* {contactlist && contactlist.length == 0 && (
          <Text style={styles.norecords}>No Contacts Found</Text>
        )} */}
          {modalVisible && (
            <BottomSheetComp
              panelStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
              sheetVisible={modalVisible}
              closePopup={() => setModalVisible(false)}>
              <View style={styles.borderLineMain}>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <View style={styles.borderLine}></View>
                </TouchableOpacity>
              </View>
              <View style={styles.contentPadding}>
                {/* <TouchableOpacity onPress={()=>shareWhatsappLink()}><Text>Whatsapp</Text></TouchableOpacity>
                   <TouchableOpacity onPress={()=>shareMessageLink()}><Text>Message</Text></TouchableOpacity> */}
                <Text style={styles.title}>Share to</Text>
                <View style={{ flexDirection: 'row', paddingTop: 12 }}>
                  <TouchableOpacity
                    onPress={() => shareWhatsappLink()}
                    style={styles.icongroup}>
                    <Image source={whatsapp_icon} style={styles.smallIcons} />
                    <Text style={styles.sharediconText}>Whatsapp</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.icongroup}
                    onPress={() => shareMessageLink()}>
                    <Image source={message} style={styles.smallIcons} />
                    <Text style={styles.sharediconText}>Message</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BottomSheetComp>
          )}
        </View>
      </View>
    </ErrorBoundary>
  );
};
export default InviteFriends;