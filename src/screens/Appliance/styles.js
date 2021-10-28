import {
  colorWhite,
  colorTabs,
  colorLightBlue,
  colorplaceholder,
  colorDropText,
  colorBrown,
  colorBlack,
} from "@constants/Colors";
import { font12, font13, font14 } from "@constants/Fonts";
import { StyleSheet, Dimensions } from "react-native";
let width = Dimensions.get("window").width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorWhite,
    // padding: 10,
  },
  productImg: {
    width: width - 50,
    height: 180,
    resizeMode: "cover",
    backgroundColor: "transparent",
  },
  productSection: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 20,
  },
  tabSection: {
    backgroundColor: colorTabs,
    padding: 6,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  btnText: {
    textAlign: "center",
    fontSize: font12,
    fontFamily: "Rubik-Regular",
    color: colorBlack,
  },
  activeBtn: {
    // backgroundColor:colorLightBlue,
    // padding:15,
    // borderRadius:8
  },
  inactiveBtn: {
    backgroundColor: "transparent",
    padding: 15,
    borderRadius: 8,
    fontFamily: "Rubik-Regular",
  },
  activeText: {
    color: colorWhite,
    fontSize: font13,
    textAlign: "center",
    fontFamily: "Rubik-Regular",
  },
  contentDisplay: {
    flexDirection: "row",
    alignItems: "center",
    // borderWidth:1,
    borderBottomWidth: 0.2,
    // padding:15
    paddingVertical: 17,
    borderColor: colorDropText,
  },
  tabcontentContainer: {
    padding: 15,
  },
  detailsLabel: {
    color: colorplaceholder,
    paddingLeft: 18,
    fontSize: font13,
    fontFamily: "Rubik-Regular",
  },
  labelstyle: {
    fontSize: font13,
    fontFamily: "Rubik-Medium",
    color: colorDropText,
    paddingVertical: 10,
  },
  tabContainer: {
    shadowColor: colorplaceholder,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 20,
    paddingVertical: 18,
    backgroundColor: colorWhite,
    position: "relative",
  },
  detailsvalue: {
    fontSize: font13,
    fontFamily: "Rubik-Medium",
    textAlign: "right",
    color: colorDropText,
  },
  reminderBtnn: {
    backgroundColor: colorLightBlue,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    padding: 12,
    justifyContent: "center",
  },
  reminderIcon: {
    width: 20,
    height: 20,
  },
  reminderText: {
    color: colorWhite,
    fontSize: font13,
    fontFamily: "Rubik-Medium",
    marginLeft: 10,
  },
  reminderBtnView: {
    width: "60%",
    marginLeft: "20%",
    marginVertical: 30,
    paddingBottom: 70,
  },
  bottomFixed: {
    backgroundColor: colorWhite,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingVertical: 30,
    shadowColor: colorplaceholder,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 24,
  },
  serviceContent: {
    paddingVertical: 15,
    flexDirection: "row",
  },
  serviceLabel: {
    color: colorplaceholder,
  },
  uploadedImg: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },
  uploadedImgService: {
    width: 40,
    height: 40,
    borderRadius: 8,
  },
  labelDisplay: {
    flexDirection: "column",
    justifyContent: "center",
  },
  labelDisplayService: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addtionalLabel: {
    textAlign: "right",
    color: colorLightBlue,
    fontSize: font12,
    fontFamily: "Rubik-Medium",
    // marginTop:3
  },
  warningView: {
    backgroundColor: colorBrown,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
  },
  warningImg: {
    width: 20,
    height: 15,
  },
  viewalertBtn: {
    backgroundColor: colorWhite,
    borderRadius: 30,
    padding: 5,
    paddingHorizontal: 10,
  },
  viewalertlabel: {
    fontSize: font12,
    color: colorBrown,
    fontFamily: "Rubik-Regular",
  },
  warrantytext: {
    color: colorWhite,
    fontFamily: "Rubik-Regular",
    fontSize: font13,
  },
  uploadedView: {
    padding: 10,
    paddingHorizontal: 20,
  },
  uploadedLable: {
    fontSize: font14,
    fontFamily: "Rubik-Medium",
    color: colorBlack,
  },
  uploadedLayer: {
    flexDirection: "row",
    paddingVertical: 12,
  },
  uploadedImgview: {
    width: 150,
    marginRight: 10,
    borderRadius: 15,
  },
  starIcon: {
    width: 20,
    height: 20,
    marginLeft: 5,
  },
  servicecontentDisplay: {
    flexDirection: "row",
    alignItems: "center",
  },
  remarkStyle: {
    color: colorLightBlue,
    fontSize: font12,
    fontFamily: "Rubik-Medium",
  },
  remarkIcon: {
    width: 7,
    height: 10,
    marginLeft: 5,
  },
  dateDisplay: {
    color: colorLightBlue,
    fontFamily: "Rubik-Regular",
    fontSize: font12,
    marginTop: 10,
    marginLeft: 10,
  },
  remarkDesc: {
    fontSize: font12,
    color: colorplaceholder,
    lineHeight: 21,
    fontFamily: "Rubik-Medium",
    paddingVertical: 10,
  },
});
export default styles;
