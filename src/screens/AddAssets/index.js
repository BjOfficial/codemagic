import React, { useEffect, useRef, useState } from "react";
import * as RN from "react-native";
import style from "./style";
import FloatingInput from "@components/FloatingInput";
import { Formik } from "formik";
import ModalDropdownComp from "@components/ModalDropdownComp";
import { useNavigation } from "@react-navigation/native";
import {
  arrow_down,
  add_img,
  rupee,
  close_round,
  glitter,
  white_arrow
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
import { AddReaminderNav } from '@navigation/NavigationConstant';
import { DatePicker } from '@screens/AddAssets/datePicker';
import * as yup from 'yup';
import { ButtonHighLight } from '@components/debounce';
import {
  cameraAndStorage,
  storageCheck,
  cameraCheck,
  storagePermission,
} from '@services/AppPermissions';
import StatusBar from '@components/StatusBar';

const AddAsset = (props) => {
  const appState = useRef(RN.AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
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
  const [isLoading, setLoading] = useState(false);
  const destinationPath = platfromOs + localTime + ".jpg";
  const [applianceModelList, setApplianceModelList] = useState([]);
  const [cameraVisible, setCameraVisible] = useState(false);
  const onSelectCategory = (data, setFieldValue) => {
    setFieldValue('category', applianceCategory[data]);
    setCategory(applianceCategory[data]);
    if (category != data) {
      formikRef.current.resetForm(
        setFieldValue({
          values: {
            applianceType: "",
            brand: "",
            modelName: "",
            serialNumber: "",
            category: "",
            otherCategoryType:"",
            otherApplianceType:"",
            otherModel:"",
            otherBrand:"",
            price:""
          },
        })
      );
      setSelectedApplianceBrandList([]);
      setFieldValue('category', applianceCategory[data]);
      setCategory(applianceCategory[data]);
      setSelectedApplianceType([]);
    }
    applianceTypeList(applianceCategory[data]);
  };
  const onSelectApplianceType = (data, setFieldValue) => {
    if (selectedApplianceType != data) {
      setFieldValue('brand', setApplianceBrandList([]));
      setFieldValue('modelName', setSelectedApplianceModelList([]));
    }
    setFieldValue('applianceType', applianceType[data]);
    setSelectedApplianceType(applianceType[data]);
    applianceBrand(applianceType[data]);
    setSelectedApplianceBrandList([]);
    setSelectedApplianceModelList([]);
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
    setSelectedApplianceModelList([]);
  };
  const onSelectModelName = (data, setFieldValue) => {
    // alert(data)
    setFieldValue('modelName', applianceModelList[data]);
    setSelectedApplianceModelList(applianceModelList[data]);
  };
  const AddAsssetSubmit = (values) => {
    console.log(values)
    setLoading(true);
    addAppliance(values);
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
  const applianceTypeList = async (applianceCategoryId) => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.applianceType +
        "?appliance_category_id=" +
        applianceCategoryId._id
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
    const getToken = await AsyncStorage.getItem("loginToken");
    let currentLocationId = await AsyncStorage.getItem('locationData_ID');
    let currentLocationName = await AsyncStorage.getItem('locationData_Name');
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
      asset_location_id:{
        id: currentLocationId,
        other_value: currentLocationName
      }
    };
    let ApiInstance = await new APIKit().init(getToken);
    let awaitresp = await ApiInstance.post(constants.addAppliance, payload);
    if (awaitresp.status == 1) {
      setResponse(awaitresp.data.data._id);
      setVisible(true);
      if (formikRef.current) {
        formikRef.current.resetForm();
      }
      setLoading(false);
    } else {
      RN.Alert.alert(awaitresp.err_msg);
      setLoading(false);
    }
    setLoading(false);
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
    category: yup.object().required("Category is Required"),
    applianceType: yup
      .object()
      .required("Appliance type is Required"),
    modelName: yup.object().required("Model name is Required"),
    purchase_date: yup.string().required("Date is Required"),
    brand: yup.object().required("Brand is Required"),
    otherCategoryType: yup
    .string().when('category', {
      is: (val) => val?.name === "Others",
      then: yup.string().required('Category is Required'),
  }),
    otherApplianceType: yup
    .string().when('applianceType', {
      is: (val) => val?.name === "Others",
      then: yup.string().required('Appliance type is Required'),
  }),
    otherModel: yup
    .string().when('modelName', {
      is: (val) => val?.name === "Others",
      then: yup.string().required('Model name is Required'),
    }),
    otherBrand: yup.string().when('brand', {
      is: (val) => val?.name === "Others",
      then: yup.string().required('Brand is Required'),
    }),
    price:yup.number().nullable().typeError("must be a number")
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

  useEffect(() => {
    RN.AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        storageCheck();
        cameraCheck();
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });
  }, []);

  const HideBrand = (data, setFieldValue) => {
    setFieldValue("otherBrand","");
  };
  const HideModelName = (data, setFieldValue) => {
    setFieldValue("otherModel","");
  };

  const openModal = () => {
    return (
      <ModalComp visible={visible}>
        <RN.View>
          <RN.View style={style.closeView}>
            <RN.TouchableOpacity
              onPress={() => {
                setVisible(false);
                navigation.navigate("Dashboard");
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
                    reminder_data: 'assetReminder',
                  });
                }}
                title="Yes"
                mode={'outline'}
                color={colorLightBlue}></ThemedButton>
            </RN.View>
            <RN.Text
              onPress={() => {
                setVisible(false);
                navigation.navigate("Dashboard");
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
    category: "",
    applianceType: "",
    brand: "",
    modelName: "",
    serialNumber: "",
    purchase_date: "",
    otherCategoryType:"",
    otherApplianceType:"",
    otherModel:"",
    otherBrand:"",
    price:""
  };

  const fetchPermission = async () => {
    cameraAndStorage();
    const cameraStatus = await AsyncStorage.getItem('cameraStatus');
    const galleryStatus = await AsyncStorage.getItem('galleryStatus');
    if (
      cameraStatus === "granted" &&
      (galleryStatus === "granted" || galleryStatus === "limited")
    ) {
      setCameraVisible(true);
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
    storagePermission();
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
          // reject(err);
        });
    });
  };
  const closeOptionsModal = () => {
    setCameraVisible(false);
  };
  return (
    <RN.View style={{ flex:1, backgroundColor: colorWhite}}>
      {selectOptions()}
      {openModal()}
      <RN.SafeAreaView style={{ backgroundColor: colorLightBlue }} />
      <StatusBar/>
      <RN.View style={style.navbar}>
        <RN.View style={style.navbarRow}>
          <RN.TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}>
            <RN.View>
              <RN.Image source={white_arrow} style={style.notificationIcon} />
            </RN.View>
          </RN.TouchableOpacity>
          <RN.View>
            <RN.Text style={style.navbarName}>{category && category.name && category.name.includes('Appliance')
              ? ' Add Appliance'
              : 'Add Asset'}</RN.Text>
          </RN.View>
        </RN.View>
      </RN.View>
      <RN.KeyboardAvoidingView style={{flex:1}}
        behavior={RN.Platform.OS === 'ios' ? 'padding' : ''}>
        <RN.ScrollView showsVerticalScrollIndicator={false} bounces={false}>
          <RN.View>
            <Formik
              validationSchema={signupValidationSchema}
              innerRef={formikRef}
              validateOnChange={false}
              validateOnBlur={false}
              enableReinitialize={true}
              initialValues={initialValues}
              onSubmit={(values, actions) => AddAsssetSubmit(values)}>
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
                      error={errors.category}
                      errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                      inputstyle={style.inputStyle}
                      containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                      dropdowncallback={() =>
                        dropdownCategoryref.current.show()
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
                  {category && category.name === 'Others' ? (
                    <FloatingInput
                      placeholder="Enter category name"
                      value={values.otherCategoryType}
                      onChangeText={(data) =>
                        setFieldValue('otherCategoryType', data)
                      }
                      error={errors.otherCategoryType}
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
                        modalVisible={values.category == "" ? false : true}
                        ref={dropdownApplianceref}
                        options={applianceType && applianceType}
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
                          selection={{ start: 0, end: 0 }}
                          mode="outlined"
                          placeholder="Select"
                          editable_text={false}
                          type="dropdown"
                          isDisabled={values.category == '' ? true : false}
                          value={
                            values.applianceType && selectedApplianceType.name
                          }
                          error={errors.applianceType}
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
                                right: RN.Dimensions.get('screen').width * 0.1,
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
                            category.name.includes("Appliance")
                              ? " Enter Appliance type"
                              : "Enter Asset type"
                          }
                          value={values.otherApplianceType}
                          onChangeText={(data) =>
                            setFieldValue("otherApplianceType", data)
                          }
                          error={errors.otherApplianceType}
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
                        modalVisible={values.applianceType == "" ? false : true}
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
                          selection={{ start: 0, end: 0 }}
                          placeholder="Select"
                          editable_text={false}
                          isDisabled={values.applianceType == '' ? true : false}
                          type="dropdown"
                          value={
                            values.brand && selectedApplianceBrandList.name
                          }
                          error={errors.brand}
                          errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                          inputstyle={style.inputStyle}
                          containerStyle={{
                            borderBottomWidth: 0,
                            marginBottom: 0,
                          }}
                          dropdowncallback={() =>
                            dropdownBrandref.current.show()
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
                      {selectedApplianceBrandList &&
                      selectedApplianceBrandList.name === "Others" ? (
                        <FloatingInput
                          placeholder="Enter brand name"
                          value={values.otherBrand}
                          onChangeText={(data) => {
                            setFieldValue("otherBrand", data);
                          }}
                          error={errors.otherBrand}
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
                      onSelect={(data) =>
                        onSelectModelName(data, setFieldValue)
                      }
                      ref={dropdownModelref}
                      disabled={values.brand == '' ? true : false}
                      modalVisible={values.brand == "" ? false : true}
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
                        selection={{ start: 0, end: 0 }}
                        placeholder="Select"
                        editable_text={false}
                        isDisabled={values.brand == '' ? true : false}
                        type="dropdown"
                        value={
                          values.modelName && selectedApplianceModelList.name
                        }
                        error={errors.modelName}
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
                    selectedApplianceModelList.name === "Others" ? (
                      <FloatingInput
                        placeholder="Enter Model Number"
                        value={values.otherModel}
                        onChangeText={(data) =>
                          setFieldValue("otherModel", data)
                        }
                        error={errors.otherModel}
                        errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                        inputstyle={style.otherInputStyle}
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
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
                          <RN.View
                            style={{ flex: 1, paddingTop: 5 }}
                            key={index}>
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
                        <RN.TouchableOpacity onPress={() => fetchPermission()}>
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
                        placeholder={"12345"}
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
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
                      />
                    </RN.View>
                  </RN.View>
                  <RN.Text
                    style={{
                      fontFamily: 'Rubik-Regular',
                      fontSize: 13,
                      color: colorGray,
                      marginLeft: 15,
                    }}>
                    {'Enter approx. date if you don\'t remember the exact date'}
                  </RN.Text>

                  <RN.View
                    style={{ marginVertical: 20, paddingTop: 40, padding: 20 }}>
                       {isLoading ? (
                    <RN.ActivityIndicator
                      animating={isLoading}
                      size="large"
                      color={colorLightBlue}
                    />
                  ) : (
                    <ThemedButton
                    title={
                      category &&
                      category.name &&
                      category?.name?.includes("Appliance")
                        ? "Add Appliance"
                        : "Add Asset"
                    }
                    onPress={handleSubmit}
                    color={colorLightBlue}>
                    </ThemedButton>
                  )}
                  </RN.View>
                </RN.View>
              )}
            </Formik>
          </RN.View>
        </RN.ScrollView>
      </RN.KeyboardAvoidingView>
    </RN.View>
  );
};

export default AddAsset;
