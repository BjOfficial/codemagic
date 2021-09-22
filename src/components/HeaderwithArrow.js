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
  TouchableOpacity,
} from "react-native";
import BackArrowComp from "@components/BackArrowComp";
import { useNavigation, useRoute } from "@react-navigation/native";
import { white_arrow } from "@constants/Images";
import { colorWhite } from "@constants/Colors";
import { font14, font16 } from "@constants/Fonts";
const HeaderwithArrow = (props) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={white_arrow} style={styles.arrowImg} />
      </TouchableOpacity>
      <Text style={styles.title}>{props.title}</Text>
    </View>
  );
};
export default HeaderwithArrow;
const styles = StyleSheet.create({
  container: {
    // flex:1,
    flexDirection: "row",
    paddingTop: Platform.OS == "ios" ? 50 : 20,
    paddingLeft: 18,
  },
  arrowImg: {
    width: 20,
    height: 18,
  },
  title: {
    color: colorWhite,
    paddingLeft: 12,
    fontSize: font16,
    fontFamily: "Rubik-Medium",
  },
});
