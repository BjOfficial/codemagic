import React,{useEffect, useState} from 'react';
import {NavigationContainer,useRoute,useNavigation} from '@react-navigation/native';
import {Text,View, Image} from "react-native";
import {createStackNavigator} from '@react-navigation/stack';
import {
dashboardNav
} from '@navigation/NavigationConstant';
import Dashboard from '@screens/Dashboard';

const Stack = createStackNavigator();

const SignInStack = (props) => {

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Dashboard}
        screenOptions={{headerShown: false}}>
       
        <Stack.Screen name={dashboardNav} component={Dashboard} />
        

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SignInStack;
