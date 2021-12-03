import React, { useContext } from 'react';
import {
	colorAsh,
	colorLightBlue,
	colorWhite,
	colorDropText,
} from '@constants/Colors';
import { font13, font16 } from '@constants/Fonts';
import * as RN from 'react-native';
import ModalComp from '@components/ModalComp';
import auth from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthContext } from '@navigation/AppNavigation';

const Logout = (props) => {
	let { logout_Call } = useContext(AuthContext);

	const logoutCall = () => {
		props.onClose();
		auth()
			.signOut()
			.then(() => {
				AsyncStorage.removeItem('loginToken');
				AsyncStorage.removeItem('userDetails');
				logout_Call();
			});
	};
	return (
		<ModalComp visible={props.isVisible}>
			<RN.Text
				style={{
					alignSelf: 'center',
					marginTop: RN.Dimensions.get('screen').height * 0.05,
					fontSize: font16,
					fontFamily: 'Rubik-Medium',
					color: colorDropText,
				}}>
        Logging Out
			</RN.Text>
			<RN.Text
				style={{
					alignSelf: 'center',
					marginTop: 25,
					fontSize: font13,
					fontFamily: 'Rubik-Regular',
					color: colorDropText,
				}}>
        Are you sure you want to Log Out?
			</RN.Text>
			<RN.View
				style={{
					display: 'flex',
					flexDirection: 'row',
					justifyContent: 'space-around',
					marginTop: RN.Dimensions.get('screen').height * 0.01,
				}}>
				<RN.TouchableOpacity
					onPress={() => props.onClose()}
					style={{
						fontFamily: 'Rubik-Regular',
						padding: 10,
						borderWidth: 1,
						borderColor: colorAsh,
						borderRadius: 20,
						marginTop: 25,
						width: RN.Dimensions.get('screen').height * 0.17,
					}}>
					<RN.Text style={{ alignSelf: 'center', color: colorAsh }}>
            Cancel
					</RN.Text>
				</RN.TouchableOpacity>
				<RN.TouchableOpacity
					onPress={() => logoutCall()}
					style={{
						padding: 10,
						fontFamily: 'Rubik-Regular',
						borderWidth: 1,
						borderColor: colorLightBlue,
						borderRadius: 30,
						marginTop: 25,
						width: RN.Dimensions.get('screen').height * 0.17,
						backgroundColor: colorLightBlue,
					}}>
					<RN.Text style={{ alignSelf: 'center', color: colorWhite }}>
            Log Out
					</RN.Text>
				</RN.TouchableOpacity>
			</RN.View>
		</ModalComp>
	);
};

export default Logout;
