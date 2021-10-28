import { StyleSheet, Platform } from "react-native";
import {
  colorWhite,
  colorplaceholder,
  colorBlack,
  colorLightBlue,
} from "@constants/Colors";
import { font14, font20, font16 } from "@constants/Fonts";
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
    lineHeight: 28,
    color: colorBlack,
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
  errorMsg: {
    fontSize: 12,
    color: "red",
    fontFamily: "Avenir-Roman",
    textAlign: "center",
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
  error: {
    width: 90,
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
  loadingcenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  activeunderLineText: {
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    textDecorationColor: colorLightBlue,
    color: colorLightBlue,
  },
});
export default styles;
