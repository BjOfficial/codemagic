import { StyleSheet, Dimensions } from 'react-native';
import {
	colorWhite,
	colorAsh,
	colorBlack,
	colorLightBlue,
	colorDropText,
} from '@constants/Colors';
import { font12, font13, font14, font16 } from '@constants/Fonts';

const style = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		marginBottom: 20,
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
	label: {
		fontFamily: 'Rubik-Medium',
		fontSize: font13,
		margin: 17,
		color: colorBlack,
	},

	inputStyle: {
		alignSelf: 'center',
		height: Dimensions.get('screen').height * 0.07,
		borderWidth: 0.5,
		borderRadius: 30,
		marginLeft: Dimensions.get('screen').width * 0.03,
		paddingLeft: 20,
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
	closeView: {
		justifyContent: 'flex-end',
		alignItems: 'flex-end',
	},
	sugesstion: {
		width: 60,
		height: 100,
		alignSelf: 'center',
		marginBottom: 10,
	},
	suggestionView: {
		justifyContent: 'center',
		alignItems: 'center',
		paddingVertical: 18,
	},
	header: {
		fontFamily: 'Rubik-Medium',
		fontSize: font16,
		color: colorBlack,
		textAlign: 'center',
		paddingBottom: 10,
	},
	paraOutline:{
		backgroundColor: '#ECF7FF',
		borderRadius: 20,
	},
	para: {
		color: colorBlack,
		textAlign: 'center',
		lineHeight: 20,
		padding: 10,
		fontSize: font12,
		fontFamily: 'Rubik-Regular',
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
		fontFamily: 'Rubik-Bold',
	},
	box: {
		borderRadius: 20,
		backgroundColor: '#ECF7FF',
	},
	optionsBox: {
		borderRadius: 20,
		backgroundColor: '#ECF7FF',
	},
	skip: {
		fontFamily: 'Rubik-Medium',
		fontSize: font12,
		color: colorAsh,
		textAlign: 'center',
		marginTop: 10,
		textDecorationLine: 'underline',
	},
});

export default style;