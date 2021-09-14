import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import ThemedButton from '@components/ThemedButton';
import {colorFBBlue} from '@constants/Colors';
import LandingPage from '@screens/LandingPage';
export default function App() {

  return (
    <View style={styles.container}>
        <LandingPage/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    
  }
});
