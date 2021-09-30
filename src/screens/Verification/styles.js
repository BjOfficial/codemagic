import { StyleSheet, Platform } from "react-native";
import {
  colorWhite,
  colorplaceholder,
  colorDropText,
  colorLightBlue,
  colorBlack,
  colorSuccess,
} from "@constants/Colors";
import { font12, font14, font16, font18, font20 } from "@constants/Fonts";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorWhite,
    padding: 20,
    paddingTop: Platform.OS == "ios" ? 50 : 20,
  },
  textinputStyles: {
    fontSize: font18,
    fontFamily: "Rubik-Bold",
    borderBottomWidth: 1,
  },
  headerText: {
    fontSize: font20,
    fontFamily: "Rubik-Medium",
    paddingTop: 25,
    // marginVertical:25
  },
  Invitepara: {
    fontSize: font14,
    fontFamily: "Rubik-Regular",
    color: colorplaceholder,
    marginBottom: 20,
    paddingVertical: 20,
    lineHeight: 24,
  },
  mobilenoStyle: {
    color: colorplaceholder,
    fontFamily: "Rubik-Medium",
  },
  otpview: {
    // width: '80%',
    // marginLeft: '10%',
  },
  resendotp: {
    textAlign: "center",
    fontFamily: "Rubik-Regular",
    fontSize: font14,
    color: colorDropText,
    marginVertical: 25,
  },
  timerdisplay: {
    color: colorLightBlue,
    fontFamily: "Rubik-Regular",
    fontSize: font14,
    textAlign: "center",
    paddingTop: 30,
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
    width: 100,
    height: 90,
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
    color: colorplaceholder,
    textAlign: "center",
    paddingBottom: 30,
    fontSize: font12,
    fontFamily: "Rubik-Regular",
  },
  successMsg: {
    color: colorSuccess,
    fontSize: 12,
    textAlign: "center",
    fontFamily: "Avenir-Roman",
  },
  errMsg: {
    fontSize: 12,
    color: "red",
    fontFamily: "Avenir-Roman",
    textAlign: "center",
  },
});
export default styles;
