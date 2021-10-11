import { StyleSheet, Dimensions, Platform } from "react-native";
import {
  colorAsh,
  colorBlack,
  colorDarkBlue,
  colorDarkGreen,
  colorLightBlue,
  colorLightGreen,
  colorLightskyBlue,
  colorLightWhite,
  colorWhite,
} from "@constants/Colors";

const style = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  navbar: {
    backgroundColor: colorLightBlue,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    height: Dimensions.get("window").height / 5,
  },
  navbarRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: Platform.OS == "ios" ? 20 : 0,
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
    marginLeft: 20,
  },
  namasteIcon: {
    height: 20,
    width: 20,
    // margin: 20,
  },
  navbarCalendar: {
    color: colorWhite,
    fontFamily: "Rubik-Regular",
    fontSize: 10,
    marginLeft: 20,
    marginTop: 10,
  },
  title: {
    color: colorBlack,
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    margin: 20,
    fontWeight: "900",
  },
  card: {
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: colorLightBlue,
    height: Dimensions.get("screen").height / 4,
    marginLeft: 20,
    marginRight: 20,
    backgroundColor: colorLightskyBlue,
    borderRadius: 20,
  },
  cardBackgroundImage: {
    width: Dimensions.get("screen").width * 0.89,
    height: Dimensions.get("screen").height / 4.1,
  },
  plusCircleIcon: {
    alignSelf: "center",
    marginTop: Dimensions.get("screen").height * 0.05,
  },
  cardTitle: {
    color: colorBlack,
    fontFamily: "Rubik-Regular",
    alignSelf: "center",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 20,
  },
  cardText: {
    color: colorAsh,
    fontFamily: "Rubik-Regular",
    alignSelf: "center",
    fontSize: 12,
    fontWeight: "900",
    marginTop: 10,
  },
  inviteCard: {
    borderStyle: "solid",
    borderWidth: 1,
    backgroundColor: colorDarkGreen,
    borderColor: colorDarkGreen,
    height: Dimensions.get("screen").height / 5,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    borderRadius: 20,
  },
  inviteCardRow: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  inviteCardImage: {
    marginTop: 10,
    height: 130,
    width: 145,
  },
  inviteCardTitle: {
    color: colorWhite,
    fontFamily: "Rubik-Bold",

    fontSize: 16,
    marginTop: 15,
  },
  inviteCardText: {
    color: colorLightGreen,
    fontFamily: "Rubik-Regular",
    fontSize: 12,
    marginTop: 10,
  },
  inviteCardButton: {
    backgroundColor: colorWhite,
    height: 30,
    width: Dimensions.get("screen").width / 4,
    borderRadius: 8,
    marginTop: 10,
  },
  inviteCardButtonText: {
    fontFamily: "Rubik-Regular",
    color: colorDarkGreen,
    alignSelf: "center",
    marginTop: 5,
  },
  doYouKnowCardBackground: {
    height: Dimensions.get("window").height * 0.36,
    width: Dimensions.get("screen").width * 0.99,
    marginLeft: 8,
  },
  doYouKnowCardTitle: {
    color: colorWhite,
    fontFamily: "Rubik-Bold",
    fontSize: 13,
    marginTop: Dimensions.get("screen").height * 0.1,
    marginLeft: 30,
  },
  doYouKnowCardRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  doYouKnowCardButton: {
    backgroundColor: colorWhite,
    height: 30,
    width: Dimensions.get("screen").width / 4,
    borderRadius: 8,
    marginTop: 20,
    marginLeft: 30,
  },
  doYouKnowCardButtonTitle: {
    color: colorDarkBlue,
    alignSelf: "center",
    marginTop: 5,
    fontFamily: "Rubik-Bold",
  },
  doYouKnowcardText: {
    color: colorLightWhite,
    fontFamily: "Rubik-Regular",
    fontSize: 10,
    marginTop: 10,
    marginLeft: 30,
  },
});
export default style;
