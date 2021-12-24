import React, { useRef, useState, useEffect, useContext } from 'react';
import {
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Keyboard,Alert
} from 'react-native';
import BackArrowComp from '@components/BackArrowComp';
import styles from './styles';
import FloatingInput from '@components/FloatingInput';
import { AuthContext } from '@navigation/AppNavigation';
import {
  colorLightBlue,
  colorDropText,
  colorWhite,
  colorBlack,
} from '@constants/Colors';
import { font14 } from '@constants/Fonts';
import {
  arrow_down,
  info,
  edit,
  primarylocation,
  locationGreen,
  close_round,
  glitter,
} from '@constants/Images';
import { Formik } from 'formik';
import ModalDropdownComp from '@components/ModalDropdownComp';
import * as yup from 'yup';
import APIKit from '@utils/APIKit';
import ThemedButton from '@components/ThemedButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constants } from '@utils/config';
import ModalComp from '@components/ModalComp';
import { useNavigation } from '@react-navigation/native';
import { loginNav,HomeStackNav } from '@navigation/NavigationConstant';
import BottomSheetComp from '@components/BottomSheetComp';
const AddLocation = (props) => {
  let { setRefreshDrawer,successCallback } = useContext(AuthContext);
  const createAcc = props?.route?.params?.createAcc;

  const navigation = useNavigation();

  const formikRef = useRef();
  const [loading, setloading] = useState(false);

  const [citydropdown, setCityDropdown] = useState(null);
  const dropdownref = useRef(null);
  const scrollviewref = useRef(null);

  const [errorMsg, setErrorMsg] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [cardShow, setCardShow] = useState(false);
  const [disable, setDisable] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [cityModel, setCityModel] = useState(false);
  const [scrollHeight, setScrollHeight] = useState(0);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getLocationList();
    });

    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    getLocationList();
  }, []);

  // const isPinValid = (val) => val && val[0] != "0" && val.length >= 5 && val.split('').every(char => char != val[0]);

  const signupValidationSchema = yup.object().shape({
    location: yup.string().required('Location is required'),
    pincode: yup
      .string()
      .required('Pincode is required')
      .test('len', 'Enter valid pincode', (val) => val.toString()[0] != "0" && val.toString().length >= 5),
    city: yup.object().nullable().required('City is required'),
  });

  const onSelectCity = (data, setFieldValue) => {
    setFieldValue('city', citydropdown[data]);
  };

  const getCityDropdown = async (
    value,
    setFieldValue,
    field,
    setFieldError,
    touched,
    setTouched
  ) => {
    setTouched({ ...touched, [field]: true });
    setFieldValue(field, value.toString());
    if (value.length >= 5) {
      setloading(true);
      let ApiInstance = await new APIKit().init();
      setFieldValue('city', '');
      let awaitresp = await ApiInstance.get(
        `https://api.postalpincode.in/pincode/${value}`
      );
      setloading(false);
      if (awaitresp.status == 1) {
        if (awaitresp.data.length > 0) {
          let responseData = awaitresp.data[0].PostOffice?.map((obj) => {
            return {
              label: obj.Name + ', ' + obj.Division,
              value: obj.Name + ', ' + obj.Division,
            };
          });
          setCityDropdown(responseData);
        }
      } else {
        Alert.alert(awaitresp.err_msg);
      }
      console.log('city response', awaitresp.data[0]);
    }
  };

  const locationSubmit = async (values, { resetForm }) => {
    let uid = await AsyncStorage.getItem('loginToken');
    let userInfo = await AsyncStorage.getItem('userDetails');
    setCityDropdown(null);
    let payload = {
      name: values.location,
      city: values.city.label,
      pincode: values.pincode,
    };
    let ApiInstance = await new APIKit().init(uid);
    let awaitresp = await ApiInstance.post(constants.addLocation, payload);
    if (awaitresp.status == 1) {
      resetForm(values);
      getLocationList();
      setCardShow(false);
      setDisable(false);
      setErrorMsg('');
      setModalVisible(true);
      setTimeout(() => {
        if (createAcc == 'createAcc') {
          // navigation.navigate(loginNav);
          // navigation.navigate(HomeStackNav);
          successCallback({ user: userInfo, token: uid });
          setModalVisible(false);
          // AsyncStorage.removeItem("loginToken");
        } else {
          //  navigation.navigate('HomeStack');
          // setRefreshDrawer(true);
          setModalVisible(false);
          getLocationList();
        }
      }, 3000);
    } else {
      setTimeout(() => {
        setErrorMsg('');
      }, 2000);
      setErrorMsg(awaitresp.err_msg);
    }
  };

  const getLocationList = async () => {
    let uid = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(uid);
    let awaitresp = await ApiInstance.get(constants.listAddLocation);
    if (awaitresp.status == 1) {
      setLocationList(awaitresp.data.data);
      setErrorMsg('');
    } else {
      setErrorMsg(awaitresp.err_msg);
    }
  };

  const showLocationCard = () => {
    setCardShow(true);
    setDisable(true);
    setTimeout(() => {
      scrollviewref.current.scrollTo({ x: 0, y: scrollHeight, animated: true });
    }, 500);
  };

  const openModel = () => {
    setCityModel(true);
  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setTimeout(() => {
          setScrollHeight((data)=>{

            scrollviewref.current.scrollTo({ x: 0, y: data, animated: true });
            return data;
          })
        }, 0);
        
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);
  const onFocusUpdate =()=>{
    // scrollviewref.current.scrollTo({ x: 0, y: scrollHeight+50, animated: true });
  }
  return (
    <KeyboardAvoidingView style={{flex:1}}
      behavior={Platform.OS === 'ios' ? 'padding' : ''} 
      style={styles.container}>
      {!createAcc && <BackArrowComp />}
      <Formik
        innerRef={(p) => (formikRef.current = p)}
        validationSchema={signupValidationSchema}
        initialValues={{
          location: '',
          pincode: '',
          city: null,
        }}
        onSubmit={(values, action) => locationSubmit(values, action)}>
        {({
          handleSubmit,
          values,
          setFieldValue,
          handleChange,
          errors,
          touched,
          setFieldError,
          setTouched,
        }) => (
          <View style={styles.wholeLocation}>
            <ScrollView
              style={{ marginBottom: 70 }}
              ref={scrollviewref}
              onContentSizeChange={(w, h) => setScrollHeight(h)}>
              <Text style={styles.addLocationTxt}>Add Location</Text>

              <>
                {locationList &&
                  locationList.map((item, index) => {
                    return (
                      <View style={styles.locationDetailsCard}>
                        <View style={styles.locationDetailsHeader}>
                          <Image
                            source={locationGreen}
                            style={styles.location}
                          />
                          <Text style={styles.locationDetailsTxt}>
                            My Location {index + 1}
                          </Text>
                          <TouchableOpacity
                            onPress={() =>
                              navigation.navigate('EditLocation', {
                                asset_location_id: item._id,
                              })
                            }
                            style={{
                              position: 'absolute',
                              right: 10,
                              top: 10,
                            }}>
                            <Image source={edit} style={[styles.edit]} />
                          </TouchableOpacity>
                        </View>
                        <View style={styles.locationBody}>
                          <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.locationDetails} numberOfLines={1}>
                              {`${item.name} - ${item.city}`}
                            </Text>
                          </View>
                          <View>
                            <Text style={styles.pincode}>{item.pincode}</Text>
                          </View>
                        </View>
                      </View>
                    );
                  })}

                <View style={styles.locationCard}>
                <View style={{ flex: 1,marginBottom:errorMsg!=''?8:0 }}>
                    <Text style={styles.errorMsg}>{errorMsg}</Text>
                  </View>
                  {cardShow && (
                    <>
                      <View style={styles.locationHeader}>
                        <Image
                          source={primarylocation}
                          style={styles.location}
                        />
                        <Text style={styles.locationTxt}>My Location</Text>
                      </View>
                      
                        <View style={[styles.locationBody, {marginBottom: 50}]}>
                          <FloatingInput
                            placeholder_text={createAcc?"Assets Location":"Location Name"}
                            value={values.location}
                            onFocus={()=>onFocusUpdate()}
                            onChange={(e) => {
                              setFieldValue('location', e);
                            }}
                            onChangeText={handleChange('location')}
                            error={touched.location && errors.location}
                            // inputstyle={styles.inputStyle}
                          />

                          <FloatingInput
                            placeholder_text="Pin Code"
                            maxLength={6}
                            value={values.pincode}
                            keyboard_type={
                              Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                            }
                            onChange={(e) => {
                              setFieldValue('pincode', e);
                            }}
                            onChangeText={(data) =>
                              getCityDropdown(
                                data,
                                setFieldValue,
                                'pincode',
                                setFieldError,
                                touched,
                                setTouched
                              )
                            }
                            error={touched.pincode && errors.pincode}
                          />

                          <View>
                            <ModalDropdownComp
                              textStyle={{ color: 'red' }}
                              loading={loading}
                              renderNoRecords={() => (
                                <Text style={{ textAlign: 'center' }}>
                                  No Records Found....
                                </Text>
                              )}
                              dropdownTextStyle={{ color: 'green' }}
                              onSelect={(data) =>
                                onSelectCity(data, setFieldValue)
                              }
                              ref={dropdownref}
                              options={citydropdown ? citydropdown : []}
                              isFullWidth
                              renderRow={(props) => (
                                <Text
                                  style={{
                                    paddingVertical: 8,
                                    paddingHorizontal: 15,
                                    fontSize: font14,
                                    color: colorDropText,
                                    fontFamily: 'Rubik-Regular',
                                  }}>
                                  {props.label}
                                </Text>
                              )}
                              dropdownStyle={{ elevation: 8, borderRadius: 8 }}
                              renderSeparator={(obj) => null}>
                              <FloatingInput
                                placeholder_text="City"
                                value={values.city ? values.city.label : ''}
                                error={touched.city && errors.city}
                                editable_text={false}
                                type="dropdown"
                                containerStyle={{ marginBottom: 0 }}
                                dropdowncallback={() =>
                                  dropdownref.current.show()
                                }
                                rightIcon={
                                  <Image
                                    source={arrow_down}
                                    style={{ width: 12, height: 8.3 }}
                                  />
                                }
                               
                              />
                            </ModalDropdownComp>
                            <TouchableOpacity
                              style={{
                                position: 'absolute',
                                left: 50,
                                top: values.city ? -8 : 5,
                              }}
                              onPress={() => openModel()}>
                              <Image
                                // source={values.city ? info : ''}
                                source={info}
                                style={{ width: 12, height: 12 }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                    </>
                  )}
                
                </View>
              </>
            </ScrollView>
            <View
              style={{
                position: 'absolute',
                bottom: 0,
                width: '100%',
                backgroundColor: '#fff',
                paddingTop: 10,
              }}>
              {!cardShow?
              <TouchableOpacity
                onPress={() => showLocationCard()}
                disabled={disable}
                style={{ alignItems: 'center', marginBottom: 20 }}>
                <Text style={styles.addAnotherLocation}>
                  + Add another location
                </Text>
              </TouchableOpacity>
:
              <View style={{ width: '100%' }}>
                <ThemedButton
                  title="Save & Proceed"
                  onPress={handleSubmit}
                  color={colorLightBlue}
                  btnStyle={{ letterSpacing: 0 }}></ThemedButton>
              </View>
}
            </View>
          </View>
        )}
      </Formik>

      <ModalComp visible={modalVisible}>
        <View>
          <View style={styles.closeView}>
            <TouchableOpacity
              onPress={() => {
                setModalVisible(false);
              }}>
              <Image source={close_round} style={styles.close_icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.glitterView}>
            <Image style={styles.glitterStar} source={glitter} />

            <Text style={styles.succesAdded}>Location added successfully!</Text>
            {createAcc && (
              <Text style={styles.asstes}>
                Taking you to assets dashboard in 3sec
              </Text>
            )}
          </View>
        </View>
      </ModalComp>
      <BottomSheetComp
        sheetVisible={cityModel}
        closePopup={() => setCityModel(false)}>
        <View
          style={{
            backgroundColor: colorWhite,
            paddingHorizontal: 20,
            paddingVertical: 20,
          }}>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.dotIcon}></View>
            <Text style={styles.textStyleModel}>
              Choose nearest city if your city is not shown in the dropdown.
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={styles.dotIcon}></View>
            <Text style={styles.textStyleModel}>Enter your PIN code.</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.dotIcon}></View>
            <Text style={styles.textStyleModel}>
              Initially we plan to cover the top 150 cities in India, and then
              add more cities based on PIN codes entered by the users.
            </Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <View style={styles.dotIcon}></View>
            <Text style={styles.textStyleModel}>
              Apart from price discovery for your old appliances from secondhand
              dealers and quote for new purchases from local retail showrooms
              all other funcationalities of Azzetta is ready for you.
            </Text>
          </View>
        </View>
      </BottomSheetComp>
    </KeyboardAvoidingView>
  );
};
export default AddLocation;
