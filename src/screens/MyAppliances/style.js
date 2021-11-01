import { StyleSheet, Dimensions, Platform } from "react-native";
import {
  colorAsh,
  colorBlack,
  colorDarkBlue,
  colorDarkGreen,
  colorLightBlue,
  colorLightGreen,
  colorLightWhite,
  colorWhite,
} from "@constants/Colors";
import { font11, font13 } from "@constants/Fonts";
const CARD_WIDTH = Dimensions.get("window").width * 0.8;
const CARD_HEIGHT = Dimensions.get("window").height * 0.65;
const SPACING_FOR_CARD_INSET = Dimensions.get("window").width * 0.1 - 10;
const { width: viewportWidth, height: viewportHeight } =
  Dimensions.get("window");
let screenWidth = viewportWidth;
let screenHeight = 550;
// const WIDTH = Dimensions.get("window").width
// const HEIGHT = Dimensions.get("window").height

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // marginBottom: 20,
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
    fontFamily: "Rubik-Regular",
    fontSize: 15,
    marginTop: 20,
    alignSelf: "center",
    color: colorLightBlue,
  },
  innerContent: {
    flexDirection: "column",
    justifyContent: "flex-start",
  },
  content: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems:"flex-end",
    marginBottom: 10,
    height: Dimensions.get("screen").height / 25,
    // marginLeft:10,
    // marginRight:50
  },
  reminderText: {
    color: colorLightBlue,
    fontSize: font13,
    fontFamily: "Rubik-Medium",
    // marginLeft: 10,
  },
  wrapDot: {
    position: "absolute",
    bottom: 0,
    flexDirection: "row",
    alignSelf: "center",
  },
  dotActive: {
    margin: 3,
    color: colorBlack,
  },
  dot: {
    margin: 3,
    color: "white",
  },
  // slider:{
  //   width: WIDTH,
  //   height:HEIGHT
  // },
  reminderBtnView: {
    width: "60%",
    alignSelf: "center",
    marginVertical: 40,
    borderWidth: 1,
    borderRadius: 39,
    borderColor: colorLightBlue,
  },
  reminderBtnn: {
    backgroundColor: colorWhite,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    padding: 12,
    justifyContent: "center",
  },
  topText: {
    fontSize: font11,
    color: colorAsh,
    fontFamily: "Rubik-Regular",
  },
  bottomText: {
    fontSize: font11,
    color: colorBlack,
    fontFamily: "Rubik-Regular",
  },
  card: {
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    margin: 5,
    borderRadius: 20,
    // borderWidth:1,
    // borderColor:colorBlack,
    // borderStyle: "dashed",
    // elevation:2,
    // borderWidth: 1,
    // borderColor: colorLightBlue,

    // height: Dimensions.get('screen').height / 1.6,
    // width: Dimensions.get('screen').width-30,
    // marginLeft: 15,
    // marginRight: 15,
    marginTop: Dimensions.get("screen").height / 25,
    backgroundColor: colorWhite,
    // borderRadius: 20,
  },
  cardBackgroundImage: {
    backgroundColor: "red",
    width: Dimensions.get("screen").width * 0.8,
    height: Dimensions.get("screen").height / 5,
    alignSelf: "center",
    marginTop: Dimensions.get("screen").height * 0.01,
    borderRadius: 10,
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
    marginTop: 20,
  },
  contain: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    // flex: 0.5,
    justifyContent: "center",
  },
  cardText: {
    color: colorAsh,
    fontFamily: "Rubik-Regular",
    alignSelf: "center",
    fontSize: 12,
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
    fontFamily: "Rubik-Regular",
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
    color: colorDarkGreen,
    alignSelf: "center",
    marginTop: 5,
  },
  doYouKnowCardBackground: {
    height: Dimensions.get("window").height * 0.07,
    // height:100,
    // width:100,
    width: Dimensions.get("screen").width * 0.1,
    // marginLeft: 8,
    borderRadius: 30,
  },
  doYouKnowCardTitle: {
    color: colorWhite,
    fontFamily: "Rubik-Regular",
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
  },
  doYouKnowcardText: {
    color: colorLightWhite,
    fontFamily: "Rubik-Regular",
    fontSize: 10,
    marginTop: 10,
    marginLeft: 30,
  },
  mainLayoutcarousel: {
    width: screenWidth - 60,
    height: screenHeight - 60,
    backgroundColor: colorWhite,
    borderRadius: 15,
    elevation: 9,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,
    padding: 20,
    marginVertical: 20,
  },
});

export default style;
