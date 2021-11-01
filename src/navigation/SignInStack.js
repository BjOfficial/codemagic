import React from 'react';
import {
	invitefriendsNav,
	SearchContactNav,
	AddDocumentNav,
	AddAssetNav,
	DocumentViewNav,
	MyAppliancesNav,
	AddReaminderNav,
	ApplianceMoreDetailsNav,
	ComingSoonNav,
	MyRewardsNav,
} from '@navigation/NavigationConstant';
import { NavigationContainer } from '@react-navigation/native';
import InviteFriends from '@screens/InviteFriends';
import SearchContact from '@screens/InviteFriends/SearchContact';
import MyTabs from './BottomTabNaviagtion';
import AddDocument from '@screens/AddDocument';
import AddAsset from '@screens/AddAssets';
import DocumentView from '@screens/DocumentView';
import ApplianceMoreDetails from '@screens/Appliance/ApplianceMoreDetails';
import { createDrawerNavigator } from '@react-navigation/drawer';
import CustomDrawer from './DrawerNavigation';
import MyAppliances from '@screens/MyAppliances/myAppliances';
import AddRemainders from '@screens/AddRemainders';
import ComingSoon from '@screens/ComingSoon';
import MyRewards from '@screens/MyRewards/MyRewards';
import TabRemainder from './tabRemainder';
import MyAssetsVintage from '@screens/MyassetsVintage/MyAssetsVintage';
import DocumentRemainder from '@screens/DocumentRemainder';

const Drawer = createDrawerNavigator();

const SignInStack = (props) => {
	return (
		<NavigationContainer>
			<Drawer.Navigator
				initialRouteName={MyTabs}
				drawerContent={(props) => <CustomDrawer {...props} />}>
				<Drawer.Screen
					name="bottomTab"
					component={MyTabs}
					options={{
						headerShown: false,
					}}
				/>

				<Drawer.Screen
					name={AddDocumentNav}
					component={AddDocument}
					options={{
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name={AddReaminderNav}
					component={AddRemainders}
					options={{
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name={'DocumentRemainder'}
					component={DocumentRemainder}
					options={{
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name={AddAssetNav}
					component={AddAsset}
					options={{
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name={DocumentViewNav}
					component={DocumentView}
					options={{
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name={SearchContactNav}
					component={SearchContact}
					options={{
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name={invitefriendsNav}
					component={InviteFriends}
					options={{
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name={MyAppliancesNav}
					component={MyAppliances}
					options={{
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name={ApplianceMoreDetailsNav}
					component={ApplianceMoreDetails}
					options={{
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name={ComingSoonNav}
					component={ComingSoon}
					options={{
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name={MyRewardsNav}
					component={MyRewards}
					options={{
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name="TabRemainder"
					component={TabRemainder}
					options={{
						headerShown: false,
					}}
				/>
				<Drawer.Screen
					name="MyAssetsVintage"
					component={MyAssetsVintage}
					options={{
						headerShown: false,
					}}
				/>
			</Drawer.Navigator>
		</NavigationContainer>
	);
};

export default SignInStack;
