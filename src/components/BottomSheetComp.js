import { colorWhite } from "@constants/Colors";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";
// import Modal from 'react-native-modal';
/**
 * Application Themed Button.
 * @component
 * @example
 */

const BottomSheetComp = (props) => {
  const [heightVisible, setHeightVisible] = useState(false);
  // alert(props.sheetVisible)
  return (
    <View>
      <Modal
        animated
        animationType="fade"
        transparent={true}
        propagateSwipe={true}
        visible={props.sheetVisible}>
        <TouchableWithoutFeedback
          onPress={() => props.closePopup && props.closePopup()}>
          <View
            style={
              props.sheetVisible === true ? styles.overlay : styles.visiblity
            }>
            <View style={styles.panel}>{props.children}</View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default BottomSheetComp;
const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    flex: 1,
    justifyContent: "flex-end",
    minHeight: 200,
  },
  panel: {
    backgroundColor: colorWhite,
    paddingTop: 10,
    paddingBottom: 35,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelTitle: {
    fontSize: 18,
    paddingVertical: 7,
    fontFamily: "Rubik-Medium",
  },
  panelSubtitle: {
    fontSize: 14,
    marginBottom: 10,
    color: "#717171",
    fontFamily: "Rubik-Medium",
  },
  visiblity: {
    display: "none",
  },
});
