import React, { useEffect, useState, createContext, Fragment } from "react";
import { View, ActivityIndicator } from "react-native";
import SignOutStack from "@navigation/SignOutStack";
import SignInStack from "@navigation/SignInStack";
import AsyncStorage from "@react-native-async-storage/async-storage";
export const AuthContext = createContext(null);
const AppNavigation = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState("hide");
  const [user, setUser] = useState(null);

  const callout_loading = () => {
    setTimeout(() => {
      setLoading(null);
    }, 500);
  };
  const retriveData = async () => {
    setLoading("show");
    const getToken = await AsyncStorage.getItem("loginToken");
    setToken(getToken);
    callout_loading();
  };
  useEffect(() => {
    retriveData();
  }, []);
  const successCallback = ({ user, token }) => {
    setUser(user);
    setLoading("show");
    setToken(token);
    setTimeout(() => {
      setLoading(null);
    }, 500);
  };
  const logoutCallback = () => {
    setLoading("show");
    setToken(null);
    setUser(null);
    setTimeout(() => {
      setLoading(null);
    }, 500);
  };
  return (
    <Fragment>
      {loading == "show" && (
        <View
          style={{
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
          }}>
          <ActivityIndicator color="#49a58d" size="large" />
        </View>
      )}
      {!user && !loading && (
        <AuthContext.Provider value={{ successCallback: successCallback }}>
          <SignOutStack />
        </AuthContext.Provider>
      )}
      {user && token && !loading && (
        <AuthContext.Provider
          value={{
            token: token,
            userDetails: user,
            logout_Call: logoutCallback,
          }}>
          <SignInStack />
        </AuthContext.Provider>
      )}
    </Fragment>
  );
};
export default AppNavigation;
