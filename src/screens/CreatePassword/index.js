import React, { useState } from "react";

import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  glitter,
  close_round,
} from "react-native";
import BackArrowComp from "@components/BackArrowComp";
import styles from "./styles";
import FloatingInput from "@components/FloatingInput";
import ThemedButton from "@components/ThemedButton";
import { colorLightBlue } from "@constants/Colors";
import { useNavigation } from "@react-navigation/native";
import { eye_close, eye_open } from "@constants/Images";
import { Formik } from "formik";
import { loginNav } from "@navigation/NavigationConstant";
import firebase from "@react-native-firebase/app";
import * as yup from "yup";
import ModalComp from "@components/ModalComp";
const CreatePassword = () => {
  const navigation = useNavigation();
  const [passwordStatus, setPasswordStatus] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);
  const [passwordConfirmStatus, setPasswordConfirmStatus] = useState(false);
  const passwordRegex = RegExp(
    /^(?=.*[a-z])(?=.*[A-Z])[a-zA-Z\d]([\w!@#\$%\^&\*\?]|(?=.*\d)){7,}$/
  );
  const signupValidationSchema = yup.object().shape({
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
  });
  const code = navigation.getState().routes.find((route) => {
    return Boolean(route?.params?.code);
  })?.params?.code;
  const PasswordSubmit = (values) => {
    firebase
      .auth()
      .confirmPasswordReset(code, values.password)
      .then(function () {
        setSuccessMsg(true);
        setTimeout(() => {
          setSuccessMsg(false);
          navigation.navigate(loginNav);
        }, 7000);
      })
      .catch((error) => {});
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <BackArrowComp />
        <Text style={styles.headerText}>Create New Password</Text>
        <Text style={styles.Invitepara}>
          Create Password - Your new password must be different from your
          previously used password
        </Text>
        <Formik
          validationSchema={signupValidationSchema}
          initialValues={{ password: "", confirm_password: "" }}
          onSubmit={(values, actions) => PasswordSubmit(values)}>
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
              <FloatingInput
                placeholder_text="Confirm Password"
                value={values.confirm_password}
                onChangeText={(data) => setFieldValue("confirm_password", data)}
                error={errors.confirm_password}
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

              <View style={{ marginVertical: 20, paddingTop: 30 }}>
                <ThemedButton
                  title="Create Password"
                  onPress={handleSubmit}
                  color={colorLightBlue}></ThemedButton>
              </View>
            </View>
          )}
        </Formik>
        <ModalComp visible={successMsg}>
          <View>
            <View style={styles.closeView}>
              <TouchableOpacity onPress={() => setSuccessMsg(false)}>
                <Image source={close_round} style={styles.close_icon} />
              </TouchableOpacity>
            </View>
            <View style={styles.glitterView}>
              <Image style={styles.glitterStar} source={glitter} />
            </View>
            <Text style={styles.header}>
              Your password reset successfully done!
            </Text>
          </View>
        </ModalComp>
      </ScrollView>
    </View>
  );
};
export default CreatePassword;
