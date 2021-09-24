import React, { useRef, useEffect, useState } from "react";
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  Image,
} from "react-native";

import { TouchableOpacity } from "react-native-gesture-handler";
/**
 * Application Themed Button.
 * @component
 * @example
 * <CustomTextInput title="Example TextInput" />
 */

const ModalComp = (props) => {
  const paddingProps = props?.contentPadding;
  return (
    <View>
      <Modal
        animated
        animationType="fade"
        transparent={true}
        propagateSwipe={true}
        visible={props.visible}
        {...props}
      >
        <View style={styles.overlay}>
          <View
            style={[styles.contentView, { padding: paddingProps ? 0 : 20 }]}
          >
            {props.children}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ModalComp;
const styles = StyleSheet.create({
  overlay: {
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
      justifyContent:'center'

  },

  contentView: {
    backgroundColor: "#fff",
    borderRadius: 15,
    width: "90%",
    marginLeft: "5%",
  },
});
