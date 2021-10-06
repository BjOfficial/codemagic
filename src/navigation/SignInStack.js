import React from "react";
import {
  invitefriendsNav,
  SearchContactNav,
  AddDocumentNav,
  AddAssetNav,
  DocumentViewNav,
} from "@navigation/NavigationConstant";
import { NavigationContainer } from "@react-navigation/native";
import InviteFriends from "@screens/InviteFriends";
import SearchContact from "@screens/InviteFriends/SearchContact";
import MyTabs from "./BottomTabNaviagtion";
import AddDocument from "@screens/AddDocument";
import AddAsset from "@screens/AddAssets";
import DocumentView from "@screens/DocumentView";
import { createDrawerNavigator } from "@react-navigation/drawer";
import CustomDrawer from "./DrawerNavigation";

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
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default SignInStack;
