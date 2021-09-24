import { StyleSheet } from "react-native";
import {
  colorDropText,
  colorLightBlue,
  colorplaceholder,
  colorWhite,
} from "@constants/Colors";
import { font12, font13, font14, font18 } from "@constants/Fonts";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: colorLightBlue,
    // paddingTop:Platform.OS=='ios'?50:20
  },
  firstSection: {
    backgroundColor: "transparent",
    flex: 0.4,
  },
  secondSection: {
    backgroundColor: colorWhite,
    flex: 0.6,
    borderTopRightRadius: 15,
    borderTopLeftRadius: 15,
    padding: 15,
  },
  invitepara: {
    fontSize: font13,
    color: colorWhite,
    fontFamily: "Rubik-Medium",
    lineHeight: 24,
  },
  knowtext: {
    fontSize: font13,
    color: colorWhite,
    opacity: 0.5,
    textDecorationLine: "underline",
    paddingVertical: 10,
  },
  inviteImg: {
    width: 150,
    height: 130,
  },
  smallIcons: {
    width: 45,
    height: 45,
    // marginRight:30,
  },
  icongroup: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 20,
  },
  sharediconText: {
    color: colorplaceholder,
    fontSize: font12,
    fontFamily: "Rubik-Regular",
    marginTop: 7,
  },
  bottomBorder: {
    borderBottomColor: colorplaceholder,
    borderBottomWidth: 0.6,
    opacity: 0.4,
    marginVertical: 20,
  },
  phoneTitle: {
    fontFamily: "Rubik-Medium",
    fontSize: font18,
    opacity: 1,
    color: colorDropText,
  },
  invitegroup: {
    flexDirection: "row",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  invitePara: {
    flex: 0.5,
    paddingRight: 40,
  },
  contactGroup: {
    flexDirection: "row",
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  contactIcon: {
    borderRadius: 25,
    width: 50,
    height: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  contactIconText: {
    textAlign: "center",
    color: colorWhite,
    fontWeight: "bold",
  },
  contactName: {
    color: colorDropText,
    fontFamily: "Rubik-Regular",
    fontSize: font14,
    paddingBottom: 5,
  },
  contactnumber: {
    color: colorplaceholder,
    fontFamily: "Rubik-Regular",
    fontSize: font13,
    paddingTop: 4,
  },
  network_icon: {
    width: 45,
    height: 45,
    position: "absolute",
    bottom: -17,
    right: 3,
  },
  netword_added_icon: {
    width: 26,
    height: 24,
  },
});
export default styles;
