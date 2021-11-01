import StatusBar from '@components/StatusBar';
import ThemedButton from '@components/ThemedButton';
import { colorLightBlue, colorWhite } from '@constants/Colors';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import React from 'react';
import * as RN from 'react-native';
import { home_icon } from '@constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign';
import style from './styles';
import { AddReaminderNav } from '@navigation/NavigationConstant';
import { useState } from 'react/cjs/react.development';

const MyAssets = () => {
	const navigation = useNavigation();
	const [remainderData] = useState([
		{
			date: 'jul 20',
			title: 'EMI Due',
			data: 'Rs.36,980 for Home mortgage HDFC and Rs. 3,500 for RWA Maintenance',
		},
		{
			date: 'Jul 04',
			title: 'Appliance Anniversary',
			data: '7th Year completion of Panasonic 1.5T AC at Guest Bedroom',
		},
		{
			date: 'Jul 10',
			title: 'Monthly Payment',
			data: 'Payment for EB and Cable TV',
		},
		{
			date: 'Jul 10',
			title: 'Family Functiont',
			data: 'Anniversary for In-Laws and Alumni Club dues',
		},
		{
			date: 'Jul 10',
			title: 'Free Service due',
			data: 'Free service due for Voltas 2T AC at Living Room',
		},
	]);
	const DrawerScreen = () => {
		return navigation.dispatch(DrawerActions.toggleDrawer());
	};
	const renderItem = ({ item, index }) => {
		return (
			<RN.View
				key={index}
				style={{ flex: 1, marginLeft: 5, marginTop: 20, marginBottom: 20 }}>
				<RN.Text style={{ alignSelf: 'center' }}>{item.title}</RN.Text>
			</RN.View>
		);
	};

	return (
		<RN.View>
			<StatusBar />
			<RN.View style={style.navbar}>
				<RN.View style={style.navbarRow}>
					<RN.TouchableOpacity
						onPress={() => {
							DrawerScreen();
						}}>
						<RN.View style={{ flex: 1 }}>
							<RN.Image source={home_icon} style={style.notificationIcon} />
						</RN.View>
					</RN.TouchableOpacity>
					<RN.View style={{ flex: 1 }}>
						<RN.TouchableOpacity>
							<RN.Text style={style.navbarName}>{'My Remainders '}</RN.Text>
						</RN.TouchableOpacity>
					</RN.View>
					<RN.View style={{ flex: 0 }}>
						<RN.TouchableOpacity>
							<AntDesign
								name="calendar"
								color={colorWhite}
								size={22}
								style={{ margin: 17 }}
							/>
						</RN.TouchableOpacity>
					</RN.View>
				</RN.View>
        x
			</RN.View>
			{remainderData.length > 0 ? (
				<RN.View>
					<RN.FlatList
						data={remainderData}
						renderItem={renderItem}
						keyExtractor={(item, index) => index.toString()}
					/>
				</RN.View>
			) : (
				<RN.View style={style.center}>
					<RN.Image
						source={require('../../assets/images/emptyStates/addreminder.png')}
						style={style.image}
					/>
					<RN.Text style={style.text}>{'Set Alerts for Remainders'}</RN.Text>
					<RN.TouchableOpacity
						onPress={() => navigation.navigate(AddReaminderNav)}>
						<ThemedButton
							title="+ Add Remainder"
							mode="outline"
							color={colorLightBlue}
							buttonStyle={{ marginTop: 20 }}
							btnStyle={{ fontFamily: 'Rubik-Medium' }}></ThemedButton>
					</RN.TouchableOpacity>
				</RN.View>
			)}
      ;
		</RN.View>
	);
};

export default MyAssets;
