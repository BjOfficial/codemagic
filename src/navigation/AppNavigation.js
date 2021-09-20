import React,{useEffect, useState,createContext,Fragment} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import ThemedButton from '@components/ThemedButton';
import LandingPage from '@screens/LandingPage';
import CreateAccount from '@screens/CreateAccount';
import RequestInvite from '@screens/RequestInvite';
import Verification from '@screens/Verification';
import Login from '@screens/Login';
import ForgotPassword from '@screens/ForgotPassword';
import CreatePassword from '@screens/CreatePassword';
import {
  landingPageNav,createAccountNav,requestInviteNav,verificationNav,loginNav,forgotpasswordNav,createpasswordNav
 } from '@navigation/NavigationConstant';
 const Stack = createStackNavigator();
const AppNavigation = () => {
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName={landingPageNav} screenOptions={{
    headerShown: false
  }}>
        <Stack.Screen name={landingPageNav} component={LandingPage} />
        <Stack.Screen name={createAccountNav} component={CreateAccount} />
        <Stack.Screen name={requestInviteNav} component={RequestInvite} />
        <Stack.Screen name={verificationNav} component={Verification} />
        <Stack.Screen name={loginNav} component={Login} />
        <Stack.Screen name={forgotpasswordNav} component={ForgotPassword} />
        <Stack.Screen name={createpasswordNav} component={CreatePassword} />
      </Stack.Navigator>
    </NavigationContainer>

  )
  }
export default AppNavigation;
