import React, { useEffect, useState, useRef } from 'react';
import HomeHeader from '@components/HomeHeader';
import {
	colorDropText,
	colorLightBlue,
	colorWhite,
	colorBlack,
} from '@constants/Colors';
import * as RN from 'react-native';
import { Formik } from 'formik';
import ModalDropdown from 'react-native-modal-dropdown';
import FloatingInput from '@components/FloatingInput';
import { arrow_down } from '@constants/Images';
import { font12, font14 } from '@constants/Fonts';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config';
import { DateOfRemainder } from './DateOfRemainder';
import ThemedButton from '@components/ThemedButton';
import { useNavigation } from '@react-navigation/native';
const DocumentRemainder = (props) => {
	const navigation = useNavigation();
	const formikRef = useRef();
	const documentId = props?.route?.params?.document_ids;
	const reminder_data = props?.route?.params?.reminder_data;
	const comments = props?.route?.params?.comments;
	const title = props?.route?.params?.title;
	const date = props?.route?.params?.date;
	const dropdownTitleref = useRef(null);
	const [applianceRemainder, setApplianceRemainder] = useState([]);
	const [titleData, setTitle] = useState([]);
	const [editableText, setEditableText] = useState(false);

	const onSelectPromisedService = (data, setFieldValue) => {
		setFieldValue('title', applianceRemainder[data]);
		setTitle(applianceRemainder[data]);
	};

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			if (formikRef.current) {
				formikRef.current.resetForm();
				setApplianceRemainder([]);
			}
			listDocumentReminder();
		});
		return unsubscribe;
	}, []);

	const listDocumentReminder = async () => {
		const getToken = await AsyncStorage.getItem('loginToken');
		let ApiInstance = await new APIKit().init(getToken);
		if (reminder_data === 1) {
			let awaitresp = await ApiInstance.get(constants.listApplianceReminder);
			if (awaitresp.status == 1) {
				setApplianceRemainder(awaitresp.data.data);
			} else {
				console.log('not listed appliance remainder');
			}
		} else {
			let awaitresp = await ApiInstance.get(constants.listDocumentReminder);
			if (awaitresp.status == 1) {
				setApplianceRemainder(awaitresp.data.data);
				if (reminder_data === 2) {
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
		}
	};

	const sendRemainder = async (values, actions) => {
		console.log(documentId);
		const getToken = await AsyncStorage.getItem('loginToken');
		if (reminder_data === 1) {
			const payload = {
				appliance_id: documentId,
				reminder: {
					date: values.issue_date,
					title: {
						id: values.title._id,
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
			} else {
				console.log(awaitresp);
				RN.Alert.alert(awaitresp.err_msg);
			}
		} else {
			const payload = {
				document_id: documentId,
				reminder: {
					date: values.issue_date,
					title: {
						id: values.title._id,
						other_value: values.otherTitle,
					},
					comments: values.comments,
				},
			};
			console.log('payload', payload);
			let ApiInstance = await new APIKit().init(getToken);
			let awaitresp = await ApiInstance.post(
				constants.updateDocumentExtra,
				payload
			);
			if (awaitresp.status == 1) {
				navigation.navigate('bottomTab');
			} else {
				console.log(awaitresp);
				RN.Alert.alert(awaitresp.err_msg);
			}
		}
	};

	return (
		<RN.View
			style={{
				backgroundColor: colorWhite,
				height: RN.Dimensions.get('screen').height,
			}}>
			<RN.ScrollView showsVerticalScrollIndicator={false}>
				<HomeHeader title={reminder_data === 2 ? 'Reminder' : 'Add Reminder'} />
				{reminder_data === 2 ? (
					<Formik
						initialValues={{
							issue_date: date,
							title: title,
							comments: comments,
						}}
						onSubmit={(values, actions) => sendRemainder(values, actions)}>
						{({ handleSubmit, values, setFieldValue, errors, handleBlur }) => (
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
												: 'Set Remainder'}
										</RN.Text>
										<DateOfRemainder
											errors={errors}
											values={values}
											setFieldValue={setFieldValue}
											handleBlur={handleBlur}
										/>
									</RN.View>
									<RN.View style={{ flex: 1 }}>
										<RN.Text style={style.label}>{'Add Titile'}</RN.Text>
										<ModalDropdown
											onSelect={(data) =>
												onSelectPromisedService(data, setFieldValue)
											}
											loading={true}
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
												placeholder="select"
												editable_text={false}
												type="dropdown"
												value={values.title && titleData.name}
												error={errors.title}
												inputstyle={style.inputStyle}
												containerStyle={{
													borderBottomWidth: 0,
													marginBottom: 0,
												}}
												dropdowncallback={() => dropdownTitleref.current.show()}
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
										</ModalDropdown>
										{titleData && titleData.name === 'Others' ? (
											<FloatingInput
												placeholder="Enter brand name"
												value={values.otherTitle}
												onChangeText={(data) =>
													setFieldValue('otherTitle', data)
												}
												error={errors.otherTitle}
												errorStyle={{ marginLeft: 20, marginBottom: 10 }}
												editable_text={editableText}
												inputstyle={style.othersInputStyle}
												containerStyle={{
													borderBottomWidth: 0,
													marginBottom: 0,
												}}
											/>
										) : null}
									</RN.View>
								</RN.View>
								<RN.Text style={style.label}>{'Comments'}</RN.Text>
								<FloatingInput
									placeholder="Comments"
									value={values.comments}
									onChangeText={(data) => setFieldValue('comments', data)}
									error={errors.comments}
									editable_text={editableText}
									errorStyle={{ marginLeft: 20, marginBottom: 10 }}
									inputstyle={style.inputStyle}
									containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
								/>
								{reminder_data !== 2 ? (
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
												title="Finish"
												onPress={handleSubmit}
												color={colorLightBlue}></ThemedButton>
										</RN.View>
									</RN.View>
								) : null}
							</RN.View>
						)}
					</Formik>
				) : (
					<Formik
						initialValues={{
							issue_date: '',
							title: '',
						}}
						onSubmit={(values, actions) => sendRemainder(values, actions)}>
						{({ handleSubmit, values, setFieldValue, errors, handleBlur }) => (
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
												: 'Set Remainder'}
										</RN.Text>
										<DateOfRemainder
											errors={errors}
											values={values}
											setFieldValue={setFieldValue}
											handleBlur={handleBlur}
										/>
									</RN.View>
									<RN.View style={{ flex: 1 }}>
										<RN.Text style={style.label}>{'Add Titile'}</RN.Text>
										<ModalDropdown
											onSelect={(data) =>
												onSelectPromisedService(data, setFieldValue)
											}
											loading={true}
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
												placeholder="select"
												editable_text={false}
												type="dropdown"
												value={values.title && titleData.name}
												error={errors.title}
												inputstyle={style.inputStyle}
												containerStyle={{
													borderBottomWidth: 0,
													marginBottom: 0,
												}}
												dropdowncallback={() => dropdownTitleref.current.show()}
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
										</ModalDropdown>
										{titleData && titleData.name === 'Others' ? (
											<FloatingInput
												placeholder="Enter brand name"
												value={values.otherTitle}
												onChangeText={(data) =>
													setFieldValue('otherTitle', data)
												}
												error={errors.otherTitle}
												errorStyle={{ marginLeft: 20, marginBottom: 10 }}
												// autoCapitalize={'characters'}
												inputstyle={style.othersInputStyle}
												containerStyle={{
													borderBottomWidth: 0,
													marginBottom: 0,
												}}
											/>
										) : null}
									</RN.View>
								</RN.View>
								<RN.Text style={style.label}>{'Comments'}</RN.Text>
								<FloatingInput
									placeholder="Comments"
									value={values.comments}
									onChangeText={(data) => setFieldValue('comments', data)}
									error={errors.comments}
									errorStyle={{ marginLeft: 20, marginBottom: 10 }}
									inputstyle={style.inputStyle}
									containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
								/>
								{reminder_data !== 2 ? (
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
												title="Finish"
												onPress={handleSubmit}
												color={colorLightBlue}></ThemedButton>
										</RN.View>
									</RN.View>
								) : null}
							</RN.View>
						)}
					</Formik>
				)}
			</RN.ScrollView>
		</RN.View>
	);
};

const style = RN.StyleSheet.create({
	label: {
		fontFamily: 'Rubik-Regular',
		fontSize: 12,
		color: colorBlack,
		margin: 15,
	},
	inputStyle: {
		alignSelf: 'center',
		height: RN.Dimensions.get('screen').height * 0.07,
		borderWidth: 0.5,
		borderRadius: 30,
		marginLeft: RN.Dimensions.get('screen').width * 0.03,
		paddingLeft: 20,
	},
	skip: {
		fontFamily: 'Rubik-Regular',
		fontSize: font12,
		color: colorDropText,
		textAlign: 'center',
		marginTop: RN.Dimensions.get('screen').height * 0.25,
		textDecorationLine: 'underline',
		paddingVertical: 15,
	},
	othersInputStyle: {
		alignSelf: 'center',
		width: RN.Dimensions.get('screen').height / 4.5,
		borderBottomWidth: 0.5,
		marginLeft: RN.Dimensions.get('screen').width * 0.04,
		paddingLeft: 10,
		marginTop: -10,
	},
});
export default DocumentRemainder;
