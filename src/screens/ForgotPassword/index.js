import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, ScrollView, TouchableOpacity, Image, TouchableHighlight, Alert } from 'react-native';
import BackArrowComp from '@components/BackArrowComp';
import styles from './styles';
import FloatingInput from '@components/FloatingInput';
import ThemedButton from '@components/ThemedButton';
import { colorLightBlue, colorDropText } from '@constants/Colors';
import { Formik, Field, FormikHelpers } from 'formik';
import firebase from '@react-native-firebase/app';
import * as yup from "yup";
import { useNavigation,useRoute } from "@react-navigation/native";
import {
  verificationNav,createpasswordNav
 } from '@navigation/NavigationConstant';
const ForgotPassword = () => {
  const navigation=useNavigation();
  const [successMsg, setSuccessMsg] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [disabled, setDisabled] = useState(false);
  const signupValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email")
      .required('Email Address is required')
  })
  
  const ResendSubmit = (values, resetForm) => {
  
            firebase
            .auth()
            .sendPasswordResetEmail(values.email)
            .then(
              () => {
                setDisabled(true);
                setErrorMsg('');
                setSuccessMsg("Successfully sent the link to your Registered Email")
                console.log("Successfully sent the link")
              },
              (err) => {
                const msg = err.message || 'Something went wrong. Try again later';
                // setErrorMsg(msg);
                setErrorMsg("This Email address is not registered with us");
                setSuccessMsg("");
                console.log("error msg",msg);
              }
            )
            .catch((err) => {
              const msg = err.message || 'Something went wrong. Try again later';
              console.log("catch msg",msg)
              setErrorMsg(msg);
              setSuccessMsg("");
            });
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <BackArrowComp />
        <Text style={styles.headerText}>Reset Password</Text>
        <Text style={styles.Invitepara}>Enter email, We will send a link to your registered email.</Text>
        <Formik
          validationSchema={signupValidationSchema}
          initialValues={{email: ''}}
          onSubmit={(values, actions) => ResendSubmit(values, actions)}
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
            errors
          }) => (
            <View>

              <FloatingInput
                placeholder_text="Email"
                value={values.email}
                onChangeText={(data) => setFieldValue('email', data)}
                error={errors.email}
              />
               <View><Text style={styles.successMsg}>{successMsg}</Text></View>
          <View><Text style={styles.errMsg}>{errorMsg}</Text></View> 
              <View style={{ marginVertical: 20, paddingTop: 30 }}><ThemedButton title="Send Resend Link" onPress={handleSubmit} color={colorLightBlue} disabled={disabled} buttonStyle={{ marginBottom: 50, width : '100%', padding: 5, backgroundColor :disabled ? '#CCC' : colorLightBlue }}></ThemedButton></View>
            </View>
          )}

        </Formik>


      </ScrollView>
    </View>
  )
}
export default ForgotPassword;