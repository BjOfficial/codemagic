import React, { useState, useContext, useEffect } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  BackHandler,
  ActivityIndicator,
} from "react-native";
import BackArrowComp from "@components/BackArrowComp";
import styles from "./styles";
import FloatingInput from "@components/FloatingInput";
import ThemedButton from "@components/ThemedButton";
import { colorLightBlue } from "@constants/Colors";
import { useNavigation } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import { eye_close, eye_open } from "@constants/Images";
import Toast from "react-native-simple-toast";
import { Formik } from "formik";
import * as yup from "yup";
import {
  requestInviteNav,
  forgotpasswordNav,
  landingPageNav,
} from "@navigation/NavigationConstant";
import { AuthContext } from "@navigation/AppNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIKit from "@utils/APIKit";
import { constants } from "@utils/config";
import messaging from "@react-native-firebase/messaging";

const Login = () => {
  let { successCallback } = useContext(AuthContext);
  const navigation = useNavigation();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(true);
  const [showMesssage, setShowMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleBackButtonClick = () => {
    navigation.navigate(landingPageNav);
    return true;
  };
  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        "hardwareBackPress",
        handleBackButtonClick
      );
    };
  }, []);
  const signupValidationSchema = yup.object().shape({
    email: yup
      .string()
      .trim()
      .email("Please enter valid email")
      .required("Email Address is Required"),
    password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required"),
  });
  const LoginSubmit = (values) => {
    setIsLoading(true);
    auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then(async (res) => {
        const response = res || {},
          userData = response.user || {},
          uid = userData.uid || null;
        AsyncStorage.setItem("loginToken", uid);
        if (uid) {
          let payload = { device_token: await messaging().getToken() };
          let ApiInstance = await new APIKit().init(uid);
          let awaitresp = await ApiInstance.post(constants.login, payload);
          console.log("login api respnse", awaitresp);
          if (awaitresp.status == 1) {
            console.log("login response", awaitresp.data.data.name);
            let userInfo = awaitresp.data.data.name;
            AsyncStorage.setItem("userDetails", userInfo);
            successCallback({ user: userInfo, token: uid });
            setIsLoading(false);
          } else {
            setErrorMsg(awaitresp.err_msg);
          }
        }
      })
      .catch((error) => {
        console.log("error", error);
        if (error.code === "auth/user-not-found") {
          setErrorMsg(
            "There is no user found with this email id, Are you sure you have registered?"
          );
          showErrorMessage();
          setIsLoading(false);
          setSuccessMsg("");
        }
        if (error.code === "auth/network-request-failed") {
          Toast.show("Check your internet connection.", Toast.LONG);
          setIsLoading(false);
          setSuccessMsg("");
        }

        if (error.code === "auth/wrong-password") {
          setErrorMsg(
            "The password is invalid or the user does not have a password"
          );
          setIsLoading(false);
          showErrorMessage();
          setSuccessMsg("");
        }
      });
  };

  const showErrorMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={"handled"}>
        <BackArrowComp navigation_direction="login" />
        <Text style={styles.headerText}>Welcome Back!</Text>
        <Text style={styles.Invitepara}>
          Login to manage your home appliances.
        </Text>
        <Formik
          validationSchema={signupValidationSchema}
          initialValues={{ email: "", password: "" }}
          onSubmit={(values) => LoginSubmit(values)}>
          {({ handleSubmit, values, setFieldValue, errors }) => (
            <View>
              <FloatingInput
                placeholder_text="Email"
                value={values.email}
                onChangeText={(data) =>
                  setFieldValue("email", data.replace(/\s/g, ""))
                }
                error={errors.email}
                keyboard_type="email-address"
              />
              <FloatingInput
                placeholder_text="Password"
                value={values.password}
                onChangeText={(data) => setFieldValue("password", data)}
                error={errors.password}
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
              <TouchableOpacity
                onPress={() => navigation.navigate(forgotpasswordNav)}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
              <View>
                <Text style={styles.successMsg}>{successMsg}</Text>
              </View>
              <View>
                {showMesssage == true ? (
                  <Text style={styles.errorMsg}>{errorMsg}</Text>
                ) : null}
              </View>
              <View style={{ marginVertical: 20, paddingTop: 40 }}>
                {isLoading == true ? (
                  <ActivityIndicator
                    animating={isLoading}
                    size="large"
                    color={colorLightBlue}
                  />
                ) : (
                  <ThemedButton
                    title="Login"
                    onPress={handleSubmit}
                    color={colorLightBlue}></ThemedButton>
                )}
              </View>
              <View style={styles.registerText}>
                <Text style={styles.homeAssetsText}>New to MyHomeAssets?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate(requestInviteNav)}>
                  <Text style={styles.inviteText}>Request An Invite</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};
export default Login;
