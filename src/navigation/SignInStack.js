import React from "react";
import { dashboardNav, invitefriendsNav } from "@navigation/NavigationConstant";
import Dashboard from "@screens/Dashboard";
import InviteFriends from "@screens/InviteFriends";

const Stack = createStackNavigator();

const SignInStack = (props) => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={Dashboard}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name={dashboardNav} component={Dashboard} />
        <Stack.Screen name={invitefriendsNav} component={InviteFriends} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SignInStack;
