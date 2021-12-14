import React, { useEffect, useRef, useState } from 'react';
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
  close_round,
  glitter,
  radioactive,
  radioinactive,
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
import {
  AddReaminderNav,
  MaintenanceNav,
} from '@navigation/NavigationConstant';
import {
  cameraAndStorage,
  storageCheck,
  cameraCheck,
  storagePermission,
} from '@services/AppPermissions';
import { ButtonHighLight } from '@components/debounce';
const radioOptions = [
  { id: 1, name: 'E-commerce', value: 'ECOMM' },
  { id: 2, name: 'Retail stores', value: 'RETAIL' },
];
const warranty_period_drop = [
  { id: 1, name: '3 months', value: 3 },
  { id: 2, name: '6 months', value: 6 },
  { id: 3, name: '12 months', value: 12 },
  { id: 4, name: '18 months', value: 18 },
  { id: 5, name: '24 months', value: 24 },
  { id: 6, name: '30 months', value: 30 },
  { id: 7, name: '36 months', value: 36 },
  { id: 8, name: '42 months', value: 42 },
  { id: 8, name: '48 months', value: 48 },
];
const extended_period_drop = [
  { id: 1, name: '3 months', value: 3 },
  { id: 2, name: '6 months', value: 6 },
  { id: 3, name: '12 months', value: 12 },
  { id: 4, name: '18 months', value: 18 },
  { id: 5, name: '24 months', value: 24 },
  { id: 6, name: '30 months', value: 30 },
  { id: 7, name: '36 months', value: 36 },
];
const OtherDetails = (props) => {
  const editAssetsData = props?.route?.params;
  const appState = useRef(RN.AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const formikRef = useRef();
  const navigation = useNavigation();
  const [resourcePath, setResourcePath] = useState([]);
  const [imageType, setImageType] = useState(null);
  const [warrantyInvoicePath, setWarrantyInvoicePath] = useState([]);
  const [asset_location, setAssetLocation] = useState([]);
  const [appliance_location, setApplianceLocation] = useState([]);
  const [shop_name, setShopName] = useState([]);
  const [selectedAssetLocation, setSelectedAssetLocation] = useState([]);
  const [selectedShopName, setSelectedShopName] = useState([]);
  const [selectedWarrantyPeriod, setSelectedWarrantyPeriod] = useState([]);
  const [selectedExtendedWarranty, setSelectedExtendedWarranty] = useState([]);
  const [extended_warranty, setExtendedWarranty] =
    useState(extended_period_drop);
  const [warranty_period, setWarrantyPeriod] = useState(warranty_period_drop);
  const [selectedApplianceLocation, setSelectedApplianceLocation] = useState(
    []
  );
  const [visible, setVisible] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [response, setResponse] = useState();

  const localTime = new Date().getTime();
  const platfromOs = `${RNFS.DocumentDirectoryPath}/.azzetta/asset/`;

  const destinationPath = platfromOs + localTime + '.jpg';
  const [cameraVisible, setCameraVisible] = useState(false);
  const [uploadType, setUploadType] = useState(false);
  const [radioOption, setRadioOption] = useState(radioOptions);
  // const [radioValue, setRadioValue] = useState('ECOMM');

  const AddOtherDetails = (values) => {
    navigation.navigate(MaintenanceNav, {
      otherDetails: values,
      EditAssets: editAssetsData,
    });
  };

  const removePhoto = (url) => {
    let result = resourcePath.filter((item, index) => item != url);
    setResourcePath(result);
  };
  const removeWarrantyInvoice = (url) => {
    let result = warrantyInvoicePath.filter((item, index) => item != url);
    setWarrantyInvoicePath(result);
  };

  const AssetLocation = async () => {
    const getToken = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(constants.listAddLocation);
    if (awaitlocationresp.status == 1) {
      console.log(awaitlocationresp.data.data, 'asset location list');
      setAssetLocation(awaitlocationresp.data.data);
    } else {
      console.log(awaitlocationresp);
    }
  };
  const ApplianceLocation = async () => {
    const getToken = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.listApplianceLocation
    );
    if (awaitlocationresp.status == 1) {
      setApplianceLocation(awaitlocationresp.data.data);
    } else {
      console.log(awaitlocationresp);
    }
  };

  const ShopList = async (data) => {
    const getToken = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.listApplianceShop + '?type=' + data
    );
    if (awaitlocationresp.status == 1) {
      const shopList = awaitlocationresp.data.data;
      shopList.push({ name: 'Others' });
      setShopName(shopList);
    } else {
      console.log(awaitlocationresp);
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (formikRef.current) {
        formikRef.current.resetForm();
        setResourcePath([]);
        setWarrantyInvoicePath([]);
      }
    });
    AssetLocation();
    ApplianceLocation();
    ShopList('ECOMM');
    return unsubscribe;
  }, []);

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
    asset_location: '',
    appliance_location: '',
    appliance_bought: 'ECOMM',
    shop_name: '',
    contact_name: '',
    contact_number: '',
    exp_shop: '',
    shop_exp_comments: '',
    warranty_period: '',
    extended_warranty: '',
    invoice_number: '',
    warranty_invoice: '',
    appliance_rating: '',
    appliance_rating_comments: '',
    networ_review: false,
  };

  const fetchPermission = async (type) => {
    setUploadType(type);
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
              if (uploadType === "ONE") {
                setResourcePath([...resourcePath, { path: newFilepath }]);
              } else {
                setWarrantyInvoicePath([
                  ...warrantyInvoicePath,
                  { path: newFilepath },
                ]);
              }
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
  const receiveRatingValue = (value, setFieldValue) => {
    setFieldValue('exp_shop', value);
  };
  const receiveApplianceValue = (value, setFieldValue) => {
    setFieldValue('appliance_rating', value);
  };
  const onSelectAssetLocation = (data, setFieldValue) => {
    setFieldValue('asset_location', asset_location[data]);
    setSelectedAssetLocation(asset_location[data]);
  };
  const onSelectApplianceLocation = (data, setFieldValue) => {
    setFieldValue('appliance_location', appliance_location[data]);
    setSelectedApplianceLocation(appliance_location[data]);
  };
  const onSelectShopName = (data, setFieldValue) => {
    setFieldValue('shop_name', shop_name[data]);
    setSelectedShopName(shop_name[data]);
  };
  const SelectWarrantyPeriod = (data, setFieldValue) => {
    setFieldValue('warranty_period', warranty_period[data]);
    setSelectedWarrantyPeriod(warranty_period[data]);
  };
  const onSelectExtendedWarranty = (data, setFieldValue) => {
    setFieldValue('extended_warranty', extended_warranty[data]);
    setSelectedExtendedWarranty(extended_warranty[data]);
  };
  const ToggleSwitch = (data, setFieldValue) => {
    setIsEnabled(!isEnabled);
    setFieldValue('network_review', !isEnabled);
  };
  const selectRadioOption = (data, index, setFieldValue) => {
    formikRef.current.setFieldValue('shop_name', '');
    ShopList(data.value);
    setFieldValue('appliance_bought', data.value);
  };

  return (
    <RN.View style={{ backgroundColor: colorWhite }}>
      {selectOptions()}
      {openModal()}
      <RN.ScrollView showsVerticalScrollIndicator={false}>
        <HomeHeader title="Add Other Details" />
        <RN.View>
          <Formik
            innerRef={formikRef}
            validateOnChange={false}
            validateOnBlur={false}
            enableReinitialize={true}
            initialValues={initialValues}
            onSubmit={(values) => AddOtherDetails(values)}>
            {({
              handleSubmit,
              values,
              setFieldValue,
              errors,
              handleBlur,
              touched,
            }) => (
              <RN.View>
                <RN.View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>Assets location</RN.Text>

                    <ModalDropdownComp
                      onSelect={(data) =>
                        onSelectAssetLocation(data, setFieldValue)
                      }
                      options={asset_location}
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
                          values.asset_location && selectedAssetLocation.name
                        }
                        inputstyle={style.inputStyle}
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
                        rightIcon={
                          <RN.Image
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

                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>
                      {'Appliance location'}
                    </RN.Text>

                    <ModalDropdownComp
                      onSelect={(data) =>
                        onSelectApplianceLocation(data, setFieldValue)
                      }
                      options={appliance_location}
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
                        isDisabled={
                          values.appliance_location == '' ? true : false
                        }
                        type="dropdown"
                        value={
                          values.appliance_location &&
                          selectedApplianceLocation.name
                        }
                        inputstyle={style.inputStyle}
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
                        rightIcon={
                          <RN.Image
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
                <RN.View>
                  <RN.Text style={style.label}>
                    {'Appliance bought from'}
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
                                    obj.value == values.appliance_bought
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
                <RN.View>
                  <RN.Text style={style.label}>{'Shop name'}</RN.Text>
                </RN.View>

                <RN.View>
                  <ModalDropdownComp
                    onSelect={(data) => onSelectShopName(data, setFieldValue)}
                    options={shop_name}
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
                      value={values.shop_name && selectedShopName.name}
                      inputstyle={style.inputStyle}
                      containerStyle={{
                        borderBottomWidth: 0,
                        marginBottom: 0,
                      }}
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
                  {selectedShopName && selectedShopName.name === 'Others' ? (
                    <FloatingInput
                      placeholder="Enter Shop Name"
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
                <RN.View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignContent: 'center',
                  }}>
                  <RN.View style={{ flex: 0.5 }}>
                    <RN.Text style={style.label}>{'Contact name'}</RN.Text>
                    <FloatingInput
                      placeholder="Sakthivel"
                      value={values.contact_name}
                      maxLength={30}
                      onChangeText={(data) =>
                        setFieldValue('contact_name', data)
                      }
                      inputstyle={style.inputStyle}
                      containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    />
                  </RN.View>
                  <RN.View style={{ flex: 0.5 }}>
                    <RN.Text style={style.label}>{'Contact number'}</RN.Text>
                    <FloatingInput
                      placeholder="894334XXXX"
                      value={values.contact_number}
                      maxLength={10}
                      onChangeText={(data) =>
                        setFieldValue('contact_number', data)
                      }
                      keyboard_type="numeric"
                      inputstyle={style.inputStyle}
                      containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    />
                  </RN.View>
                </RN.View>
                <RN.View>
                  <RN.Text style={style.label}>
                    {'Share your experience with the shop?'}
                  </RN.Text>
                  <StarRating
                    sendRatingsValue={(starvalue) =>
                      receiveApplianceValue(starvalue, setFieldValue)
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
                      value={values.shop_exp_comments}
                      onChangeText={(data) =>
                        setFieldValue('shop_exp_comments', data)
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
                    <RN.Text style={style.label}>
                      {'Upload Document/Bill'}
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
                      <RN.TouchableOpacity onPress={() => fetchPermission("ONE")}>
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
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>Warranty period</RN.Text>

                    <ModalDropdownComp
                      onSelect={(data) =>
                        SelectWarrantyPeriod(data, setFieldValue)
                      }
                      options={warranty_period}
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
                          values.warranty_period && selectedWarrantyPeriod.name
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
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>{'Extended warranty'}</RN.Text>

                    <ModalDropdownComp
                      onSelect={(data) =>
                        onSelectExtendedWarranty(data, setFieldValue)
                      }
                      options={extended_warranty}
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
                        value={
                          values.extended_warranty &&
                          selectedExtendedWarranty.name
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
                </RN.View>
                <RN.Text style={style.label}>
                  Extended warranty invoice number
                </RN.Text>
                <FloatingInput
                  placeholder="894334XXXX"
                  value={values.invoice_number}
                  onChangeText={(data) => setFieldValue('invoice_number', data)}
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
                      {'Upload extended warranty invoice'}
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
                    {warrantyInvoicePath.map((image, index) => {
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
                                    removeWarrantyInvoice(image);
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
                      <RN.TouchableOpacity onPress={() => fetchPermission("TWO")}>
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
                <RN.Text style={style.label}>
                  How satisfied are you with this appliance?
                </RN.Text>
                <StarRating
                  sendRatingsValue={(starvalue) =>
                    receiveRatingValue(starvalue, setFieldValue)
                  }
                />
                <RN.View style={{ marginLeft: 15 }}>
                  <RN.Text>Comments</RN.Text>
                  <RN.TextInput
                    style={{
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#747474',
                      marginTop: -10,
                    }}
                    value={values.appliance_rating_comments}
                    onChangeText={(data) =>
                      setFieldValue('appliance_rating_comments', data)
                    }
                  />
                </RN.View>
                <RN.View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <RN.Text style={style.label}>
                    Share ratings and reviews with my network?
                  </RN.Text>
                  <RN.Switch
                    trackColor={{ false: '#E4E9EC', true: '#DBEFFE' }}
                    thumbColor={isEnabled ? '#1D7BC3' : '#BEC9CF'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={(data) => ToggleSwitch(data, setFieldValue)}
                    value={isEnabled}
                  />
                </RN.View>
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

export default OtherDetails;
