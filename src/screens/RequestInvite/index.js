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
  verificationNav
 } from '@navigation/NavigationConstant';
 import APIKit from '@utils/APIKit';
 import {constants} from '@utils/config';
const RequestInvite = (props) => {
  console.log("props",props);
  const props_params=props?.route?.params?.params;
  console.log("props_params",props_params);
  const navigation=useNavigation();
  const [errorMessage,setErrorMsg]=useState('');
  const phoneNumber = RegExp(/^[0-9]{10}$/);
  const signupValidationSchema = yup.object().shape({
    phonenumber: yup
      .string()
      .required('Mobile number is required')
      .matches(phoneNumber, "Invalid Mobile Number")
  })
  
  const RequestSubmit = async(values, resetForm) => {
    if(props_params=="Already_Invite"){
      
      let ApiInstance = await new APIKit().init();
            let awaitresp = await ApiInstance.get(constants.checkInviteExist+ "?phone_number="+values.phonenumber);
            console.log("await resp already",awaitresp);
            if(awaitresp.status==1){
              navigation.navigate(verificationNav,{mobileNumber:values.phonenumber,status:"Already_Invite"})
            }else{
              setErrorMsg(awaitresp.err_msg);
              setTimeout(()=>{
                setErrorMsg("");
              },5000)
              
            }
          
    }else{
    let ApiInstance = await new APIKit().init();
    console.log("invite",constants.requestInvite+ "?phone_number="+values.phonenumber);
          let awaitresp = await ApiInstance.get(constants.requestInvite+ "?phone_number="+values.phonenumber);
          console.log("await resp",awaitresp);
          if(awaitresp.status==1){
            navigation.navigate(verificationNav,{mobileNumber:values.phonenumber})
          }else{
            setErrorMsg(awaitresp.err_msg);
            setTimeout(()=>{
              setErrorMsg("");
            },5000)
            
          }
        }
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <BackArrowComp />
        <Text style={styles.headerText}>Request An Invite</Text>
        <Text style={styles.Invitepara}>Enter your mobile number below. We will let you know when you have an invite.</Text>
        <Formik
          validationSchema={signupValidationSchema}
          initialValues={{phonenumber: ''}}
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
              <Text style={styles.errorMsg}>{errorMessage}</Text>
              <View style={{ marginVertical: 20, paddingTop: 30 }}><ThemedButton title="Submit" onPress={handleSubmit} color={colorLightBlue}></ThemedButton></View>
            </View>
          )}

        </Formik>


      </ScrollView>
    </View>
  )
}
export default RequestInvite;