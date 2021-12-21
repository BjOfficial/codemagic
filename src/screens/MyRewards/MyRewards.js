import React from 'react';
import {
	View,
	Text,
	Image,
	SafeAreaView,
	TouchableOpacity,
	StyleSheet,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { colorLightBlue, colorWhite } from '@constants/Colors';
import StatusBar from '@components/StatusBar';
import { white_arrow } from '@constants/Images';
// import {reward} from '@constants/Images/reward'

function MyRewards(props) {
	const data = [
		{
			icon: require('@assets/images/rewards/howitworks1.png'),
			text: 'Invite your friends to use Azzetta App and earn 25 Azzeti coins for each invitation sent by you.',
		},
		{
			icon: require('@assets/images/rewards/howitworks2.png'),
			text: 'After your friend downloads and installs Azzetta App within 60 days you earn 500 Azzeti coins.',
		},
		{
			icon: require('@assets/images/rewards/howitworks3.png'),
			text: 'Your direct contacts who are already using Azzetta App are automatically added to your network as first circle (FC).',
		},
		{
			icon: require('@assets/images/rewards/howitworks4.png'),
			text: 'When your FC users invite their friends and those who install Azzetta App within 60 days of receiving their invitation become your second circle (SC) of trusted network.',
		},
		{
			icon: require('@assets/images/rewards/howitworks5.png'),
			text: 'For every second circle users you get 200 more Azzeti coins as your reward.',
		},
		{
			icon: require('@assets/images/rewards/howitworks6.png'),
			text: 'You need to subscribe to join Azzetta Club with 2000 Azzeti coins and renew membership subscription at 2000 Azzeti coins per year.',
		},
		{
			icon: require('@assets/images/rewards/howitworks7.png'),
			text: 'Each year 10% of your Azzetta coins will be donated to our charity partners.',
		},
	];
	const banner = () => {
		return (
			<View
				style={{
					flexDirection: 'row',
					marginVertical: 10,
					marginHorizontal: 20,
					flex: 1,
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				<View style={{ height: 120, width: 120 }}>
					<Image
						style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
						source={require('@assets/images/rewards/reward.png')}
					/>
				</View>
				<View
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					<Text
						style={{
							fontFamily: 'Rubik-Medium',
							color: '#393939',
							margin: 20,
							fontSize: 13,
						}}>
						Earn 25 Coins For Each Invite You Send And 500 Coins If They Install
						Azzetta.
					</Text>
				</View>
			</View>
		);
	};
	const points = (data) => {
		return (
			<View
				style={{
					flexDirection: 'row',
					marginVertical: 10,
					marginHorizontal: 20,
					flex: 1,
				}}>
				<View style={{ height: 20, width: 20 }}>
					<Image
						style={{ height: '100%', width: '100%', resizeMode: 'contain' }}
						source={data.icon}
					/>
				</View>
				<View style={{ flex: 1, paddingLeft: 15 }}>
					<Text style={{ fontFamily: 'Rubik-Regular', color: '#393939' }}>
						{data.text}
					</Text>
				</View>
			</View>
		);
	};
	return (
		<View style={{ flex: 1, backgroundColor: colorWhite }}>
			<SafeAreaView style={{ backgroundColor: colorLightBlue }} />
			<StatusBar />
			<View style={style.navbar}>
				<View style={style.navbarRow}>
					<TouchableOpacity
						onPress={() => {
							props.navigation.goBack();
						}}>
						<View>
							<Image source={white_arrow} style={style.notificationIcon} />
						</View>
					</TouchableOpacity>
					<View>
						<Text style={style.navbarName}>{'My Rewards'}</Text>
					</View>
				</View>
			</View>
			<ScrollView
				showsVerticalScrollIndicator={false}
				contentContainerStyle={{paddingVertical:10}}>
				{banner()}
				<Text
					style={{
						fontFamily: 'Rubik-Medium',
						color: '#393939',
						margin: 20,
						fontSize: 16,
					}}>
					{'How it works :'}
				</Text>
				{data.map((item) => {
					return points(item);
				})}
			</ScrollView>
		</View>
	);
}

const style = StyleSheet.create({
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
		marginVertical: 15,
	},
});

export default MyRewards;
