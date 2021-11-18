import React, { useEffect, useRef, useState } from 'react';
import * as RN from 'react-native';
import style from './style';
import HomeHeader from '@components/HomeHeader';
import FloatingInput from '@components/FloatingInput';
import { Formik } from 'formik';
import ModalDropdownComp from '@components/ModalDropdownComp';
import { useNavigation } from '@react-navigation/native';
import { DatePicker } from '@components/DatePickerComp';
import {
	arrow_down,
	add_img,
	close_round,
	glitter,
	radioactive,
	radioinactive,
	rupee,
} from '@constants/Images';
import { font14 } from '@constants/Fonts';
import {
	colorLightBlue,
	colorDropText,
	colorAsh,
	colorWhite,
} from '@constants/Colors';
import ThemedButton from '@components/ThemedButton';
import StarRating from '@components/StarRating';
import ModalComp from '@components/ModalComp';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config';
import * as ImagePicker from 'react-native-image-picker';
import * as RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import { AddReaminderNav } from '@navigation/NavigationConstant';
import * as yup from 'yup';
import { ButtonHighLight } from '@components/debounce';

const Maintenance = (props) => {
	const formikRef = useRef();
	const navigation = useNavigation();
	const dropdownCategoryref = useRef(null);
	const dropdownApplianceref = useRef(null);
	const dropdownModelref = useRef(null);
	const dropdownBrandref = useRef(null);
	const [resourcePath, setResourcePath] = useState([]);
	const [applianceBrandList, setApplianceBrandList] = useState([]);
	const [visible, setVisible] = useState(false);
	const [category, setCategory] = useState(null);
	const [response, setResponse] = useState();
	const [applianceCategory, setApplianceCategory] = useState([]);
	const [applianceType, setApplianceType] = useState([]);
	const [selectedApplianceType, setSelectedApplianceType] = useState([]);
	const [selectedApplianceModelList, setSelectedApplianceModelList] = useState(
		[]
	);
	const [selectedApplianceBrandList, setSelectedApplianceBrandList] = useState(
		[]
	);
	const [isEnabled, setIsEnabled] = useState(false);
	const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
	const localTime = new Date().getTime();
	const platfromOs = `${RNFS.DocumentDirectoryPath}/.azzetta/asset/`;

	const destinationPath = platfromOs + localTime + '.jpg';
	const [applianceModelList, setApplianceModelList] = useState([]);
	const [cameraVisible, setCameraVisible] = useState(false);
	const [radioOption, setRadioOption] = useState(false);
	const [radioOption1, setRadioOption1] = useState(false);
	const onSelectCategory = (data, setFieldValue) => {
		// alert(data)
		setFieldValue('category', applianceCategory[data]);
		setCategory(applianceCategory[data]);
		if (category != data) {
			formikRef.current.resetForm(
				setFieldValue({
					values: {
						applianceType: '',
						brand: '',
						modelName: '',
						serialNumber: '',
					},
				})
			);
			setFieldValue('category', applianceCategory[data]);
			setCategory(applianceCategory[data]);
		}
		applianceTypeList(applianceCategory[data]);
	};
	const onSelectApplianceType = (data, setFieldValue) => {
		// alert(data)
		setFieldValue('applianceType', applianceType[data]);
		setSelectedApplianceType(applianceType[data]);
		if (selectedApplianceType != data) {
			setFieldValue('brand', setApplianceBrandList([]));
			setFieldValue('modelName', setSelectedApplianceModelList([]));
		}
		setFieldValue('applianceType', applianceType[data]);
		setSelectedApplianceType(applianceType[data]);
		applianceBrand(applianceType[data]);
	};
	const onSelectBrand = (data, setFieldValue) => {
		// alert(data)
		setFieldValue('brand', applianceBrandList[data]);
		setSelectedApplianceBrandList(applianceBrandList[data]);
		if (selectedApplianceBrandList != data) {
			setFieldValue('modelName', setSelectedApplianceModelList([]));
		}
		setFieldValue('brand', applianceBrandList[data]);
		setSelectedApplianceBrandList(applianceBrandList[data]);
		applianceModel(applianceBrandList[data]);
	};
	const onSelectModelName = (data, setFieldValue) => {
		// alert(data)
		setFieldValue('modelName', applianceModelList[data]);
		setSelectedApplianceModelList(applianceModelList[data]);
	};
	const EditAsssetSubmit = (values) => {
		// addAppliance(values);
	};

	const removePhoto = (url) => {
		let result = resourcePath.filter((item, index) => item != url);
		setResourcePath(result);
	};

	const applianceCategoryList = async () => {
		const getToken = await AsyncStorage.getItem('loginToken');
		let ApiInstance = await new APIKit().init(getToken);
		let awaitlocationresp = await ApiInstance.get(constants.applianceCategory);
		if (awaitlocationresp.status == 1) {
			setApplianceCategory(awaitlocationresp.data.data);
		} else {
			console.log('not listed location type');
		}
	};
	const applianceTypeList = async (applianceCategory) => {
		const getToken = await AsyncStorage.getItem('loginToken');
		let ApiInstance = await new APIKit().init(getToken);
		let awaitlocationresp = await ApiInstance.get(
			constants.applianceType +
				'?appliance_category_id=' +
				applianceCategory._id
		);
		if (awaitlocationresp.status == 1) {
			setApplianceType(awaitlocationresp.data.data);
		} else {
			console.log('not listed location type');
		}
	};

	const applianceBrand = async (applianceType) => {
		const getToken = await AsyncStorage.getItem('loginToken');
		let ApiInstance = await new APIKit().init(getToken);
		let awaitlocationresp = await ApiInstance.get(
			constants.applianceBrand +
				'?appliance_type_id=' +
				applianceType._id +
				'&appliance_category_id=' +
				category._id
		);

		if (awaitlocationresp.status == 1) {
			setApplianceBrandList(awaitlocationresp.data.data);
		} else {
			console.log('brand not listed  type');
		}
	};
	const addAppliance = async (values) => {
		const getToken = await AsyncStorage.getItem('loginToken');
		const payload = {
			appliance_category_id: {
				id: category._id,
				other_value: values.otherCategoryType,
			},
			appliance_type_id: {
				id: selectedApplianceType._id,
				other_value: values.otherApplianceType,
			},
			appliance_brand_id: {
				id: selectedApplianceBrandList._id,
				other_value: values.otherBrand,
			},
			appliance_model_id: {
				id: selectedApplianceModelList._id,
				other_value: values.otherModel,
			},
			serial_number: values.serialNumber,
			image: resourcePath,
			purchase_date: moment(new Date(values.purchase_date)).format(
				'YYYY-MM-DD'
			),
			price: values.price !== '' ? values.price : ' ',
		};
		let ApiInstance = await new APIKit().init(getToken);
		let awaitresp = await ApiInstance.post(constants.addAppliance, payload);
		if (awaitresp.status == 1) {
			setResponse(awaitresp.data.data._id);
			setVisible(true);
			if (formikRef.current) {
				formikRef.current.resetForm();
			}
		} else {
			RN.Alert.alert(awaitresp.err_msg);
		}
	};
	const applianceModel = async (applianceBrandList) => {
		const getToken = await AsyncStorage.getItem('loginToken');
		let ApiInstance = await new APIKit().init(getToken);
		let awaitlocationresp = await ApiInstance.get(
			constants.listApplianceModel +
				'?appliance_type_id=' +
				selectedApplianceType._id +
				'&appliance_brand_id=' +
				applianceBrandList._id +
				'&appliance_category_id=' +
				category._id
		);
		if (awaitlocationresp.status == 1) {
			setApplianceModelList(awaitlocationresp.data.data);
		} else {
			console.log('  brand not listed  type');
		}
	};
	const signupValidationSchema = yup.object().shape({});
	useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			if (formikRef.current) {
				formikRef.current.resetForm();
				setResourcePath([]);
			}
		});
		applianceCategoryList();
		applianceTypeList();
		return unsubscribe;
	}, []);

	const HideBrand = (data, setFieldValue) => {
		setFieldValue('otherBrand', ' ');
	};
	const HideModelName = (data, setFieldValue) => {
		setFieldValue('otherModel', ' ');
	};

	const openModal = () => {
		return (
			<ModalComp visible={visible}>
				<RN.View>
					<RN.View style={style.closeView}>
						<RN.TouchableOpacity
							onPress={() => {
								setVisible(false);
								navigation.navigate('bottomTab');
							}}>
							<RN.Image source={close_round} style={style.close_icon} />
						</RN.TouchableOpacity>
					</RN.View>
					<RN.View style={style.glitterView}>
						<RN.Image style={style.glitterStar} source={glitter} />
					</RN.View>
					<RN.Text style={style.para}>
						Your appliance added successfully!
					</RN.Text>
					<RN.View style={style.box}>
						<RN.Text style={style.header}>
							Would you like to add additional details and set reminder for free
							or paid service?
						</RN.Text>
						<RN.View style={{ width: '80%', marginLeft: '10%' }}>
							<ThemedButton
								onPress={() => {
									setVisible(false);
									navigation.navigate(AddReaminderNav, {
										asset_id: response,
									});
								}}
								title="Yes"
								mode={'outline'}
								color={colorLightBlue}></ThemedButton>
						</RN.View>
						<RN.Text
							onPress={() => {
								setVisible(false);
								navigation.navigate('bottomTab');
							}}
							style={style.skip}>
							Skip for now
						</RN.Text>
					</RN.View>
				</RN.View>
			</ModalComp>
		);
	};
	const initialValues = {
		helpdesk_number: '',
		download_link: '',
		free_services: '',
		no_of_services: '',
		maintanenance_date: '',
		labour_cost: '',
		spare_name: '',
		spare_cost: '',
		maintenance_remarks: '',
		service_person_name: '',
		contact_number: '',
		set_reminder: '',
		add_title: '',
		comments: '',
	};

	const requestPermission = async () => {
		try {
			const granted = await RN.PermissionsAndroid.request(
				RN.PermissionsAndroid.PERMISSIONS.CAMERA,
				{
					title: 'Permission',
					message:
						'App needs access to your camera and storage ' +
						'so you can take photos and store.',
					// buttonNeutral: "Ask Me Later",
					//  buttonNegative: 'Cancel',
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
				RN.Alert.alert(
					'Please allow Camera and Storage permissions in application settings to upload an image'
				);
				console.log('denied');
			} else {
				console.log('error');
			}
		} catch (err) {
			console.warn(err);
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
						<ButtonHighLight onPress={() => selectImage()}>
							<RN.Text style={style.successHeader}>Select Image</RN.Text>
						</ButtonHighLight>
						<ButtonHighLight
							onPress={() => {
								selectCamera();
							}}>
							<RN.Text style={style.successHeader}>Open Camera</RN.Text>
						</ButtonHighLight>
					</RN.View>
				</RN.View>
			</ModalComp>
		);
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
		try {
			const granted = await RN.PermissionsAndroid.requestMultiple([
				RN.PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
				RN.PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
			]);
		} catch (err) {
			console.warn(err);
		}
		const readGranted = await RN.PermissionsAndroid.check(
			RN.PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
		);
		const writeGranted = await RN.PermissionsAndroid.check(
			RN.PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
		);
		if (!readGranted || !writeGranted) {
			console.log('Read and write permissions have not been granted');
			return;
		}
		var path = platfromOs;
		return new Promise((resolve, reject) => {
			RNFS.mkdir(path)
				.then(() => {
					RNFS.moveFile(filePath, newFilepath)
						.then((res) => {
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
					// reject(err);
				});
		});
	};
	const closeOptionsModal = () => {
		setCameraVisible(false);
	};
	const receiveRatingValue = (value) => {};
	const EnableEcomRadio = () => {
		setRadioOption(!radioOption);
	};
	return (
		<RN.View style={{ backgroundColor: colorWhite }}>
			{selectOptions()}
			{openModal()}
			<RN.ScrollView showsVerticalScrollIndicator={false}>
				<HomeHeader title="Maintenance & Reminder" />
				<RN.View>
					<Formik
						validationSchema={signupValidationSchema}
						innerRef={formikRef}
						validateOnChange={false}
						validateOnBlur={false}
						enableReinitialize={true}
						initialValues={initialValues}
						onSubmit={(values) => EditAsssetSubmit(values)}>
						{({
							handleSubmit,
							values,
							setFieldValue,
							errors,
							handleBlur,
							touched,
						}) => (
							<RN.View>
								<RN.Text style={style.label}>
									Helpdesk number of the brand for service and repair
								</RN.Text>
								<FloatingInput
									placeholder="894334XXXX"
									value={values.helpdesk_number}
									onChangeText={(data) =>
										setFieldValue('helpdesk_number', data)
									}
									error={errors.helpdesk_number}
									errorStyle={{ marginLeft: 20, marginBottom: 10 }}
									// autoCapitalize={'characters'}
									inputstyle={style.inputStyle}
									containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
								/>
								<RN.Text style={style.label}>
									Add link to download owners manual
								</RN.Text>
								<FloatingInput
									placeholder="https://"
									value={values.download_link}
									onChangeText={(data) => setFieldValue('download_link', data)}
									error={errors.download_link}
									errorStyle={{ marginLeft: 20, marginBottom: 10 }}
									// autoCapitalize={'characters'}
									inputstyle={style.inputStyle}
									containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
								/>
								<RN.View>
									<RN.Text style={style.label}>
										{'Free service availability'}
									</RN.Text>
									<RN.View style={{ flex: 1, flexDirection: 'row' }}>
										<RN.View
											style={{
												flex: 0.5,
												flexDirection: 'row',
												alignItems: 'center',
											}}>
											<RN.TouchableOpacity
												onPress={() => setRadioOption(!radioOption)}>
												<RN.ImageBackground
													source={
														radioOption == true ? radioactive : radioinactive
													}
													style={{ width: 20, height: 20, marginLeft: 15 }}
													resizeMode="contain"
												/>
											</RN.TouchableOpacity>
											<RN.Text style={style.label}>Yes</RN.Text>
										</RN.View>
										<RN.View
											style={{
												flex: 0.5,
												flexDirection: 'row',
												alignItems: 'center',
											}}>
											<RN.TouchableOpacity
												onPress={() => setRadioOption1(!radioOption1)}>
												<RN.ImageBackground
													source={
														radioOption1 == true ? radioactive : radioinactive
													}
													style={{ width: 20, height: 20, marginLeft: 15 }}
													resizeMode="contain"
												/>
											</RN.TouchableOpacity>
											<RN.Text style={style.label}>No</RN.Text>
										</RN.View>
									</RN.View>
								</RN.View>

								<RN.Text style={style.label}>
									{'How many free services promised?'}
								</RN.Text>
								<RN.View
									style={{
										flex: 1,
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignContent: 'center',
									}}>
									<RN.View style={{ flex: 0.35 }}>
										<ModalDropdownComp
											disabled={values.free_services == '' ? true : false}
											ref={dropdownApplianceref}
											options={applianceType}
											isFullWidth
											renderRow={(props) => {
												return (
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
												);
											}}
											dropdownStyle={{
												elevation: 8,
												borderRadius: 8,
											}}
											renderSeparator={(obj) => null}>
											<FloatingInput
												placeholder="Select"
												editable_text={false}
												type="dropdown"
												isDisabled={values.free_services == '' ? true : false}
												value={
													values.applianceType && selectedApplianceType.name
												}
												inputstyle={style.inputStyle}
												containerStyle={{
													borderBottomWidth: 0,
													marginBottom: 0,
												}}
												dropdowncallback={() =>
													dropdownApplianceref.current.show()
												}
												rightIcon={
													<RN.ImageBackground
														source={arrow_down}
														resizeMode="contain"
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
									</RN.View>
									<RN.View style={{ flex: 0.65 }}>
										<RN.TextInput
											values={values.no_of_services}
											placeholder="How many services are over?"
											style={style.customTextinput}
										/>
									</RN.View>
								</RN.View>
								<RN.Text style={style.label}>
									{'Previous maintenance details'}
								</RN.Text>
								<RN.View
									style={{
										flex: 1,
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignContent: 'center',
									}}>
									<RN.View style={{ flex: 0.5 }}>
										<DatePicker
											style={{ backgroundColor: 'red' }}
											errors={errors}
											values={values}
											setFieldValue={setFieldValue}
											handleBlur={handleBlur}
										/>
									</RN.View>
									<RN.View style={{ flex: 0.5 }}>
										<FloatingInput
											placeholder={touched.labour_cost ? ' ' : 'Labour cost'}
											value={values.labour_cost}
											onChangeText={(data) =>
												setFieldValue('labour_cost', data)
											}
											error={errors.labour_cost}
											errorStyle={{ marginLeft: 20, marginBottom: 10 }}
											keyboard_type="numeric"
											autoCapitalize={'characters'}
											leftIcon={
												<RN.Image
													source={rupee}
													style={{
														width: 35,
														height: 35,
														top: RN.Dimensions.get('screen').height * 0.01,
														left: RN.Dimensions.get('screen').width * 0.06,
														position: 'absolute',
													}}
												/>
											}
											inputstyle={style.inputStyles}
											containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
										/>
									</RN.View>
								</RN.View>
								<RN.View
									style={{
										flex: 1,
										marginTop: 20,
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignContent: 'center',
									}}>
									<RN.View style={{ flex: 0.5 }}>
										<FloatingInput
											placeholder="Spare part name"
											value={values.spare_name}
											onChangeText={(data) => setFieldValue('spare_name', data)}
											error={errors.spare_name}
											errorStyle={{ marginLeft: 20, marginBottom: 10 }}
											// autoCapitalize={'characters'}
											inputstyle={style.inputStyle}
											containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
										/>
									</RN.View>
									<RN.View style={{ flex: 0.5 }}>
										<FloatingInput
											placeholder={touched.spare_cost ? ' ' : 'Spare cost'}
											value={values.spare_cost}
											onChangeText={(data) => setFieldValue('spare_cost', data)}
											error={errors.spare_cost}
											errorStyle={{ marginLeft: 20, marginBottom: 10 }}
											keyboard_type="numeric"
											autoCapitalize={'characters'}
											leftIcon={
												<RN.Image
													source={rupee}
													style={{
														width: 35,
														height: 35,
														top: RN.Dimensions.get('screen').height * 0.01,
														left: RN.Dimensions.get('screen').width * 0.06,
														position: 'absolute',
													}}
												/>
											}
											inputstyle={style.inputStyles}
											containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
										/>
									</RN.View>
								</RN.View>
								<RN.TextInput
									placeholder="Remarks"
									style={[
										style.customTextinput,
										{ marginLeft: 15, marginRight: 15 },
									]}
								/>
								<RN.Text style={style.addanotherText}>Add another</RN.Text>
								<RN.View>
									<RN.Text style={style.label}>
										{'Share your experience with the service person?'}
									</RN.Text>
									<StarRating
										sendRatingsValue={(starvalue) =>
											receiveRatingValue(starvalue)
										}
									/>
									<RN.View style={{ marginLeft: 15 }}>
										<RN.Text>Comments</RN.Text>
										<RN.TextInput
											style={{
												borderBottomWidth: 0.5,
												borderBottomColor: '#747474',
												height: 40,
											}}
										/>
									</RN.View>
								</RN.View>
								<RN.View
									style={{
										flexDirection: 'row',
										justifyContent: 'flex-start',
									}}>
									<RN.View style={{ flex: 1 }}>
										<RN.Text style={style.label}>{'Upload invoice'}</RN.Text>
									</RN.View>
								</RN.View>

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
												<RN.View style={{ flex: 1, paddingTop: 5 }} key={index}>
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
															borderRadius: 10,
															paddingLeft: 5,
														}}
													/>
													<RN.View
														style={{
															position: 'absolute',
															top: 0,
															right: 0,
														}}>
														<RN.TouchableOpacity
															onPress={() => {
																RNFS.unlink('file:///' + image.path)
																	.then(() => {
																		removePhoto(image);
																	})
																	.catch((err) => {
																		console.log(err.message);
																	});
															}}>
															<RN.Image
																source={require('../../assets/images/add_asset/close.png')}
																style={{ height: 20, width: 20 }}
															/>
														</RN.TouchableOpacity>
													</RN.View>
												</RN.View>
											);
										})}
										<RN.View style={{ flex: 1 }}>
											<RN.TouchableOpacity
												onPress={() => {
													if (RN.Platform.OS == 'android') {
														requestPermission();
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
														borderRadius: 10,
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
										flex: 1,
										flexDirection: 'row',
										justifyContent: 'space-between',
										alignContent: 'center',
									}}>
									<RN.View style={{ flex: 0.5 }}>
										<RN.Text style={style.label}>Set reminder</RN.Text>
										<DatePicker
											style={{ backgroundColor: 'red' }}
											errors={errors}
											values={values}
											setFieldValue={setFieldValue}
											handleBlur={handleBlur}
										/>
									</RN.View>
									<RN.View style={{ flex: 0.5 }}>
										<RN.Text style={style.label}>Add Title</RN.Text>
										<ModalDropdownComp
											onSelect={(data) => {
												onSelectApplianceType(data, setFieldValue);
												HideBrand(data, setFieldValue);
												setSelectedApplianceBrandList([]);
											}}
											disabled={values.add_title == '' ? true : false}
											ref={dropdownApplianceref}
											options={applianceType}
											isFullWidth
											renderRow={(props) => {
												return (
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
												);
											}}
											dropdownStyle={{
												elevation: 8,
												borderRadius: 8,
											}}
											renderSeparator={(obj) => null}>
											<FloatingInput
												placeholder="Select"
												editable_text={false}
												type="dropdown"
												isDisabled={values.add_title == '' ? true : false}
												value={
													values.applianceType && selectedApplianceType.name
												}
												error={
													values.applianceType && errors.applianceType
														? ' '
														: errors.applianceType
												}
												errorStyle={{ marginLeft: 20, marginBottom: 10 }}
												inputstyle={style.inputStyle}
												containerStyle={{
													borderBottomWidth: 0,
													marginBottom: 0,
												}}
												dropdowncallback={() =>
													dropdownApplianceref.current.show()
												}
												rightIcon={
													<RN.ImageBackground
														source={arrow_down}
														resizeMode="contain"
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
									</RN.View>
								</RN.View>

								<RN.Text style={style.label}>Comments</RN.Text>
								<FloatingInput
									placeholder="Warranty end date for Whirlpool AC"
									value={values.comments}
									onChangeText={(data) => setFieldValue('serialNumber', data)}
									error={errors.serialNumber}
									errorStyle={{ marginLeft: 20, marginBottom: 10 }}
									// autoCapitalize={'characters'}
									inputstyle={style.inputStyle}
									containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
								/>

								<RN.View
									style={{ marginVertical: 20, paddingTop: 40, padding: 20 }}>
									<ThemedButton
										title="Save Changes"
										onPress={handleSubmit}
										color={colorLightBlue}></ThemedButton>
								</RN.View>
							</RN.View>
						)}
					</Formik>
				</RN.View>
			</RN.ScrollView>
		</RN.View>
	);
};

export default Maintenance;
