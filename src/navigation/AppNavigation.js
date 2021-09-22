import React, { useEffect, useState, createContext, Fragment } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, Image } from "react-native";
import SignOutStack from '@navigation/SignOutStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
const AppNavigation = () => {
  return (
    <Fragment>
      <SignOutStack />
    </Fragment>

  )
}
export default AppNavigation;
