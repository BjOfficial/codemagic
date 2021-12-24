import React, { useEffect } from "react";
import { Appearance, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import AppNavigation from "@navigation/AppNavigation";
import SplashScreen from "react-native-splash-screen";
import { colorBlack } from "@constants/Colors";
import { Provider as StoreProvider } from 'react-redux';

import storeData from '@reduxDir/store';

export default function App() {
  
  useEffect(() => {
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    SplashScreen.hide();
    // dispatch(getContactData());
  }, []);
  const colorScheme = Appearance.getColorScheme();
  if (colorScheme === "dark") {
    <View style={{ color: colorBlack }} />;
  }
  return (
     <StoreProvider store={storeData}>
    <View style={styles.container}>
      <SafeAreaProvider>
        <PaperProvider>
          <AppNavigation />
        </PaperProvider>
      </SafeAreaProvider>
    </View>
    </StoreProvider>
     
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
