import React from "react";
import { ComingSoonNav, MyRewardsNav } from "@navigation/NavigationConstant";
import { NavigationContainer } from "@react-navigation/native";   
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./DrawerNavigation";
import ComingSoon from "@screens/ComingSoon";
import MyRewards from "@screens/MyRewards/MyRewards"
import MyAssetsVintage from "@screens/MyassetsVintage/MyAssetsVintage";
import HomeStack from "./HomeStack";  

const Drawer = createDrawerNavigator();

const SignInStack = (props) => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName={HomeStack}
        screenOptions={{
          drawerStyle: {
            width: "90%",
          },
        }}
        drawerContent={(props) => <CustomDrawer {...props} />}>
        <Drawer.Screen
          name="HomeStack"
          component={HomeStack}
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
    </NavigationContainer>
  );
};

export default SignInStack;
