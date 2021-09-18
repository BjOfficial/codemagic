import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import styles from './styles';
import OTPTextView from 'react-native-otp-textinput';
import BackArrowComp from '@components/BackArrowComp';
import ThemedButton from '@components/ThemedButton';
import { colorLightBlue } from '@constants/Colors';
import ModalComp from '@components/ModalComp';
import { close_round, glitter } from '@constants/Images';
import { useNavigation, useRoute } from "@react-navigation/native";
import {
    landingPageNav
} from '@navigation/NavigationConstant';
const Verification = (props) => {
    const navigation = useNavigation();
    const [timer, setTimer] = useState(10);
    const [otpvalue, setOtpvalue] = useState('');
    const [visible, setVisible] = useState(false);
    const mobileNumber = props?.route?.params.mobileNumber;
    console.log("mobile number", mobileNumber);
    const SetTime = () => {
        let interval = setInterval(() => {
            setTimer(lastTimerCount => {
                if (lastTimerCount <= 1) {
                    clearInterval(interval)
                    // return 10;
                }
                return lastTimerCount - 1
            })
        }, 1000) //each count lasts for a second
        //cleanup the interval on complete
        return () => clearInterval(interval)
    }
    const resendotp = () => {
        if (timer == 0) {
            setTimer(10);
            setTimeout(() => {
                SetTime();
            })
        }
    }
    useEffect(() => {
        SetTime();
    }, []);
    const verifyOTP = () => {
        if (otpvalue.length < 4) {
            Alert.alert('Please fill the otp field');
        } else {
            setVisible(true);
            console.log("otp success");
        }
    }
    const closeModal = () => {
        setVisible(false);
        navigation.navigate(landingPageNav)
    }
    return (
        <View style={styles.container}>
            <BackArrowComp />
            <Text style={styles.headerText}>OTP Sent!</Text>
            <Text style={styles.Invitepara}>We have sent OTP to your phone number <Text style={styles.mobilenoStyle}>{mobileNumber}</Text></Text>

            <View style={styles.otpview}><OTPTextView
                ref={(e) => (this.input1 = e)}
                containerStyle={styles.textInputContainer}
                tintColor="#ccc"
                textInputStyle={styles.textinputStyles}
                handleTextChange={(data) => setOtpvalue(data)}
                inputCount={4}
                keyboardType="numeric"
            /></View>
            <Text style={styles.timerdisplay}>00:{timer}</Text>
            <TouchableOpacity onPress={() => resendotp()}><Text style={[styles.resendotp, { opacity: timer == 0 ? 1 : 0.5 }]}>Resend again?</Text></TouchableOpacity>
            <View style={{ marginVertical: 20, paddingTop: 30 }}><ThemedButton title="Verify" onPress={() => verifyOTP()} color={colorLightBlue}></ThemedButton></View>
            <ModalComp visible={visible}>
                <View>
                    <View style={styles.closeView}><TouchableOpacity onPress={() => closeModal()}><Image source={close_round} style={styles.close_icon} /></TouchableOpacity></View>
                    <View style={styles.glitterView}><Image style={styles.glitterStar} source={glitter} /></View>
                    <Text style={styles.header}>Your request has been registered!</Text>
                    <Text style={styles.para}>We will update you when you have an invite</Text>
                </View>
            </ModalComp>
        </View>
    )
}
export default Verification;