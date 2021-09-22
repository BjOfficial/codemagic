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
import { Formik, Field, FormikHelpers } from "formik";
import * as yup from "yup";
import { useNavigation, useRoute } from "@react-navigation/native";
import { verificationNav } from "@navigation/NavigationConstant";
const RequestInvite = () => {
  const navigation = useNavigation();
  const phoneNumber = RegExp(/^[0-9]{10}$/);
  const signupValidationSchema = yup.object().shape({
    phonenumber: yup
      .string()
      .required("Mobile number is required")
      .matches(phoneNumber, "Invalid Mobile Number"),
  });

  const RequestSubmit = (values, resetForm) => {
    navigation.navigate(verificationNav, { mobileNumber: values.phonenumber });
    console.log("values", values);
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <BackArrowComp />
        <Text style={styles.headerText}>Request An Invite</Text>
        <Text style={styles.Invitepara}>
          Enter your mobile number below. We will let you know when you have an
          invite.
        </Text>
        <Formik
          validationSchema={signupValidationSchema}
          initialValues={{ phonenumber: "" }}
          onSubmit={(values, actions) => RequestSubmit(values, actions)}
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
                placeholder_text="Mobile Number"
                value={values.phonenumber}
                onChangeText={(data) => setFieldValue("phonenumber", data)}
                error={errors.phonenumber}
                focus={true}
                prefix="+91"
                // prefixCall={() => alert('')}
              />
              <View style={{ marginVertical: 20, paddingTop: 30 }}>
                <ThemedButton
                  title="Submit"
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
export default RequestInvite;
