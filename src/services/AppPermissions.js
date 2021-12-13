import * as RN from "react-native";
import {
  check,
  requestMultiple,
  PERMISSIONS,
} from "react-native-permissions";
import AsyncStorage from "@react-native-async-storage/async-storage";

const alertKeys = [
  { text: "Not Now", onPress: () => console.log("Cancel Pressed!") },
  { text: "Settings", onPress: () => RN.Linking.openSettings() },
];

export const galleryText =
  "To capture photos or upload files, allow Azzetta access to your camera and your device's photos and files. Go to your device's Settings > Permissions, and turn Camera on and Storage on.";
export const contactText =
  "To help you invite friends and family on Azzetta, allow Azzetta access to your contacts. Go to your device's Settings > Permissions, and turn Contacts on.";
export const storageText =
  "To upload or display photos/files for assets or documents, allow Azzetta access to your device's photos and files. Go to your device’s Settings > Permissions, and turn Storage on.";
export const alertToSettings = (alertContent) =>
  RN.Alert.alert("Permission required", alertContent, alertKeys);

const osCamera =
  RN.Platform.OS === "android"
    ? PERMISSIONS.ANDROID.CAMERA
    : PERMISSIONS.IOS.CAMERA;

const osStorage =
  RN.Platform.OS === "android"
    ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    : PERMISSIONS.IOS.PHOTO_LIBRARY;

const osStorageWrite =
  RN.Platform.OS === "android"
    ? PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE
    : PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY;

export const cameraCheck = (props) => {
  check(osCamera);
};

export const storageCheck = () => {
  check(osStorage);
};

export const cameraAndStorage = () => {
  requestMultiple([osCamera, osStorage]).then((statuses) => {
    AsyncStorage.setItem("cameraStatus", statuses[osCamera]);
    AsyncStorage.setItem("galleryStatus", statuses[osStorage]);
    if (statuses[osCamera] === "blocked" || statuses[osStorage] === "blocked") {
      alertToSettings(galleryText);
    }
  });
};

export const storagePermission = () => {
  requestMultiple([osStorage, osStorageWrite]).then((statuses) => {
    AsyncStorage.setItem("galleryStatus", statuses[osStorage]);
    if (
      statuses[osStorage] === "blocked" ||
      statuses[osStorageWrite] === "blocked"
    ) {
      alertToSettings(storageText);
    }
  });
};
