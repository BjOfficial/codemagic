import StatusBar from "@components/StatusBar";
import ThemedButton from "@components/ThemedButton";
import { colorLightBlue } from "@constants/Colors";
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
      <RN.View
        key={index}
        style={{ flex: 1, marginLeft: 5, marginTop: 20, marginBottom: 20 }}>
        <RN.TouchableOpacity
          onPress={() =>
            navigation.navigate(DocumentViewNav, { id: item._id })
          }>
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
          ) : (
            <RN.Image
              source={require("../../assets/images/home/placeholder.jpg")}
              style={{
                borderWidth: 1,
                height: RN.Dimensions.get("screen").height / 6,
                width: RN.Dimensions.get("screen").width / 4,
                marginLeft: 20,
                marginRight: 10,
                borderRadius: 20,
              }}
            />
          )}
          <RN.Text style={{ marginLeft: 20, fontFamily: "Rubik-Regular" }}>
            {item.document_type.name
              ? item.document_type.name
              : item.document_type.other_value}
          </RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
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
    <RN.View>
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
