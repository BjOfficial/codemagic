import { StyleSheet, Dimensions, Platform } from "react-native";
import { colorAsh, colorLightBlue, colorWhite } from "@constants/Colors";

const styles = StyleSheet.create({
  container: {
    backgroundColor: colorWhite,
    flex: 1,
    paddingBottom: 60,
  },
  image: {
    width: Dimensions.get("screen").width * 0.32,
    height: Dimensions.get("screen").height * 0.13,
    alignSelf: "center",
    marginBottom: 30,
  },
  text: {
    fontFamily: "Rubik-Regular",
    alignSelf: "center",
    color: colorAsh,
    marginTop: 5,
  },
  navbarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  notificationIcon: {
    height: 15,
    width: 20,
    margin: 20,
  },
  navbar: {
    backgroundColor: colorLightBlue,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    // height: Dimensions.get("window").height / 9,
    paddingTop: Platform.OS === "ios" ? 35 : 0,
    paddingBottom: 10,
    // PaddingTop: Platform.OS === 'ios' ? 30 : 0,
  },
  navbarName: {
    color: colorWhite,
    fontFamily: "Rubik-Regular",
    fontSize: 20,
    margin: 15,
  },
  center: {
    marginTop: Dimensions.get("screen").height * 0.2,
    justifyContent: "center",
    alignSelf: "center",
  },
});

export default styles;
