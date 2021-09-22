import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  PermissionsAndroid,
} from "react-native";
import styles from "./styles";
import HeaderwithArrow from "@components/HeaderwithArrow";
import {
  invite_friends,
  whatsapp_icon,
  copy_icon,
  network_icon,
  networkadded,
} from "@constants/Images";
import SearchInput from "@components/SearchInput";
import Contacts from "react-native-contacts";
import ThemedButton from "@components/ThemedButton";
import { colorLightBlue, colorWhite } from "@constants/Colors";
import { font12 } from "@constants/Fonts";
const InviteFriends = () => {
  var caontactList = [
    {
      id: 1,
      aliasName: "DS",
      contactName: "Danielle Stanley",
      contactNumber: 9876543210,
      backgroundColor: "#6AB5D8",
      remainder: true,
      invited: true,
    },
    {
      id: 2,
      aliasName: "TE",
      contactName: "Tom Evans",
      contactNumber: 9876543210,
      backgroundColor: "#72BFA9",
      remainder: false,
      invited: false,
    },
    {
      id: 3,
      aliasName: "RE",
      contactName: "Ryan Ellis",
      contactNumber: 9876543210,
      backgroundColor: "#AE98D2",
      remainder: true,
      invited: true,
    },
    {
      id: 3,
      aliasName: "RE",
      contactName: "Ryan Ellis",
      contactNumber: 9876543210,
      backgroundColor: "#AE98D2",
      remainder: false,
      invited: false,
    },
    {
      id: 3,
      aliasName: "RE",
      contactName: "Ryan Ellis",
      contactNumber: 9876543210,
      backgroundColor: "#AE98D2",
      remainder: false,
      invited: false,
    },
    {
      id: 3,
      aliasName: "RE",
      contactName: "Ryan Ellis",
      contactNumber: 9876543210,
      backgroundColor: "#AE98D2",
      remainder: false,
      invited: false,
    },
    {
      id: 3,
      aliasName: "RE",
      contactName: "Ryan Ellis",
      contactNumber: 9876543210,
      backgroundColor: "#AE98D2",
      remainder: false,
      invited: false,
    },
  ];
  const [searchvalue, setSearchvalue] = useState("");
  const [contactlist, setContactlist] = useState("");
  const searchClick = () => {
    Alert.alert("search clicked");
  };
  const contactpermission = () => {
    if (Platform.OS === "android") {
      console.log("contact coming inside android");
      try {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
          {
            title: "Contacts",
            message: "This app would like to view your contacts.",
          }
        ).then((res) => {
          console.log("contact coming...", res);
          if (res == "granted") {
            loadContacts();
          } else {
            Alert.alert("permission denied for contact list");
          }
          //
        });
      } catch (e) {
        console.log("permisssion not given");
      }
    } else {
      loadContacts();
    }
  };
  const loadContacts = () => {
    console.log("load contact function");
    Contacts.getAll().then((contacts) => {
      console.log("contacts form", contacts.length);
      setContactlist(JSON.parse(contacts));
      // contacts returned
    });
  };
  useEffect(() => {
    contactpermission();
  }, []);
  console.log("contactlist", contactlist);
  return (
    <View style={styles.container}>
      <View style={styles.firstSection}>
        <HeaderwithArrow title="Invite Friends" />
        <View style={styles.invitegroup}>
          <View style={{ flex: 0.5 }}>
            <Image source={invite_friends} style={styles.inviteImg} />
          </View>
          <View style={styles.invitePara}>
            <Text style={styles.invitepara}>
              Earn 5 Coins For Each Invite You Send And 50 Coins If They Install
              Azzetta.
            </Text>
            <Text style={styles.knowtext}>know more</Text>
          </View>
        </View>
      </View>
      <View style={styles.secondSection}>
        <ScrollView>
          <View style={{ flexDirection: "row", paddingTop: 12 }}>
            <TouchableOpacity
              onPress={() => contactpermission()}
              style={styles.icongroup}
            >
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
          <SearchInput
            placeholder="search for name,number"
            value={searchvalue}
            onChangeText={(data) => setSearchvalue(data)}
            onPress={() => searchClick()}
          />

          {caontactList &&
            caontactList.map((contact) => {
              return (
                <View style={styles.contactGroup}>
                  <View style={{ flex: 0.2 }}>
                    <View
                      style={[
                        styles.contactIcon,
                        { backgroundColor: contact.backgroundColor },
                      ]}
                    >
                      <Text style={styles.contactIconText}>
                        {contact.aliasName}
                      </Text>
                    </View>
                    {contact.remainder && (
                      <Image
                        source={network_icon}
                        style={styles.network_icon}
                      />
                    )}
                  </View>
                  <View style={{ flex: 0.55 }}>
                    <View style={{ flexDirection: "column" }}>
                      <Text style={styles.contactName}>
                        {contact.contactName}
                      </Text>
                      <Text style={styles.contactnumber}>
                        {contact.contactNumber}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      flex: 0.25,
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {contact.invited ? (
                      <TouchableOpacity>
                        <Image
                          source={networkadded}
                          style={styles.netword_added_icon}
                        />
                      </TouchableOpacity>
                    ) : (
                      <ThemedButton
                        title="Invite"
                        mode="outlined"
                        buttonStyle={{ padding: 0, margin: 0 }}
                        labelStyle={{ fontSize: font12 }}
                        color={colorLightBlue}
                      ></ThemedButton>
                    )}
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
    </View>
  );
};
export default InviteFriends;
