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
import ModalDropdown from "react-native-modal-dropdown";
import {
  eye_close,
  eye_open,
  check_in_active,
  check_active,
  arrow_down,
} from "@constants/Images";
import { Formik, Field, FormikHelpers } from "formik";
import { requestInviteNav, loginNav } from "@navigation/NavigationConstant";
import * as yup from "yup";
import { font12, font14 } from "@constants/Fonts";
const CreatePassword = () => {
  const navigation = useNavigation();
  const [passwordStatus, setPasswordStatus] = useState(false);
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
  const code = navigation.dangerouslyGetState().routes.find((route) => {
    return Boolean(route?.params?.code);
  })?.params?.code;
  console.log(
    "Stripe auth code",
    code,
    navigation.dangerouslyGetState().routes.find((route) => {
      return Boolean(route?.params?.code);
    })?.params?.code
  );
  console.log("oobcode", code);
  const PasswordSubmit = (values) => {
    firebase
      .auth()
      .confirmPasswordReset(code, values.password)
      .then(function () {
        // Success
        setSuccessMsg(true);
        setTimeout(() => {
          setSuccessMsg(false);
          navigation.navigate(loginNav);
        }, 7000);
        console.log("password updated successfully");
      })
      .catch((error) => {
        console.log("password error", error);
        // Invalid code
      });
    // navigation.navigate("CompleteProfile");
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
          onSubmit={(values, actions) => PasswordSubmit(values, actions)}
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

              <View style={{ marginVertical: 20, paddingTop: 30 }}>
                <ThemedButton
                  title="Create Password"
                  onPress={handleSubmit}
                  color={colorLightBlue}
                ></ThemedButton>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};
export default CreatePassword;
