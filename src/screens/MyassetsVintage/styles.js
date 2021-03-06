import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colorAsh, colorLightBlue, colorWhite } from '@constants/Colors';

const styles = StyleSheet.create({
	image: {
		width: Dimensions.get('screen').width * 0.3,
		height: Dimensions.get('screen').height * 0.15,
		alignSelf: 'center',
		marginBottom: 30,
	},
	text: {
		fontFamily: 'Rubik-Regular',
		alignSelf: 'center',
		color: colorAsh,
		marginTop: 5,
	},
	navbarRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	notificationIcon: {
		height: 15,
		width: 20,
		margin: 20,
	},
	navbar: {
		backgroundColor: colorLightBlue,
		borderBottomLeftRadius: 50,
		borderBottomRightRadius: 50,
		// height: Dimensions.get('window').height / 12,
		marginBottom: 10,
		paddingBottom: 10,
		paddingTop: Platform.OS === 'ios' ? 30 : 0,
	},
	navbarName: {
		color: colorWhite,
		fontFamily: 'Rubik-Regular',
		fontSize: 17,
		margin: 15,
	},
	center: {
		// marginTop: Dimensions.get('screen').height * 0.2,
		// justifyContent: 'center',
		// alignSelf: 'center',
	},
	FilterButtongrp: {
		flexDirection: 'row',
		marginVertical: 10,
		marginLeft: 20,
	},
});

export default styles;
