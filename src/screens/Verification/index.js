import React, { useState, useEffect } from "react";
import { Text, View, Image, TouchableOpacity, Alert } from "react-native";
import styles from "./styles";
import OTPTextView from "react-native-otp-textinput";
import BackArrowComp from "@components/BackArrowComp";
import ThemedButton from "@components/ThemedButton";
import { colorLightBlue } from "@constants/Colors";
import ModalComp from "@components/ModalComp";
import { close_round, glitter } from "@constants/Images";
import { useNavigation } from "@react-navigation/native";
import { createAccountNav } from "@navigation/NavigationConstant";
import auth from "@react-native-firebase/auth";

const Verification = (props) => {
  const navigation = useNavigation();
  const [timer, setTimer] = useState(60);
  const [otpvalue, setOtpvalue] = useState("");
  const [visible, setVisible] = useState(false);
  const [credentails, setCredentials] = useState(null);
  const verification_id = props?.route?.params.verificationCode;
  const [verification_code, setVerificationCode] = useState(verification_id);
  const mobileNumber = props?.route?.params.mobileNumber;

  const SetTime = () => {
    let interval = setInterval(() => {
      setTimer((lastTimerCount) => {
        if (lastTimerCount <= 1) {
          clearInterval(interval);
        }
        return lastTimerCount - 1;
      });
    }, 1000); //each count lasts for a second
    //cleanup the interval on complete
    return () => clearInterval(interval);
  };

  const resendotp = async () => {
    if (timer == 0) {
      setTimer(60);
      try {
        const confirmation = await auth().signInWithPhoneNumber(
          `+91 ${mobileNumber}`
        );
        setVerificationCode(confirmation._verificationId);
      } catch (error) {
        Alert.alert(error);
      }

      setTimeout(() => {
        SetTime();
      });
    }
  };
  useEffect(() => {
    SetTime();
  }, []);

  const verifyOTP = async () => {
    if (otpvalue.length < 6) {
      Alert.alert("Please fill the otp field");
    } else {
      console.log("verification code", verification_id);
      try {
        let credentials = await auth.PhoneAuthProvider.credential(
          verification_code,
          otpvalue
        );
        console.log("credentials", credentials);
        let success = await auth().signInWithCredential(credentials);
        if (success) {
          setCredentials(credentials);
        }
        console.log("success", success);
        if (success) {
          setVisible(true);
        }
      } catch (error) {
        Alert.alert(error.code);
      }
    }
  };
  const closeModal = () => {
    setVisible(false);

    navigation.navigate(createAccountNav, {
      mobileNumber: mobileNumber,
      credentails: credentails,
    });
  };
  return (
    <View style={styles.container}>
      <BackArrowComp />
      <Text style={styles.headerText}>OTP Sent!</Text>
      <Text style={styles.Invitepara}>
        We have sent OTP to your phone number{" "}
        <Text style={styles.mobilenoStyle}>{mobileNumber}</Text>
      </Text>

      <View style={styles.otpview}>
        <OTPTextView
          // ref={(e) => (this.input1 = e)}
          containerStyle={styles.textInputContainer}
          tintColor="#ccc"
          textInputStyle={styles.textinputStyles}
          handleTextChange={(data) => setOtpvalue(data)}
          inputCount={6}
          keyboardType="numeric"
        />
      </View>
      <Text style={styles.timerdisplay}>00:{timer}</Text>

      <TouchableOpacity onPress={() => resendotp()}>
        <Text style={[styles.resendotp, { opacity: timer == 0 ? 1 : 0.5 }]}>
          Resend again?
        </Text>
      </TouchableOpacity>
      <View style={{ marginVertical: 20, paddingTop: 30 }}>
        <ThemedButton
          title="Verify"
          onPress={() => verifyOTP()}
          color={colorLightBlue}></ThemedButton>
      </View>
      <ModalComp visible={visible}>
        <View>
          <View style={styles.closeView}>
            <TouchableOpacity onPress={() => closeModal()}>
              <Image source={close_round} style={styles.close_icon} />
            </TouchableOpacity>
          </View>
          <View style={styles.glitterView}>
            <Image style={styles.glitterStar} source={glitter} />
          </View>
          <Text style={styles.header}>Your request has been registered!</Text>
          <Text style={styles.para}>
            We will update you when you have an invite
          </Text>
        </View>
      </ModalComp>
    </View>
  );
};
export default Verification;
