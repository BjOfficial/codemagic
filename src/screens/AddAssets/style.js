import { StyleSheet, Dimensions } from "react-native";
import {
  colorWhite,
  colorAsh,
  colorplaceholder,
  colorDropText,
  colorLightBlue,
  colorSuccess,
  colorBlack,
} from "@constants/Colors";
import { font12, font13, font14, font20, font16 } from "@constants/Fonts";

const style = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  navbar: {
    backgroundColor: colorLightBlue,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    height: Dimensions.get("window").height / 9,
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
  closeView: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  sugesstion: {
    width: 60,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
  },
  successHeader: {
    fontFamily: "Rubik-Medium",
    fontSize: font14,
    color: colorBlack,
    textAlign: "center",
    marginTop: 20,
    paddingBottom: 10,
    borderRadius: 20,
    lineHeight: 30,
  },
  successPara: {
    color: colorLightBlue,
    textAlign: "center",
    lineHeight: 30,
    borderRadius: 20,
    padding: 10,
    fontSize: font16,
    fontWeight: "bold",
    fontFamily: "Rubik-Regular",
  },
  box: {
    borderRadius: 20,
    backgroundColor: "#ECF7FF",
    height: Dimensions.get("screen").height * 0.25,
  },
  optionsBox: {
    borderRadius: 20,
    backgroundColor: "#ECF7FF",
    height: Dimensions.get("screen").height * 0.18,
  },
  skip: {
    fontFamily: "Rubik-Medium",
    fontSize: font12,
    color: colorAsh,
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },

  suggestionView: {
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

  navbarName: {
    color: colorWhite,
    fontFamily: "Rubik-Regular",
    fontSize: 20,
    margin: 15,
  },
  label: {
    fontFamily: "Rubik-Regular",
    fontSize: font13,
    margin: 15,
  },

  headerText: {
    fontSize: font20,
    fontFamily: "Rubik-Medium",
    paddingTop: 25,
  },
  acceptenceText: {
    fontSize: font12,
    lineHeight: 22,
    fontFamily: "Rubik-Regular",
    color: colorAsh,
  },
  Invitepara: {
    fontSize: font14,
    fontFamily: "Rubik-Regular",
    color: colorplaceholder,
    marginBottom: 20,
    paddingVertical: 5,
    lineHeight: 24,
  },
  forgotText: {
    fontFamily: "Rubik-Regular",
    fontSize: font12,
    color: colorDropText,
    textDecorationLine: "underline",
  },
  homeAssetsText: {
    fontFamily: "Rubik-Regular",
    fontSize: font13,
    color: colorDropText,
  },
  inviteText: {
    fontFamily: "Rubik-Medium",
    color: colorLightBlue,
    fontSize: font13,
    marginLeft: 3,
  },
  registerText: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
  },
  errorMsg: {
    fontSize: 12,
    color: "red",
    fontFamily: "Avenir-Roman",
    textAlign: "center",
  },
  successMsg: {
    color: colorSuccess,
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Avenir-Roman",
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

  glitterStar: {
    width: 100,
    height: 90,
  },
  glitterView: {
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
  },
});

export default style;
