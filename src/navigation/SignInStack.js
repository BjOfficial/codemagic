import React from "react";
import {
  ComingSoonNav,
  MyRewardsNav,
  AddLocationNav,
  EditLocationNav,
  MyProfileNav,
  dashboardNav,
} from "@navigation/NavigationConstant";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./DrawerNavigation";
import ComingSoon from "@screens/ComingSoon";
import MyRewards from "@screens/MyRewards/MyRewards";
import MyAssetsVintage from "@screens/MyassetsVintage/MyAssetsVintage";
import HomeStack from "./HomeStack";
import AddLocation from "@screens/AddLocation";
import EditLocation from "@screens/AddLocation/EditLocation";
import MyProfile from "@screens/Profile";
import MyTabs from "./BottomTabNaviagtion";
import Dashboard from "@screens/Dashboard";

const Drawer = createDrawerNavigator();

const SignInStack = (props) => {
  return (
    <Drawer.Navigator
      initialRouteName={MyTabs}
      screenOptions={{
        drawerStyle: {
          width: "90%",
        },
      }}
      drawerContent={(props) => <CustomDrawer {...props} />}>
      {/* <Drawer.Screen name={dashboardNav} component={Dashboard} /> */}
      <Drawer.Screen
        name="mytabs"
        component={MyTabs}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={ComingSoonNav}
        component={ComingSoon}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name={MyRewardsNav}
        component={MyRewards}
        options={{
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="MyAssetsVintage"
        component={MyAssetsVintage}
        options={{
          headerShown: false,
        }}
      />
    </Drawer.Navigator>
  );
};

export default SignInStack;
