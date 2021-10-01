import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import BackArrowComp from "@components/BackArrowComp";
import styles from "./styles";
import FloatingInput from "@components/FloatingInput";
import ThemedButton from "@components/ThemedButton";
import { colorLightBlue } from "@constants/Colors";
import { close_round, glitter } from "@constants/Images";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigation } from "@react-navigation/native";
import {
  verificationNav,
  landingPageNav,
} from "@navigation/NavigationConstant";
import APIKit from "@utils/APIKit";
import { constants } from "@utils/config";
import ModalComp from "@components/ModalComp";
import auth from "@react-native-firebase/auth";
const RequestInvite = (props) => {
  const props_params = props?.route?.params?.params;
  const navigation = useNavigation();
  const [errorMessage, setErrorMsg] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [responseErrMsg, setResponseErrMsg] = useState(null);
  const phoneNumber = RegExp(/^[0-9]{10}$/);
  const signupValidationSchema = yup.object().shape({
    phonenumber: yup
      .string()
      .required("Mobile number is required")
      .matches(phoneNumber, "Invalid Mobile Number"),
  });

  const RequestSubmit = async (values, resetForm) => {
    if (props_params == "Already_Invite") {
      let ApiInstance = await new APIKit().init();
      let awaitresp = await ApiInstance.get(
        constants.checkMobileExist + "?phone_number=" + values.phonenumber
      );
      console.log("check mobile exist", awaitresp);

      if (awaitresp.status == 1) {
        checkInviteExists(values.phonenumber);
        // if(awaitresp.data.is_user==false && awaitresp.data.is_signup_completed==false){
        // 	checkInviteExists(values.phonenumber);
        // }else if(awaitresp.data.is_user==true && awaitresp.data.is_signup_completed==false){
        // 	let uid=awaitresp.data.data.uid
        // 	checkInviteExists(values.phonenumber,uid);
        // }
        //   navigation.navigate(verificationNav,{mobileNumber:values.phonenumber,status:"Already_Invite"})
      } else {
        setVisible(true);
        setResponseErrMsg(awaitresp.err_msg);
      }
    } else {
      let ApiInstance = await new APIKit().init();
      const payload = { phone_number: values.phonenumber };
      let awaitresp = await ApiInstance.post(constants.requestInvite, payload);
      if (awaitresp.status == 1) {
        setModalVisible(true);
        setErrorMsg(
          "Your request has been registered!,we will update you when you have an invite."
        );
        // navigation.navigate(verificationNav,{mobileNumber:values.phonenumber})
      } else {
        setModalVisible(true);
        setErrorMsg(awaitresp.err_msg);
        // setTimeout(() => {
        // 	setErrorMsg(null);
        // }, 5000);
      }
    }
  };
  const checkInviteExists = async (data) => {
    let ApiInstance = await new APIKit().init();
    let awaitresp = await ApiInstance.get(
      constants.checkInviteExist + "?phone_number=" + data
    );
    console.log("ceck invite", awaitresp);
    if (awaitresp.status == 1) {
      setLoading(true);
      try {
        // console.log('phone number auth',`+91 ${values.phonenumber}`);
        // return;
        const confirmation = await auth().signInWithPhoneNumber(`+91 ${data}`);
        if (confirmation) {
          setLoading(false);
          let { _verificationId } = confirmation;
          // console.log("verification code:",confirmation._verificationId);
          navigation.navigate(verificationNav, {
            mobileNumber: data,
            verificationCode: _verificationId,
          });
          // console.log("phoneauthprovider",auth.PhoneAuthProvider.credential());
        }
      } catch (error) {
        console.log("error", error);
        Alert.alert(error.code);
        // Alert.alert(error);
      }

      //   navigation.navigate(verificationNav,{mobileNumber:values.phonenumber,status:"Already_Invite"})
    } else {
      setVisible(true);
      setResponseErrMsg(awaitresp.err_msg);
    }
  };
  const closeModal = () => {
    setVisible(false);
    navigation.navigate(landingPageNav);
  };
  const closeModelClick = () => {
    setModalVisible(false);
    navigation.navigate(landingPageNav);
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <BackArrowComp />

        <Text style={styles.headerText}>
          {props_params === "Already_Invite"
            ? "Already have an invite"
            : "Request An Invite"}
        </Text>
        <Text style={styles.Invitepara}>
          {/* Enter your mobile number below. We will let you know when you have an
          invite. */}
          {props_params === "Already_Invite"
            ? "Enter your mobile number to check if you already have an invite"
            : "Enter your mobile number below. We will let you know when you have an invite"}
        </Text>
        <Formik
          validationSchema={signupValidationSchema}
          initialValues={{ phonenumber: "" }}
          onSubmit={(values, actions) => RequestSubmit(values, actions)}>
          {({ handleSubmit, values, setFieldValue, errors }) => (
            <View>
              <FloatingInput
                placeholder_text="Mobile Number"
                value={values.phonenumber}
                onChangeText={(data) => setFieldValue("phonenumber", data)}
                error={errors.phonenumber}
                focus={true}
                prefix="+91"
                keyboardType={
                  Platform.OS == "android" ? "numeric" : "number-pad"
                }
              />
              {/* <Text style={styles.errorMsg}>{errorMessage}</Text> */}
              <View style={{ marginVertical: 20, paddingTop: 30 }}>
                <ThemedButton
                  title="Submit"
                  onPress={handleSubmit}
                  color={colorLightBlue}></ThemedButton>
              </View>
            </View>
          )}
        </Formik>
        {loading && (
          <View style={styles.loadingcenter}>
            <ActivityIndicator color={colorLightBlue} size="large" />
          </View>
        )}
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
            {responseErrMsg && (
              <View>
                <Text style={styles.header}>{responseErrMsg}</Text>
              </View>
            )}
          </View>
        </ModalComp>
        <ModalComp visible={modalVisible}>
          <View>
            <View style={styles.closeView}>
              <TouchableOpacity onPress={() => closeModelClick()}>
                <Image source={close_round} style={styles.close_icon} />
              </TouchableOpacity>
            </View>
            <View style={styles.glitterView}>
              <Image style={styles.glitterStar} source={glitter} />
            </View>
            {errorMessage && (
              <View>
                <Text style={styles.header}>{errorMessage}</Text>
              </View>
            )}
            {/* <Text style={styles.header}>Your request has been registered!</Text>
						<Text style={styles.para}>
              We will update you when you have an invite
						</Text> */}
          </View>
        </ModalComp>
      </ScrollView>
    </View>
  );
};
export default RequestInvite;
