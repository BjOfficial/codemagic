import React,{useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {Text,View, Image} from "react-native";
import {createStackNavigator} from '@react-navigation/stack';
import {
  landingPageNav,
  loginNav,
  signupNav,forgotPasswordNav,PrivacyPolicyNav,TermsofuseNav,createpasswordNav
} from '@navigation/NavigationConstant';
// screens
import LandingPage from '@screens/LandingPage';
import Login from '@screens/Login';
import Signup from '@screens/Signup';
import ForgotPassword from '@screens/ForgotPassword';
import CreatePassword from '@screens/CreatePassword';
import PrivacyPolicy from '@screens/PrivacyPolicy';
import TermsOfUse from '@screens/TermsOfUse';

const Stack = createStackNavigator();
const SignOutStack = (props) => {
  // const deepLinking = {
  //   // http://18.224.15.118:3000/sessions/reset-password/
  //   // prefixes:['https://deepLinking.com', 'deepLinking://'],
  //   prefixes: [
  //     "http://188.166.228.50/",
  //     "myizppapp://",
  //   ],
  //   config: {
  //     CreatePassword: {
  //       path: "CreatePassword/:code",
  //       params: { code: null },
  //     },
  //   },
  // };

  const config = {
    screens: {
      CreatePassword: `${createpasswordNav}/:code`,
    },
  };
  const linking = {
    
    prefixes: [
      "http://188.166.228.50/",
      "myizppapp://",
      /* your linking prefixes */
    ],
    config
  };
console.log("props",props)
  return (

   
    // linking={deepLinking}
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName={landingPageNav}
        screenOptions={{headerShown: false}}>
        <Stack.Screen name={landingPageNav} component={LandingPage} />
        <Stack.Screen name={loginNav} component={Login} />
        <Stack.Screen name={signupNav} component={Signup} />
        <Stack.Screen name={forgotPasswordNav} component={ForgotPassword} />
        <Stack.Screen name={createpasswordNav} component={CreatePassword} />
        <Stack.Screen name={PrivacyPolicyNav} component={PrivacyPolicy} />
        <Stack.Screen name={TermsofuseNav} component={TermsOfUse} />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SignOutStack;
