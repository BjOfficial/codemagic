import StatusBar from "@components/StatusBar";
import ThemedButton from "@components/ThemedButton";
import { colorLightBlue } from "@constants/Colors";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import * as RN from "react-native";
import APIKit from "@utils/APIKit";
import style from "./styles";
import { AddAssetNav } from "@navigation/NavigationConstant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { constants } from "@utils/config";

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
    console.log(item);
    return (
      <RN.View key={index} style={{ marginTop: 10 }}>
        <RN.TouchableOpacity>
          {item.image[0] && item.image ? (
            <RN.Image
              source={{
                uri: "file:///" + item.image[0].path,
              }}
              style={{
                borderWidth: 1,
                height: RN.Dimensions.get("screen").height / 6,
                width: RN.Dimensions.get("screen").width / 4,
                marginLeft: 20,
                marginRight: 10,
                borderRadius: 20,
                paddingLeft: 5,
              }}
            />
          ) : null}
          <RN.Text style={{ alignSelf: "center" }}>
            {item.model.name ? item.model.name : item.model.other_value}
          </RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    );
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
      {applianceList.length > 0 ? (
        <RN.FlatList
          data={applianceList}
          renderItem={renderItem}
          numColumns={3}
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
    </RN.View>
  );
};

export default MyAssets;
