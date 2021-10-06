import StatusBar from "@components/StatusBar";
import ThemedButton from "@components/ThemedButton";
import { colorLightBlue } from "@constants/Colors";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import React from "react";
import * as RN from "react-native";

import style from "./styles";
import { AddAssetNav } from "@navigation/NavigationConstant";

const MyAssets = () => {
  const navigation = useNavigation();
  const navigateToAddAsset = () => {
    navigation.navigate(AddAssetNav);
  };
  const DrawerScreen = () => {
    return navigation.dispatch(DrawerActions.toggleDrawer());
  };
  return (
    <RN.View>
      <StatusBar />
      <RN.View style={style.navbar}>
        <RN.View style={style.navbarRow}>
          <RN.TouchableOpacity
            onPress={() => {
              DrawerScreen();
            }}>
            <RN.View style={{ flex: 1 }}>
              <RN.Image
                source={require("../../assets/images/home/menu.png")}
                style={style.notificationIcon}
              />
            </RN.View>
          </RN.TouchableOpacity>
          <RN.View style={{ flex: 1 }}>
            <RN.TouchableOpacity>
              <RN.Text style={style.navbarName}>{"My Assets "}</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
        </RN.View>
      </RN.View>
      <RN.View style={style.center}>
        <RN.Image
          source={require("../../assets/images/emptyStates/addasset.png")}
          style={style.image}
        />
        <RN.Text style={style.text}>
          {"Manage your Assets like an Expert"}
        </RN.Text>
        <RN.TouchableOpacity onPress={() => navigateToAddAsset()}>
          <ThemedButton
            title="+ Add Asset"
            mode="outline"
            color={colorLightBlue}
            buttonStyle={{ marginTop: 20 }}
            btnStyle={{ fontFamily: "Rubik-Medium" }}></ThemedButton>
        </RN.TouchableOpacity>
      </RN.View>
    </RN.View>
  );
};

export default MyAssets;
