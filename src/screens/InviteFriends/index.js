/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState, useEffect } from 'react';
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
import HeaderwithArrow from '@components/HeaderwithArrow';
import {
	invite_friends,
	whatsapp_icon,
	copy_icon,
	networkadded,
	search_icon,
	message,
} from '@constants/Images';
import SearchInput from '@components/SearchInput';
import Contacts from 'react-native-contacts';
import ThemedButton from '@components/ThemedButton';
import { colorLightBlue, colorsearchbar } from '@constants/Colors';
import { font12 } from '@constants/Fonts';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import Clipboard from '@react-native-community/clipboard';
import Toast from 'react-native-simple-toast';
import BottomSheetComp from '@components/BottomSheetComp';
import { MyRewardsNav, SearchContactNav } from '@navigation/NavigationConstant';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ErrorBoundary from '@services/ErrorBoundary'

const InviteFriends = () => {
	const navigation = useNavigation();
	const focused = useIsFocused();
	const [searchvalue, setSearchvalue] = useState(null);
	const [contactlist, setContactlist] = useState([]);
	const [filteredcontactlist, setFilteredContactlist] = useState([]);
	const [newContactList, setNewContactlist] = useState(null);
	const [loading, setloading] = useState(false);
	const [initialloading, setinitialloading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false);
	const [searchButtonVisible, setSearchButtonVisible] = useState(true);

	
	const [phoneNumber, setPhoneNumber] = useState(null);

	const searchClick = (screen,data) => {
		navigation.navigate(screen,data);
	};
	const contactpermission = () => {
		if (Platform.OS === 'android') {
			try {
				PermissionsAndroid.request(
					PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
					{
						title: 'Contacts',
						message: 'This app would like to view your contacts.',
					}
				).then((res) => {
					if (res == 'granted') {
						loadContacts();
					} else {
						Alert.alert('To help you invite friends and family on Azzetta, allow Azzetta access to your contacts. Go to your devices Settings > Permissions, and turn Contacts on.')
						setinitialloading(false);
						// Alert.alert('permission denied for contact list');
					}
				});
			} catch (e) {
				console.log('contact err', e);
			}
		} else {
			loadContacts();
		}
	};
	const loadContacts = () => {
		Contacts.getAll().then(async (contacts) => {
			const getToken = await AsyncStorage.getItem('loginToken');
			let filterrecords = [];
			let framecontacts =
        contacts &&
        contacts.length > 0 &&
        contacts.map((obj) => {
        	if (obj.phoneNumbers.length > 0) {
        		let phoneObj = {
        			name: obj.displayName || obj.phoneNumbers[0].number,
        			phone_number: obj.phoneNumbers[0].number.replace(
        				/([^0-9])+/g,
        				''
        			),
        		};
        		if (phoneObj.phone_number.length > 10) {
        			phoneObj.phone_number = phoneObj.phone_number.replace('91', '');
        		}
        		filterrecords.push(phoneObj);
        	} else {
        		console.log('unliste record', obj);
        	}
        });

if(filterrecords.length > 0) {
			const payload = { contacts: filterrecords };
			let ApiInstance = await new APIKit().init(getToken);
			let awaitresp = await ApiInstance.post(constants.syncContacts, payload);
			if (awaitresp.status == 1) {
				setTimeout(() => {
					setinitialloading(true);
					loadContactList(filterrecords,awaitresp.data);
				}, 500);
				console.log('success contact');
			} else {
				console.log('failure contact');
			}
		} else {
			setinitialloading(false);
			Alert.alert('No contacts Found');
		}
		});
		
	};
	const loadContactList = async (mycontacts,resContacts) => {
	
		// if (awaitresp.status == 1) {
			// setinitialloading(false);
			// let contactDatas = resContacts.data;
			
			// let myContectList = mycontacts.map(({ phone_number }) => phone_number);
			let responseContactList = resContacts.data.map(({ phone_number }) => phone_number);
			let localContactList = mycontacts.map(({ phone_number }) => phone_number);
			// let finalContactList = resContacts.data.filter(({ phone_number }) => {
			// 	return myContectList.includes(phone_number);
			// });

			let finalContactList = resContacts.data.filter(({ phone_number}, index) => {
				console.log('====================================');


				console.log('====================================');
				if(localContactList.includes(phone_number)){
					let localName = mycontacts.filter((ele) => ele.phone_number == phone_number );
					// console.log("contacts filter local map",localName.map(({ name }) => name).toString());

					resContacts.data[index].localName = localName.map(({ name }) => name).toString();
				}
				return localContactList.includes(phone_number);
			});
			console.log("finalContactList2",finalContactList);

			//   let possibilities = finalContactList.length / 10;
			let alphabeticRecords = [...finalContactList]
					.filter((obj) => /[a-zA-Z]/g.test(obj.localName))
					.sort((a, b) => a.localName > b.localName),
				nonalphabeticRecords = [...finalContactList].filter((obj) =>
					/[^a-zA-Z]/g.test(obj.localName)
				);
			// console.log('nonaplpha', nonalphabeticRecords.length);
			// console.log('alpha', alphabeticRecords.length);
			let mergecontacts = [...alphabeticRecords, ...nonalphabeticRecords];
			// console.log('mergecontacts', mergecontacts.length);
			setNewContactlist([...mergecontacts]);
			setinitialloading(false);
			setSearchButtonVisible(false);
		// } else {
		// 	Alert.alert('No contacts Found');
		// 	setinitialloading(false);
		// }
	};
	// contactpermission();
	// setinitialloading(true);
	useEffect(() => {
		// console.log('isFocused', focused);
		setNewContactlist([]);
		setinitialloading(true);
		contactpermission();

		// loadContactList(10);
	}, [focused]);
	// useEffect(() => {}, [newContactList, contactlist]);
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
	// useEffect(() => {
	//   loadContactList();
	// }, [contactlist]);
	console.log('contactlist length', newContactList && newContactList.length);
	const navigatePage = (data) => {
		setSearchvalue(data);
		navigation.navigate(SearchContactNav);
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
					onPress={() => {}}>
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

			//
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
		<View style={styles.container}>
			<View style={styles.firstSection}>
				<HeaderwithArrow title="Invite Friends" />
				<View style={styles.invitegroup}>
					<View style={{ flex: 0.5 }}>
						<Image source={invite_friends} style={styles.inviteImg} />
					</View>
					<View style={styles.invitePara}>
						<Text style={styles.invitepara}>
              Earn 5 Coins For Each Invite You Send And 50 Coins If They Install
              Azzetta.
						</Text>
						<TouchableOpacity
							onPress={() => {
								navigation.navigate(MyRewardsNav);
							}}>
							<Text style={styles.knowtext}>Know more</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
			<View style={styles.secondSection}>
				<View style={{ flexDirection: 'row', paddingTop: 12 }}>
					<TouchableOpacity
						onPress={() => shareWhatsapp()}
						style={styles.icongroup}>
						<Image source={whatsapp_icon} style={styles.smallIcons} />
						<Text style={styles.sharediconText}>Whatsapp</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.icongroup}
						onPress={() => copyToClipboard()}>
						<Image source={copy_icon} style={styles.smallIcons} />
						<Text style={styles.sharediconText}>Copy Link</Text>
					</TouchableOpacity>
				</View>

				<View style={styles.bottomBorder}></View>
				<Text style={styles.phoneTitle}>Phone Contacts</Text>
				<TouchableOpacity disabled={searchButtonVisible} onPress={() => searchClick(SearchContactNav,newContactList)}>
					{/* <SearchInput
            disableInput={true}
            placeholder="Search for name, number"
            value={searchvalue}
            onChangeText={(data) => navigatePage(data)}
            editable_text={false}
            backgroundColor={colorsearchbar}
            icon={search_icon}
          /> */}
					<SearchInput
						disableInput={true}
						placeholder="search for name, number"
						value={searchvalue}
						onChangeText={(data) => navigatePage(data)}
						editable_text={false}
						backgroundColor={colorsearchbar}
						icon={search_icon}
						editable_text={searchButtonVisible}
						style={{ padding: 10 }}
					/>
				</TouchableOpacity>
				<ScrollView scrollEventThrottle={400}>
					{newContactList && (
						<FlatList
							extraData={newContactList}
							data={newContactList}
							renderItem={renderItem}
						/>
					)}
				</ScrollView>
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
				{/* {contactlist && contactlist.length == 0 && (
					<Text style={styles.norecords}>No Contacts Found</Text>
				)} */}
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
