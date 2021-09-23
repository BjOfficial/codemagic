import React, { useEffect, useState, createContext, Fragment } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, Image } from "react-native";
import SignOutStack from '@navigation/SignOutStack';
import SignInStack from '@navigation/SignInStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const AuthContext = createContext(null);
const AppNavigation = () => {
  const [token,setToken]=useState(null);
  const successCallback =(token)=>{
    console.log("app navigation token",token);
  }
  return (
    <Fragment>
      {!token&&
      <AuthContext.Provider value={{successCallback:successCallback}}>
      <SignOutStack />
      </AuthContext.Provider>
}
      {token&&
      <AuthContext.Provider  value={{token:token}}>
      <SignInStack />
      </AuthContext.Provider>
    }
    </Fragment>

  )
}
export default AppNavigation;
