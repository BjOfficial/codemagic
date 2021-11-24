import React, { useRef, useState, useEffect } from 'react';
import * as RN from 'react-native';
import style from './style';
import FloatingInput from '@components/FloatingInput';
import { Formik } from 'formik';
import ModalDropdownComp from '@components/ModalDropdownComp';
import {
	arrow_down,
	add_img,
	close_round,
	rupee,
	suggestion,
} from '@constants/Images';
import * as ImagePicker from 'react-native-image-picker';
import * as RNFS from 'react-native-fs';
import { font14 } from '@constants/Fonts';
import {
	colorLightBlue,
	colorDropText,
	colorAsh,
	colorWhite,
} from '@constants/Colors';
import ThemedButton from '@components/ThemedButton';
import ModalComp from '@components/ModalComp';
import RadioForm from 'react-native-simple-radio-button';
import HomeHeader from '@components/HomeHeader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config';
import { DateOfPurchase } from '@screens/AddDocument/DateOfPurchase';
import { DateOfExpiry } from '@screens/AddDocument/DateOfExpiry';
import { useNavigation } from '@react-navigation/native';

const AddRemainders = (props) => {
	const navigation = useNavigation();
	const assetId = props?.route?.params?.asset_id;
	const dropdownServiceDataref = useRef(null);
	const service_data = [
		{ value: 1, label: '1' },
		{ value: 2, label: '2' },
		{ value: 3, label: '3' },
		{ value: 4, label: '4' },
		{ value: 5, label: '5' },
	];
	const [applianceRemainder, setApplianceRemainder] = useState([]);
	const [radioProps] = useState([
		{ label: 'Yes', value: true },
		{ label: 'No', value: false },
	]);
	const dropdownTitleref = useRef(null);
	const formikRef = useRef();
	const [titleData, setTitle] = useState([]);
	const [serviceData, setServiceData] = useState([]);
	const [radio, setRadio] = useState(0);
	const [resourcePath, setResourcePath] = useState([]);
	const [cameraVisible, setCameraVisible] = useState(false);
	const [visible, setVisible] = useState(false);
	const [initial, setInitial] = useState(0);
	const localTime = new Date().getTime();
	const platfromOs = `${RNFS.DocumentDirectoryPath}/azzetta/.invoice`;
	const destinationPath = platfromOs + localTime + '.jpg';
	const [maintenance, setMaintenance] = useState([]);

	const onSelectPromisedService = (data, setFieldValue) => {
		setFieldValue('service', service_data[data]);
		setServiceData(service_data[data]);
	};
	const onSelectApplianceRemainder = (data, setFieldValue) => {
		setFieldValue('title', applianceRemainder[data]);
		setTitle(applianceRemainder[data]);
	};

	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			if (formikRef.current) {
				formikRef.current.resetForm();
				setResourcePath([]);
				setInitial(0);
			}
		});
		listApplianceReminder();
		return unsubscribe;
	}, []);

	const listApplianceReminder = async () => {
		const getToken = await AsyncStorage.getItem('loginToken');
		let ApiInstance = await new APIKit().init(getToken);
		let awaitresp = await ApiInstance.get(constants.listApplianceReminder);
		if (awaitresp.status == 1) {
			setApplianceRemainder(awaitresp.data.data);
		} else {
			RN.Alert.alert(awaitresp.err_msg);
		}
	};

	const requestPermission = async () => {
		if(RN.Platform.OS == "android"){
		try {
			const granted = await RN.PermissionsAndroid.request(
				RN.PermissionsAndroid.PERMISSIONS.CAMERA,
				{
					title: 'Permission',
					message:
            'App needs access to your camera and storage ' +
            'so you can take photos and store.',
					buttonPositive: 'OK',
				}
			);
			const grantedWriteStorage = await RN.PermissionsAndroid.request(
				RN.PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
			);
			const grantedReadStorage = await RN.PermissionsAndroid.request(
				RN.PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
			);
			if (
				granted &&
        grantedWriteStorage &&
        grantedReadStorage === RN.PermissionsAndroid.RESULTS.GRANTED
			) {
				setCameraVisible(true);
			}
			if (
				granted &&
        grantedWriteStorage &&
        grantedReadStorage === RN.PermissionsAndroid.RESULTS.DENIED
			) {
				console.log('denied');
			} else {
				console.log('error');
			}
		} catch (err) {
			console.warn(err);
		}
	} else {
		requestMultiple([PERMISSIONS.IOS.CAMERA, PERMISSIONS.IOS.MEDIA_LIBRARY,PERMISSIONS.IOS.PHOTO_LIBRARY,PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY]).then((statuses) => {
		  console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
		  console.log('FaceID', statuses[PERMISSIONS.IOS.MEDIA_LIBRARY]);
		  console.log('PHOTO_LIBRARY', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);
		  console.log('PHOTO_LIBRARY_ADD_ONLY', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY]);
		  setCameraVisible(true);
		}).catch((e) => {
		  console.log('Access denied', e);
		  return;
		});
	  }
	};
	const selectOptions = () => {
		return (
			<ModalComp visible={cameraVisible}>
				<RN.View>
					<RN.View style={style.closeView}>
						<RN.TouchableOpacity onPress={() => closeOptionsModal()}>
							<RN.Image source={close_round} style={style.close_icon} />
						</RN.TouchableOpacity>
					</RN.View>
					<RN.Text style={style.successPara}>Select Options</RN.Text>
					<RN.View style={style.optionsBox}>
						<RN.Text style={style.successHeader} onPress={() => selectImage()}>
              Select Image
						</RN.Text>
						<RN.TouchableOpacity
							onPress={() => {
								selectCamera();
							}}>
							<RN.Text style={style.successHeader}>Open Camera</RN.Text>
						</RN.TouchableOpacity>
					</RN.View>
				</RN.View>
			</ModalComp>
		);
	};

	const openModal = () => {
		return (
			<ModalComp visible={visible}>
				<RN.View>
					<RN.View style={style.closeView}>
						<RN.TouchableOpacity onPress={() => closeModal()}>
							<RN.Image source={close_round} style={style.close_icon} />
						</RN.TouchableOpacity>
					</RN.View>
					<RN.View style={style.sugesstionView}>
						<RN.Image style={style.sugesstion} source={suggestion} />
					</RN.View>
					<RN.Text style={style.para}>
            We suggest that you keep all the documents in DigiLocker (from
            government of India with 100MB free storage for each citizen) so
            that the documents do not add to the size of Azzetta App. We only
            need a few data points for you to set reminders. Help us to keep
            Azzetta light by keeping all photos or documents in DigiLocker or
            your Google Drive.
					</RN.Text>
				</RN.View>
			</ModalComp>
		);
	};

	const closeModal = () => {
		setVisible(false);
		requestPermission();
	};

	const selectImage = () => {
		var options = {
			title: 'Select Image',
			customButtons: [
				{
					name: 'customOptionKey',
					title: 'Choose file from Custom Option',
				},
			],
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
		};
		ImagePicker.launchImageLibrary(options, (res) => {
			console.log('Response = ', res);

			if (res.didCancel) {
				console.log('User cancelled image picker');
			} else if (res.error) {
				console.log('ImagePicker Error: ', res.error);
			} else if (res.customButton) {
				console.log('User tapped custom button: ', res.customButton);
				alert(res.customButton);
			} else {
				let source = res;
				moveAttachment(source.assets[0].uri, destinationPath);
			}
		});
	};

	const selectCamera = () => {
		let options = {
			storageOptions: {
				skipBackup: true,
				path: 'images',
			},
		};
		ImagePicker.launchCamera(options, (res) => {
			console.log('Response = ', res);

			if (res.didCancel) {
				console.log('User cancelled image picker');
			} else if (res.error) {
				console.log('ImagePicker Error: ', res.error);
			} else if (res.customButton) {
				console.log('User tapped custom button: ', res.customButton);
				alert(res.customButton);
			} else {
				let source = res;
				moveAttachment(source.assets[0].uri, destinationPath);
			}
		});
	};
	const moveAttachment = async (filePath, newFilepath) => {
		var path = platfromOs;
		return new Promise((resolve, reject) => {
			RNFS.mkdir(path)
				.then(() => {
					RNFS.moveFile(filePath, newFilepath)
						.then((res) => {
							console.log('FILE MOVED', filePath, newFilepath);
							setResourcePath([...resourcePath, { path: newFilepath }]);
							resolve(true);
							closeOptionsModal();
						})
						.catch((error) => {
							console.log('moveFile error', error);
							reject(error);
						});
				})
				.catch((err) => {
					console.log('mkdir error', err);
					reject(err);
				});
		});
	};
	const closeOptionsModal = () => {
		setCameraVisible(false);
	};

	const AddMaintenanceSubmit = async (values, actions) => {
		let maintenanceDetails = [
			...maintenance,
			{
				date: values.issue_date,
				labour_cost: values.labourCost,
				spare_name: values.sparePartnerName,
				spare_cost: values.spareCost,
				remarks: values.remarks,
			},
		];
		setMaintenance(maintenanceDetails);
		const getToken = await AsyncStorage.getItem('loginToken');
		let payload = {
			appliance_id: assetId,
			free_service: radio,
			service_promised:
        values.service.value == undefined ? ' ' : values.service.value,
			service_over: values.serviceOver == '' ? ' ' : values.service.value,
			maintenance: maintenance,
			invoice: resourcePath,
			reminder: {
				date: values.expire_date,
				title: {
					id: titleData._id,
					other_value: values.otherDocumentLocation,
				},
				comments: values.comments,
			},
		};
		let ApiInstance = await new APIKit().init(getToken);
		ApiInstance.post(constants.updateApplianceExtra, payload)
			.then((response)=>{
				navigation.navigate('bottomTab');
			}).catch((e) => {
				RN.Alert.alert(e);
			});
	};
	const addAnotherField = () => {
		console.log('another field');
	};
	return (
		<RN.KeyboardAvoidingView behavior={RN.Platform.OS === 'ios' ? "padding":""}>
		<RN.View style={{ backgroundColor: colorWhite }}>
			{selectOptions()}
			{openModal()}
			<RN.ScrollView showsVerticalScrollIndicator={false} bounces={false}>
				<HomeHeader title="Maintenance & Reminder" navigationProp="dashboard" />

				<RN.View>
					<Formik
						initialValues={{
							labourCost: '',
							spareCost: '',
							sparePartnerName: '',
							expire_date: '',
							issue_date: '',
							remarks: '',
							comments: '',
							serviceOver: '',
						}}
						innerRef={formikRef}
						onSubmit={(values, actions) =>
							AddMaintenanceSubmit(values, actions)
						}>
						{({
							handleSubmit,
							values,
							setFieldValue,
							errors,
							handleBlur,
							handleChange,
						}) => (
							<RN.View>
								<RN.Text style={style.label}>
									{'Free service availability'}
								</RN.Text>
								<RadioForm
									radio_props={radioProps}
									initial={true}
									value={radio}
									buttonSize={15}
									buttonColor={colorLightBlue}
									buttonInnerColor={colorWhite}
									formHorizontal={true}
									labelHorizontal={true}
									buttonOuterColor={colorLightBlue}
									labelStyle={{ fontFamily: 'Rubik-Rergular' }}
									radioStyle={{ paddingRight: 20 }}
									style={{ marginLeft: 20 }}
									onPress={(value) => {
										setRadio(value);
									}}
								/>
								{radio == false ? (
									(values.service = '0' && values.serviceOver == 0)
								) : radio == true ? (
									<RN.View>
										<RN.Text style={style.label}>
											{'How many free services promised?'}
										</RN.Text>
										<RN.View
											style={{
												flexDirection: 'row',
												justifyContent: 'space-between',
											}}>
											<RN.View style={{ flex: 1 }}>
												<ModalDropdownComp
													onSelect={(data) =>
														onSelectPromisedService(data, setFieldValue)
													}
													ref={dropdownServiceDataref}
													options={service_data}
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
															{props.label}
														</RN.Text>
													)}
													dropdownStyle={{ elevation: 8, borderRadius: 8 }}
													renderSeparator={(obj) => null}>
													<FloatingInput
														placeholder="select"
														editable_text={false}
														type="dropdown"
														value={values.service && serviceData.label}
														error={errors.service}
														inputstyle={style.inputStyle}
														containerStyle={{
															borderBottomWidth: 0,
															marginBottom: 0,
														}}
														dropdowncallback={() =>
															dropdownServiceDataref.current.show()
														}
														rightIcon={
															<RN.Image
																source={arrow_down}
																style={{
																	width: 12,
																	position: 'absolute',
																	height: 8.3,
																	right:
                                    RN.Dimensions.get('screen').width * 0.11,
																	top: 23,
																}}
															/>
														}
													/>
												</ModalDropdownComp>
											</RN.View>
											<RN.View style={{ flex: 1 }}>
												<FloatingInput
													placeholder="How many services are over?"
													value={values.serviceOver}
													keyboard_type={'numeric'}
													onChangeText={handleChange('serviceOver')}
													onBlur={handleBlur('serviceOver')}
													containerStyle={{
														width: RN.Dimensions.get('screen').width * 0.5,
													}}
												/>
											</RN.View>
										</RN.View>
									</RN.View>
								) : null}
								<RN.Text style={style.label}>
									{'Previous maintenance details'}
								</RN.Text>
								<RN.View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}>
									<RN.View style={{ flex: 1 }}>
										<DateOfPurchase
											style={{ backgroundColor: 'red' }}
											errors={errors}
											values={values}
											setFieldValue={setFieldValue}
											handleBlur={handleBlur}
										/>
									</RN.View>
									<RN.View style={{ flex: 1 }}>
										<FloatingInput
											placeholder={'Labour cost'}
											value={values.labourCost}
											keyboard_type={'numeric'}
											onChangeText={handleChange('labourCost')}
											onBlur={handleBlur('labourCost')}
											inputstyle={style.inputStyles}
											leftIcon={
												<RN.Image
													source={rupee}
													style={{
														width: 35,
														height: 35,
														top: -22,
														marginTop:
                              RN.Dimensions.get('screen').height * 0.04,
														left: RN.Dimensions.get('screen').width * 0.06,
														position: 'absolute',
													}}
												/>
											}
											containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
										/>
									</RN.View>
								</RN.View>
								<RN.View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}>
									<RN.View style={{ flex: 1 }}>
										<FloatingInput
											placeholder="Spare part name"
											value={values.sparePartnerName}
											onChangeText={handleChange('sparePartnerName')}
											onBlur={handleBlur('sparePartnerName')}
											inputstyle={style.inputStyle}
											containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
										/>
									</RN.View>
									<RN.View style={{ flex: 1 }}>
										<FloatingInput
											placeholder={'Spare cost'}
											value={values.spareCost}
											keyboard_type={'numeric'}
											onChangeText={handleChange('spareCost')}
											onBlur={handleBlur('spareCost')}
											inputstyle={style.inputStyles}
											leftIcon={
												<RN.Image
													source={rupee}
													style={{
														width: 35,
														height: 35,
														top: -22,
														marginTop:
                              RN.Dimensions.get('screen').height * 0.04,
														left: RN.Dimensions.get('screen').width * 0.06,
														position: 'absolute',
													}}
												/>
											}
											containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
										/>
									</RN.View>
								</RN.View>
								<FloatingInput
									placeholder="Remarks"
									value={values.remarks}
									onChangeText={handleChange('remarks')}
									onBlur={handleBlur('remarks')}
									containerStyle={{
										width: RN.Dimensions.get('screen').width * 0.9,
										marginBottom: 0,
										alignSelf: 'center',
										marginTop: -15,
									}}
								/>
								<RN.Text
									style={{
										marginTop: -12,
										fontSize: 13,
										color: colorAsh,
										marginLeft: 25,
										width: '20%',
										textDecorationLine: 'underline',
									}}
									onPress={() => addAnotherField()}>
									{'Add Another'}
								</RN.Text>

								<RN.Text style={style.label}>{'Upload invoice'}</RN.Text>
								<RN.ScrollView
									horizontal={true}
									showsHorizontalScrollIndicator={false}>
									<RN.View
										style={{
											flexDirection: 'row',
											justifyContent: 'flex-end',
										}}>
										{resourcePath.map((image, index) => {
											return (
												<RN.View style={{ flex: 1 }} key={index}>
													<RN.Image
														source={{ uri: 'file:///' + image.path }}
														style={{
															borderStyle: 'dashed',
															borderWidth: 1,
															borderColor: colorAsh,
															height: RN.Dimensions.get('screen').height / 6,
															width: RN.Dimensions.get('screen').width / 4,
															marginLeft: 20,
															marginRight: 10,
															borderRadius: 20,
															paddingLeft: 5,
														}}
													/>
												</RN.View>
											);
										})}
										<RN.View style={{ flex: 1 }}>
											<RN.TouchableOpacity
												onPress={() => {
													if (initial == 0) {
														setInitial(initial + 1);
														setVisible(true);
													} else {
														closeModal();
													}
												}}>
												<RN.View
													style={{
														borderStyle: 'dashed',
														borderWidth: 1,
														borderColor: colorAsh,
														height: RN.Dimensions.get('screen').height / 6,
														width: RN.Dimensions.get('screen').width / 4,
														marginLeft: 20,
														marginRight: 20,
														backgroundColor: colorWhite,
														borderRadius: 20,
														justifyContent: 'center',
													}}>
													<RN.Image
														source={add_img}
														style={{
															height: 30,
															width: 30,
															alignSelf: 'center',
														}}
													/>
												</RN.View>
											</RN.TouchableOpacity>
										</RN.View>
									</RN.View>
								</RN.ScrollView>

								<RN.View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}>
									<RN.View style={{ flex: 1 }}>
										<RN.Text style={style.label}>{'Set remainder'}</RN.Text>
										<DateOfExpiry
											style={{ backgroundColor: 'red' }}
											errors={errors}
											values={values}
											setFieldValue={setFieldValue}
											handleBlur={handleBlur}
										/>
									</RN.View>
									<RN.View style={{ flex: 1 }}>
										<RN.Text style={style.label}>{'Add Title'}</RN.Text>
										<ModalDropdownComp
											onSelect={(data) =>
												onSelectApplianceRemainder(data, setFieldValue)
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
										</ModalDropdownComp>
										{titleData && titleData.name === 'Others' ? (
											<FloatingInput
												placeholder="Other Location"
												value={values.otherDocumentLocation}
												onChangeText={(data) => setFieldValue('title', data)}
												error={errors.otherDocumentLocation}
												inputstyle={style.inputStyle}
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
									placeholder={'Comments'}
									value={values.comments}
									onChangeText={handleChange('comments')}
									onBlur={handleBlur('comments')}
									error={errors.otherDocumentLocation}
									inputstyle={style.inputStyle}
									containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
								/>
								<RN.Text
									style={{
										marginTop: 20,
										fontSize: 13,
										color: colorAsh,
										alignSelf: 'center',
										textDecorationLine: 'underline',
									}}
									onPress={() => navigation.navigate('bottomTab')}>
									{'Skip for now'}
								</RN.Text>
								<RN.View
									style={{ marginVertical: 20, paddingTop: 40, padding: 20 }}>
									<ThemedButton
										title="Finish"
										onPress={handleSubmit}
										color={colorLightBlue}></ThemedButton>
								</RN.View>
							</RN.View>
						)}
					</Formik>
				</RN.View>
			</RN.ScrollView>
		</RN.View>
		</RN.KeyboardAvoidingView>
	);
};

export default AddRemainders;
