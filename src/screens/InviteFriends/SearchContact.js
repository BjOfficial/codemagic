/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState, useEffect, useRef } from 'react';
import {
	Text,
	View,
	ScrollView,
	Image,
	TouchableOpacity,
	Alert,
	PermissionsAndroid,
	ActivityIndicator,
	Linking,
	FlatList,
	Platform,
} from 'react-native';
import styles from './styles';
import HomeHeader from '@components/HomeHeader';
import {
	whatsapp_icon,
	networkadded,
	search_icon,
	message,
	close,
} from '@constants/Images';
import SearchInput from '@components/SearchInput';
import Contacts from 'react-native-contacts';
import ThemedButton from '@components/ThemedButton';
import { colorBlack, colorLightBlue, colorWhite } from '@constants/Colors';
import { font12 } from '@constants/Fonts';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';
import BottomSheetComp from '@components/BottomSheetComp';
import { SearchContactNav } from '@navigation/NavigationConstant';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorBoundary from '@services/ErrorBoundary'

const InviteFriends = (props) => {
	console.log('====================================');
	console.log("search contact res1", props.route.params);
	console.log('====================================');
	const navigation = useNavigation();
	const focused = useIsFocused();
	const inputRef = useRef(null);
	const [searchvalue, setSearchvalue] = useState('');
	const [contactlist, setContactlist] = useState([]);
	const [filteredcontactlist, setFilteredContactlist] = useState([]);
	const [newContactList, setNewContactlist] = useState([]);
	const [searchContactLists, setSearchContactlists] = useState([]);
	const [loading, setloading] = useState(false);
	const [initialloading, setinitialloading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [phoneNumber, setPhoneNumber] = useState(null);

	const searchContactList = (data) => {
		console.log('search input,data', data);
		if (data.length > 7) {
			inputRef.current.clear();
		}
		setSearchvalue(data);
		setloading(true);
		let filterdata = [...newContactList].filter(
			(item) =>
				item.localName.toLowerCase().includes(data.toLowerCase()) ||
				item.phone_number.includes(data.toLowerCase())
		);
		setSearchContactlists(filterdata);
		setTimeout(() => {
			setloading(false);
		}, 1000);
	};
	
	useEffect(() => {
		setNewContactlist(props.route.params);
	}, [focused]);
	
	const sendInvite = async (number, contact, index) => {
		const getToken = await AsyncStorage.getItem('loginToken');
		const payload = { phone_number: number };
		let ApiInstance = await new APIKit().init(getToken);
		let contactlistData = [...newContactList];
		contactlistData[index].is_already_invited = true;
		setNewContactlist(contactlistData);
		let awaitresp = await ApiInstance.post(constants.inviteContact, payload);
		if (awaitresp.status == 1) {
			setModalVisible(true);
			setPhoneNumber(number);
		} else {
			Alert.alert(awaitresp.err_msg);
		}
	};

	const renderContactStatus = (contact, index) => {
		if (contact.is_user) {
			return (
				<TouchableOpacity>
					<Image source={networkadded} style={styles.netword_added_icon} />
				</TouchableOpacity>
			);
		} else if (contact.is_already_invited) {
			return (
				<TouchableOpacity
					disabled={contact.is_already_invited}
					style={styles.invitesentBtn}
					onPress={() => { }}>
					<Text style={styles.invitesent}>Invite Sent</Text>
				</TouchableOpacity>
			);
		} else if (contact.is_requested) {
			return (
				<ThemedButton
					title="Accept"
					onPress={() => sendInvite(contact.phone_number, contact, index)}
					color={colorLightBlue}
					labelStyle={{ fontSize: font12 }}
					buttonStyle={{ padding: 0, margin: 0 }}></ThemedButton>
			);
		} else {
			return (
				<ThemedButton
					title="Invite"
					mode="outlined"
					onPress={() => sendInvite(contact.phone_number, contact, index)}
					buttonStyle={{ padding: 0, margin: 0 }}
					labelStyle={{ fontSize: font12 }}
					color={colorLightBlue}></ThemedButton>
			);
		}
	};
	const copyToClipboard = () => {
		const content =
			'“Hi, I am an Alpha user of Azzetta, a very useful App to manage all appliances and gadgets. You can learn more about this App at www.azzetta.com. I would like to invite you to register as a Beta user of Azzetta and look forward to seeing you soon as a part of my trusted network on Azzetta.”';
		Clipboard.setString(content);
		Toast.show('Link Copied.', Toast.LONG);
	};
	const shareWhatsapp = () => {
		const content =
			'“Hi, I am an Alpha user of Azzetta, a very useful App to manage all appliances and gadgets. You can learn more about this App at www.azzetta.com. I would like to invite you to register as a Beta user of Azzetta and look forward to seeing you soon as a part of my trusted network on Azzetta.”';
		Linking.openURL('whatsapp://send?text=' + content);
	};
	const renderItem = ({ item, index }) => {
		return (
			<ErrorBoundary>
				<View style={styles.contactGroup} key={`contact_index_${index + 1}`}>
					<View style={{ flex: 0.2 }}>
						<View style={[styles.contactIcon, { backgroundColor: '#6AB5D8' }]}>
							<Text style={styles.contactIconText}>{item.localName.charAt(0)}</Text>
						</View>
					</View>
					<View style={{ flex: 0.53 }}>
						<View style={{ flexDirection: 'column' }}>
							<Text style={styles.contactName}>{item.localName}</Text>
							<Text style={styles.contactnumber}>
								{item.phone_number.replace(/\s/g, '')}
							</Text>
						</View>
					</View>
					<View
						style={{
							flex: 0.27,
							flexDirection: 'row',
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						{renderContactStatus(item, index)}
					</View>
				</View>
			</ErrorBoundary>
		);
	};
	const clearSearch = () => {
		searchContactList('');
		setSearchContactlists([]);
	};
	const shareWhatsappLink = () => {
		let numbers = phoneNumber;
		let text =
			'“Hi, I am an Alpha user of Azzetta, a very useful App to manage all appliances and gadgets. You can learn more about this App at www.azzetta.com. I would like to invite you to register as a Beta user of Azzetta and look forward to seeing you soon as a part of my trusted network on Azzetta.”';
		Linking.openURL('whatsapp://send?text=' + text + '&phone=91' + numbers);
		setModalVisible(false);
	};
	const shareMessageLink = () => {
		let numbers = `91${phoneNumber}`;
		let text =
			'“Hi, I am an Alpha user of Azzetta, a very useful App to manage all appliances and gadgets. You can learn more about this App at www.azzetta.com. I would like to invite you to register as a Beta user of Azzetta and look forward to seeing you soon as a part of my trusted network on Azzetta.”';

		const url =
			Platform.OS === 'android'
				? `sms:${numbers}?body=${text}`
				: `sms:/open?addresses=${numbers}&body=${text}`;
		Linking.canOpenURL(url)
			.then((supported) => {
				if (!supported) {
					console.log('Unsupported url: ' + url);
				} else {
					return Linking.openURL(url);
				}
			})
			.catch((err) => console.error('An error occurred', err));
		setModalVisible(false);
	};
	return (
		<ErrorBoundary>
			<View style={[styles.container, { backgroundColor: colorWhite }]}>
				<HomeHeader title="Search" navigationProp="search" />
				<View style={styles.searchView}>
					<SearchInput
						inputRef={inputRef}
						placeholder="search for name,number"
						value={searchvalue}
						onChangeText={(data) => searchContactList(data)}
						backgroundColor={colorWhite}
						icon={searchvalue.length == '' ? search_icon : close}
						onPress={() => clearSearch()}
						style={{color: colorBlack}}
					/>
				</View>
				{searchvalue.length != '' &&
					newContactList &&
					newContactList.length == 0 && (
						<Text style={styles.norecords}>No Contacts Found</Text>
					)}
				<View style={styles.secondSection}>
					{searchContactLists.length > 0 ?
						<ScrollView scrollEventThrottle={400}>
							{searchContactLists && (
								<FlatList
									extraData={searchContactLists}
									data={searchContactLists}
									renderItem={renderItem}
								/>
							)}
						</ScrollView>
						: <ScrollView scrollEventThrottle={400}>
							{newContactList && (
								<FlatList
									extraData={newContactList}
									data={newContactList}
									renderItem={renderItem}
								/>
							)}
						</ScrollView>
					}
					{(loading || initialloading) && (
						<View
							style={{
								flex: 1,
								flexDirection: 'row',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
							<ActivityIndicator color={colorLightBlue} size="large" />
						</View>
					)}

					{modalVisible && (
						<BottomSheetComp
							panelStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
							sheetVisible={modalVisible}
							closePopup={() => setModalVisible(false)}>
							<View style={styles.borderLineMain}>
								<TouchableOpacity onPress={() => setModalVisible(false)}>
									<View style={styles.borderLine}></View>
								</TouchableOpacity>
							</View>
							<View style={styles.contentPadding}>
								{/* <TouchableOpacity onPress={()=>shareWhatsappLink()}><Text>Whatsapp</Text></TouchableOpacity>
                   <TouchableOpacity onPress={()=>shareMessageLink()}><Text>Message</Text></TouchableOpacity> */}
								<Text style={styles.title}>Share to</Text>
								<View style={{ flexDirection: 'row', paddingTop: 12 }}>
									<TouchableOpacity
										onPress={() => shareWhatsappLink()}
										style={styles.icongroup}>
										<Image source={whatsapp_icon} style={styles.smallIcons} />
										<Text style={styles.sharediconText}>Whatsapp</Text>
									</TouchableOpacity>
									<TouchableOpacity
										style={styles.icongroup}
										onPress={() => shareMessageLink()}>
										<Image source={message} style={styles.smallIcons} />
										<Text style={styles.sharediconText}>Message</Text>
									</TouchableOpacity>
								</View>
							</View>
						</BottomSheetComp>
					)}
				</View>
			</View>
		</ErrorBoundary>
	);
};
export default InviteFriends;
