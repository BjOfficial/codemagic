import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { colorOrange, colorWhite, colorplaceholder } from '@constants/Colors';

const FilterButtons = (props) => {
	return (
		<View style={[{ paddingRight: 5 }]}>
			<TouchableOpacity
				onPress={() => props.buttonClick && props.buttonClick()}
				style={[
					styles.buttonStyle,
					{
						paddingLeft: props.buttonLeftSize,
						paddingRight: props.buttonRightSize,
						backgroundColor: props.isSelected ? colorOrange : colorWhite,
						borderColor: props.isSelected ? colorWhite : colorplaceholder,
						borderWidth: 0.5,
					},
					props.touchableStyle,
					{ ...props.style },
				]}>
				<Text
					style={[
						styles.titleStyle,
						{ color: props.isSelected ? '#fff' : '#747474' },
					]}>
					{props.buttonTitle}
				</Text>
			</TouchableOpacity>
		</View>
	);
};

export default FilterButtons;

const styles = StyleSheet.create({
	titleStyle: {
		color: colorplaceholder,
		fontFamily: 'Rubik-Regular',
		fontSize: 12,
		fontWeight: '300',
		paddingLeft: 6,
		paddingRight: 6,
		padding: 3,
		textTransform: 'capitalize',
		// marginLeft: 5
	},
	buttonStyle: {
		flexDirection: 'row',
		alignItems: 'center',
		backgroundColor: '#F9FAFE',
		// borderColor: 'blue',
		// borderWidth: 1,
		borderRadius: 30,
		padding: 5,
		paddingLeft: 18,
		paddingRight: 18,
	},
});
