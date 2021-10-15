import React, { useEffect, useState } from "react";
import * as RN from "react-native";
import styles from "./style";
import { my_appliances, document_menu, my_remainders } from "@constants/Images";
import { useNavigation } from "@react-navigation/native";
import { AddAssetNav, AddDocumentNav } from "@navigation/NavigationConstant";

const Add = () => {
  const [modalVisible, setModalVisible] = useState(true);
  const navigation = useNavigation();
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
      name: "Add Reminders",
      icon: my_remainders,
      height: 20,
      width: 17,
    },
  ]);
  useEffect(() => {
    setModalVisible(true);
  }, []);
  return (
    <RN.View style={styles.centeredView}>
      <RN.Modal
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
      </RN.Modal>
    </RN.View>
  );
};

export default Add;
