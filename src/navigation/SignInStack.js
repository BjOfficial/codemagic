import React from "react";
import {
  invitefriendsNav,
  SearchContactNav,
  AddDocumentNav,
  AddAssetNav,
  DocumentViewNav,
  MyAppliancesNav,
  AddReaminderNav,
  ApplianceMoreDetailsNav,
} from "@navigation/NavigationConstant";
import { NavigationContainer } from "@react-navigation/native";
import InviteFriends from "@screens/InviteFriends";
import SearchContact from "@screens/InviteFriends/SearchContact";
import MyTabs from "./BottomTabNaviagtion";
import AddDocument from "@screens/AddDocument";
import AddAsset from "@screens/AddAssets";
import DocumentView from "@screens/DocumentView";
import ApplianceMoreDetails from "@screens/Appliance/ApplianceMoreDetails";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./DrawerNavigation";
import MyAppliances from "@screens/MyAppliances/myAppliances";
import AddRemainders from "@screens/AddRemainders";
import ComingSoon from "@screens/ComingSoon/comingSoon";
import Delegate from "@screens/ComingSoon/Delegate";
import LocalBusiness from "@screens/ComingSoon/LocalBusiness";
import MyAssetsVintage from "@screens/ComingSoon/MyAssestsVintage";
import MyResale from "@screens/ComingSoon/MyResale";
import MyRewards from "@screens/ComingSoon/MyRewards";

const Drawer = createDrawerNavigator();

const SignInStack = (props) => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName={MyTabs}
        drawerContent={(props) => <CustomDrawer {...props} />}>
        <Drawer.Screen
          name="bottomTab"
          component={MyTabs}
          options={{
            headerShown: false,
          }}
        />

        <Drawer.Screen
          name={AddDocumentNav}
          component={AddDocument}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name={AddReaminderNav}
          component={AddRemainders}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name={AddAssetNav}
          component={AddAsset}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name={DocumentViewNav}
          component={DocumentView}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name={SearchContactNav}
          component={SearchContact}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name={invitefriendsNav}
          component={InviteFriends}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name={MyAppliancesNav}
          component={MyAppliances}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name={ApplianceMoreDetailsNav}
          component={ApplianceMoreDetails}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="ComingSoon"
          component={ComingSoon}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="Delegate"
          component={Delegate}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="LocalBusiness"
          component={LocalBusiness}
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
        <Drawer.Screen
          name="MyResale"
          component={MyResale}
          options={{
            headerShown: false,
          }}
        />
        <Drawer.Screen
          name="MyRewards"
          component={MyRewards}
          options={{
            headerShown: false,
          }}
        />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default SignInStack;
