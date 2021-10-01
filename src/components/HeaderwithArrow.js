import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { white_arrow } from "@constants/Images";
import { colorWhite } from "@constants/Colors";
import { font16 } from "@constants/Fonts";
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
