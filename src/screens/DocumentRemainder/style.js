import * as RN from 'react-native';
import {
	colorWhite,
	colorAsh,
	colorBlack,
	colorLightBlue,
	colorDropText,
} from '@constants/Colors';
import { font12, font16 } from '@constants/Fonts';

const style = RN.StyleSheet.create({
	label: {
		fontFamily: 'Rubik-Regular',
		fontSize: 12,
		color: colorBlack,
		margin: 15,
	},
	inputStyle: {
		alignSelf: 'center',
		height: RN.Dimensions.get('screen').height * 0.07,
		borderWidth: 0.5,
		borderRadius: 30,
		marginLeft: RN.Dimensions.get('screen').width * 0.03,
		paddingLeft: 20,
	},
	skip: {
		fontFamily: 'Rubik-Regular',
		fontSize: font12,
		color: colorDropText,
		textAlign: 'center',
		marginTop: RN.Dimensions.get('screen').height * 0.25,
		textDecorationLine: 'underline',
		paddingVertical: 15,
	},
	othersInputStyle: {
		alignSelf: 'center',
		width: RN.Dimensions.get('screen').height / 4.5,
		borderBottomWidth: 0.5,
		marginLeft: RN.Dimensions.get('screen').width * 0.04,
		paddingLeft: 10,
		marginTop: -10,
	},
	containerHeader: {
		backgroundColor: colorLightBlue,
		borderBottomLeftRadius: 33,
		borderBottomRightRadius: 33,
		padding: RN.Platform.OS == 'ios' ? 40 : 30,
		paddingLeft: 15,
		paddingTop: RN.Platform.OS == 'ios' ? 50 : 30,
	},
	arrow_icon: {
		width: 18,
		height: 16,
	},
	box: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	headerText: {
		fontSize: font16,
		fontFamily: 'Rubik-Medium',
		color: colorWhite,
		marginLeft: 30,
		marginTop: -17,
	},
	headerEdit: {
		fontSize: font12,
		fontFamily: 'Rubik-Regular',
		color: colorWhite,
		paddingVertical: 5,
		paddingHorizontal: 15,
	},
	headerEditCancel: {
		fontSize: font12,
		fontFamily: 'Rubik-Regular',
		color: '#FF0000',
		paddingVertical: 5,
		paddingHorizontal: 15,
	},
	text: {
		fontFamily: 'Rubik-Regular',
		alignSelf: 'center',
		color: colorAsh,
		marginTop: 5,
	},
	navbarRow: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	notificationIcon: {
		height: 15,
		width: 20,
		margin: 20,
	},
	navbar: {
		backgroundColor: colorLightBlue,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
	},
	navbarName: {
		color: colorWhite,
		fontFamily: 'Rubik-Medium',
		fontSize: 17,
	},
	center: {
		justifyContent: 'center',
		alignSelf: 'center',
	},
	inputStyles: {
		alignSelf: 'center',
		height: RN.Dimensions.get('screen').height * 0.07,
		borderWidth: 0.5,
		borderRadius: 30,
		marginLeft: RN.Dimensions.get('screen').width * 0.03,
		paddingLeft: RN.Dimensions.get('screen').width * 0.12,
	},
});

export default style;
