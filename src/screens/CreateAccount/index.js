import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  TouchableHighlight,
  BackHandler,
  ImageBackground,
} from 'react-native';
import BackArrowComp from '@components/BackArrowComp';
import styles from './styles';
import FloatingInput from '@components/FloatingInput';
import ThemedButton from '@components/ThemedButton';
import ModalDropdownComp from '@components/ModalDropdownComp';
import { colorLightBlue, colorDropText } from '@constants/Colors';
import {
  eye_close,
  eye_open,
  check_in_active,
  check_active,
  glitter,
  arrow_down,
} from '@constants/Images';
import { Formik } from 'formik';
import { useNavigation } from '@react-navigation/native';
import * as yup from 'yup';
import APIKit from '@utils/APIKit';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import { constants } from '@utils/config';
import {
	loginNav,
	PrivacyPolicyNav,
	requestInviteNav,
	TermsConditionsNav,
	AddLocationNav
} from '@navigation/NavigationConstant';
import ModalComp from '@components/ModalComp';
import { font14 } from '@constants/Fonts';
import { AuthContext } from '@navigation/AppNavigation';
import Loader from '@components/Loader';
const CreateAccount = (props) => {
  let { networkStatus } = useContext(AuthContext);
  const navigation = useNavigation();
  const mobilenumber = props?.route?.params?.mobileNumber;
  const credentails_verification = props?.route?.params?.credentails;
  const [citydropdown, setCityDropdown] = useState(null);
  const [checkboxActive, setCheckboxActive] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(true);
  const [passwordConfirmStatus, setPasswordConfirmStatus] = useState(true);
  const [invitelist, setInviteList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setloading] = useState(false);
  const [fcmToken, setFcmToken] = useState('');
  const [registerloading, setRegisterLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [errorPincode, setErrorPincode] = useState('Pincode is required');
  // const [pincodeError,setPincodeError] = useState(false);
  const dropdownref = useRef(null);
  const formikref = useRef(null);
  const phoneNumber = RegExp(/^[0-9]{10}$/);

  const signupValidationSchema = yup.object().shape({
    name: yup.string().required('Name is required'),
    email: yup
      .string()
      .email('Please enter valid email')
      .required('Email Address is Required'),
    phonenumber: yup
      .string()
      .required('Phone number is required')
      .matches(phoneNumber, 'Invalid Phone Number'),
    password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('Password is required'),
    confirm_password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required('Confirm Password is required')
      .when('password', {
        is: (val) => (val && val.length > 0 ? true : false),
        then: yup
          .string()
          .oneOf([yup.ref('password')], 'Both password need to be the same'),
      }),

    pincode: yup.string().required('Pincode is required'),
    // .test('len', 'Enter valid pincode', (val) => val && val.length >= 5)
    // .test('test', 'Enter valid pincode', () => !pincodeError),
    city: yup.object().nullable().required('City is required'),
  });

  const InviteList = async () => {
    let ApiInstance = await new APIKit().init();
    let awaitresp = await ApiInstance.get(
      constants.listAllInvites + '?phone_number=' + mobilenumber
    );
    if (awaitresp.status === 1) {
      setInviteList(awaitresp.data.data);
    } else {
      Alert.alert(awaitresp.err_msg);
    }
  };
	

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
			authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
			authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      setFcmToken(await messaging().getToken());
    } else {
      setFcmToken(null);
    }
  };
  useEffect(() => {
    requestUserPermission();
    InviteList();
  }, []);

  const handleBackButtonClick = () => {
    navigation.navigate(requestInviteNav, { params: 'Already_Invite' });
    return true;
  };
  // useEffect(() => {
  // 	Alert.alert(pincodeError==true?"true":"false")
  // }, [pincodeError]);
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick
      );
    };
  }, []);
  const onSelectCity = (data, setFieldValue) => {
    setFieldValue('city', citydropdown[data]);
  };
  const AccountSubmit = async (values) => {
    if (checkboxActive == false) {
      Alert.alert('Please accept the Terms & Conditions and Privacy Policy');
    } else {
      if (networkStatus == true) {
        setRegisterLoading(true);
      } else {
        setRegisterLoading(false);
      }
      let ApiInstance = await new APIKit().init();
      let awaitresp = await ApiInstance.get(
        constants.checkEmailNumberExist +
					'?phone_number=' +
					mobilenumber +
					'&email=' +
					values.email
      );
      if (awaitresp.status === 1) {
        try {
          let currentUser = auth().currentUser;
          console.log('currentUser', currentUser);
          // return;
          // currentUser.reauthenticateWithCredential(credentails_verification).then(async() => {
          await currentUser.updatePassword(values.password);
          await currentUser.updateEmail(values.email);
          const response = currentUser || {},
            uid = response.uid || null;
          const payload = {
            uid: uid,
            name: values.name.trim(),
            email: values.email,
            phone_number: values.phonenumber,
            city: values.city.value,
            pincode: values.pincode,
            referrer_id: invitelist[0].referrer_id,
            device_token: fcmToken,
            device_type: Platform.OS,
          };
          let ApiInstance = await new APIKit().init();
          let awaitresp = await ApiInstance.post(
            constants.appRegister,
            payload
          );
					
					if (awaitresp.status === 1) {
						setSuccessMsg(awaitresp.message);
						setRegisterLoading(false);
						modalVisible();
					} else {
						Alert.alert(awaitresp.err_msg);
						setRegisterLoading(false);
					}
				} catch (err) {
					console.log('catche error', err);
				}
			} else {
				setErrorMsg(awaitresp.err_msg);
				setRegisterLoading(false);
				setTimeout(() => {
					setErrorMsg('');
				}, 5000);
			}
		}
	};
	const modalVisible = () => {
		setVisible(true);
		setTimeout(() => {
			// navigation.navigate(loginNav);
			 navigation.navigate(AddLocationNav, {createAcc:'createAcc'});
			setVisible(false);
		}, 5000);
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
		if (value.toString().length >= 6) {
			setErrorPincode(null);
			let ApiInstance = await new APIKit().init();
			setFieldValue('city', '');
			let awaitresp = await ApiInstance.get(
				`https://api.postalpincode.in/pincode/${value}`
			);
			if (awaitresp.data.length > 0 && awaitresp.data[0].PostOffice == null) {
				setErrorPincode('Enter valid pincode');
			}
			if (awaitresp.data.length > 0 && awaitresp.data[0].Status == 'Success') {
				let responseData = awaitresp.data[0].PostOffice?.map((obj) => {
					return { label: obj.Name+','+obj.Division, value: obj.Name+','+obj.Division };
				});
				setCityDropdown(responseData);
			} else if (awaitresp.data[0].Status !== 'Success') {
				setCityDropdown([]);
			}
		} else {
			setErrorPincode('Enter Valid Pincode');
		}
	};
	const changeFieldValue = (setFieldValue, key, value, touched, setTouched) => {
		setTouched({ ...touched, [key]: true });
		setFieldValue(key, value);
	};

  return (
    <View style={styles.container}>
      <ScrollView>
        <BackArrowComp navigation_direction="create_account" />
        <Text style={styles.headerText}>Good To Have You Here!</Text>
        <Formik
          innerRef={formikref}
          validationSchema={signupValidationSchema}
          initialValues={{
            name: '',
            phonenumber: mobilenumber,
            email: '',
            password: '',
            confirm_password: '',
            pincode: '',
            city: null,
          }}
          onSubmit={(values) => {
            if (!errorPincode) {
              AccountSubmit(values);
            }
          }}>
          {({
            handleSubmit,
            values,
            touched,
            setFieldValue,
            setFieldError,
            setTouched,
            errors,
          }) => (
            <View>
              <FloatingInput
                placeholder_text="Name"
                value={values.name}
                onChangeText={(data) =>
                  changeFieldValue(
                    setFieldValue,
                    'name',
                    data,
                    touched,
                    setTouched
                  )
                }
                error={touched.name && errors.name}
                maxLength={30}
              />
              <FloatingInput
                placeholder_text="Phone Number"
                value={values.phonenumber}
                onChangeText={(data) =>
                  changeFieldValue(
                    setFieldValue,
                    'phonenumber',
                    data,
                    touched,
                    setTouched
                  )
                }
                error={touched.phonenumber && errors.phonenumber}
                focus={true}
                prefix="+91"
                editable_text={false}
              />
              <FloatingInput
                placeholder_text="Email"
                value={values.email}
                keyboard_type="email-address"
                onChangeText={(data) =>
                  changeFieldValue(
                    setFieldValue,
                    'email',
                    data.replace(/\s/g, ''),
                    touched,
                    setTouched
                  )
                }
                error={touched.email && errors.email}
              />
              <FloatingInput
                placeholder_text="Password"
                value={values.password}
                onChangeText={(data) =>
                  changeFieldValue(
                    setFieldValue,
                    'password',
                    data,
                    touched,
                    setTouched
                  )
                }
                error={touched.password && errors.password}
                secureTextEntry={passwordStatus == true ? true : false}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setPasswordStatus(!passwordStatus)}>
                    <Image
                      source={passwordStatus == true ? eye_close : eye_open}
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                }
              />
              <FloatingInput
                placeholder_text="Confirm Password"
                value={values.confirm_password}
                onChangeText={(data) =>
                  changeFieldValue(
                    setFieldValue,
                    'confirm_password',
                    data,
                    touched,
                    setTouched
                  )
                }
                error={touched.confirm_password && errors.confirm_password}
                secureTextEntry={passwordConfirmStatus == true ? true : false}
                rightIcon={
                  <TouchableOpacity
                    onPress={() =>
                      setPasswordConfirmStatus(!passwordConfirmStatus)
                    }>
                    <Image
                      source={
                        passwordConfirmStatus == true ? eye_close : eye_open
                      }
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                }
              />
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View style={{ flex: 0.4, height: 100 }}>
                  <FloatingInput
                    placeholder_text="Pin Code"
                    maxLength={6}
                    value={values.pincode}
                    keyboard_type={
                      Platform.OS === 'ios' ? 'number-pad' : 'numeric'
                    }
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
                    error={touched.pincode && errorPincode}
                  />
                </View>

                <View style={{ flex: 0.6, height: 100 }}>
                  <ModalDropdownComp
                    textStyle={{ color: 'red' }}
                    loading={loading}
                    renderNoRecords={() => (
                      <Text style={{ textAlign: 'center' }}>
												No Records Found....
                      </Text>
                    )}
                    dropdownTextStyle={{ color: 'green' }}
                    onSelect={(data) => onSelectCity(data, setFieldValue)}
                    ref={dropdownref}
                    options={citydropdown ? citydropdown : []}
                    isFullWidth
                    renderRow={(props) => (
                      <Text
                        style={{
                          paddingVertical: 4,
                          paddingHorizontal: 8,
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
                      selection={{start:0, end:0}}
                      placeholder_text="Area, City"
                      editable_text={false}
                      value={values.city ? values.city.label : ''}
                      error={touched.city && errors.city}
                      type="dropdown"
                      containerStyle={{ marginBottom: 0 }}
                      dropdowncallback={() => dropdownref.current.show()}
                      rightIcon={
                        <ImageBackground
                          resizeMode="contain"
                          source={arrow_down}
                          style={{ width: 12, height: 8.3 }}
                        />
                      }
                    />
                  </ModalDropdownComp>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingTop: 30,
                }}>
                <TouchableOpacity
                  style={{ flex: 0.1 }}
                  onPress={() => setCheckboxActive(!checkboxActive)}>
                  <Image
                    source={
                      checkboxActive == true ? check_active : check_in_active
                    }
                    style={styles.checkboxSize}
                  />
                </TouchableOpacity>
                <View style={{ flex: 0.9, paddingLeft: 5 }}>
                  <Text style={styles.acceptenceText}>
										By registering you agree to Azzetta&apos;s{' '}
                    <TouchableHighlight
                      underlayColor="none"
                      onPress={() => navigation.navigate(TermsConditionsNav)}>
                      <Text style={styles.hyperlinkText}>
												Terms & Conditions
                      </Text>
                    </TouchableHighlight>{' '}
                    <TouchableHighlight underlayColor="none">
                      <Text style={styles.acceptenceText}> and</Text>
                    </TouchableHighlight>{' '}
                    <TouchableHighlight
                      underlayColor="none"
                      onPress={() => navigation.navigate(PrivacyPolicyNav)}>
                      <Text style={styles.hyperlinkText}> Privacy Policy</Text>
                    </TouchableHighlight>
										.
                  </Text>
                </View>
              </View>
              <View>
                <Text style={styles.successMsg}>{successMsg}</Text>
              </View>
              <View>
                <Text style={styles.errMsg}>{errorMsg}</Text>
              </View>
              <View style={{ marginVertical: 20, paddingTop: 30 }}>
                {registerloading ? (
                  <View
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    {/* <ActivityIndicator
											color={colorLightBlue}
											animating={registerloading}
											size="large"
										/> */}
                    <Loader/>
                  </View>
                ) : (
                  <ThemedButton
                    title="Create Account"
                    onPress={handleSubmit}
                    color={colorLightBlue}></ThemedButton>
                )}
              </View>
            </View>
          )}
        </Formik>

        <ModalComp visible={visible}>
          <View>
            <View style={styles.glitterView}>
              <Image style={styles.glitterStar} source={glitter} />
            </View>
            <Text style={styles.header}>Account created successfully</Text>
          </View>
        </ModalComp>
      </ScrollView>
    </View>
  );
};
export default CreateAccount;
