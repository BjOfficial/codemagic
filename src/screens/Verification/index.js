import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, TouchableOpacity, Alert } from 'react-native';
import styles from './styles';
import OTPTextView from 'react-native-otp-textinput';
import BackArrowComp from '@components/BackArrowComp';
import ThemedButton from '@components/ThemedButton';
import { colorLightBlue } from '@constants/Colors';
import ModalComp from '@components/ModalComp';
import { close_round, glitter } from '@constants/Images';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config';
import { useNavigation, useRoute } from "@react-navigation/native";
import {
    createAccountNav,
    landingPageNav
} from '@navigation/NavigationConstant';
import { set } from 'react-native-reanimated';
const Verification = (props) => {
    const navigation = useNavigation();
    const [timer, setTimer] = useState(60);
    const [otpvalue, setOtpvalue] = useState('');
    const [visible, setVisible] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const mobileNumber = props?.route?.params.mobileNumber;
    const status = props?.route?.params.status;
    const SetTime = () => {
        let interval = setInterval(() => {
            setTimer(lastTimerCount => {
                if (lastTimerCount <= 1) {
                    clearInterval(interval)
                }
                return lastTimerCount - 1
            })
        }, 1000) //each count lasts for a second
        //cleanup the interval on complete
        return () => clearInterval(interval)
    }
    const resendotp = async () => {
        if (timer == 0) {
            setTimer(60);

            let ApiInstance = await new APIKit().init();
            let awaitresp = await ApiInstance.get(constants.resendOtp + "?phone_number=" + mobileNumber);
            if (awaitresp.status == 1) {
                setSuccessMsg(awaitresp.data.message)
                setTimeout(() => {
                    setSuccessMsg("");
                }, 5000)
            } else {
                setErrorMsg(awaitresp.err_msg)
                setTimeout(() => {
                    setErrorMsg("");
                }, 5000)
            }
            setTimeout(() => {
                SetTime();
            })
        }
    }
    useEffect(() => {
        SetTime();
    }, []);
    const verifyOTP = async () => {
        if (otpvalue.length < 4) {
            Alert.alert('Please fill the otp field');
        } else {
            if (status === 'Already_Invite') {
                const payload = {
                    "phone_number": mobileNumber,
                    "otp": otpvalue
                }
                let ApiInstance = await new APIKit().init();
                let awaitresp = await ApiInstance.post(constants.registerVerifyOtp, payload);
                if (awaitresp.status == 1) {
                    setVisible(true);
                } else {
                    setErrorMsg(awaitresp.err_msg)
                    setTimeout(() => {
                        setErrorMsg("");
                    }, 5000)
                }
            } else {
                const payload = {
                    "phone_number": mobileNumber,
                    "otp": otpvalue
                }
                let ApiInstance = await new APIKit().init();
                let awaitresp = await ApiInstance.post(constants.requestInviteVerifyOtp, payload);
                if (awaitresp.status == 1) {
                    setVisible(true);
                } else {
                    setErrorMsg(awaitresp.err_msg)
                    setTimeout(() => {
                        setErrorMsg("");
                    }, 5000)
                }
            }

        }
    }
    const closeModal = () => {
        setVisible(false);
        if (status === 'Already_Invite') {
            navigation.navigate(createAccountNav, { mobileNumber: mobileNumber });
        } else {
            navigation.navigate(landingPageNav)
        }

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
            <Text style={styles.successMsg}>{successMsg}</Text>
            <Text style={styles.errMsg}>{errorMsg}</Text>
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