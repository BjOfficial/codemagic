import { StyleSheet, Platform } from "react-native";
import {
  colorWhite,
  colorAsh,
  colorplaceholder,
  colorDropText,
  colorLightBlue,
  colorSuccess,
} from "@constants/Colors";
import {
  font10,
  font12,
  font13,
  font14,
  font20,
  font25,
} from "@constants/Fonts";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorWhite,
    padding: 20,
    paddingTop: Platform.OS == "ios" ? 50 : 20,
  },
  headerText: {
    fontSize: font20,
    fontFamily: "Rubik-Medium",
    paddingTop: 25,
  },
  eyeIcon: {
    width: 18,
    height: 18,
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
});
export default styles;
