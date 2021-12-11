import React from 'react';
import { Text, View, ImageBackground, StatusBar } from 'react-native';
import { onboard_image } from '@constants/Images';
import styles from './styles';
import ThemedButton from '@components/ThemedButton';
import { colorLightBlue, colorWhite } from '@constants/Colors';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { requestInviteNav, loginNav } from '@navigation/NavigationConstant';
const LandingPage = () => {
	const navigation = useNavigation();
	return (
		<View style={styles.container}>
			<StatusBar barStyle="light-content" />
			<ImageBackground
				resizeMethod={'auto'}
				style={{
					flex: 1,
				}}
				source={onboard_image}
				imageStyle={{
					resizeMode: 'cover',
					alignSelf: 'flex-end',
				}}>
				<View style={styles.landing_seperate}>
					<View style={styles.loginButton}>
						<ThemedButton
							title="Login"
							mode="outlined"
							color={colorWhite}
							onPress={() => navigation.navigate(loginNav)}
							buttonStyle={{ width: 90, marginLeft: 'auto' }}
							btnStyle={{
								fontFamily: 'Rubik-Medium',
							}}></ThemedButton>
					</View>
					<View style={styles.welcomeView}>
						<View style={styles.welcomeBox}>
							<Text style={styles.welcomeText}>Welcome!</Text>
							<Text style={styles.welcomePara}>
								We are at an invite-only Beta phase. Anyone with an invite from an
								existing user can join. If you don &apos;t have an invite please
								register with your phone number and we will alert you when you are
								invited
							</Text>
							<ThemedButton
								title="Already have an invite?"
								color={colorLightBlue}
								onPress={() =>
									navigation.navigate(requestInviteNav, {
										params: 'Already_Invite',
									})
								}></ThemedButton>
							<TouchableOpacity
								onPress={() =>
									navigation.navigate(requestInviteNav, {
										params: 'Request_Invite',
									})
								}>
								<Text style={styles.inviteText}>Request An Invite</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</ImageBackground>
		</View>
	);
};
export default LandingPage;
