import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {Provider as PaperProvider} from 'react-native-paper';
import AppNavigation from '@navigation/AppNavigation';
import LandingPage from '@screens/LandingPage';
import ThemedButton from '@components/ThemedButton';
import {colorFBBlue} from '@constants/Colors';
import BottomTabNavigation from '@navigation/BottomTabNaviagtion';


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
