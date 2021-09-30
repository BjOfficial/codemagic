import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from "react-native";
import { white_arrow } from "@constants/Images";
import { colorLightBlue, colorWhite } from "@constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { font16 } from "@constants/Fonts";

const HomeHeader = (props) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.box}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={white_arrow} style={styles.arrow_icon} />
        </TouchableOpacity>
        <Text style={styles.headerText}>{props.title}</Text>
      </View>
    </View>
  );
};
export default HomeHeader;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colorLightBlue,
    borderBottomLeftRadius: 33,
    borderBottomRightRadius: 33,
    padding: Platform.OS == "ios" ? 40 : 30,
    paddingLeft: 15,
    paddingTop: Platform.OS == "ios" ? 50 : 30,
  },
  arrow_icon: {
    width: 18,
    height: 16,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: font16,
    fontFamily: "Rubik-Medium",
    color: colorWhite,
    marginLeft: 20,
  },
});
