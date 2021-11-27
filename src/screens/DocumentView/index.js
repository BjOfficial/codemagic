import { constants } from '@utils/config';
import React, { useState, useEffect } from 'react';
import * as RN from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIKit from '@utils/APIKit';
import BackArrowComp from '@components/BackArrowComp';
import {
	colorAsh,
	colorBlack,
	colorBrown,
	colorDropText,
	colorLightBlue,
	colorplaceholder,
	colorWhite,
} from '@constants/Colors';
import {
	addreminder_white,
	noDocument,
	my_reminder,
	no_image_icon,
	alert_icon,
	calendar_check,
	documentDefaultImages,
} from '@constants/Images';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { font13, font12 } from '@constants/Fonts';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { ComingSoonNav } from '@navigation/NavigationConstant';

const DocumentView = (props) => {
	let reminder_data = [
		'You can set up fully customizable reminders for dates (1 week / 1 month or any period in advance of the end date) for end of warranty, AMC, Extended Warranty, Maintenance Service due dates for all your appliances and gadgets so that you can raise issues within the due dates. ',

		'Similarly, you can set up renewal dates for your Passport, Driving License, etc., and payment due dates of your EMI or ECS mandate, etc. Further, these alerts will get populated in your native calendar in your cell phone.',

		'\u{2B24}   You can set your own customizable and mul',
		'\u{2B24}   Important dates for end of warranty, AMC, Extended Warranty, Regular Service ',
		'\u{2B24}   Renewal related - Passport, Driving License for self and family, etc.,',
		'\u{2B24}  Payment due dates - EMI, Loan, ECS, Home mortgage, Insurance premium  etc',
		'\u{2B24}   Any important dates in your life',
	];
	let edit = [
		'● There are several attributes included for each asset that will be enabled in the beta version ',
		'● The rating of the brand, retailers, service technicians and comments are to help your network in their own purchase decisions',
		'● Also you will earn Azzeti coins when the Brands and Retailers get your ratings and comments that will help them to serve you better ',
		'● Do add as many documents, appliances, gadgets and others as you can to test the Alpha version ',
		'● You will be able to edit and add these additional details in Beta version in the next 3 weeks',
	];
	const IsFocused = useIsFocused();
	const navigation = useNavigation();
	const [view, setView] = useState(null);
	const documentId = props?.route?.params?.document_id;
	const [imageVisible, setImageVisible] = useState(false);
	console.log('documnet view', documentId);
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			viewDocument();
		});
		viewDocument();
		return unsubscribe;
	}, [IsFocused]);

	const viewDocument = async () => {
		const getToken = await AsyncStorage.getItem('loginToken');
		let ApiInstance = await new APIKit().init(getToken);
		console.log('documentId', documentId);

		let awaitlocationresp = await ApiInstance.get(
			constants.viewDocument + '?document_id=' + documentId._id
		);
		if (awaitlocationresp.status == 1) {
			setView(awaitlocationresp.data.data);
		} else {
			console.log('not listed location type');
		}
	};
	const onImageLoadingError = () => {
		setImageVisible(true);
	};
	try {
	let assetName = view && view.document_type.name.replace(/ /g, '');
	let brandName = "Others";
	var defImg;
	documentDefaultImages.forEach((assetType) => {
		defImg = assetType[assetName][brandName].url;
	});
} catch (e) {
	defImg = noDocument;
}
return (
	<RN.View
		style={{
			flex: 1,
			backgroundColor: colorWhite,
			height: RN.Dimensions.get('screen').height,
		}}>
		<RN.View
			style={{
				flexDirection: 'row',
				marginTop: 15,
				marginLeft: 20,
				marginBottom: 10,
				paddingTop: RN.Platform.OS === 'ios' ? 30 : 0,
			}}>
			<RN.View style={{ flex: 1 }}>
				<BackArrowComp />
			</RN.View>
			<RN.View style={{ flex: 9 }}>
				<RN.Text
					style={{
						fontFamily: 'Rubik-Bold',
						fontSize: 15,
						color: colorBlack,
					}}>
					{documentId !== null &&
						documentId.document_type &&
						documentId.document_type.is_other_value == true
						? documentId.document_type.other_value
						: documentId.document_type.name}
				</RN.Text>
			</RN.View>
			<RN.View style={{ flex: 1 }}>
				<TouchableOpacity
					onPress={() => {
						navigation.navigate('DocumentRemainder', {
							document_ids: view._id,
							reminder_data: 'editDocumentReminder',
							comments: view.reminder.comments,
							title: view.reminder.title._id,
							date: view.reminder.date,
						});
					}}>
					{view && !view.reminder ? null : (
						<EvilIcons name="bell" color={colorBlack} size={25} />
					)}
				</TouchableOpacity>
			</RN.View>
			<RN.View style={{ flex: 1 }}>
				<TouchableOpacity
					onPress={() => {
						navigation.navigate(ComingSoonNav, {
							title: 'Edit Document',
							content: edit,
							icon: my_reminder,
						});
					}}>
					<RN.Text>
						<MaterialCommunityIcons
							name="dots-vertical"
							color={colorBlack}
							size={20}
						/>
					</RN.Text>
				</TouchableOpacity>
			</RN.View>
		</RN.View>
		<RN.ScrollView>
			<RN.View
				style={{
					flex: 1,
					elevation: 4,
					shadowColor: '#000',
					shadowOffset: {
						width: 0,
						height: 2,
					},
					shadowOpacity: 0.25,
					shadowRadius: 3.84,
					width: RN.Dimensions.get('screen').width * 0.95,
					alignSelf: 'center',
					borderRadius: 20,
					marginTop: 20,
					backgroundColor: colorWhite,
				}}>
				<RN.View
					style={{
						borderWidth: 1,
						borderColor: '#e7f5ff',
						backgroundColor: '#e7f5ff',
						width: RN.Dimensions.get('screen').width * 0.8,
						alignSelf: 'center',
						borderRadius: 20,
						height: 50,
						marginTop: 20,
					}}>
					<RN.Text
						style={{
							color: colorLightBlue,
							alignSelf: 'center',
							marginTop: 15,
							fontFamily: 'Rubik-Regular',
							fontSize: 17,
						}}>
						{'Document Details:'}
					</RN.Text>
				</RN.View>

				<RN.View style={{ marginTop: 20 }}>
					<RN.View style={{ flexDirection: 'row' }}>
						<RN.View style={{ flex: 1 }}>
							<RN.Image
								source={require('../../assets/images/asset_detail_and_edit/serialnumber.png')}
								style={{
									height: 15,
									width: 20,
									marginTop: 20,
									marginLeft: 30,
								}}
							/>
						</RN.View>
						<RN.View style={{ flex: 5 }}>
							<RN.View>
								<RN.Text
									style={{
										color: '#747474',
										fontFamily: 'Rubik-Regular',
										fontSize: 13,
										marginTop: 20,
									}}>
									{'Document Number'}
								</RN.Text>
							</RN.View>
							<RN.View>
								<RN.Text
									style={{
										fontFamily: 'Rubik-Regular',
										fontSize: 14,
										marginTop: 10,
										color: colorDropText,
									}}>
									{view && view.document_type && view.document_number}
								</RN.Text>
							</RN.View>
						</RN.View>
					</RN.View>
					<RN.View
						style={{
							borderBottomColor: colorAsh,
							borderBottomWidth: 0.5,
							width: RN.Dimensions.get('screen').width * 0.8,
							alignSelf: 'center',
							marginTop: 20,
						}}
					/>
					<RN.View style={{ flexDirection: 'row', marginTop: 10 }}>
						<RN.View style={{ flex: 1 }}>
							<RN.Image
								source={calendar_check}
								style={{
									height: 18,
									width: 17,
									marginTop: 20,
									marginLeft: 30,
								}}
							/>
						</RN.View>
						<RN.View style={{ flex: 5 }}>
							<RN.View>
								<RN.Text
									style={{
										color: '#747474',
										fontFamily: 'Rubik-Regular',
										fontSize: 14,
										marginTop: 20,
									}}>
									{'Date Of Issue'}
								</RN.Text>
							</RN.View>
							<RN.View>
								<RN.Text
									style={{
										fontFamily: 'Rubik-Regular',
										fontSize: 14,
										marginTop: 10,
										color: colorDropText,
									}}>
									{view &&
										view.document_type &&
										moment(new Date(view.issue_date)).format('DD/MM/YYYY')}
								</RN.Text>
							</RN.View>
						</RN.View>
					</RN.View>
					<RN.View
						style={{
							borderBottomColor: colorAsh,
							borderBottomWidth: 0.5,
							width: RN.Dimensions.get('screen').width * 0.8,
							alignSelf: 'center',
							marginTop: 20,
						}}
					/>
					<RN.View style={{ flexDirection: 'row' }}>
						<RN.View style={{ flex: 1 }}>
							<RN.Image
								source={require('../../assets/images/asset_detail_and_edit/warrantyending.png')}
								style={{
									height: 18,
									width: 17,
									marginTop: 20,
									marginLeft: 30,
								}}
							/>
						</RN.View>
						<RN.View style={{ flex: 5 }}>
							<RN.View>
								<RN.Text
									style={{
										color: '#747474',
										fontFamily: 'Rubik-Regular',
										fontSize: 14,
										marginTop: 20,
									}}>
									{'Date Of Expiry'}
								</RN.Text>
							</RN.View>
							<RN.View>
								<RN.Text
									style={{
										fontFamily: 'Rubik-Regular',
										fontSize: 14,
										marginTop: 10,
										color: colorDropText,
									}}>
									{view &&
										view.expire_date &&
										moment(new Date(view.expire_date)).format('DD/MM/YYYY')}
								</RN.Text>
							</RN.View>
						</RN.View>
					</RN.View>
					<RN.View
						style={{
							borderBottomColor: colorAsh,
							borderBottomWidth: 0.5,
							width: RN.Dimensions.get('screen').width * 0.8,
							alignSelf: 'center',
							marginTop: 20,
						}}
					/>
					<RN.View style={{ flexDirection: 'row' }}>
						<RN.View style={{ flex: 1 }}>
							<RN.Image
								source={require('../../assets/images/asset_detail_and_edit/reminderdate.png')}
								style={{
									height: 18,
									width: 17,
									marginTop: 20,
									marginLeft: 30,
								}}
							/>
						</RN.View>
						<RN.View style={{ flex: 5 }}>
							<RN.View>
								<RN.Text
									style={{
										color: '#747474',
										fontFamily: 'Rubik-Regular',
										fontSize: 14,
										marginTop: 20,
									}}>
									{'Reminder Date'}
								</RN.Text>
							</RN.View>
							<RN.View>
								<RN.Text
									style={{
										fontFamily: 'Rubik-Regular',
										fontSize: 14,
										marginTop: 10,
										color: colorDropText,
									}}>
									{view &&
										view.reminder &&
										moment(new Date(view.reminder.date)).format('DD/MM/YYYY')}
								</RN.Text>
							</RN.View>
						</RN.View>
					</RN.View>

					{view && view.image.length > 0 ? (
						view.image.map((image, index) => {
							return (
								<RN.View style={{ marginBottom: 10 }} key={index}>
									<RN.Image
										source={
											imageVisible
												? defImg
												: { uri: 'file:///' + image.path }
										}
										onError={() => onImageLoadingError()}
										style={{
											borderStyle: 'dashed',
											borderWidth: 1,
											borderRadius: 15,
											height: RN.Dimensions.get('screen').height / 5,
											width: '90%',
											alignSelf: 'center',
											marginTop: 20,
											marginBottom: 20,
											elevation: 2,
										}}
									/>
								</RN.View>
							);
						})
					) : (
						<RN.View>
							<RN.Image
								source={defImg}
								style={{
									borderStyle: 'dashed',
									borderWidth: 1,
									borderRadius: 15,
									height: RN.Dimensions.get('screen').height / 8,
									width:'20%',
									marginLeft: 20,
									marginRight: 10,
									paddingLeft: 5,
									marginTop: 30,
									marginBottom: 20,
									alignSelf: 'center',
									bottom: 10,
									elevation: 2,
								}}
							/>
						</RN.View>
					)}
				</RN.View>
			</RN.View>

			<RN.View style={styles.reminderBtnView}>
				{view && !view.reminder ? (
					<RN.TouchableOpacity
						onPress={() => {
							navigation.navigate('DocumentRemainder', {
								document_ids: view._id,
								reminder_data: 'documentReminder',
							});
						}}
						style={styles.reminderBtnn}>
						<RN.Image
							source={addreminder_white}
							style={styles.reminderIcon}
						/>
						<RN.Text style={styles.reminderText}>Add Reminder</RN.Text>
					</RN.TouchableOpacity>
				) : null}
			</RN.View>
		</RN.ScrollView>
		{view && !view.reminder ? null : (
			<RN.View style={styles.bottomFixed}>
				<RN.View style={styles.warningView}>
					<RN.View
						style={{
							flex: 0.1,
							alignItems: 'center',
							justifyContent: 'center',
						}}>
						<RN.ImageBackground
							source={alert_icon}
							resizeMode="contain"
							style={styles.warningImg}
						/>
					</RN.View>
					<RN.View style={{ flex: 0.67 }}>
						<RN.Text style={styles.warrantytext}>
							{view && view.reminder && view.reminder.title.name} {' - '}
							{view &&
								view.reminder &&
								moment(new Date(view.reminder.date)).format('DD/MM/YYYY')}
						</RN.Text>
					</RN.View>
					<RN.View style={{ flex: 0.23 }}>
						<RN.TouchableOpacity style={styles.viewalertBtn} onPress={() => {
							navigation.navigate('DocumentRemainder', {
								document_ids: view._id,
								reminder_data: 'editDocumentReminder',
								comments: view.reminder.comments,
								title: view.reminder.title._id,
								date: view.reminder.date,
								otherTitle: view.reminder.title.other_value
							});
						}
						}>
							<RN.Text style={styles.viewalertlabel}>View alert</RN.Text>
						</RN.TouchableOpacity>
					</RN.View>
				</RN.View>
			</RN.View>
		)}
	</RN.View>
);
};

export default DocumentView;
const styles = RN.StyleSheet.create({
	reminderBtnn: {
		backgroundColor: colorLightBlue,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 30,
		padding: 12,
		justifyContent: 'center',
	},
	reminderIcon: {
		width: 20,
		height: 20,
	},
	reminderText: {
		color: colorWhite,
		fontSize: 13,
		fontFamily: 'Rubik-Medium',
		marginLeft: 10,
	},
	reminderBtnView: {
		width: '60%',
		marginLeft: '20%',
		marginVertical: 30,
		paddingBottom: 80,
		bottom: 10,
	},
	bottomFixed: {
		backgroundColor: colorWhite,
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		padding: 20,
		paddingVertical: 30,
		shadowColor: colorplaceholder,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.4,
		shadowRadius: 7,
		elevation: 24,
	},
	warningView: {
		backgroundColor: colorBrown,
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		justifyContent: 'center',
	},
	warningImg: {
		width: 20,
		height: 15,
	},
	warrantytext: {
		color: colorWhite,
		fontFamily: 'Rubik-Regular',
		fontSize: font13,
	},
	viewalertBtn: {
		backgroundColor: colorWhite,
		borderRadius: 30,
		padding: 5,
		paddingHorizontal: 10,
	},
	viewalertlabel: {
		fontSize: font12,
		color: colorBrown,
		fontFamily: 'Rubik-Regular',
	},
});
