import React, { useEffect, useRef, useState } from 'react';
import * as RN from 'react-native';
import style from './style';
import HomeHeader from '@components/HomeHeader';
import FloatingInput from '@components/FloatingInput';
import { Formik } from 'formik';
import ModalDropdownComp from '@components/ModalDropdownComp';
import { useNavigation } from '@react-navigation/native';
import { DatePicker } from './datePicker';
import {
  arrow_down,
  add_img,
  close_round,
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
  colorBlack,
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
import { ApplianceMoreDetailsNav } from "@navigation/NavigationConstant";
import * as yup from 'yup';
import {
  cameraAndStorage,
  storageCheck,
  cameraCheck,
  storagePermission,
} from '@services/AppPermissions';
import { ButtonHighLight } from '@components/debounce';
import DocumentPicker from 'react-native-document-picker';
import PdfThumbnail from 'react-native-pdf-thumbnail';

const radioOptions = [
  { id: 1, name: 'Yes', value: 'yes' },
  { id: 2, name: 'No', value: 'no' },
];
const FreeService = [
  { id: 1, name: '1' },
  { id: 2, name: '2' },
  { id: 3, name: '3' },
  { id: 4, name: '4' },
  { id: 5, name: '5' },
  { id: 6, name: '6' },
];
const Maintenance = (props) => {
  const appState = useRef(RN.AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const appliance_id = props?.route?.params?.EditAssets?.appliance_id;
  const editAssets = props?.route?.params?.EditAssets?.editAsset;
  const editAssetImage = props?.route?.params?.EditAssets?.editImage;
  const otherDetailsData = props?.route?.params?.otherDetails;
  console.log('edit images', );
  const formikRef = useRef();
  const navigation = useNavigation();
  const [resourcePath, setResourcePath] = useState([]);
  const [visible, setVisible] = useState(false);
  const [free_services, setFreeServices] = useState(FreeService);
  const [add_title, setAddTitle] = useState([]);
  const [selectedFreeServices, setSelectedFreeServices] = useState([]);
  const [radioOption, setRadioOption] = useState(radioOptions);
  const [selectedApplianceType, setSelectedApplianceType] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState([]);
  const [selectedApplianceModelList, setSelectedApplianceModelList] = useState(
    []
  );
  const [editDetails, setEditDetails] = useState(null);
  const [selectedApplianceBrandList, setSelectedApplianceBrandList] = useState(
    []
  );
  const localTime = new Date().getTime();
  const platfromOs = `${RNFS.DocumentDirectoryPath}/.azzetta/asset/`;

  const destinationPath = platfromOs + localTime + '.jpg';
  const [cameraVisible, setCameraVisible] = useState(false);
  const destinationPathPdf = platfromOs + localTime + '.pdf';


  const EditAsssetSubmit = async (values) => {
    const payload = {
      appliance_id: appliance_id,
      appliance_category_id: {
        id: editAssets?.category._id,
        other_value: editAssets?.otherCategoryType,
      },
      appliance_type_id: {
        id: editAssets?.applianceType._id,
        other_value: editAssets?.otherApplianceType,
      },
      appliance_brand_id: {
        id: editAssets?.brand._id,
        other_value: editAssets?.otherBrand,
      },
      appliance_model_id: {
        id: editAssets?.modelName._id,
        other_value: editAssets?.otherModel,
      },
      serial_number: editAssets?.serialNumber,
      image:
        editAssetImage &&
        editAssetImage.map((item) => {
          return { path: item.path };
        }),
      // editAssetImage?.editAssetImage.map((obj)=>{
      // 	return(
      // 		"path":obj.path
      // 	)
      // }),
      purchase_date: moment(editAssets?.purchase_date).format('YYYY-MM-DD'),
      price: editAssets?.price,
      asset_location_id: {
        id: otherDetailsData?.asset_location._id,
        other_value: '',
      },
      appliance_location_id: {
        id: otherDetailsData?.appliance_location._id,
        other_value:otherDetailsData?.otherLocation,
      },
      appliance_bought: otherDetailsData?.appliance_bought,
      appliance_shop_id: {
        id: otherDetailsData?.shop_name._id,
        other_value: '',
      },
      contact_name: otherDetailsData?.contact_name,
      contact_number:
        otherDetailsData?.contact_number !== ''
          ? parseInt(otherDetailsData?.contact_number)
          : 0,
      shop_rating:
        otherDetailsData?.exp_shop !== ''
          ? parseInt(otherDetailsData?.exp_shop)
          : 0,
      shop_comments: otherDetailsData?.shop_exp_comments,
      document_bill: [
        {
          path: 'path1',
        },
        {
          path: 'path2',
        },
      ],
      warranty_period: otherDetailsData?.warranty_period.name,
      extended_warranty: otherDetailsData?.extended_warranty.name,
      extended_warranty_invioce_number: otherDetailsData?.invoice_number,
      extended_warranty_invoice: [
        {
          path: 'path1',
        },
        {
          path: 'path2',
        },
      ],
      appliance_rating:
        otherDetailsData?.appliance_rating !== ''
          ? parseInt(otherDetailsData?.appliance_rating)
          : 0,
      appliance_comments: otherDetailsData?.appliance_rating_comments,
      share_rating: true,
      helpdesk_number: parseInt(values.helpdesk_number),
      owner_link: values.download_link,
      free_service: values.freeservice_availability === 'yes' ? true : false,
      service_promised: values.free_services === false ? 0 : 1,
      service_over: values.no_of_services,
      maintenance: [
        {
          date: moment(editAssets?.maintenance_date).format('YYYY-MM-DD'),
          labour_cost:
            values.labour_cost !== '' ? parseInt(values.labour_cost) : 0,
          spare_name: values.spare_name,
          spare_cost:
            values.spare_cost !== '' ? parseInt(values.spare_cost) : 0,
          remarks: values.maintenance_remarks,
        },
      ],
      service_person_name: values.service_person_name,
      service_person_no: parseInt(values.service_person_no),
      service_person_rating: parseInt(values.service_rating),
      service_person_comments: values.service_person_comments,
      invoice: resourcePath,
      reminder: {
        date: values.set_reminder,
        title: {
          id: values.add_title._id,
          other_value: '',
        },
        comments: values.comments,
      },
    };
    console.log('maintanence payload', payload);
    const getToken = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(getToken);
    let awaitresp = await ApiInstance.post(constants.editAppliance, payload);
    if (awaitresp.status == 1) {
      navigation.navigate(ApplianceMoreDetailsNav, {
        appliance_id: appliance_id,
      });
    }
    else  {
      console.log('payloads', awaitresp);
    }
    // addAppliance(values);
  };

  const removePhoto = (url) => {
    let result = resourcePath.filter((item, index) => item != url);
    setResourcePath(result);
  };

  const loadEditDetails = async () => {
    const getToken = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(getToken);
    let awaitresp = await ApiInstance.get(
      constants.viewAppliance + '?appliance_id=' + appliance_id
    );
    if (awaitresp.status == 1) {
      setEditDetails(awaitresp.data.data);
    } else {
      console.log('No Details in edit');
    }
  };

  const signupValidationSchema = yup.object().shape({});
  const ListTitle = async () => {
    const getToken = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.listApplianceReminder
    );
    if (awaitlocationresp.status == 1) {
      setAddTitle(awaitlocationresp.data.data);
    } else {
      console.log(awaitlocationresp);
    }
  };
  useEffect(() => {
    loadEditDetails();
  }, [appliance_id]);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (formikRef.current) {
        formikRef.current.resetForm();
        setResourcePath([]);
      }
    });
    ListTitle();
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (editDetails) {
      formikRef.current.setFieldValue(
        'helpdesk_number',
        editDetails.brand?.customercare_no[0]
      );
      formikRef.current.setFieldValue(
        'download_link',
        editDetails.owner_link
      );
      formikRef.current.setFieldValue(
        'free_services',
        editDetails.service_promised
      );
      formikRef.current.setFieldValue(
        'no_of_services',
        editDetails.service_over
      );
      formikRef.current.setFieldValue(
        'set_reminder',
        editDetails?.reminder?.date
      );
      formikRef.current.setFieldValue(
        'comments',
        editDetails.reminder?.comments
      );
      formikRef.current.setFieldValue(
        'labour_cost',
        '' + editDetails.maintenance[0]?.labour_cost?editDetails.maintenance[0]?.labour_cost:''
      );
      formikRef.current.setFieldValue(
        'spare_cost',
        '' + editDetails.maintenance[0]?.spare_cost?editDetails.maintenance[0]?.spare_cost:''
      );
      formikRef.current.setFieldValue(
        'spare_name',
        '' + editDetails.maintenance[0]?.spare_name?editDetails.maintenance[0]?.spare_name:''
      );
      formikRef.current.setFieldValue(
        'maintenance_date',
        editDetails.maintenance[0]?.date
      );
      formikRef.current.setFieldValue(
        'maintenance_remarks',
        editDetails.maintenance[0]?.remarks
      );
      formikRef.current.setFieldValue(
        'service_person_comments',
        editDetails.service_person_comments
      );
    }
  }, [editDetails]);

  const initialValues = {
    helpdesk_number: '',
    download_link: '',
    freeservice_availability: 'yes',
    free_services: '',
    no_of_services: '',
    maintenance_date: '',
    labour_cost: '',
    spare_name: '',
    spare_cost: '',
    maintenance_remarks: '',
    service_person_name: '',
    service_person_comments: '',
    service_rating: '',
    set_reminder: '',
    add_title: '',
    comments: 'Warranty end date for Whirlpool AC',
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
            <ButtonHighLight onPress={() => selectPdf()}>
              <RN.Text style={style.successHeader}>Select PDF</RN.Text>
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

  const selectPdf = async () => {
    const results = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
    });
    // for (const res of results) {
    //   let source = res;
    //   const pdfThumbnailPath = await PdfThumbnail.generate(source.uri, 0);
    //   moveAttachment(source.uri, destinationPathPdf,pdfThumbnailPath);
    //   setPdfThumbnailImagePath(pdfThumbnailPath);

    // }
    for (const res of results) {
      let source = res;
      console.log("source",source);
      try{
      const pdfThumbnailPath = await PdfThumbnail.generate(source.uri, 0);
      console.log("pdfThumbnailPath",pdfThumbnailPath);
      moveAttachment(source.uri, destinationPathPdf,pdfThumbnailPath);
      }catch(e){
        console.log("error opening pdf",e)
      }
      // setPdfThumbnailImagePath(pdfThumbnailPath);

    }
  };
  const pdfThumbnailView = async (filePath) => {
    setPdfThumbnailViewImage(true);
    const pdfThumbnailPath = await PdfThumbnail.generate(filePath, 0);
    setPdfThumbnailImagePath(pdfThumbnailPath);
  };

  const moveAttachment = async (filePath, newFilepath,pdfPath=null) => {
    storagePermission();
    var path = platfromOs;
    const decodedURL = RN.Platform.select({
      android: filePath,
      ios: decodeURIComponent(filePath),
    });
    return new Promise((resolve, reject) => {
      RNFS.mkdir(path)
        .then(() => {
          RNFS.moveFile(decodedURL, newFilepath)
            .then((res) => {
              console.log('FILE MOVED', decodedURL, newFilepath);
              setResourcePath([...resourcePath, { path: newFilepath,imagePath:pdfPath?pdfPath.uri:null }]);
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
  const onSelectFreeService = (data, setFieldValue) => {
    setFieldValue('free_services', free_services[data]);
    setSelectedFreeServices(free_services[data]);
  };
  const receiveRatingValue = (value, setFieldValue) => {
    setFieldValue('service_rating', value);
  };
  const selectRadioOption = (data, index, setFieldValue) => {
    setFieldValue('freeservice_availability', data.value);
  };
  const onSelectTitle = (data, setFieldValue) => {
    setFieldValue('add_title', add_title[data]);
    setSelectedTitle(add_title[data]);
  };
  return (
    <RN.View style={{ backgroundColor: colorWhite }}>
      {selectOptions()}
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
                  keyboardType="numeric"
                  inputstyle={style.inputStyle}
                  containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                />
                <RN.Text style={style.label}>
                Link to webform to request a service call / download owner manual
                </RN.Text>
                <FloatingInput
                  placeholder="https://"
                  value={values.download_link}
                  onChangeText={(data) => setFieldValue('download_link', data)}
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
                      {radioOption &&
                        radioOption.map((obj, index) => {
                          return (
                            <>
                              <RN.TouchableOpacity
                                onPress={() =>
                                  selectRadioOption(obj, index, setFieldValue)
                                }>
                                <RN.ImageBackground
                                  source={
                                    obj.value == values.freeservice_availability
                                      ? radioactive
                                      : radioinactive
                                  }
                                  style={{
                                    width: 20,
                                    height: 20,
                                    marginLeft: 15,
                                  }}
                                  resizeMode="contain"
                                />
                              </RN.TouchableOpacity>
                              <RN.Text style={style.label}>{obj.name}</RN.Text>
                            </>
                          );
                        })}
                    </RN.View>
                  </RN.View>
                </RN.View>

{values.freeservice_availability == 'yes'? (
  <RN.View>
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
                  <RN.View style={{ flex: 0.4 }}>
                    <ModalDropdownComp
                      onSelect={(data) =>
                        onSelectFreeService(data, setFieldValue)
                      }
                      options={free_services}
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
                        value={
                          values.free_services && selectedFreeServices.name
                        }
                        inputstyle={style.inputStyle}
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
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
                  <RN.View style={{ flex: 0.6, marginTop: 10 }}>
                    <RN.TextInput
                      values={values.no_of_services}
                      placeholder="How many services are over?"
                      style={style.customTextinput}
                      keyboardType="numeric"
                      onChangeText={(data) =>
                        setFieldValue('no_of_services', data)
                      }
                    />
                  </RN.View>
                </RN.View>
                </RN.View>
)
: null }
                
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
                      field_key="maintenance_date"
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
                  value={values.maintenance_remarks}
                  onChangeText={(data) =>
                    setFieldValue('maintenance_remarks', data)
                  }
                  style={{ borderBottomWidth: 0.5,
                    borderBottomColor: '#747474',
                    height: 40,
                    marginLeft: 10,
                    color: colorBlack}}
                />
                {/* <RN.Text style={style.addanotherText}>Add another</RN.Text> */}
                <RN.View>
                  <RN.Text style={style.label}>
                    {'Share your experience with the service person?'}
                  </RN.Text>
                  <StarRating
                    sendRatingsValue={(starvalue) =>
                      receiveRatingValue(starvalue, setFieldValue)
                    }
                  />
                  <RN.View style={{ marginLeft: 15 }}>
                    <RN.TextInput
                    placeholder = 'Comments'
                      style={{
                        borderBottomWidth: 0.5,
                        borderBottomColor: '#747474',
                        height: 40,
                        color: colorBlack
                      }}
                      value={values.service_person_comments}
                      onChangeText={(data) =>
                        setFieldValue('service_person_comments', data)
                      }
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
                        <>
                              <RN.View style={{ flex: 1 }} key={index}>
                            {/* {!pdfThumbnailViewImage ? */}
                                <RN.Image
                                  source={{ uri: image.imagePath?image.imagePath:'file:///' + image.path }}
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
                                   onError={(e) => console.log(e)}
                                  // onError={(e) => setPdfThumbnailViewImage(true)}
                                />
                                {/* :   <RN.Image
                                  source={pdfThumbnailImagePath}
                                  // resizeMode="contain"
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
                                /> } */}
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
                          </>
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
                    <RN.Text style={style.label}>Set reminder</RN.Text>
                    <DatePicker
                      style={{ backgroundColor: 'red' }}
                      values={values}
                      errors={errors}
                      setFieldValue={setFieldValue}
                      handleBlur={handleBlur}
                      field_key="set_reminder"
                    />
                  </RN.View>
                  <RN.View style={{ flex: 0.5 }}>
                    <RN.Text style={style.label}>Add Title</RN.Text>
                    <ModalDropdownComp
                      onSelect={(data) => onSelectTitle(data, setFieldValue)}
                      options={add_title}
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
                        value={values.add_title && selectedTitle.name}
                        inputstyle={style.inputStyle}
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
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
                  onChangeText={(data) => setFieldValue('comments', data)}
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
