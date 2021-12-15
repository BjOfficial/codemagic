import { StyleSheet, Dimensions } from 'react-native';
import {
  colorWhite,
  colorAsh,
  colorplaceholder,
  colorDropText,
  colorLightBlue,
  colorSuccess,
  colorBlack,
} from '@constants/Colors';
import { font12, font13, font14, font20, font16 } from '@constants/Fonts';

const style = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 20,
  },
	
	
  closeView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
	
  successHeader: {
    fontFamily: 'Rubik-Medium',
    fontSize: font14,
    color: colorBlack,
    textAlign: 'center',
    marginTop: 20,
    paddingBottom: 10,
    borderRadius: 20,
    lineHeight: 30,
  },
  successPara: {
    color: colorLightBlue,
    textAlign: 'center',
    lineHeight: 30,
    borderRadius: 20,
    padding: 10,
    fontSize: font16,
    fontWeight: 'bold',
    fontFamily: 'Rubik-Regular',
  },
  box: {
    borderRadius: 20,
    backgroundColor: '#ECF7FF',
    // height: Dimensions.get("screen").height * 0.25,
  },
  optionsBox: {
    borderRadius: 20,
    backgroundColor: '#ECF7FF',
    height: Dimensions.get('screen').height * 0.18,
  },
  skip: {
    fontFamily: 'Rubik-Regular',
    fontSize: font12,
    color: colorDropText,
    textAlign: 'center',
    // marginTop: 15,
    textDecorationLine: 'underline',
    paddingVertical: 15,
  },

  suggestionView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
  },
  header: {
    fontFamily: 'Rubik-Medium',
    fontSize: font14,
    color: colorBlack,
    textAlign: 'center',
    padding: 15,
    lineHeight: 24,
  },
  para: {
    color: colorLightBlue,
    textAlign: 'center',
    lineHeight: 30,
    borderRadius: 20,
    padding: 10,
    fontSize: font14,
    fontFamily: 'Rubik-Medium',
  },

  label: {
    fontFamily: 'Rubik-Medium',
    fontSize: font13,
    margin: 15,
    color: colorBlack,
  },

  headerText: {
    fontSize: font20,
    fontFamily: 'Rubik-Medium',
    paddingTop: 25,
  },
  acceptenceText: {
    fontSize: font12,
    lineHeight: 22,
    fontFamily: 'Rubik-Regular',
    color: colorAsh,
  },
  Invitepara: {
    fontSize: font14,
    fontFamily: 'Rubik-Regular',
    color: colorplaceholder,
    marginBottom: 20,
    paddingVertical: 5,
    lineHeight: 24,
  },
  forgotText: {
    fontFamily: 'Rubik-Regular',
    fontSize: font12,
    color: colorDropText,
    textDecorationLine: 'underline',
  },
  homeAssetsText: {
    fontFamily: 'Rubik-Regular',
    fontSize: font13,
    color: colorDropText,
  },
  inviteText: {
    fontFamily: 'Rubik-Medium',
    color: colorLightBlue,
    fontSize: font13,
    marginLeft: 3,
  },
  registerText: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  errorMsg: {
    fontSize: 12,
    color: 'red',
    fontFamily: 'Avenir-Roman',
    textAlign: 'center',
  },
  successMsg: {
    color: colorSuccess,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Avenir-Roman',
  },
  inputStyle: {
    alignSelf: 'center',
    height: Dimensions.get('screen').height * 0.07,
    borderWidth: 0.5,
    borderRadius: 30,
    marginLeft: Dimensions.get('screen').width * 0.03,
    paddingLeft: 20,
    paddingRight: 50,
  },
  otherInputStyle: {
    alignSelf: 'center',
    width: Dimensions.get('screen').height / 2,
    borderBottomWidth: 0.5,
    marginLeft: Dimensions.get('screen').width * 0.04,
    paddingLeft: 10,
    marginTop: -10,
  },
  othersInputStyle: {
    alignSelf: 'center',
    width: Dimensions.get('screen').height / 4.5,
    borderBottomWidth: 0.5,
    marginLeft: Dimensions.get('screen').width * 0.04,
    paddingLeft: 10,
    marginTop: -10,
  },
  inputStyles: {
    alignSelf: 'center',
    height: Dimensions.get('screen').height * 0.07,
    borderWidth: 0.5,
    borderRadius: 30,
    marginLeft: Dimensions.get('screen').width * 0.03,
    paddingLeft: Dimensions.get('screen').width * 0.12,
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
  },
  addanotherText:{
    color:'#393939',
    fontSize:font13,
    fontFamily:'Rubik-Regular'
  },
  navbar: {
		backgroundColor: colorLightBlue,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
	},
	navbarRow: {
		flexDirection: 'row',
	},
	customTextinput:{
		borderBottomWidth:0.5,
		borderBottomColor:colorDropText,
		marginRight:8
	},
	notificationIcon: {
		height: 15,
		width: 20,
		margin: 20,
	},
	navbarName: {
		color: colorWhite,
		fontFamily: 'Rubik-Medium',
		fontSize: 20,
		margin: 15,
	},
});

export default style;
