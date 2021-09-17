import React from 'react';
import { StyleSheet, Text, View,Image, ImageBackground,TouchableOpacity } from 'react-native';
import styles from './styles';
import OTPTextView from 'react-native-otp-textinput';
import BackArrowComp from '@components/BackArrowComp';
import ThemedButton from '@components/ThemedButton';
import {colorLightBlue} from '@constants/Colors';
const Verification =(props)=>{
    const mobileNumber=props?.route?.params.mobileNumber;
    console.log("mobile number",mobileNumber);
    return(
<View style={styles.container}>
<BackArrowComp />
<Text style={styles.headerText}>OTP Sent!</Text>
        <Text style={styles.Invitepara}>We have sent OTP to your phone number <Text style={styles.mobilenoStyle}>{mobileNumber}</Text></Text>
    
    <View style={styles.otpview}><OTPTextView
          ref={(e) => (this.input1 = e)}
          containerStyle={styles.textInputContainer}
          tintColor="#ccc"
          textInputStyle={styles.textinputStyles}
          handleTextChange={(text) => {console.log("otp value",text)}}
          inputCount={4}
          keyboardType="numeric"
        /></View>
        <TouchableOpacity><Text style={styles.resendotp}>Resend again?</Text></TouchableOpacity>
        <View style={{ marginVertical: 20, paddingTop: 30 }}><ThemedButton title="Verify" onPress={()=>verifyOTP} color={colorLightBlue}></ThemedButton></View>
</View>
    )
}
export default Verification;