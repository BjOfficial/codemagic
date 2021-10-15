import { StyleSheet, Dimensions, Platform } from "react-native";
import { colorWhite, colorBlack, colorLightBlue } from "@constants/Colors";
import { font12, font16 } from "@constants/Fonts";

const style = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  navbar: {
    backgroundColor: colorLightBlue,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    height: Dimensions.get("window").height / 9,
    paddingTop: Platform.OS === "ios" ? 30 : 0,
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
  navbarName: {
    color: colorWhite,
    fontFamily: "Rubik-Regular",
    fontSize: 20,
    margin: 15,
  },
  label: {
    fontFamily: "Rubik-Regular",
    fontSize: 12,
    margin: 15,
  },

  inputStyle: {
    alignSelf: "center",
    height: Dimensions.get("screen").height * 0.07,
    borderWidth: 0.5,
    borderRadius: 30,
    marginLeft: Dimensions.get("screen").width * 0.03,
    paddingLeft: 20,
  },
  inputStyles: {
    alignSelf: "center",
    height: Dimensions.get("screen").height * 0.07,
    borderWidth: 0.5,
    borderRadius: 30,
    marginLeft: Dimensions.get("screen").width * 0.03,
    paddingLeft: Dimensions.get("screen").width * 0.12,
  },
  close_icon: {
    width: 20,
    height: 20,
  },
  closeView: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  glitterStar: {
    width: 60,
    height: 100,
  },
  glitterView: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
  },
  header: {
    fontFamily: "Rubik-Medium",
    fontSize: font16,
    color: colorBlack,
    textAlign: "center",
    paddingBottom: 10,
  },
  para: {
    color: colorBlack,
    textAlign: "center",
    lineHeight: 20,
    borderRadius: 20,
    padding: 10,
    backgroundColor: "#ECF7FF",
    fontSize: font12,
    fontFamily: "Rubik-Regular",
  },
});

export default style;
