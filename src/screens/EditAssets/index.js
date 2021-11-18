import React, { useEffect, useRef, useState } from 'react';
import { Image, Text } from 'react-native';
import * as RN from 'react-native';
import style from './style';
import HomeHeader from '@components/HomeHeader';
import FloatingInput from '@components/FloatingInput';
import { Formik } from 'formik';
import ModalDropdownComp from '@components/ModalDropdownComp';
import { useNavigation } from '@react-navigation/native';
import {
	arrow_down,
	add_img,
	rupee,
	close_round,
	glitter,
} from '@constants/Images';
import { font14 } from '@constants/Fonts';
import {
	colorLightBlue,
	colorDropText,
	colorAsh,
	colorWhite,
	colorGray,
} from '@constants/Colors';
import ThemedButton from '@components/ThemedButton';
import ModalComp from '@components/ModalComp';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config';
import * as ImagePicker from 'react-native-image-picker';
import * as RNFS from 'react-native-fs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';
import {
	AddReaminderNav,
	OtherDetailsNav,
} from '@navigation/NavigationConstant';
import { DatePicker } from '@screens/AddAssets/datePicker';
import * as yup from 'yup';
import { ButtonHighLight } from '@components/debounce';

const AddAsset = (props) => {
	let reminder_data = [
		'You can set up fully customizable reminders for dates (1 week / 1 month or any period in advance of the end date) for end of warranty, AMC, Extended Warranty, Maintenance Service due dates for all your appliances and gadgets so that you can raise issues within the due dates. ',

		'Similarly, you can set up renewal dates for your Passport, Driving License, etc., and payment due dates of your EMI or ECS mandate, etc. Further, these alerts will get populated in your native calendar in your cell phone.',

		'\u{2B24}   You can set your own customizable and mul',
		'\u{2B24}   Important dates for end of warranty, AMC, Extended Warranty, Regular Service ',
		'\u{2B24}   Renewal related - Passport, Driving License for self and family, etc.,',
		'\u{2B24}  Payment due dates - EMI, Loan, ECS, Home mortgage, Insurance premium  etc',
		'\u{2B24}   Any important dates in your life',
	];
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
	const localTime = new Date().getTime();
	const platfromOs = `${RNFS.DocumentDirectoryPath}/.azzetta/asset/`;

	const destinationPath = platfromOs + localTime + '.jpg';
	const [applianceModelList, setApplianceModelList] = useState([]);
	const [cameraVisible, setCameraVisible] = useState(false);
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
		navigation.navigate(OtherDetailsNav);
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
	const signupValidationSchema = yup.object().shape({
		category: yup.object().nullable().required('Category is Required'),
		applianceType: yup
			.object()
			.nullable()
			.required('Appliance type  is Required'),
		brand: yup.object().nullable().required('Brand  is Required'),
		modelName: yup.object().nullable().required('Model name  is Required'),
		purchase_date: yup.string().required('Date is Required'),
	});
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
		category: '',
		applianceType: '',
		brand: '',
		modelName: '',
		serialNumber: '',
		purchase_date: '',
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
				console.log('You can use the storage');
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

	return (
		<RN.View style={{ backgroundColor: colorWhite }}>
			{selectOptions()}
			{openModal()}
			<RN.ScrollView showsVerticalScrollIndicator={false}>
				<HomeHeader
					title={
						category && category.name && category.name.includes('Appliance')
							? ' Edit  Appliance'
							: 'Edit Asset'
					}
				/>
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
									{'Category'}
									<RN.Text style={{ color: 'red', justifyContent: 'center' }}>
										*
									</RN.Text>
								</RN.Text>
								<ModalDropdownComp
									onSelect={(data) => onSelectCategory(data, setFieldValue)}
									ref={dropdownCategoryref}
									options={applianceCategory}
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
									dropdownStyle={{
										elevation: 8,
										borderRadius: 8,
									}}
									renderSeparator={(obj) => null}>
									<FloatingInput
										placeholder="Select"
										editable_text={false}
										type="dropdown"
										value={values.category && category.name}
										error={
											values.category && errors.category ? ' ' : errors.category
										}
										errorStyle={{ marginLeft: 20, marginBottom: 10 }}
										inputstyle={style.inputStyle}
										containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
										dropdowncallback={() => dropdownCategoryref.current.show()}
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
								{category && category.name === 'Others' ? (
									<FloatingInput
										placeholder="Enter category name"
										value={values.otherCategoryType}
										onChangeText={(data) =>
											setFieldValue('otherCategoryType', data)
										}
										error={
											values.otherCategoryType && errors.otherCategoryType
												? ' '
												: errors.otherCategoryType
										}
										errorStyle={{ marginLeft: 20, marginBottom: 10 }}
										// autoCapitalize={'characters'}
										inputstyle={style.otherInputStyle}
										containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
									/>
								) : null}
								<RN.View
									style={{
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}>
									<RN.View style={{ flex: 1 }}>
										<RN.Text style={style.label}>
											{category &&
											category.name &&
											category.name.includes('Appliance')
												? 'Appliance type'
												: 'Asset type'}
											<RN.Text
												style={{ color: 'red', justifyContent: 'center' }}>
												*
											</RN.Text>
										</RN.Text>

										<ModalDropdownComp
											onSelect={(data) => {
												onSelectApplianceType(data, setFieldValue);
												HideBrand(data, setFieldValue);
												setSelectedApplianceBrandList([]);
											}}
											disabled={values.category == '' ? true : false}
											ref={dropdownApplianceref}
											options={(applianceType && applianceType)}
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
												isDisabled={values.category == '' ? true : false}
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
										{selectedApplianceType &&
										selectedApplianceType.name === 'Others' ? (
											<FloatingInput
												placeholder={
													category &&
													category.name &&
													category.name.includes('Appliance')
														? ' Enter Appliance type'
														: 'Enter Asset type'
												}
												value={values.otherApplianceType}
												onChangeText={(data) =>
													setFieldValue('otherApplianceType', data)
												}
												error={
													values.otherApplianceType && errors.otherApplianceType
														? ' '
														: errors.otherApplianceType
												}
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

									<RN.View style={{ flex: 1 }}>
										<RN.Text style={style.label}>
											{'Brand'}
											<RN.Text
												style={{ color: 'red', justifyContent: 'center' }}>
												*
											</RN.Text>
										</RN.Text>

										<ModalDropdownComp
											onSelect={(data) => {
												onSelectBrand(data, setFieldValue);
												HideModelName(data, setFieldValue);
											}}
											disabled={values.applianceType == '' ? true : false}
											ref={dropdownBrandref}
											options={applianceBrandList}
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
											dropdownStyle={{
												elevation: 8,
												borderRadius: 8,
											}}
											renderSeparator={(obj) => null}>
											<FloatingInput
												placeholder="Select"
												editable_text={false}
												isDisabled={values.applianceType == '' ? true : false}
												type="dropdown"
												value={values.brand && selectedApplianceBrandList.name}
												error={
													values.brand && errors.brand ? ' ' : errors.brand
												}
												errorStyle={{ marginLeft: 20, marginBottom: 10 }}
												inputstyle={style.inputStyle}
												containerStyle={{
													borderBottomWidth: 0,
													marginBottom: 0,
												}}
												dropdowncallback={() => dropdownBrandref.current.show()}
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
										{selectedApplianceBrandList &&
										selectedApplianceBrandList.name === 'Others' ? (
											<FloatingInput
												placeholder="Enter brand name"
												value={values.otherBrand}
												onChangeText={(data) => {
													setFieldValue('otherBrand', data);
												}}
												error={
													values.otherBrand && errors.otherBrand
														? ' '
														: errors.otherBrand
												}
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
								{selectedApplianceBrandList &&
								selectedApplianceBrandList.name === 'Others' ? (
									<RN.View>
										<RN.Text style={style.label}>
											{'Model number'}
											<RN.Text
												style={{ color: 'red', justifyContent: 'center' }}>
												*
											</RN.Text>
										</RN.Text>
									</RN.View>
								) : (
									<RN.View>
										<RN.Text style={style.label}>
											{'Model name'}
											<RN.Text
												style={{ color: 'red', justifyContent: 'center' }}>
												*
											</RN.Text>
										</RN.Text>
									</RN.View>
								)}
								<RN.View>
									<ModalDropdownComp
										onSelect={(data) => onSelectModelName(data, setFieldValue)}
										ref={dropdownModelref}
										disabled={values.brand == '' ? true : false}
										options={applianceModelList}
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
										dropdownStyle={{
											elevation: 8,
											borderRadius: 8,
										}}
										renderSeparator={(obj) => null}>
										<FloatingInput
											placeholder="Select"
											editable_text={false}
											isDisabled={values.brand == '' ? true : false}
											type="dropdown"
											value={
												values.modelName && selectedApplianceModelList.name
											}
											error={
												values.modelName && errors.modelName
													? ' '
													: errors.modelName
											}
											errorStyle={{ marginLeft: 20, marginBottom: 10 }}
											inputstyle={style.inputStyle}
											containerStyle={{
												borderBottomWidth: 0,
												marginBottom: 0,
											}}
											dropdowncallback={() => dropdownModelref.current.show()}
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
									{selectedApplianceModelList &&
									selectedApplianceModelList.name === 'Others' ? (
										<FloatingInput
											placeholder="Enter Model Number"
											value={values.otherModel}
											onChangeText={(data) => setFieldValue('otherModel', data)}
											error={
												values.otherModel && errors.otherModel
													? ' '
													: errors.otherModel
											}
											errorStyle={{ marginLeft: 20, marginBottom: 10 }}
											inputstyle={style.otherInputStyle}
											containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
										/>
									) : null}
								</RN.View>
								<RN.Text style={style.label}>{'Serial number'}</RN.Text>
								<FloatingInput
									placeholder="ex: SJ93RNFKD0"
									value={values.serialNumber}
									onChangeText={(data) => setFieldValue('serialNumber', data)}
									error={errors.serialNumber}
									errorStyle={{ marginLeft: 20, marginBottom: 10 }}
									// autoCapitalize={'characters'}
									inputstyle={style.inputStyle}
									containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
								/>
								<RN.View
									style={{
										flexDirection: 'row',
										justifyContent: 'flex-start',
									}}>
									<RN.View style={{ flex: 1 }}>
										<RN.Text style={style.label}>
											{'Upload appliance image'}
										</RN.Text>
									</RN.View>
									<RN.View style={{ flex: 1 }}>
										<RN.Text
											style={{
												fontFamily: 'Rubik-Regular',
												fontSize: 13,
												color: colorGray,
												marginLeft: 5,
												padding: 17,
												right: RN.Dimensions.get('screen').width * 0.13,
											}}>
											{'   ( Optional )'}
										</RN.Text>
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
										<RN.Text style={style.label}>
											{'Date of purchase'}
											<RN.Text
												style={{ color: 'red', justifyContent: 'center' }}>
												*
											</RN.Text>
										</RN.Text>
										<RN.View>
											<DatePicker
												style={{ backgroundColor: 'red' }}
												errors={errors}
												values={values}
												setFieldValue={setFieldValue}
												handleBlur={handleBlur}
											/>
										</RN.View>
									</RN.View>
									<RN.View style={{ flex: 0.5 }}>
										<RN.Text style={style.label}>{'Price '}</RN.Text>
										<FloatingInput
											placeholder={touched.price ? ' ' : '12345'}
											value={values.price}
											onChangeText={(data) => setFieldValue('price', data)}
											error={errors.price}
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
								<RN.Text
									style={{
										fontFamily: 'Rubik-Regular',
										fontSize: 13,
										color: colorGray,
										marginLeft: 15,
										marginVertical: 8,
									}}>
									{'Forgot date of purchase? Enter approx. date instead.'}
								</RN.Text>

								<RN.View
									style={{ marginVertical: 20, paddingTop: 40, padding: 20 }}>
									<ThemedButton
										title="Next"
										mode="outlined"
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

export default AddAsset;
