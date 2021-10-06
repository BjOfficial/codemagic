import React from "react";
import {
  dashboardNav,
  invitefriendsNav,
  SearchContactNav,
  ApplianceMoreDetailsNav,
} from "@navigation/NavigationConstant";
import Dashboard from "@screens/Dashboard";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import InviteFriends from "@screens/InviteFriends";
import SearchContact from "@screens/InviteFriends/SearchContact";
import ApplianceMoreDetails from "@screens/Appliance/ApplianceMoreDetails";

const Stack = createStackNavigator();

const SignInStack = (props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Dashboard}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name={dashboardNav} component={Dashboard} />
        <Stack.Screen name={invitefriendsNav} component={InviteFriends} />
        <Stack.Screen name={SearchContactNav} component={SearchContact} />
        <Stack.Screen
          name={ApplianceMoreDetailsNav}
          component={ApplianceMoreDetails}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SignInStack;
