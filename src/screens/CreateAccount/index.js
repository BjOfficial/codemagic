import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
  ActivityIndicator,
} from "react-native";
import BackArrowComp from "@components/BackArrowComp";
import styles from "./styles";
import FloatingInput from "@components/FloatingInput";
import ThemedButton from "@components/ThemedButton";
import ModalDropdownComp from "@components/ModalDropdownComp";
import { colorLightBlue, colorDropText } from "@constants/Colors";
import {
  eye_close,
  eye_open,
  check_in_active,
  check_active,
  glitter,
  close_round,
  arrow_down,
} from "@constants/Images";
import { Formik } from "formik";
import { useNavigation } from "@react-navigation/native";
import * as yup from "yup";
import APIKit from "@utils/APIKit";
import auth from "@react-native-firebase/auth";
import { constants } from "@utils/config";
import { loginNav } from "@navigation/NavigationConstant";
import ModalComp from "@components/ModalComp";
import { font14 } from "@constants/Fonts";
const CreateAccount = (props) => {
  console.log("create account", props);
  const navigation = useNavigation();
  const mobilenumber = props?.route?.params?.mobileNumber;
  const credentails_verification = props?.route?.params?.credentails;
  console.log("credentails", credentails_verification);
  const [citydropdown, setCityDropdown] = useState(null);
  const [checkboxActive, setCheckboxActive] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [passwordConfirmStatus, setPasswordConfirmStatus] = useState(false);
  const [invitelist, setInviteList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [loading, setloading] = useState(false);
  const [registerloading, setRegisterLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const dropdownref = useRef(null);
  const phoneNumber = RegExp(/^[0-9]{10}$/);
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
      .test("len", "Invalid Pincode", (val) => val.length >= 5),
    // .min(6,({min})=>`invalid pincode  min ${min}`)
    // .max(6,({max})=>`invalid pincode  max ${max}`),

    // .test('len',"invalid pincode",(data)=>data.length==5),

    city: yup.object().nullable().required("City is required"),
  });

  const InviteList = async () => {
    let ApiInstance = await new APIKit().init();
    let awaitresp = await ApiInstance.get(
      constants.listAllInvites + "?phone_number=" + mobilenumber
    );
    if (awaitresp.status === 1) {
      setInviteList(awaitresp.data.data);
    } else {
      Alert.alert(awaitresp.err_msg);
    }
  };
  useEffect(() => {
    InviteList();
  }, []);
  const onSelectCity = (data, setFieldValue) => {
    setFieldValue("city", citydropdown[data]);
    // setCityDropdown(citydropdown[data]);
  };
  const AccountSubmit = async (values) => {
    if (checkboxActive == false) {
      Alert.alert("Before submit please select the Terms & Conditions");
    } else {
      setRegisterLoading(true);
      let ApiInstance = await new APIKit().init();
      let awaitresp = await ApiInstance.get(
        constants.checkEmailNumberExist +
          "?phone_number=" +
          mobilenumber +
          "&email=" +
          values.email
      );
      if (awaitresp.status === 1) {
        try {
          let currentUser = auth().currentUser;
          console.log("currentUser", currentUser);
          // return;
          // currentUser.reauthenticateWithCredential(credentails_verification).then(async() => {
          await currentUser.updatePassword(values.password);
          await currentUser.updateEmail(values.email);
          const response = currentUser || {},
            uid = response.uid || null;
          const payload = {
            uid: uid,
            name: values.name,
            email: values.email,
            phone_number: values.phonenumber,
            city: values.city.value,
            pincode: values.pincode,
            referrer_id: invitelist[0].referrer_id,
            device_token: "sdfsdfsdfsd",
            device_type: Platform.OS,
          };
          console.log("payload account", payload);
          let ApiInstance = await new APIKit().init();
          let awaitresp = await ApiInstance.post(
            constants.appRegister,
            payload
          );
          console.log("awaitresp", awaitresp);
          if (awaitresp.status === 1) {
            setRegisterLoading(false);
            setVisible(true);
            setTimeout(() => {
              navigation.navigate(loginNav);
              setVisible(false);
            }, 5000);
          } else {
            Alert.alert(awaitresp.err_msg);
          }
        } catch (err) {
          console.log("catche error", err);
        }
      } else {
        setErrorMsg(awaitresp.err_msg);
        setTimeout(() => {
          setErrorMsg("");
        }, 5000);
      }
    }
  };
  const closeModal = () => {
    setVisible(false);
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
    // setFieldError("pincode",value.length!=6?"Invalid Pincode":null)
    // return;
    if (value.length >= 5) {
      setloading(true);
      console.log("reached 5");
      let ApiInstance = await new APIKit().init();
      setFieldValue("city", "");
      let awaitresp = await ApiInstance.get(
        `https://api.postalpincode.in/pincode/${value}`
      );
      console.log("awaitresp city", awaitresp);
      setloading(false);
      if (awaitresp.status == 1) {
        if (awaitresp.data.length > 0) {
          let responseData = awaitresp.data[0].PostOffice?.map((obj) => {
            let city_frame = { label: obj.Name, value: obj.Name };
            return city_frame;
          });
          setCityDropdown(responseData);
        }
      } else {
        Alert.alert(awaitresp.err_msg);
      }
      console.log("city response", awaitresp.data[0]);
    }
  };
  const changeFieldValue = (setFieldValue, key, value, touched, setTouched) => {
    setTouched({ ...touched, [key]: true });
    setFieldValue(key, value);
  };
  console.log("city dropdown", citydropdown);
  return (
    <View style={styles.container}>
      <ScrollView>
        <BackArrowComp />
        <Text style={styles.headerText}>Good To Have You Here!</Text>
        <Formik
          validationSchema={signupValidationSchema}
          initialValues={{
            name: "",
            phonenumber: mobilenumber,
            email: "",
            password: "",
            confirm_password: "",
            pincode: "",
            city: null,
          }}
          onSubmit={(values, actions) => AccountSubmit(values)}>
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
                    "name",
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
                    "phonenumber",
                    data,
                    touched,
                    setTouched
                  )
                }
                error={touched.phonenumber && errors.phonenumber}
                focus={true}
                prefix="+91"
                prefixCall={() => alert("")}
                editable_text={false}
              />
              <FloatingInput
                placeholder_text="Email"
                value={values.email}
                onChangeText={(data) =>
                  changeFieldValue(
                    setFieldValue,
                    "email",
                    data,
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
                    "password",
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
                    "confirm_password",
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
                  flexDirection: "row",
                  alignItems: "center",
                }}>
                <View style={{ flex: 0.5 }}>
                  <FloatingInput
                    placeholder_text="Pin Code"
                    maxLength={6}
                    value={values.pincode}
                    keyboardType={
                      Platform.OS == "android" ? "numeric" : "number-pad"
                    }
                    onChangeText={(data) =>
                      getCityDropdown(
                        data,
                        setFieldValue,
                        "pincode",
                        setFieldError,
                        touched,
                        setTouched
                      )
                    }
                    error={touched.pincode && errors.pincode}
                  />
                </View>

                <View style={{ flex: 0.5 }}>
                  <ModalDropdownComp
                    textStyle={{ color: "red" }}
                    loading={loading}
                    renderNoRecords={() => (
                      <Text style={{ textAlign: "center" }}>
                        No Records Found....
                      </Text>
                    )}
                    dropdownTextStyle={{ color: "green" }}
                    onSelect={(data) => onSelectCity(data, setFieldValue)}
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
                          fontFamily: "Rubik-Regular",
                        }}>
                        {props.label}
                      </Text>
                    )}
                    dropdownStyle={{ elevation: 8, borderRadius: 8 }}
                    renderSeparator={(obj) => null}>
                    <FloatingInput
                      placeholder_text="City"
                      editable_text={false}
                      value={values.city ? values.city.label : ""}
                      error={touched.city && errors.city}
                      type="dropdown"
                      containerStyle={{ marginBottom: 0 }}
                      dropdowncallback={() => dropdownref.current.show()}
                      rightIcon={
                        <Image
                          source={arrow_down}
                          style={{ width: 12, height: 8.3 }}
                        />
                      }
                    />
                  </ModalDropdownComp>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => setCheckboxActive(!checkboxActive)}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingTop: 30,
                }}>
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
                    By registering you agree to MyHomeAsset&apos;s Terms &
                    Conditions and Privacy Policy.
                  </Text>
                </View>
              </TouchableOpacity>
              <View>
                <Text style={styles.successMsg}>{successMsg}</Text>
              </View>
              <View>
                <Text style={styles.errMsg}>{errorMsg}</Text>
              </View>
              <View style={{ marginVertical: 20, paddingTop: 30 }}>
                <ThemedButton
                  title="Create Account"
                  onPress={handleSubmit}
                  color={colorLightBlue}></ThemedButton>
              </View>
            </View>
          )}
        </Formik>
        {registerloading && (
          <View
            style={{
              flex: 1,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <ActivityIndicator color="#49a58d" size="large" />
          </View>
        )}
        <ModalComp visible={visible}>
          <View>
            <View style={styles.closeView}>
              <TouchableOpacity onPress={() => closeModal()}>
                <Image source={close_round} style={styles.close_icon} />
              </TouchableOpacity>
            </View>
            <View style={styles.glitterView}>
              <Image style={styles.glitterStar} source={glitter} />
            </View>
            <Text style={styles.header}>User Added Successfully</Text>
          </View>
        </ModalComp>
      </ScrollView>
    </View>
  );
};
export default CreateAccount;
