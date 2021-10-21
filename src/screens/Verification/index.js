import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import styles from "./styles";
import OTPTextView from "react-native-otp-textinput";
import BackArrowComp from "@components/BackArrowComp";
import ThemedButton from "@components/ThemedButton";
import { colorLightBlue } from "@constants/Colors";
import ModalComp from "@components/ModalComp";
import { glitter } from "@constants/Images";
import { useNavigation } from "@react-navigation/native";
import { createAccountNav } from "@navigation/NavigationConstant";
import auth from "@react-native-firebase/auth";
import Toast from "react-native-simple-toast";

const Verification = (props) => {
  const navigation = useNavigation();
  const [timer, setTimer] = useState(60);
  const [otpvalue, setOtpvalue] = useState("");
  const [visible, setVisible] = useState(false);
  const [credentails, setCredentials] = useState(null);
  const verification_id = props?.route?.params.verificationCode;
  const [loading, setLoading] = useState(false);
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
        console.log("resend confirmation", confirmation);
        setVerificationCode(confirmation._verificationId);
      } catch (error) {
        console.log("error", error);
        if (error.code === "auth/network-request-failed") {
          Toast.show("Check your internet connection.", Toast.LONG);
        }
        if (error.code === "auth/invalid-verification-code") {
          Toast.show(
            "Invalid verification code,Please resend the verification code.",
            Toast.LONG
          );
        }
        if (error.code === "auth/session-expired") {
          Toast.show("Verfication code expired", Toast.LONG);
        }
        // Alert.alert(error);
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
      setLoading(true);
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
          modalVisible();
          setLoading(false);
        }
      } catch (error) {
        console.log("err", error);
        // Alert.alert(error.code);
        if (error.code === "auth/network-request-failed") {
          Toast.show("Check your internet connection.", Toast.LONG);
          setLoading(false);
        }
        if (error.code === "auth/invalid-verification-code") {
          Toast.show(
            "Invalid verification code,Please resend the verification code.",
            Toast.LONG
          );
          setLoading(false);
        }
        if (error.code === "auth/session-expired") {
          Toast.show("Verfication code expired", Toast.LONG);
          setLoading(false);
        }
      }
    }
  };
  const modalVisible = () => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
      navigation.navigate(createAccountNav, {
        mobileNumber: mobileNumber,
        credentails: credentails,
      });
    }, 3000);
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
          keyboard_type={Platform.OS === "ios" ? "number-pad" : "numeric"}
        />
      </View>
      <Text style={styles.timerdisplay}>00:{timer}</Text>

      {timer == 0 ? (
        <TouchableOpacity onPress={() => (timer == 0 ? resendotp() : null)}>
          <Text style={[styles.resendotp, { opacity: timer == 0 ? 1 : 0.5 }]}>
            Resend again?
          </Text>
        </TouchableOpacity>
      ) : (
        <Text style={[styles.resendotp, { opacity: timer == 0 ? 1 : 0.5 }]}>
          Resend again?
        </Text>
      )}
      <View style={{ marginVertical: 20, paddingTop: 30 }}>
        {loading ? (
          <ActivityIndicator color={colorLightBlue} size="large" />
        ) : (
          <ThemedButton
            title="Verify"
            onPress={() => verifyOTP()}
            color={colorLightBlue}></ThemedButton>
        )}
      </View>
      <ModalComp visible={visible}>
        <View>
          <View style={styles.glitterView}>
            <Image style={styles.glitterStar} source={glitter} />
          </View>
          <Text style={styles.header}>OTP verified successfully</Text>
        </View>
      </ModalComp>
    </View>
  );
};
export default Verification;
