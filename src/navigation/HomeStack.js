import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
	AddAssetNav,
	AddDocumentNav,
	AddReaminderNav,
	ApplianceMoreDetailsNav,
	ComingSoonNav,
	dashboardNav,
	DocumentViewNav,
	invitefriendsNav,
	MyAppliancesNav,
	SearchContactNav,
	CalendarNav,
	RemindersNav,
	OtherReminderNav,
  AddLocationNav,
  EditLocationNav,
  MyProfileNav,
  EditProfileNav,
  forgotpasswordNav
} from './NavigationConstant';
import Dashboard from '@screens/Dashboard';
import AddAsset from '@screens/AddAssets';
import AddRemainders from '@screens/AddRemainders';
import MyAppliances from '@screens/MyAppliances/myAppliances';
import ApplianceMoreDetails from '@screens/Appliance/ApplianceMoreDetails';
import MyTabs from './BottomTabNaviagtion';
import DocumentRemainder from '@screens/DocumentRemainder';
import DocumentView from '@screens/DocumentView';
import InviteFriends from '@screens/InviteFriends';
import SearchContact from '@screens/InviteFriends/SearchContact';
import ComingSoon from '@screens/ComingSoon';
import AddDocument from '@screens/AddDocument';
import Remainders from '@screens/Remainders';
import Calendar from '@screens/Calendar';
import OtherReminder from '@screens/OtherReminder';
import AddLocation from "@screens/AddLocation";
import EditLocation from "@screens/AddLocation/EditLocation";
import MyProfile from "@screens/Profile";
import EditProfile from "@screens/Profile/EditProfile";
import ForgotPassword from '@screens/ForgotPassword';
const Stack = createStackNavigator();
const HomeStack = (props) => {
	return (
		<Stack.Navigator
			screenOptions={{
				headerShown: false,
			}}>
			<Stack.Screen name={'bottomTab'} component={MyTabs} />
			<Stack.Screen name={dashboardNav} component={Dashboard} />
			<Stack.Screen name={AddAssetNav} component={AddAsset} />
			<Stack.Screen name={AddDocumentNav} component={AddDocument} />
			<Stack.Screen name={MyAppliancesNav} component={MyAppliances} />
			<Stack.Screen
				name={ApplianceMoreDetailsNav}
				component={ApplianceMoreDetails}
			/>
			<Stack.Screen name={AddReaminderNav} component={AddRemainders} />
			<Stack.Screen name={'DocumentRemainder'} component={DocumentRemainder} />
			<Stack.Screen name={DocumentViewNav} component={DocumentView} />
			<Stack.Screen name={SearchContactNav} component={SearchContact} />
			<Stack.Screen name={invitefriendsNav} component={InviteFriends} />
			<Stack.Screen name={ComingSoonNav} component={ComingSoon} />
			<Stack.Screen name={RemindersNav} component={Remainders} />
			<Stack.Screen name={CalendarNav} component={Calendar} />
			<Stack.Screen name={OtherReminderNav} component={OtherReminder}/>
			<Stack.Screen name={AddLocationNav} component={AddLocation} />
			<Stack.Screen name={EditLocationNav} component={EditLocation} />
			<Stack.Screen name={MyProfileNav} component={MyProfile} />
			<Stack.Screen name={EditProfileNav} component={EditProfile} />
			<Stack.Screen name={forgotpasswordNav} component={ForgotPassword} />
	   
		</Stack.Navigator>
	);
};
export default HomeStack;
