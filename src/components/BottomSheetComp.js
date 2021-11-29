import { colorWhite } from '@constants/Colors';
import React from 'react';
import {
	View,
	StyleSheet,
	TouchableWithoutFeedback,
	Modal,
} from 'react-native';
import { useNavigation } from "@react-navigation/native";
/**
 * Application Themed Button.
 * @component
 * @example
 */

const BottomSheetComp = (props) => {
	const navigation = useNavigation();
	return (
		
			<Modal
				animated
				animationType="fade"
				transparent={true}
				propagateSwipe={true}
				onRequestClose = {()=> navigation.goBack()}
				visible={props.sheetVisible}>
				<TouchableWithoutFeedback
					onPress={() => props.closePopup && props.closePopup()}>
					<View
						style={
							props.sheetVisible === true ? styles.overlay : styles.visiblity
						}></View>
				</TouchableWithoutFeedback>
				<View style={[styles.panel, { ...props.panelStyle }]}>
					{props.children}
				</View>
			</Modal>
		
	);
};

export default BottomSheetComp;
const styles = StyleSheet.create({
	overlay: {
		backgroundColor: 'rgba(0,0,0,0.5)',
		flex: 1,
		justifyContent: 'flex-end',
		minHeight: 100,
	},
	panel: {
		backgroundColor: colorWhite,
		paddingTop: 10,
		// paddingBottom: 35,
	},
	panelTitle: {
		fontSize: 18,
		paddingVertical: 7,
		fontFamily: 'Rubik-Medium',
	},
	panelSubtitle: {
		fontSize: 14,
		marginBottom: 10,
		color: '#717171',
		fontFamily: 'Rubik-Medium',
	},
	visiblity: {
		display: 'none',
	},
});
