import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LandingPage from "@screens/LandingPage";
import CreateAccount from "@screens/CreateAccount";
import RequestInvite from "@screens/RequestInvite";
import Verification from "@screens/Verification";
import Login from "@screens/Login";
import ForgotPassword from "@screens/ForgotPassword";
import CreatePassword from "@screens/CreatePassword";
import InviteFriends from "@screens/InviteFriends";
import {
  landingPageNav,
  createAccountNav,
  requestInviteNav,
  verificationNav,
  loginNav,
  forgotpasswordNav,
  invitefriendsNav,
} from "@navigation/NavigationConstant";
const Stack = createStackNavigator();
const SignOutStack = () => {
  const config = {
    screens: {
      CreatePassword: "CreatePassword/:code",
    },
  };
  const linking = {
    prefixes: [
      "http://188.166.228.50/",
      "myassetta://",
      /* your linking prefixes */
    ],
    config,
  };
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName={landingPageNav}
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name={landingPageNav} component={LandingPage} />
        <Stack.Screen name={createAccountNav} component={CreateAccount} />
        <Stack.Screen name={requestInviteNav} component={RequestInvite} />
        <Stack.Screen name={verificationNav} component={Verification} />
        <Stack.Screen name={loginNav} component={Login} />
        <Stack.Screen name={forgotpasswordNav} component={ForgotPassword} />
        <Stack.Screen name="CreatePassword" component={CreatePassword} />
        <Stack.Screen name={invitefriendsNav} component={InviteFriends} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default SignOutStack;
