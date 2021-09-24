import React, { useEffect, useState, createContext, Fragment } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, View, Image ,ActivityIndicator} from "react-native";
import SignOutStack from '@navigation/SignOutStack';
import SignInStack from '@navigation/SignInStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const AuthContext = createContext(null);
const AppNavigation = () => {
  const [token,setToken]=useState(null);
  const [loading,setLoading]=useState('hide');
  const retriveData =async()=>{
    setLoading('show')
    const getToken=await AsyncStorage.getItem("loginToken");
    setToken(getToken);
    if(getToken){
      setTimeout(()=>{
        setLoading(null)
      },500)
    }else{
      setTimeout(()=>{
        setLoading(null)
      },500)
    }
  }
  useEffect(()=>{
retriveData();
  },[])
  const successCallback =(token)=>{
    setLoading('show');
    setToken(token);
    setTimeout(()=>{
      setLoading(null)
    },500)
  }
 const logoutCallback =()=>{
  setLoading('show');
   setToken(null);
   setTimeout(()=>{
    setLoading(null)
  },500)
 }
  return (
    <Fragment>
      {loading=='show'&&
      <View style={{flex:1,alignItems:'center',justifyContent:'center'}}>
    <ActivityIndicator color="#49a58d" size="large"/>
    </View>
      }
      {(!token&&!loading)&&
      <AuthContext.Provider value={{successCallback:successCallback}}>
      <SignOutStack />
      </AuthContext.Provider>
}
      {(token&&!loading)&&
      <AuthContext.Provider  value={{token:token,logout_Call:logoutCallback}}>
      <SignInStack />
      </AuthContext.Provider>
    }
    </Fragment>

  )
}
export default AppNavigation;
