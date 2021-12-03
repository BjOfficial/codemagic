import { StyleSheet, Dimensions, Platform } from 'react-native';
import { colorAsh, colorLightBlue, colorWhite } from '@constants/Colors';

const styles = StyleSheet.create({
	container: {
		backgroundColor: colorWhite,
		flex: 1,
		paddingBottom: 60,
	},
	image: {
		width: Dimensions.get('screen').width * 0.29,
		height: Dimensions.get('screen').height * 0.16,
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
		fontFamily: 'Rubik-Regular',
		fontSize: 20,
		margin: 15,
	},
	center: {
		marginTop: Dimensions.get('screen').height * 0.2,
		justifyContent: 'center',
		alignSelf: 'center',
	},
});

export default styles;
