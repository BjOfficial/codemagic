/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  FlatList,
  Linking,
  Platform,
} from "react-native";
import HomeHeader from "@components/HomeHeader";
import SearchInput from "@components/SearchInput";
import styles from "@screens/InviteFriends/styles";
import { colorWhite, colorLightBlue } from "@constants/Colors";
import {
  search_icon,
  close,
  networkadded,
  whatsapp_icon,
  message,
} from "@constants/Images";
import APIKit from "@utils/APIKit";
import { constants } from "@utils/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ThemedButton from "@components/ThemedButton";
import { font12 } from "@constants/Fonts";
import BottomSheetComp from "@components/BottomSheetComp";
const SearchContact = () => {
  const [searchvalue, setSearchvalue] = useState("");
  const [contactlist, setContactlist] = useState(null);
  const [duplicateContactlist, setduplicateContactlist] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);

  const [loading, setloading] = useState(false);
  const inputRef = useRef(null);
  const loadContactList = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitresp = await ApiInstance.get(constants.listContacts);
    if (awaitresp.status == 1) {
      setContactlist([...awaitresp.data.data]);
      setduplicateContactlist([...awaitresp.data.data]);
    } else {
      Alert.alert("No contacts Found");
    }
  };
  useEffect(() => {
    loadContactList();
  }, []);
  const searchContactList = (data) => {
    if (data.length > 7) {
      inputRef.current.clear();
    }
    setSearchvalue(data);
    setloading(true);
    let filterdata = [...duplicateContactlist].filter(
      (item) =>
        item.name.toLowerCase().includes(data.toLowerCase()) ||
        item.phone_number.includes(data)
    );
    setContactlist([...filterdata]);
    setTimeout(() => {
      setloading(false);
    }, 1000);
  };

  const sendInvite = async (number, contact, index) => {
    const getToken = await AsyncStorage.getItem("loginToken");
    const payload = { phone_number: number };
    let ApiInstance = await new APIKit().init(getToken);
    let contactlistData = [...contactlist];
    contactlistData[index].is_already_invited = true;
    setContactlist(contactlistData);
    let awaitresp = await ApiInstance.post(constants.inviteContact, payload);
    if (awaitresp.status == 1) {
      setModalVisible(true);
      setPhoneNumber(number);
    } else {
      Alert.alert(awaitresp.err_msg);
    }
  };

  const shareWhatsappLink = () => {
    let numbers = phoneNumber;
    let text =
      "Hi, I am finding Azzetta very useful to manage all appliances and gadgets. Refer www.myhomeassets.in or www.azzetta.com for details. Do download and install at your convenience. Here is the link for your download.";
    Linking.openURL("whatsapp://send?text=" + text + "&phone=91" + numbers);
    setModalVisible(false);
  };
  const shareMessageLink = () => {
    let numbers = `91${phoneNumber}`;
    let text =
      "Hi, I am finding Azzetta very useful to manage all appliances and gadgets. Refer www.myhomeassets.in or www.azzetta.com for details. Do download and install at your convenience. Here is the link for your download.";

    const url =
      Platform.OS === "android"
        ? `sms:${numbers}?body=${text}`
        : `sms:/open?addresses=${numbers}&body=${text}`;
    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          console.log("Unsupported url: " + url);
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
    setModalVisible(false);
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
          style={styles.invitesentBtn}>
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

      //
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <View style={styles.contactGroup}>
        <View style={{ flex: 0.2 }}>
          <View style={[styles.contactIcon, { backgroundColor: "#6AB5D8" }]}>
            <Text style={styles.contactIconText}>{item.name.charAt(0)}</Text>
          </View>
        </View>
        <View style={{ flex: 0.55 }}>
          <View style={{ flexDirection: "column" }}>
            <Text style={styles.contactName}>{item.name}</Text>
            <Text style={styles.contactnumber}>
              {item.phone_number.replace(/\s/g, "")}
            </Text>
          </View>
        </View>
        <View
          style={{
            flex: 0.25,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}>
          {renderContactStatus(item, index)}
        </View>
      </View>
    );
  };
  return (
    <View style={[styles.container, { backgroundColor: colorWhite }]}>
      <HomeHeader title="Search" />
      <View style={styles.searchView}>
        <SearchInput
          inputRef={inputRef}
          placeholder="search for name,number"
          value={searchvalue}
          onChangeText={(data) => searchContactList(data)}
          backgroundColor={colorWhite}
          icon={searchvalue.length == "" ? search_icon : close}
          onPress={() => searchContactList("")}
        />
      </View>
      <View style={styles.searchsection}>
        {contactlist == null && (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}>
            <ActivityIndicator color={colorLightBlue} size="large" />
          </View>
        )}
        <ScrollView scrollEventThrottle={400}>
          {contactlist && (
            <FlatList data={contactlist} renderItem={renderItem} />
          )}
          {loading && (
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}>
              <ActivityIndicator color={colorLightBlue} size="large" />
            </View>
          )}
          {contactlist && contactlist.length == 0 && (
            <Text style={styles.norecords}>No Contacts Found</Text>
          )}
        </ScrollView>
        {modalVisible && (
          <BottomSheetComp
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
              <View style={{ flexDirection: "row", paddingTop: 12 }}>
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
  );
};
export default SearchContact;
