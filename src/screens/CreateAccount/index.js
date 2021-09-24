import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, ScrollView, TouchableOpacity, Image, TouchableHighlight, Alert, Platform } from 'react-native';
import BackArrowComp from '@components/BackArrowComp';
import styles from './styles';
import FloatingInput from '@components/FloatingInput';
import ThemedButton from '@components/ThemedButton';
import { colorLightBlue, colorDropText } from '@constants/Colors';
import ModalDropdown from 'react-native-modal-dropdown';
import { eye_close, eye_open, check_in_active, check_active, arrow_down, glitter, close_round } from '@constants/Images';
import { Formik, Field, FormikHelpers } from 'formik';
import { useNavigation, useRoute } from "@react-navigation/native";
import * as yup from "yup";
import APIKit from '@utils/APIKit';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';
import { constants } from '@utils/config';
import { font12, font14 } from '@constants/Fonts';
import {
  requestInviteNav, dashboardNav, loginNav
} from '@navigation/NavigationConstant';
import ModalComp from '@components/ModalComp';
const CreateAccount = (props) => {
  const navigation = useNavigation();
  const mobilenumber = props?.route?.params?.mobileNumber;
  const city_dropdown = [{ value: 1, label: 'Option 1' }, { value: 2, label: 'option 2' }, { value: 3, label: 'option 3' }, { value: 4, label: 'option 4' }, { value: 5, label: 'option 5' }]
  const [inputval, setInput] = useState('');
  const [city, setCity] = useState(null);
  const [checkboxActive, setCheckboxActive] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [passwordConfirmStatus, setPasswordConfirmStatus] = useState(false);
  const [invitelist, setInviteList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const dropdownref = useRef(null);
  const phoneNumber = RegExp(/^[0-9]{10}$/);
  const Pincode = /^[1-9][0-9]{5}$/;
  const passwordRegex = RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]([\w!@#\$%\^&\*\?]|(?=.*\d)){7,}$/
  );
  const signupValidationSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Please enter valid email")
      .required("Email Address is Required"),
    phonenumber: yup
      .string()
      .required("Phone number is required")
      .matches(phoneNumber, "Invalid Phone Number"),
    password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required")
      .matches(passwordRegex, "Invalid Password"),
    confirm_password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .matches(passwordRegex, "Confirm Password is Invalid")
      .required("Confirm Password is required")
      .when("password", {
        is: (val) => (val && val.length > 0 ? true : false),
        then: yup
          .string()
          .oneOf([yup.ref("password")], "Both password need to be the same"),
      }),

    pincode: yup
      .string()
      .required("Pincode is required")
      .matches(Pincode, "Invalid Pincode"),
      city: yup
      .string()
      .required('City is required'),
      /*
      Need future purpose
     city: yup.object().nullable()
      .required('City is required')
      */
  })
  const InviteList = async () => {
    let ApiInstance = await new APIKit().init();
    let awaitresp = await ApiInstance.get(constants.listAllInvites + "?phone_number=" + mobilenumber);
    if (awaitresp.status ===1) {
      setInviteList(awaitresp.data.data)
    } else {
      Alert.alert(awaitresp.err_msg);
    }
  }
  useEffect(() => {
    InviteList();
  }, [])
  const onSelectCity = (data, setFieldValue) => {
    setFieldValue("city", city_dropdown[data]);
    setCity(city_dropdown[data])
  }
  const AccountSubmit = async (values, resetForm) => {
    if (checkboxActive == false) {
      Alert.alert("Before submit please select the Terms & Conditions");
    } else {
      let ApiInstance = await new APIKit().init();
      let awaitresp = await ApiInstance.get(constants.checkEmailNumberExist + "?phone_number=" + mobilenumber + "&email=" + values.email);
      if (awaitresp.status === 1) {
        auth()
          .createUserWithEmailAndPassword(values.email, values.password)
          .then(async (res) => {
            const response = res || {},
              userData = response.user || {},
              uid = userData.uid || null;
            const payload =
            {
              "uid": uid,
              "name": values.name,
              "email": values.email,
              "phone_number": values.phonenumber,
              "city": values.city,
              "pincode": values.pincode,
              "referrer_id": invitelist[0].referrer_id,
              "device_token": "sdfsdfsdfsd",
              "device_type": Platform.OS
            }
            let ApiInstance = await new APIKit().init();
            let awaitresp = await ApiInstance.post(constants.appRegister, payload);

            if (awaitresp.status === 1) {
              setVisible(true)
              setTimeout(() => {
                navigation.navigate(loginNav);
                setVisible(false);
              }, 5000)
            } else {

            }
          })
          .catch(error => {
            if (error.code === 'auth/email-already-in-use') {
              setErrorMsg('That email address is already in use!');
              setSuccessMsg("");
            }

            if (error.code === 'auth/invalid-email') {
              setErrorMsg('That email address is invalid!');
              setSuccessMsg("");
            }

          });
      }
      else{
        setErrorMsg(awaitresp.err_msg);
        setTimeout(() => {
          setErrorMsg("");
        }, 5000)
      }
    }

  }
  const closeModal =()=>{
    setVisible(false);
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <BackArrowComp />
        <Text style={styles.headerText}>Good To Have You Here!</Text>
        <Formik
          validationSchema={signupValidationSchema}
          initialValues={{ name: '', phonenumber: mobilenumber, email: '', password: '', confirm_password: '', pincode: '', city: '' }}
          onSubmit={(values, actions) => AccountSubmit(values, actions)}
        >
          {({
            handleSubmit,
            handleChange,
            handleBlur,
            handleReset,
            values,
            touched,
            isInvalid,
            isSubmitting,
            isValidating,
            submitCount,
            setFieldValue,
            errors,
          }) => (
            <View>
              <FloatingInput
                placeholder_text="Name"
                value={values.name}
                onChangeText={(data) => setFieldValue("name", data)}
                error={errors.name}
                maxLength={30}
              />

              <FloatingInput
                placeholder_text="Phone Number"
                value={values.phonenumber}
                onChangeText={(data) => setFieldValue("phonenumber", data)}
                error={errors.phonenumber}
                focus={true}
                prefix="+91"
                prefixCall={() => alert('')}
                editable_text={false}
              />
              <FloatingInput
                placeholder_text="Email"
                value={values.email}
                onChangeText={(data) => setFieldValue('email', data)}
                error={errors.email}
              />
              <FloatingInput
                placeholder_text="Password"
                value={values.password}
                onChangeText={(data) => setFieldValue("password", data)}
                error={errors.password}
                secureTextEntry={passwordStatus == true ? true : false}
                rightIcon={
                  <TouchableOpacity
                    onPress={() => setPasswordStatus(!passwordStatus)}
                  >
                    <Image
                      source={passwordStatus == true ? eye_close : eye_open}
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                }
              />
              <FloatingInput
                placeholder_text="Confirm Password"
                secureTextEntry={true}
                value={values.confirm_password}
                onChangeText={(data) => setFieldValue("confirm_password", data)}
                error={errors.confirm_password}
                secureTextEntry={passwordConfirmStatus == true ? true : false}
                rightIcon={
                  <TouchableOpacity
                    onPress={() =>
                      setPasswordConfirmStatus(!passwordConfirmStatus)
                    }
                  >
                    <Image
                      source={
                        passwordConfirmStatus == true ? eye_close : eye_open
                      }
                      style={styles.eyeIcon}
                    />
                  </TouchableOpacity>
                }
              />
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <View style={{ flex: 0.5 }}>
                  <FloatingInput
                    placeholder_text="Pin Code"
                    value={values.pincode}
                    onChangeText={(data) => setFieldValue("pincode", data)}
                    error={errors.pincode}
                  />
                </View>
                <View style={{ flex: 0.5 }}>
                  <FloatingInput
                    placeholder_text="City"
                    value={values.city}
                    onChangeText={(data) => setFieldValue('city', data)}
                    error={errors.city}
                  />
                </View>
                
                {/* 
                Need future purpose
                <View style={{ flex: 0.5 }}>
                  <ModalDropdown onSelect={(data) => onSelectCity(data, setFieldValue)} loading={true} ref={dropdownref} options={city_dropdown} isFullWidth renderRow={(props) => <Text style={{ paddingVertical: 8, paddingHorizontal: 15, fontSize: font14, color: colorDropText, fontFamily: 'Rubik-Regular' }}>{props.label}</Text>} dropdownStyle={{ elevation: 8, borderRadius: 8 }} renderSeparator={(obj) => null}>
                    <FloatingInput
                      placeholder_text="City"
                      editable_text={false}
                      value={values.city && city.label}
                      error={errors.city}
                      type="dropdown"
                      containerStyle={{ marginBottom: 0 }}
                      dropdowncallback={() => dropdownref.current.show()}
                      rightIcon={<Image source={arrow_down} style={{ width: 12, height: 8.3 }} />}


                    /></ModalDropdown>
                </View> */}

              </View>
              <TouchableOpacity
                onPress={() => setCheckboxActive(!checkboxActive)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingTop: 30,
                }}
              >
                <View style={{ flex: 0.1 }}>
                  <Image
                    source={
                      checkboxActive == true ? check_active : check_in_active
                    }
                    style={styles.checkboxSize}
                  />
                </View>
                <View style={{ flex: 0.9, paddingLeft: 5 }}>
                  <Text style={styles.acceptenceText}>
                    By registering you agree to MyHomeAsset's Terms & Conditions
                    and Privacy Policy.
                  </Text>
                </View>
              </TouchableOpacity>
              <View><Text style={styles.successMsg}>{successMsg}</Text></View>
              <View><Text style={styles.errMsg}>{errorMsg}</Text></View>
              <View style={{ marginVertical: 20, paddingTop: 30 }}><ThemedButton title="Create Account" onPress={handleSubmit} color={colorLightBlue}></ThemedButton></View>
            </View>
          )}
        </Formik>
        <ModalComp visible={visible}>
          <View>
            <View style={styles.closeView}>
              <TouchableOpacity onPress={() => closeModal()}><Image source={close_round} style={styles.close_icon} /></TouchableOpacity>
              </View>
            <View style={styles.glitterView}><Image style={styles.glitterStar} source={glitter} /></View>
            <Text style={styles.header}>User Added Successfully</Text>
          </View>
        </ModalComp>

      </ScrollView>
    </View>
  );
};
export default CreateAccount;
