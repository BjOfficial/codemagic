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
import {
  white_arrow,
  appliance_option,
  add_remainder,
} from "@constants/Images";
import { colorWhite } from "@constants/Colors";
import { font16 } from "@constants/Fonts";
const HeaderwithArrow = (props) => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.8, flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={props?.arrow_icon ? props?.arrow_icon : white_arrow}
            style={styles.arrowImg}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.title,
            { color: props?.color ? props?.color : colorWhite },
          ]}>
          {props.title}
        </Text>
      </View>
      {props?.rightIcon && (
        <>
          <View style={styles.iconSection}>
            {props?.remainder && (
              <Image source={add_remainder} style={styles.remainderImg} />
            )}
            <Image source={appliance_option} style={styles.optionImg} />
          </View>
        </>
      )}
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
    paddingLeft: 12,
    fontSize: font16,
    fontFamily: "Rubik-Medium",
  },
  optionImg: {
    width: 4,
    height: 20,
    marginLeft: 20,
  },
  remainderImg: {
    width: 20,
    height: 22,
  },
  iconSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 0.2,
    paddingRight: 20,
  },
});
