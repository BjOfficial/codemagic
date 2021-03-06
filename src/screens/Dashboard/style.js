import { StyleSheet, Dimensions } from 'react-native';
import {
	colorAsh,
	colorBlack,
	colorDarkGreen,
	colorLightBlue,
	colorLightGreen,
	colorLightskyBlue,
	colorWhite,
	colorplaceholder,
	colorOrangeBtn,
	colorBlue,
} from '@constants/Colors';
import { font10, font11, font12 } from '@constants/Fonts';

const style = StyleSheet.create({
	navbar: {
		backgroundColor: colorLightBlue,
		borderBottomLeftRadius: 30,
		borderBottomRightRadius: 30,
	},
	navbarRow: {
		paddingHorizontal: 20,
		marginVertical: 15,
	},
	notificationIcon: {
		height: 15,
		width: 20,
	},
	namaste: {
		color: colorWhite,
		fontFamily: 'Rubik-Regular',
		fontSize: 20,
	},
	navbarName: {
		color: colorWhite,
		fontFamily: 'Rubik-Regular',
		fontSize: 20,
		width: 'auto',
	},
	namasteIcon: {
		height: 25,
		width: 25,
		// paddingLeft:17,
	},
	location: {
		height: 48,
		width: 48,
	},
	switchAccount: {
		height: 50,
		width: 70,
		// paddingLeft:17,
	},
	navbarCalendar: {
		color: colorWhite,
		fontFamily: 'Rubik-Regular',
		fontSize: 10,
		paddingTop: 5,
	},
	title: {
		color: colorBlack,
		fontFamily: 'Rubik-Medium',
		fontSize: 16,
		marginLeft: 20,
		paddingVertical: 15,
	},
	doYouKnow: {
		color: colorBlack,
		fontFamily: 'Rubik-Medium',
		fontSize: 16,
		marginLeft: '7%',
		marginTop: 20,
		marginBottom: 5,
	},
	card: {
		borderStyle: 'dashed',
		borderWidth: 1,
		borderColor: colorLightBlue,
		height: Dimensions.get('screen').height / 4,
		marginLeft: 20,
		marginRight: 20,
		backgroundColor: colorLightskyBlue,
		borderRadius: 20,
	},
	cardBackgroundImage: {
		width: Dimensions.get('screen').width * 0.89,
		height: Dimensions.get('screen').height / 4.1,
	},
	plusCircleIcon: {
		alignSelf: 'center',
		marginTop: Dimensions.get('screen').height * 0.05,
	},
	cardTitle: {
		color: colorBlack,
		fontFamily: 'Rubik-Regular',
		alignSelf: 'center',
		fontSize: 15,
		marginTop: 20,
	},
	cardText: {
		color: colorAsh,
		fontFamily: 'Rubik-Regular',
		alignSelf: 'center',
		fontSize: 12,
		marginTop: 10,
	},
	inviteCard: {
		borderStyle: 'solid',
		borderWidth: 1,
		backgroundColor: colorDarkGreen,
		borderColor: colorDarkGreen,
		height: Dimensions.get('screen').height / 6,
		width: Dimensions.get('screen').width * 0.89,
		marginLeft: 20,
		marginRight: 20,
		marginTop: 20,
		borderRadius: 20,
	},
	inviteCardRow: {
		flexDirection: 'row',
		flex: 1,
		alignItems: 'center',
	},
	inviteCardImage: {
		marginTop: 10,
		height: 130,
		width: 100,
	},
	inviteCardTitle: {
		color: colorWhite,
		fontFamily: 'Rubik-Medium',
		width: Dimensions.get('screen').width * 0.5,
		fontSize: 13,
		marginTop: 15,
	},
	inviteCardText: {
		color: colorLightGreen,
		fontFamily: 'Rubik-Regular',
		fontSize: 12,
		marginTop: 10,
	},
	inviteCardButton: {
		backgroundColor: colorWhite,
		width: Dimensions.get('screen').width / 4,
		height: Dimensions.get('screen').height * 0.03,
		borderRadius: 6,
		marginTop: 10,
		marginBottom: 15,
	},
	inviteCardButtonText: {
		fontFamily: 'Rubik-Medium',
		color: colorDarkGreen,
		alignSelf: 'center',
		marginTop: 5,
		fontSize: font10,
	},
	doYouKnowCardBackground: {
		height: Dimensions.get('screen').height * 0.3,
		width: Dimensions.get('screen').width * 1.01,
		marginLeft: 8,
		marginBottom: 40,
	},
	doYouKnowCardBackgroundRed: {
		height: Dimensions.get('window').height * 0.27,
		width: Dimensions.get('screen').width * 1.02,
		marginLeft: 14,
		marginTop: 10,
		alignSelf: 'center',
	},
	doYouKnowCardTitle: {
		color: colorWhite,
		fontFamily: 'Rubik-Medium',
		fontSize: 15,
		marginTop: Dimensions.get('screen').height * 0.04,
		marginLeft: 30,
		width: Dimensions.get('screen').width * 0.4,
	},
	doYouKnowCardRow: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
	},
	doYouKnowCardButton: {
		backgroundColor: colorWhite,
		width: Dimensions.get('screen').width / 4,
		height: Dimensions.get('window').height * 0.035,
		borderRadius: 6,
		position: 'absolute',
		bottom: -60,
		marginLeft: 30,
	},
	doYouKnowCardButtonRed: {
		backgroundColor: '#963E4C',
		height: 30,
		width: Dimensions.get('screen').width / 4,
		borderRadius: 8,
		marginTop: 20,
		marginLeft: 30,
	},
	doYouKnowCardButtonTitle: {
		color: colorBlue,
		alignSelf: 'center',
		marginTop: 6,
		fontFamily: 'Rubik-Medium',
		fontSize: font10,
	},
	doYouKnowCardButtonTitleRed: {
		color: colorWhite,
		alignSelf: 'center',
		marginTop: 8,
		fontFamily: 'Rubik-Medium',
		fontSize: font10,
	},
	doYouKnowcardText: {
		color: colorWhite,
		fontFamily: 'Rubik-Regular',
		fontSize: 10,
		marginTop: 10,
		marginLeft: 30,
		width: Dimensions.get('screen').width / 2,
	},
	viewallText: {
		color: colorplaceholder,
		fontSize: font12,
		fontFamily: 'Rubik-Regular',
	},
	addNewBtn: {
		fontFamily: 'Rubik-Regular',
		color: '#f3a03c',
		alignSelf: 'center',
		fontSize: font11,
	},
	addBtn: {
		borderWidth: 1,
		borderColor: colorOrangeBtn,
		borderRadius: 30,
		padding: 4,
		paddingLeft: 10,
		paddingRight: 10,
		marginLeft: 10,
	},
});
export default style;
