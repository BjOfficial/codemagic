import React from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider as PaperProvider } from "react-native-paper";
import AppNavigation from "@navigation/AppNavigation";

export default function App() {
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
