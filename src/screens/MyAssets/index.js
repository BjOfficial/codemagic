import StatusBar from "@components/StatusBar";
import ThemedButton from "@components/ThemedButton";
import { colorAsh, colorLightBlue, colorWhite } from "@constants/Colors";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import * as RN from "react-native";
import APIKit from "@utils/APIKit";
import style from "./styles";
import { AddAssetNav } from "@navigation/NavigationConstant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { constants } from "@utils/config";
import moment from "moment";

const MyAssets = () => {
  const navigation = useNavigation();
  const navigateToAddAsset = () => {
    navigation.navigate(AddAssetNav);
  };
  const [applianceList, setApplianceList] = useState([]);
  useEffect(() => {
    listDocument();
  }, []);

  const listDocument = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(constants.listAppliance);
    if (awaitlocationresp.status == 1) {
      setApplianceList(awaitlocationresp.data.data);
    } else {
      console.log("not listed location type");
    }
  };
  const DrawerScreen = () => {
    return navigation.dispatch(DrawerActions.toggleDrawer());
  };
  const renderItem = ({ item, index }) => {
    console.log("item", item);
    return (
      <RN.View key={index} style={{ flex: 1, margin: 5 }}>
        <RN.TouchableOpacity
          style={{
            height: RN.Dimensions.get("screen").height * 0.3,
            width: RN.Dimensions.get("window").width * 0.45,
            backgroundColor: colorWhite,
            borderRadius: 20,
          }}>
          {item.image[0] && item.image ? (
            <RN.Image
              source={{
                uri: "file:///" + item.image[0].path,
              }}
              style={{
                borderWidth: 1,
                height: RN.Dimensions.get("screen").height / 8,
                width: RN.Dimensions.get("screen").width * 0.4,
                borderRadius: 20,
                marginTop: 20,
                marginLeft: 10,
              }}
            />
          ) : null}
          <RN.Text
            style={{
              fontFamily: "Rubik-Regular",
              paddingLeft: 20,
              marginTop: 20,
            }}>
            {item.type.name ? item.type.name : item.type.other_value}
          </RN.Text>
          <RN.Text
            style={{
              fontFamily: "Rubik-Regular",
              paddingLeft: 20,
              marginTop: 5,
              color: colorAsh,
              fontSize: 12,
              marginBottom: 5,
            }}>
            {item.model.name ? item.model.name : item.model.other_value}
          </RN.Text>
          <RN.View
            style={{
              borderBottomColor: colorAsh,
              borderBottomWidth: 0.5,
            }}
          />
          <RN.View style={{ flexDirection: "row" }}>
            <RN.View style={{ flex: 1 }}>
              <RN.Image
                source={require("../../assets/images/home/expirycalender.png")}
                style={{ height: 22, width: 20, marginTop: 10, marginLeft: 20 }}
              />
            </RN.View>
            <RN.View style={{ flex: 2.3 }}>
              <RN.Text
                style={{
                  color: "#8a520d",
                  fontFamily: "Rubik-Regular",
                  marginTop: 15,
                }}>
                {moment(new Date(item.purchase_date)).format("DD/MM/YYYY")}
              </RN.Text>
            </RN.View>
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
    );
  };

  return (
    <RN.View>
      <StatusBar />
      <RN.ScrollView>
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
        {applianceList.length > 0 ? (
          <RN.FlatList
            style={{ marginBottom: 80, marginLeft: 5, marginTop: 10 }}
            data={applianceList}
            renderItem={renderItem}
            numColumns={2}
          />
        ) : (
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
        )}
      </RN.ScrollView>
    </RN.View>
  );
};

export default MyAssets;
