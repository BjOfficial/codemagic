import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  Alert,
} from "react-native";
import BackArrowComp from "@components/BackArrowComp";
import styles from "./styles";
import FloatingInput from "@components/FloatingInput";
import ThemedButton from "@components/ThemedButton";
import { colorLightBlue, colorDropText } from "@constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import auth from "@react-native-firebase/auth";
import firebase from "@react-native-firebase/app";
import {
  eye_close,
  eye_open,
  check_in_active,
  check_active,
  arrow_down,
} from "@constants/Images";
import { Formik, Field, FormikHelpers } from "formik";
import * as yup from "yup";
import {
  requestInviteNav,
  forgotpasswordNav,
} from "@navigation/NavigationConstant";
const Login = () => {
  const navigation = useNavigation();
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [passwordStatus, setPasswordStatus] = useState(false);
  const passwordRegex = RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]([\w!@#\$%\^&\*\?]|(?=.*\d)){7,}$/
  );
  const signupValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email")
      .required("Email Address is Required"),
    password: yup
      .string()
      .min(8, ({ min }) => `Password must be at least ${min} characters`)
      .required("Password is required")
      .matches(passwordRegex, "Invalid Password"),
  });
  const onSelectCity = (data, setFieldValue) => {
    // alert(data)
    setFieldValue("city", city_dropdown[data]);
    setCity(city_dropdown[data]);
  };
  const LoginSubmit = (values, resetForm) => {
    auth()
      .signInWithEmailAndPassword(values.email, values.password)
      .then(async (res) => {
        console.log("firebase login result", res);
      })
      .catch((error) => {
        if (error.code === "auth/user-not-found") {
          setErrorMsg(
            "There is no user found with this email id, Are you sure you have registered?"
          );
          // setErrorMsg('There is no user record corresponding to this identifier. The user may have been deleted');
          setSuccessMsg("");
        }

        if (error.code === "auth/wrong-password") {
          setErrorMsg(
            "The password is invalid or the user does not have a password"
          );
          setSuccessMsg("");
          console.log("That email address is invalid!");
        } else if (error.code === "auth/network-request-failed]") {
          setErrorMsg("A network error has occurred, please try again");
          setSuccessMsg("");
        }
      });
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <BackArrowComp />
        <Text style={styles.headerText}>Welcome Back!</Text>
        <Text style={styles.Invitepara}>
          Login to manage your home appliances.
        </Text>
        <Formik
          validationSchema={signupValidationSchema}
          initialValues={{ name: "", password: "" }}
          onSubmit={(values, actions) => LoginSubmit(values, actions)}
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
                placeholder_text="Email"
                value={values.email}
                // addtionalPlaceholder="(optional)"
                onChangeText={(data) => setFieldValue("email", data)}
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
              <TouchableOpacity
                onPress={() => navigation.navigate(forgotpasswordNav)}
              >
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>
              <View>
                <Text style={styles.successMsg}>{successMsg}</Text>
              </View>
              <View>
                <Text style={styles.errorMsg}>{errorMsg}</Text>
              </View>
              <View style={{ marginVertical: 20, paddingTop: 40 }}>
                <ThemedButton
                  title="Login"
                  onPress={handleSubmit}
                  color={colorLightBlue}
                ></ThemedButton>
              </View>
              <View style={styles.registerText}>
                <Text style={styles.homeAssetsText}>New to MyHomeAssets?</Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate(requestInviteNav)}
                >
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
