import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ImageBackground, ScrollView, TouchableOpacity, Image, TouchableHighlight, Alert } from 'react-native';
import BackArrowComp from '@components/BackArrowComp';
import styles from './styles';
import FloatingInput from '@components/FloatingInput';
import ThemedButton from '@components/ThemedButton';
import { colorLightBlue, colorDropText } from '@constants/Colors';
import { Formik, Field, FormikHelpers } from 'formik';
import * as yup from "yup";
import { useNavigation,useRoute } from "@react-navigation/native";
import {
  verificationNav,createpasswordNav
 } from '@navigation/NavigationConstant';
const ForgotPassword = () => {
  const navigation=useNavigation();
  const phoneNumber = RegExp(/^[0-9]{10}$/);
  const signupValidationSchema = yup.object().shape({
    phonenumber: yup
      .string()
      .required('Mobile number is required')
      .matches(phoneNumber, "Invalid Mobile Number")
  })
  
  const ResendSubmit = (values, resetForm) => {
    navigation.navigate(createpasswordNav)
      console.log("values", values);
    
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <BackArrowComp />
        <Text style={styles.headerText}>Reset Password</Text>
        <Text style={styles.Invitepara}>Enter email, We will send a link to your registered email.</Text>
        <Formik
          validationSchema={signupValidationSchema}
          initialValues={{phonenumber: ''}}
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
                placeholder_text="Mobile Number"
                value={values.phonenumber}
                onChangeText={(data) => setFieldValue('phonenumber', data)}
                error={errors.phonenumber}
                focus={true}
                prefix="+91"
                // prefixCall={() => alert('')}
              />
              <View style={{ marginVertical: 20, paddingTop: 30 }}><ThemedButton title="Send Resend Link" onPress={handleSubmit} color={colorLightBlue}></ThemedButton></View>
            </View>
          )}

        </Formik>


      </ScrollView>
    </View>
  )
}
export default ForgotPassword;