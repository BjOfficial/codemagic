import * as RN from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";

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

export const alertToSettings = (alertContent) =>
  RN.Alert.alert("Permission required", alertContent, alertKeys);

const osCamera =
  RN.Platform.OS === "android"
    ? PERMISSIONS.ANDROID.CAMERA
    : PERMISSIONS.IOS.CAMERA;

export const cameraCheck = () => {
  check(osCamera)
    .then((result) => {
      AsyncStorage.setItem("cameraStatus", result);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const cameraPermission = () => {
  request(osCamera).then((result) => {
    AsyncStorage.setItem("cameraStatus", result);
  });
  cameraCheck();
};

const readPermission = () => {
  const osPermission =
    RN.Platform.OS === "android"
      ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      : PERMISSIONS.IOS.PHOTO_LIBRARY;
  request(osPermission).then((result) => {
    AsyncStorage.setItem("galleryStatus", result);
  });
};

const writePermission = () => {
  const osPermission =
    RN.Platform.OS === "android"
      ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
      : PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY;
  request(osPermission).then((res) => res);
};

export const storageCheck = () => {
  const osGallery =
    RN.Platform.OS === "android"
      ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
      : PERMISSIONS.IOS.PHOTO_LIBRARY;
  check(osGallery)
    .then((result) => {
      AsyncStorage.setItem("galleryStatus", result);
    })
    .catch((error) => {
      console.log(error);
    });
};

export const storagePermission = () => {
  readPermission();
  writePermission();
  storageCheck();
};
