<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import {
dashboardNav,invitefriendsNav,SearchContactNav
} from '@navigation/NavigationConstant';
import Dashboard from '@screens/Dashboard';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import InviteFriends from '@screens/InviteFriends';
import SearchContact from '@screens/InviteFriends/SearchContact';
=======
import React from "react";
import { dashboardNav, invitefriendsNav } from "@navigation/NavigationConstant";
import Dashboard from "@screens/Dashboard";
import InviteFriends from "@screens/InviteFriends";
>>>>>>> 5990a2432d310bc60eee4d842886fbb97c2e1be3

const Stack = createStackNavigator();

const SignInStack = (props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Dashboard}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name={dashboardNav} component={Dashboard} />
        <Stack.Screen name={invitefriendsNav} component={InviteFriends} />
<<<<<<< HEAD
        <Stack.Screen name={SearchContactNav} component={SearchContact} />
        

=======
>>>>>>> 5990a2432d310bc60eee4d842886fbb97c2e1be3
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SignInStack;
