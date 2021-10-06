import StatusBar from "@components/StatusBar";
import ThemedButton from "@components/ThemedButton";
import { colorLightBlue, colorWhite } from "@constants/Colors";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import React from "react";
import * as RN from "react-native";
import { home_icon } from "@constants/Images";
import AntDesign from "react-native-vector-icons/AntDesign";
import style from "./styles";

const MyAssets = () => {
  const navigation = useNavigation();

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
              <RN.Image source={home_icon} style={style.notificationIcon} />
            </RN.View>
          </RN.TouchableOpacity>
          <RN.View style={{ flex: 1 }}>
            <RN.TouchableOpacity>
              <RN.Text style={style.navbarName}>{"My Remainders "}</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
          <RN.View style={{ flex: 0 }}>
            <RN.TouchableOpacity>
              <AntDesign
                name="calendar"
                color={colorWhite}
                size={22}
                style={{ margin: 17 }}
              />
            </RN.TouchableOpacity>
          </RN.View>
        </RN.View>
      </RN.View>
      <RN.View style={style.center}>
        <RN.Image
          source={require("../../assets/images/emptyStates/addreminder.png")}
          style={style.image}
        />
        <RN.Text style={style.text}>{"Set Alerts for Remainders"}</RN.Text>
        <RN.TouchableOpacity onPress={() => navigation.navigate("AddDocument")}>
          <ThemedButton
            title="+ Add Remainder"
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
