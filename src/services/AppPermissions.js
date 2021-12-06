import * as RN from 'react-native';
import { check, request, PERMISSIONS } from 'react-native-permissions';
import AsyncStorage from '@react-native-async-storage/async-storage';

const handleOpenSettings = () => {
  RN.Linking.openSettings();
  // if (RN.Platform.OS === "ios") {
  //   RN.Linking.openURL("app-settings:");
  // } else {
  //   RN.Linking.openSettings();
  // }
};

let camResult, storageResult, contactResult;

const alertKeys = [
  { text: 'Not Now', onPress: () => console.log('Cancel Pressed!') },
  { text: 'Settings', onPress: handleOpenSettings },
];

export const galleryText =
  'To capture photos or upload files, allow Azzetta access to your camera and your device\'s photos and files. Go to your device\'s Settings > Permissions, and turn Camera on and Storage on.';
export const contactText =
  'To help you invite friends and family on Azzetta, allow Azzetta access to your contacts. Go to your device\'s Settings > Permissions, and turn Contacts on.';
export const storageText =
  'To upload or display photos/files for assets or documents, allow Azzetta access to your device\'s photos and files. Go to your device’s Settings > Permissions, and turn Storage on.';
export const alertToSettings = (alertContent) =>
  RN.Alert.alert('Permission required', alertContent, alertKeys);

const osCamera =
  RN.Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.CAMERA
    : PERMISSIONS.IOS.CAMERA;

const osStorage =
  RN.Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE
    : PERMISSIONS.IOS.PHOTO_LIBRARY;

const osContact =
  RN.Platform.OS === 'android'
    ? PERMISSIONS.ANDROID.READ_CONTACTS
    : PERMISSIONS.IOS.CONTACTS;

export const cameraCheck = (props) => {
  check(osCamera).then((result) => {
    camResult = result;
  });
};

export const cameraPermission = () => {
  request(osCamera).then((result) => {
    camResult = result;
    if (camResult !== 'granted') {
      cameraCheck();
    }
  });
};

export const storageCheck = () => {
  check(osStorage).then((result) => {
    storageResult = result;
  });
};

export const storagePermission = () => {
  request(osStorage).then((result) => {
    storageResult = result;
    if (storageResult !== 'granted') {
      storageCheck();
    }
  });
};

export const storageInitial = () => {
  request(osStorage).then((result) => {
    storageResult = result;
    if (storageResult !== 'granted') {
      storageCheck();
    }
    if (storageResult === 'blocked' || storageResult === 'denied') {
      alertToSettings(storageText);
    }
  });
};

export const cameraAndStorage = () => {
  cameraPermission();
  storagePermission();
  AsyncStorage.setItem('cameraStatus', camResult);
  AsyncStorage.setItem('galleryStatus', storageResult);
  if (
    (camResult === 'blocked' || camResult === 'denied') &&
    (storageResult === 'blocked' || storageResult === 'denied')
  ) {
    alertToSettings(galleryText);
  }
};

const ContactCheck = () => {
  check(osContact).then((result) => {
    contactResult = result;
    AsyncStorage.setItem('contactStatus', contactResult);
    if (contactResult === 'blocked' || contactResult === 'denied') {
      alertToSettings(contactText);
    }
  });
};

export const readContact = () => {
  request(osContact).then((result) => {
    if (result !== 'granted') {
      ContactCheck();
    }
  });
};
