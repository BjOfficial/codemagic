import { StyleSheet, Dimensions } from 'react-native';
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
		// paddingVertical:10,
	},
	navbarName: {
		color: colorWhite,
		fontFamily: 'Rubik-Medium',
		fontSize: 17,
		marginVertical: 15,
	},
	center: {
		justifyContent: 'center',
		alignSelf: 'center',
	},
});

export default styles;
