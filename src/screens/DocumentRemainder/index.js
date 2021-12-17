import React, { useEffect, useState, useRef } from 'react';
import { colorDropText, colorLightBlue, colorWhite } from '@constants/Colors';
import * as RN from 'react-native';
import { Formik } from 'formik';
import ModalDropdownComp from '@components/ModalDropdownComp';
import FloatingInput from '@components/FloatingInput';
import { arrow_down, white_arrow } from '@constants/Images';
import { font14 } from '@constants/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config';
import { DateOfRemainder } from './DateOfRemainder';
import ThemedButton from '@components/ThemedButton';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import style from './style';
import StatusBar from '@components/StatusBar';
import { dashboardNav } from '@navigation/NavigationConstant';
const DocumentRemainder = (props) => {
	const navigation = useNavigation();
	const documentId = props?.route?.params?.document_ids;
	const reminder_data = props?.route?.params?.reminder_data;
	const comments = props?.route?.params?.comments;
	const title = props?.route?.params?.title;
	const date = props?.route?.params?.date;
	const from = props?.route?.params?.from;
	const otherTitle = props?.route?.params?.otherTitle;
	const navigation_props = props?.route?.params?.navigation_props;
	const dropdownTitleref = useRef(null);
	const [applianceRemainder, setApplianceRemainder] = useState([]);
	const [titleData, setTitle] = useState([]);
	const [editableText, setEditableText] = useState(false);
	const [editButtonVisible, setEditButtonVisible] = useState(false);
	const [cancelButton, setCancelButton] = useState(false);

	const onSelectPromisedService = (data, setFieldValue) => {
		setFieldValue('title', applianceRemainder[data]);
		setTitle(applianceRemainder[data]);
	};
	const notifyMessage = (msg) => {
		if (RN.Platform.OS === 'android') {
			RN.ToastAndroid.show(msg, RN.ToastAndroid.SHORT);
		} else {
			RN.AlertIOS.alert(msg);
		}
	};
	const navigationBack = () => {
		if (navigation_props === 'navigateToDashboard') {
			navigation.navigate('bottomTab');
		} else {
			navigation.goBack();
		}
	};
	useEffect(() => {
		listDocumentReminder();
	}, []);

	const listDocumentReminder = async () => {
		const getToken = await AsyncStorage.getItem('loginToken');
		let ApiInstance = await new APIKit().init(getToken);
		if (
			reminder_data === 'assetReminder' ||
			reminder_data === 'editAssetReminder'
		) {
			let awaitresp = await ApiInstance.get(constants.listApplianceReminder);
			if (awaitresp.status == 1) {
				setApplianceRemainder(awaitresp.data.data);
				if (reminder_data === 'editAssetReminder') {
					if (title) {
						setTitle(
							awaitresp.data.data.find((appliance) => appliance._id == title)
						);
						setEditableText(false);
					}
				}
			} else {
				console.log('not listed appliance remainder');
			}
		} else if (
			reminder_data === 'documentReminder' ||
			reminder_data === 'editDocumentReminder'
		) {
			let awaitresp = await ApiInstance.get(constants.listDocumentReminder);
			if (awaitresp.status == 1) {
				setApplianceRemainder(awaitresp.data.data);
				if (reminder_data === 'editDocumentReminder') {
					if (title) {
						setTitle(
							awaitresp.data.data.find((appliance) => appliance._id == title)
						);
						setEditableText(false);
					}
				}
			} else {
				console.log('not listed document remainder');
			}
		} else if (
			reminder_data === 'otherReminder' ||
			reminder_data === 'editOtherReminder'
		) {
			let awaitresp = await ApiInstance.get(constants.listGeneralReminder);
			if (awaitresp.status == 1) {
				setApplianceRemainder(awaitresp.data.data);
				if (reminder_data === 'editOtherReminder') {
					if (title) {
						setTitle(
							awaitresp.data.data.find((appliance) => appliance._id == title)
						);
						setEditableText(false);
					}
				}
			} else {
				console.log('not listed other remainder');
			}
		}
	};
	const sendRemainder = async (values, actions) => {
		const getToken = await AsyncStorage.getItem('loginToken');
		if (
			reminder_data === 'assetReminder' ||
			reminder_data === 'editAssetReminder'
		) {
			const payload = {
				appliance_id: documentId,
				reminder: {
					date: values.issue_date,
					title: {
						id: values.title._id ? values.title._id : title,
						other_value: values.otherTitle,
					},
					comments: values.comments,
				},
			};
			let ApiInstance = await new APIKit().init(getToken);
			let awaitresp = await ApiInstance.post(
				constants.updateApplianceReminder,
				payload
			);
			if (awaitresp.status == 1) {
				navigation.navigate('bottomTab');
				setEditButtonVisible(false);
			} else {
				notifyMessage(JSON.stringify(awaitresp));
			}
		} else if (
			reminder_data === 'documentReminder' ||
			reminder_data === 'editDocumentReminder'
		) {
			const payload = {
				document_id: documentId,
				reminder: {
					date: values.issue_date,
					title: {
						id: values.title._id ? values.title._id : title,
						other_value: values.otherTitle,
					},
					comments: values.comments,
				},
			};
			let ApiInstance = await new APIKit().init(getToken);
			let awaitresp = await ApiInstance.post(
				constants.updateDocumentExtra,
				payload
			);
			if (awaitresp.status == 1) {
				navigation.navigate('bottomTab');
				setEditButtonVisible(false);
			} else {
				notifyMessage(JSON.stringify(awaitresp));
			}
		} else if (
			reminder_data === 'otherReminder' ||
			reminder_data === 'editOtherReminder'
		) {
			const title_id = values.title._id ? values.title._id : title;
			const payload = {
				reminder_id: documentId,
				reminder: {
					date: values.issue_date,
					title: {
						id: title_id,
						other_value: values.otherTitle,
					},
					comments: values.comments,
				},
			};
			let ApiInstance = await new APIKit().init(getToken);
			let awaitresp = await ApiInstance.post(
				constants.editUserReminder,
				payload
			);
			if (awaitresp.status == 1) {
				navigation.navigate('bottomTab');
				setEditButtonVisible(false);
			} else {
				notifyMessage(JSON.stringify(awaitresp));
			}
		}
	};

	const ValidationSchema = yup.object().shape({
		issue_date: yup.string().required('Date is Required'),
		title: yup.lazy((value) => {
			switch (typeof value) {
			case 'object':
				return yup.object().required('Title is Required');
			case 'string':
				return yup.string().required('Title is Required');
			default:
				return yup.string().required('Title is Required');
			}
		}),
		otherTitle: yup.string().when('title', {
			is: (val) => val?.name === 'Others',
			then: yup.string().required('Title is Required'),
		}),
		comments: yup.string().required('Comment is Required'),
	});
	return (
		<RN.View
			style={{
				backgroundColor: colorWhite,
				flex: 1,
			}}>
			<RN.SafeAreaView style={{ backgroundColor: colorLightBlue }} />
			<StatusBar />
			<RN.View style={style.navbar}>
				<RN.View style={style.navbarRow}>
					<RN.TouchableOpacity
						onPress={() => {
							navigation.navigate(dashboardNav);
						}}>
						<RN.Image source={white_arrow} style={style.notificationIcon} />
					</RN.TouchableOpacity>
					<RN.View
						style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
						<RN.View style={{ flex: 1 }}>
							<RN.Text style={style.navbarName}>
								{reminder_data === 'editAssetReminder' ||
								reminder_data === 'editDocumentReminder' ||
								reminder_data === 'editOtherReminder'
									? 'Reminder'
									: 'Add Reminder'}
							</RN.Text>
						</RN.View>

						<RN.View style={{ marginRight: 20 }}>
							{reminder_data === 'editAssetReminder' ||
							reminder_data === 'editDocumentReminder' ||
							reminder_data === 'editOtherReminder' ? (
									<RN.View>
										{cancelButton ? (
											<RN.TouchableOpacity
												style={{
													borderWidth: 2,
													borderColor: colorWhite,
													backgroundColor: colorWhite,
													borderRadius: 20,
												}}
												onPress={() => {
													setEditButtonVisible(false);
													setEditableText(false);
													setCancelButton(!cancelButton);
												}}>
												<RN.Text style={style.headerEditCancel}>
													{'Cancel'}
												</RN.Text>
											</RN.TouchableOpacity>
										) : (
											<RN.TouchableOpacity
												style={{
													borderWidth: 2,
													borderColor: '#145485',
													backgroundColor: '#145485',
													borderRadius: 20,
												}}
												onPress={() => {
													setEditButtonVisible(true);
													setEditableText(true);
													setCancelButton(!cancelButton);
												}}>
												<RN.Text style={style.headerEdit}>{'Edit'}</RN.Text>
											</RN.TouchableOpacity>
										)}
									</RN.View>
								) : null}
						</RN.View>
					</RN.View>
				</RN.View>
			</RN.View>
			{reminder_data === 'editAssetReminder' ||
			reminder_data === 'editDocumentReminder' ||
			reminder_data === 'editOtherReminder' ? (
					<RN.KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={RN.Platform.OS === 'ios' ? 'padding' : ''}>
						<RN.ScrollView showsVerticalScrollIndicator={false} bounces={false}>
							<Formik
								initialValues={{
									issue_date: date,
									title: title,
									otherTitle: otherTitle,
									comments: comments,
								}}
								validationSchema={ValidationSchema}
								onSubmit={(values, actions) => sendRemainder(values, actions)}>
								{({
									handleSubmit,
									values,
									setFieldValue,
									errors,
									handleBlur,
								}) => (
									<RN.View>
										<RN.View
											style={
												from != 'myReminders'
													? {
														flexDirection: 'row',
														justifyContent: 'space-between',
												  }
													: { justifyContent: 'space-between' }
											}>
											<RN.View style={{ flex: 1 }}>
												<RN.Text style={style.label}>
													{reminder_data === 2
														? 'Set date & time'
														: 'Set Reminder'}
													<RN.Text
														style={{ color: 'red', justifyContent: 'center' }}>
													*
													</RN.Text>
												</RN.Text>
												<DateOfRemainder
													disabled={editButtonVisible ? false : true}
													errors={errors}
													values={values}
													setFieldValue={setFieldValue}
													handleBlur={handleBlur}
												/>
											</RN.View>
											<RN.View style={{ flex: 1 }}>
												<RN.Text style={style.label}>
													{'Add Titile'}
													<RN.Text
														style={{ color: 'red', justifyContent: 'center' }}>
													*
													</RN.Text>
												</RN.Text>
												<ModalDropdownComp
													editable_text={editButtonVisible ? true : false}
													disabled={editButtonVisible ? false : true}
													onSelect={(data) =>
														onSelectPromisedService(data, setFieldValue)
													}
													ref={dropdownTitleref}
													options={applianceRemainder}
													isFullWidth
													renderRow={(props) => (
														<RN.Text
															style={{
																paddingVertical: 8,
																paddingHorizontal: 15,
																fontSize: font14,
																color: colorDropText,
																fontFamily: 'Rubik-Regular',
															}}>
															{props.name}
														</RN.Text>
													)}
													dropdownStyle={{ elevation: 8, borderRadius: 8 }}
													renderSeparator={(obj) => null}>
													<FloatingInput
														selection={{ start: 0, end: 0 }}
														mode="outlined"
														placeholder="select"
														editable_text={editButtonVisible ? true : false}
														disabled={editButtonVisible ? false : true}
														type={editButtonVisible ? 'dropdown' : ''}
														value={values.title && titleData && titleData.name}
														error={errors.title}
														errorStyle={{ marginHorizontal: 20}}
														inputstyle={style.inputStyle}
														containerStyle={{
															borderBottomWidth: 0,
															marginBottom: 0,
														}}
														dropdowncallback={() =>
															dropdownTitleref.current.show()
														}
														rightIcon={
															<RN.Image
																source={arrow_down}
																style={{
																	width: 12,
																	position: 'absolute',
																	height: 8.3,
																	right: RN.Dimensions.get('screen').width * 0.11,
																	top: 23,
																}}
															/>
														}
													/>
												</ModalDropdownComp>
												{titleData && titleData.name === 'Others' ? (
													<FloatingInput
														placeholder="Enter brand name"
														value={values.otherTitle}
														onChangeText={(data) =>
															setFieldValue('otherTitle', data)
														}
														error={errors.otherTitle}
														errorStyle={{ marginHorizontal: 20}}
														inputstyle={style.othersInputStyle}
														containerStyle={{
															borderBottomWidth: 0,
															marginBottom: 0,
														}}
													/>
												) : null}
											</RN.View>
										</RN.View>
										<RN.Text style={style.label}>
											{'Comments'}
											<RN.Text style={{ color: 'red', justifyContent: 'center' }}>
											*
											</RN.Text>
										</RN.Text>
										<FloatingInput
											placeholder="Comments"
											value={values.comments}
											editable_text={editableText ? true : false}
											disabled={editButtonVisible ? false : true}
											selectTextOnFocus={editButtonVisible ? false : true}
											onChangeText={(data) => setFieldValue('comments', data)}
											error={errors.comments}
											errorStyle={{ marginHorizontal: 20}}
											inputstyle={style.inputStyle}
											containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
										/>
										{editButtonVisible ? (
											<RN.View style={{ marginVertical: 20, padding: 20 }}>
												<ThemedButton
													title="Save Changes"
													onPress={handleSubmit}
													color={colorLightBlue}></ThemedButton>
											</RN.View>
										) : null}
									</RN.View>
								)}
							</Formik>
						</RN.ScrollView>
					</RN.KeyboardAvoidingView>
				) : (
					<RN.KeyboardAvoidingView
						style={{ flex: 1 }}
						behavior={RN.Platform.OS === 'ios' ? 'padding' : ''}>
						<RN.ScrollView showsVerticalScrollIndicator={false} bounces={false}>
							<Formik
								initialValues={{
									issue_date: '',
									title: '',
									otherTitle: '',
									comments: '',
								}}
								validationSchema={ValidationSchema}
								onSubmit={(values, actions) => sendRemainder(values, actions)}>
								{({
									handleSubmit,
									values,
									setFieldValue,
									errors,
									handleBlur,
								}) => (
									<RN.View>
										<RN.View
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
											}}>
											<RN.View style={{ flex: 1 }}>
												<RN.Text style={style.label}>
													{reminder_data === 2
														? 'Set date & time'
														: 'Set Reminder'}
													<RN.Text
														style={{ color: 'red', justifyContent: 'center' }}>
													*
													</RN.Text>
												</RN.Text>
												<DateOfRemainder
													errors={errors}
													values={values}
													setFieldValue={setFieldValue}
													handleBlur={handleBlur}
												/>
											</RN.View>
											<RN.View style={{ flex: 1 }}>
												<RN.Text style={style.label}>
													{'Add Titile'}
													<RN.Text
														style={{ color: 'red', justifyContent: 'center' }}>
													*
													</RN.Text>
												</RN.Text>
												<ModalDropdownComp
													onSelect={(data) =>
														onSelectPromisedService(data, setFieldValue)
													}
													ref={dropdownTitleref}
													options={applianceRemainder}
													isFullWidth
													renderRow={(props) => (
														<RN.Text
															style={{
																paddingVertical: 8,
																paddingHorizontal: 15,
																fontSize: font14,
																color: colorDropText,
																fontFamily: 'Rubik-Regular',
															}}>
															{props.name}
														</RN.Text>
													)}
													dropdownStyle={{ elevation: 8, borderRadius: 8 }}
													renderSeparator={(obj) => null}>
													<FloatingInput
														selection={{ start: 0, end: 0 }}
														mode="outlined"
														placeholder="select"
														editable_text={false}
														type="dropdown"
														value={values.title && titleData.name}
														error={errors.title}
														errorStyle={{ marginHorizontal: 20}}
														inputstyle={style.inputStyle}
														containerStyle={{
															borderBottomWidth: 0,
															marginBottom: 0,
														}}
														dropdowncallback={() =>
															dropdownTitleref.current.show()
														}
														rightIcon={
															<RN.Image
																source={arrow_down}
																style={{
																	width: 12,
																	position: 'absolute',
																	height: 8.3,
																	right: RN.Dimensions.get('screen').width * 0.11,
																	top: 23,
																}}
															/>
														}
													/>
												</ModalDropdownComp>
												{titleData && titleData.name === 'Others' ? (
													<FloatingInput
														placeholder="Title"
														value={values.otherTitle}
														onChangeText={(data) =>
															setFieldValue('otherTitle', data)
														}
														error={errors.otherTitle}
														errorStyle={{ marginHorizontal: 20}}
														inputstyle={style.othersInputStyle}
														containerStyle={{
															borderBottomWidth: 0,
															marginBottom: 0,
														}}
													/>
												) : null}
											</RN.View>
										</RN.View>
										<RN.Text style={style.label}>
											{'Comments'}
											<RN.Text style={{ color: 'red', justifyContent: 'center' }}>
											*
											</RN.Text>
										</RN.Text>
										<FloatingInput
											placeholder="Comments"
											value={values.comments}
											onChangeText={(data) => setFieldValue('comments', data)}
											error={errors.comments}
											errorStyle={{ marginHorizontal: 20}}
											inputstyle={style.inputStyle}
											containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
										/>
										{reminder_data === 'documentReminder' ||
									reminder_data === 'assetReminder' ? (
												<RN.View>
													<RN.Text
														onPress={() => {
															navigation.navigate('bottomTab');
														}}
														style={style.skip}>
												Skip for now
													</RN.Text>
													<RN.View style={{ marginVertical: 20, padding: 20 }}>
														<ThemedButton
															title="Add Reminder"
															onPress={handleSubmit}
															color={colorLightBlue}></ThemedButton>
													</RN.View>
												</RN.View>
											) : null}
									</RN.View>
								)}
							</Formik>
						</RN.ScrollView>
					</RN.KeyboardAvoidingView>
				)}
		</RN.View>
	);
};

export default DocumentRemainder;
