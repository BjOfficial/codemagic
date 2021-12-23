import React, { useEffect, useState, createContext, Fragment } from 'react';
import { View, ActivityIndicator } from 'react-native';
import SignOutStack from '@navigation/SignOutStack';
import SignInStack from '@navigation/SignInStack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo,{useNetInfo} from '@react-native-community/netinfo';
import {
	landingPageNav,
	createAccountNav,
	requestInviteNav,
	verificationNav,
	loginNav,
	forgotpasswordNav,
	invitefriendsNav,
	PrivacyPolicyNav,
	TermsConditionsNav,
	AddLocationNav,
	HomeStackNav
} from '@navigation/NavigationConstant';
import PouchDBHandler from '@utils/PouchDB';
export const AuthContext = createContext(null);
const AppNavigation = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState('hide');
  const [connected, setconnected] = useState(false);
  const [user, setUser] = useState(null);
  const [addVisible, setAddVisible] = useState(false);
  const [refreshDrawer, setRefreshDrawer] = useState(false);
  const [locationID, setLocationID] = useState(null);
  const [initialRoute, setInitialRoute] = useState(landingPageNav);
  const netInfo = useNetInfo();
  const callout_loading = () => {
    setTimeout(() => {
      setLoading(null);
    }, 500);
  };
  const retriveData = async () => {
    setLoading('show');
    const getToken = await AsyncStorage.getItem('loginToken');
    setToken(getToken);
    callout_loading();
  };
  useEffect(()=>{
    console.log("networkinfostatus123 ====",netInfo);
    setconnected(netInfo.isInternetReachable);
  },[netInfo])
	
  useEffect(() =>{
    (async () => {
      retriveData();
      const getUser = await AsyncStorage.getItem('userDetails');
      setUser(getUser);
    })();
  }, []);
  const successCallback = ({ user, token }) => {
    setUser(user);
    setLoading('show');
    setToken(token);
    setTimeout(() => {
      setLoading(null);
    }, 500);
  };
  const logoutCallback = (initial_route=null) => {
    if(initial_route){
      setInitialRoute(initial_route)
    }
    setLoading('show');
    setToken(null);
    setUser(null);
    setTimeout(() => {
      setLoading(null);
    }, 500);
  };
  return (
    <PouchDBHandler>
      {loading == 'show' && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <ActivityIndicator color="#49a58d" size="large" />
        </View>
      )}
      {!token && !loading && (
        <AuthContext.Provider  value={{ successCallback: successCallback,networkStatus:connected }} >
          <SignOutStack initialRouteName={initialRoute} />
        </AuthContext.Provider>
      )}
      {token && !loading && (
        <AuthContext.Provider
          value={{
            token: token,
            userDetails: user,
            logout_Call: logoutCallback,
            networkStatus:connected,
            addVisible:addVisible,
            setAddVisible:setAddVisible,
            refreshDrawer:refreshDrawer,
            setRefreshDrawer:setRefreshDrawer,
            locationID:locationID,
            setLocationID:setLocationID
          }}>
          <SignInStack />
        </AuthContext.Provider>
      )}
    </PouchDBHandler>
  );
};
export default AppNavigation;



