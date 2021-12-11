import React, { useState } from 'react';
import {
	Text,
	View,
	ScrollView,
	TouchableOpacity,
	Image,
	Platform,
	Dimensions,
	SafeAreaView,
	StatusBar,
} from 'react-native';
import BackArrowComp from '@components/BackArrowComp';
import styles from './styles';
import FloatingInput from '@components/FloatingInput';
import ThemedButton from '@components/ThemedButton';
import { colorLightBlue, colorWhite, colorBlack } from '@constants/Colors';
import { close_round, existing, glitter, notfound } from '@constants/Images';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useNavigation } from '@react-navigation/native';
import {
	verificationNav,
	loginNav,
	requestInviteNav,
} from '@navigation/NavigationConstant';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config';
import ModalComp from '@components/ModalComp';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';
import Loader from '@components/Loader';
const RequestInvite = (props) => {
	const props_params = props?.route?.params?.params;
	const navigation = useNavigation();
	const [errorMessage, setErrorMsg] = useState(null);
	const [visible, setVisible] = useState(false); // no invite found
	const [loading, setLoading] = useState(false);
	const [modalVisible, setModalVisible] = useState(false); // already exist
	const [responseErrMsg, setResponseErrMsg] = useState(null);
	const [errorObj, setErrorObj] = useState(null);
	const phoneNumber = RegExp(/^[0-9]{10}$/);
	const signupValidationSchema = yup.object().shape({
		phonenumber: yup
			.string()
			.required('Mobile number is required')
			.matches(phoneNumber, 'Invalid Mobile Number'),
	});
	const RequestSubmit = async (values) => {
		setLoading(true);
		if (props_params == 'Already_Invite') {
			let ApiInstance = await new APIKit().init();
			let awaitresp = await ApiInstance.get(
				constants.checkMobileExist + '?phone_number=' + values.phonenumber
			);
			if (awaitresp == undefined) {
				setLoading(false);
				Toast.show('Check your internet connection.', Toast.LONG);
			}
			if (awaitresp.status == 1) {
				// navigation.navigate(createAccountNav,{mobilenumber:values.phonenumber})
				checkInviteExists(values.phonenumber);
			} else {
				setTimeout(() => {
					setLoading(false);
					setVisible(true);
				}, 1000);
				setErrorObj(awaitresp);
				setResponseErrMsg(awaitresp.err_msg);
			}
		} else {
			let ApiInstance = await new APIKit().init();
			const payload = { phone_number: values.phonenumber };
			let awaitresp = await ApiInstance.post(constants.requestInvite, payload);
			setLoading(true);
			if (awaitresp.status == 1) {
				setTimeout(() => {
					setLoading(false);
					setModalVisible(true);
				}, 1000);
				setErrorMsg(
					'Your request has been registered!,we will update you when you have an invite.'
				);
			} else {
				setTimeout(() => {
					setLoading(false);
					setModalVisible(true);
				}, 1000);
				setErrorObj(awaitresp);
				setErrorMsg(awaitresp.err_msg);
			}
			setTimeout(() => {
				setLoading(false);
				setModalVisible(true);
			}, 1000);
		}
	};
	const checkInviteExists = async (data) => {
		let ApiInstance = await new APIKit().init();
		let awaitresp = await ApiInstance.get(
			constants.checkInviteExist + '?phone_number=' + data
		);
		if (awaitresp.status == 1) {
			setLoading(true);
			try {
				const confirmation = await auth().signInWithPhoneNumber(`+91 ${data}`);
				if (confirmation) {
					setLoading(false);
					let { _verificationId } = confirmation;
					navigation.navigate(verificationNav, {
						mobileNumber: data,
						verificationCode: _verificationId,
					});
				}
			} catch (error) {
				console.log('error', error);
				setLoading(false);
				if (error.code === 'auth/too-many-requests') {
					Toast.show(
						'We have blocked all requests from this device due to unusual activity. Try again later',
						Toast.LONG
					);
				}
				if (error.code === 'auth/network-request-failed') {
					Toast.show('Check your internet connection.', Toast.LONG);
				}
				if (error.code === 'auth/missing-client-identifier') {
					Toast.show('Cant reach server', Toast.LONG);
				}
			}
		} else {
			setTimeout(() => {
				setLoading(false);
				setVisible(true);
			}, 1000);
			setResponseErrMsg(awaitresp.err_msg);
		}
	};

	const navigatePage = () => {
		if (errorObj?.is_login) {
			setModalVisible(false);
			setVisible(false);
			navigation.navigate(loginNav);
		} else if (errorObj?.is_signup) {
			setModalVisible(false);
			setVisible(false);
			navigation.navigate(requestInviteNav, {
				params: 'Already_Invite',
			});
		}
	};
	let signup_login_exist = errorObj?.is_login || errorObj?.is_signup;

	return (
		<View style={styles.container}>
			<SafeAreaView style={{ backgroundColor: colorWhite }} />
			<StatusBar backgroundColor={colorWhite} barStyle="dark-content" />
			<View style={{ padding: 20 }}>
				<BackArrowComp />

				<Text style={styles.headerText}>
					{props_params === 'Already_Invite'
						? 'Already have an invite'
						: 'Request An Invite'}
				</Text>
				<ScrollView keyboardShouldPersistTaps={'handled'} bounces={false}>
					<Text style={styles.Invitepara}>
						{props_params === 'Already_Invite'
							? 'Enter your mobile number to check if you already have an invite'
							: 'Enter your mobile number below. We will let you know when you have an invite'}
					</Text>
					<Formik
						validationSchema={signupValidationSchema}
						initialValues={{ phonenumber: '' }}
						onSubmit={(values) => RequestSubmit(values)}>
						{({ handleSubmit, values, setFieldValue, errors }) => (
							<View>
								<FloatingInput
									placeholder_text="Mobile Number"
									value={values.phonenumber}
									onChangeText={(data) => setFieldValue('phonenumber', data)}
									error={errors.phonenumber}
									focus={true}
									prefix="+91"
									keyboard_type={Platform.OS == 'android' ? 'numeric' : 'number-pad'}
								/>
								<View style={{ marginVertical: 20, paddingTop: 30 }}>
									{loading ? (
										<Loader />
									) : (
										<ThemedButton
											title="Submit"
											onPress={handleSubmit}
											color={colorLightBlue}></ThemedButton>
									)}
								</View>
							</View>
						)}
					</Formik>

					<ModalComp visible={visible}>
						<View>
							<View style={styles.closeView}>
								<TouchableOpacity
									onPress={() => {
										setLoading(false);
										setVisible(false);
									}}>
									<Image source={close_round} style={styles.close_icon} />
								</TouchableOpacity>
							</View>
							<View style={styles.glitterView}>
								{responseErrMsg === 'Invite Not Found' ? (
									<Image style={styles.error} source={notfound} />
								) : (
									<Image style={styles.glitterStar} source={existing} />
								)}
							</View>
							{responseErrMsg && (
								<View>
									<TouchableOpacity
										disabled={!signup_login_exist}
										onPress={() => (signup_login_exist ? navigatePage() : null)}>
										<Text
											style={[
												styles.header,
												signup_login_exist ? styles.activeunderLineText : styles.header,
											]}>
											{responseErrMsg}
										</Text>
										{responseErrMsg ===
										'Phone number already registered, do you want to login?' ? (
												<View
													style={{
														display: 'flex',
														flexDirection: 'row',
														justifyContent: 'space-around',
														marginTop: Dimensions.get('screen').height * 0.01,
													}}>
													<TouchableOpacity
														onPress={() => setVisible(false)}
														style={{
															padding: 10,
															fontFamily: 'Rubik-Regular',
															borderWidth: 1,
															borderColor: colorLightBlue,
															borderRadius: 30,
															marginTop: 25,
															width: Dimensions.get('screen').height * 0.17,
														}}>
														<Text style={{ alignSelf: 'center', color: colorBlack }}>No</Text>
													</TouchableOpacity>
													<TouchableOpacity
														onPress={() => {
															setVisible(false);
															navigation.navigate(loginNav);
														}}
														style={{
															padding: 10,
															fontFamily: 'Rubik-Regular',
															borderWidth: 1,
															borderColor: colorLightBlue,
															borderRadius: 30,
															marginTop: 25,
															width: Dimensions.get('screen').height * 0.17,
															backgroundColor: colorLightBlue,
														}}>
														<Text style={{ alignSelf: 'center', color: colorWhite }}>Yes</Text>
													</TouchableOpacity>
												</View>
											) : null}
									</TouchableOpacity>
								</View>
							)}
						</View>
					</ModalComp>
					<ModalComp visible={modalVisible}>
						<View>
							<View style={styles.closeView}>
								<TouchableOpacity
									onPress={() => {
										setLoading(false);
										setModalVisible(false);
									}}>
									<Image source={close_round} style={styles.close_icon} />
								</TouchableOpacity>
							</View>
							<View style={styles.glitterView}>
								{errorMessage ==
								'Your request has been registered!,we will update you when you have an invite.' ? (
										<Image style={styles.glitterStar} source={glitter} />
									) : (
										<Image style={styles.glitterStar} source={existing} />
									)}
							</View>
							{errorMessage && (
								<View>
									<TouchableOpacity
										disabled={!signup_login_exist}
										onPress={() => (signup_login_exist ? navigatePage() : null)}>
										<Text
											style={[
												styles.header,
												signup_login_exist ? styles.activeunderLineText : styles.header,
											]}>
											{errorMessage}
										</Text>
										{errorMessage === 'Invite already exists, do you want to signup?' ? (
											<View
												style={{
													display: 'flex',
													flexDirection: 'row',
													justifyContent: 'space-around',
													marginTop: Dimensions.get('screen').height * 0.01,
												}}>
												<TouchableOpacity
													onPress={() => setModalVisible(false)}
													style={{
														padding: 10,
														fontFamily: 'Rubik-Regular',
														borderWidth: 1,
														borderColor: colorLightBlue,
														borderRadius: 30,
														marginTop: 25,
														width: Dimensions.get('screen').height * 0.17,
													}}>
													<Text style={{ alignSelf: 'center', color: colorBlack }}>No</Text>
												</TouchableOpacity>
												<TouchableOpacity
													onPress={() => {
														setModalVisible(false);
														navigation.navigate(requestInviteNav, {
															params: 'Already_Invite',
														});
													}}
													style={{
														padding: 10,
														fontFamily: 'Rubik-Regular',
														borderWidth: 1,
														borderColor: colorLightBlue,
														borderRadius: 30,
														marginTop: 25,
														width: Dimensions.get('screen').height * 0.17,
														backgroundColor: colorLightBlue,
													}}>
													<Text style={{ alignSelf: 'center', color: colorWhite }}>Yes</Text>
												</TouchableOpacity>
											</View>
										) : errorMessage ===
										  'Phone number already registered, do you want to login?' ? (
												<View
													style={{
														display: 'flex',
														flexDirection: 'row',
														justifyContent: 'space-around',
														marginTop: Dimensions.get('screen').height * 0.01,
													}}>
													<TouchableOpacity
														onPress={() => setModalVisible(false)}
														style={{
															padding: 10,
															fontFamily: 'Rubik-Regular',
															borderWidth: 1,
															borderColor: colorLightBlue,
															borderRadius: 30,
															marginTop: 25,
															width: Dimensions.get('screen').height * 0.17,
														}}>
														<Text style={{ alignSelf: 'center', color: colorBlack }}>No</Text>
													</TouchableOpacity>
													<TouchableOpacity
														onPress={() => {
															setModalVisible(false);
															navigation.navigate(loginNav);
														}}
														style={{
															padding: 10,
															fontFamily: 'Rubik-Regular',
															borderWidth: 1,
															borderColor: colorLightBlue,
															borderRadius: 30,
															marginTop: 25,
															width: Dimensions.get('screen').height * 0.17,
															backgroundColor: colorLightBlue,
														}}>
														<Text style={{ alignSelf: 'center', color: colorWhite }}>Yes</Text>
													</TouchableOpacity>
												</View>
											) : null}
									</TouchableOpacity>
								</View>
							)}
						</View>
					</ModalComp>
				</ScrollView>
			</View>
		</View>
	);
};
export default RequestInvite;
