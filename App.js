import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import AppNavigation from "@navigation/AppNavigation";
import SplashScreen from "react-native-splash-screen";

export default function App() {
  useEffect(() => {
    if (Text.defaultProps == null) Text.defaultProps = {};
    Text.defaultProps.allowFontScaling = false;
    SplashScreen.hide();
  }, []);
  return (
    <View style={styles.container}>
      <SafeAreaProvider>
        <PaperProvider>
          <AppNavigation />
        </PaperProvider>
      </SafeAreaProvider>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
