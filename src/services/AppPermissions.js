import * as RN from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const handleOpenSettings = () => {
  if (RN.Platform.OS === "ios") {
    RN.Linking.openURL("app-settings:");
  } else {
    RN.Linking.openSettings();
  }
};

const alertKeys = [
  { text: "Not Now", onPress: () => console.log("Cancel Pressed!") },
  { text: "Settings", onPress: handleOpenSettings },
];

export const cameraText =
  "To capture photos, allow Azzetta access to your camera and your device's photos and files. Go to your device’s Settings > Permissions, and turn Camera on and Storage on.";
export const galleryText =
  "To upload or display photos/files for assets or documents, allow Azzetta access to your device's photos and files. Go to your device’s Settings > Permissions, and turn Storage on.";
export const contactText =
  "To help you invite friends and family on Azzetta, allow Azzetta access to your contacts. Go to your device's Settings > Permissions, and turn Contacts on.";

export const alertToSettings = (alertContent) =>
  RN.Alert.alert("Permission required", alertContent, alertKeys);

const osCamera =
  RN.Platform.OS === "android"
    ? PERMISSIONS.ANDROID.CAMERA
    : PERMISSIONS.IOS.CAMERA;

export const cameraPermission = () => {
  request(osCamera).then((res) => res);
};

export const cameraCheck = (props) => {
  check(osCamera).then((result) => {
    console.log(result, "os camera");
    if (result === "blocked" || result === "denied") {
      alertToSettings(cameraText);
    }
    AsyncStorage.setItem("cameraStatus", result);
  });
};

const readPermission = (props) => {
  const osPermission =
    RN.Platform.OS === "android"
      ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      : PERMISSIONS.IOS.PHOTO_LIBRARY;
  request(osPermission).then((res) => {
    // props.storageCta(result);
  });
};

const writePermission = () => {
  const osPermission =
    RN.Platform.OS === "android"
      ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      : PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY;
  request(osPermission).then((res) => res);
};

export const storageCheck = (props) => {
  const osGallery =
    RN.Platform.OS === "android"
      ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      : PERMISSIONS.IOS.PHOTO_LIBRARY;
  check(osGallery).then((result) => {
    if (result === "blocked" || result === "denied") {
      alertToSettings(galleryText);
    }
    AsyncStorage.setItem("galleryStatus", result);
  });
};

export const storagePermission = () => {
  readPermission();
  writePermission();
};

const osContact =
  RN.Platform.OS === "android"
    ? PERMISSIONS.ANDROID.READ_CONTACTS
    : PERMISSIONS.IOS.CONTACTS;

const readContact = () => {
  request(osContact).then((res) => res);
};

export const ContactCheck = (props) => {
  check(osContact).then((res) => {
    props.contactCta(res);
  });
  return null;
};
