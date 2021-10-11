import StatusBar from "@components/StatusBar";
import ThemedButton from "@components/ThemedButton";
import { colorLightBlue, colorWhite } from "@constants/Colors";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import React, { useState, useEffect } from "react";
import * as RN from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIKit from "@utils/APIKit";
import style from "./styles";
import {
  AddDocumentNav,
  DocumentViewNav,
} from "@navigation/NavigationConstant";
import { constants } from "@utils/config";
import { no_image_icon } from "@constants/Images";
import { colorDropText } from "@constants/Colors";

const Documents = () => {
  const navigation = useNavigation();
  const [documentList, setDocumentList] = useState([]);
  useEffect(() => {
    listDocument();
  }, []);

  const listDocument = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(constants.listDocument);
    if (awaitlocationresp.status == 1) {
      setDocumentList(awaitlocationresp.data.data);
    } else {
      console.log("not listed location type");
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <RN.TouchableOpacity
        onPress={() => navigation.navigate(DocumentViewNav, { id: item._id })}>
        <RN.View
          style={{
            margin: 15,
            elevation: 12,
            marginBottom: 0,
            borderRadius: 10,
            backgroundColor: colorWhite,
            height: RN.Dimensions.get("screen").height / 7,
            width: RN.Dimensions.get("screen").width / 4,
          }}>
          {item.image[0] && item.image ? (
            <RN.ImageBackground
              source={{
                uri: "file:///" + item.image[0].path,
              }}
              imageStyle={{ borderRadius: 10 }}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 10,
              }}
              resizeMode="cover"></RN.ImageBackground>
          ) : (
            <RN.ImageBackground
              source={no_image_icon}
              style={{
                height: "100%",
                width: "100%",
              }}
              resizeMode="contain"></RN.ImageBackground>
          )}
        </RN.View>
        <RN.View
          style={{
            width: RN.Dimensions.get("screen").width / 4,
            marginHorizontal: 15,
            marginTop: 5,
          }}>
          <RN.Text
            style={{
              width: "100%",
              fontFamily: "Rubik-Medium",
              textAlign: "center",
              color: colorDropText,
              fontSize: 12,
              marginVertical: 5,
            }}
            numberOfLines={2}>
            {item.document_type.name
              ? item.document_type.name
              : item.document_type.other_value}
          </RN.Text>
        </RN.View>
      </RN.TouchableOpacity>
      // </RN.View>
    );
  };

  const navigateToAddDocument = () => {
    navigation.navigate(AddDocumentNav);
  };
  const DrawerScreen = () => {
    return navigation.dispatch(DrawerActions.toggleDrawer());
  };

  // console.log('documentList', documentList);
  return (
    <RN.View style={style.container}>
      <RN.ScrollView>
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
                <RN.Text style={style.navbarName}>{"My Documents "}</RN.Text>
              </RN.TouchableOpacity>
            </RN.View>
          </RN.View>
        </RN.View>
        {documentList.length > 0 ? (
          <RN.FlatList
            data={documentList}
            renderItem={renderItem}
            numColumns={3}
          />
        ) : (
          <RN.View style={style.center}>
            <RN.Image
              source={require("../../assets/images/emptyStates/adddocument.png")}
              style={style.image}
            />
            <RN.Text style={style.text}>
              {"Be on Top of all renwals of documents"}
            </RN.Text>
            <RN.Text style={style.text}>{"and payments"}</RN.Text>
            <RN.TouchableOpacity onPress={() => navigateToAddDocument()}>
              <ThemedButton
                title="+ Add Document"
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

export default Documents;
