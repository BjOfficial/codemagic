import React, { useEffect, useState } from "react";
import * as RN from "react-native";
import styles from "./style";
import { my_appliances, document_menu, my_remainders } from "@constants/Images";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  AddAssetNav,
  AddDocumentNav,
  AddReaminderNav,
} from "@navigation/NavigationConstant";
import BottomSheetComp from "@components/BottomSheetComp";
import { colorBlack } from "@constants/Colors";
const Add = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const navigation = useNavigation();
  const focused = useIsFocused();
  // if(focused){
  //   setModalVisible(true);
  // }
  const [menu] = useState([
    {
      name: "Add Appliances",
      icon: my_appliances,
      height: 20,
      width: 17,
      route: AddAssetNav,
    },
    {
      name: "Add Documents",
      icon: document_menu,
      height: 20,
      width: 16,
      route: AddDocumentNav,
    },
    {
      name: "Add Reminder",
      icon: my_remainders,
      height: 20,
      width: 17,
      route: AddReaminderNav,
    },
  ]);

  const goBack = () => {
    setModalVisible(false);
    navigation.goBack();
  };
  useEffect(() => {
    if (focused) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  }, [focused]);
  return (
    <RN.View style={styles.centeredView}>
      {/* <RN.Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}>
        <RN.View style={styles.centeredView}>
          <RN.View style={styles.modalView}>
            {menu.map((menu, index) => (
              <RN.TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(menu.route)}>
                <RN.View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    marginLeft: 20,
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Image
                      source={menu.icon}
                      style={{
                        height: menu.height,
                        width: menu.width,
                        marginTop: menu.marginTop,
                      }}
                    />
                  </RN.View>
                  <RN.View style={{ flex: 7 }}>
                    <RN.Text
                      style={{ fontFamily: "Rubik-Regular", fontSize: 15 }}>
                      {menu.name}
                    </RN.Text>
                  </RN.View>
                </RN.View>
              </RN.TouchableOpacity>
            ))}
          </RN.View>
        </RN.View>
      </RN.Modal> */}
      <BottomSheetComp
        panelStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
        sheetVisible={modalVisible}
        closePopup={() => goBack()}>
        {/* <RN.View style={styles.centeredView}> */}
        <RN.View style={styles.modalView}>
          {menu.map((menu, index) => {
            return (
              <RN.TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(menu.route)}>
                <RN.View
                  style={{
                    flexDirection: "row",
                    marginTop: 10,
                    marginLeft: 20,
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Image
                      source={menu.icon}
                      style={{
                        height: menu.height,
                        width: menu.width,
                        marginTop: menu.marginTop,
                      }}
                    />
                  </RN.View>
                  <RN.View style={{ flex: 7 }}>
                    <RN.Text
                      style={{
                        fontFamily: "Rubik-Regular",
                        fontSize: 15,
                        color: colorBlack,
                      }}>
                      {menu.name}
                    </RN.Text>
                  </RN.View>
                </RN.View>
              </RN.TouchableOpacity>
            );
          })}
        </RN.View>
        {/* </RN.View> */}
      </BottomSheetComp>
    </RN.View>
  );
};

export default Add;
