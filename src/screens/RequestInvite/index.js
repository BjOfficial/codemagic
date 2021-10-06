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
import Toast from "react-native-simple-toast";
const RequestInvite = (props) => {
  const props_params = props?.route?.params?.params;
  const navigation = useNavigation();
  const [errorMessage, setErrorMsg] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [responseErrMsg, setResponseErrMsg] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const phoneNumber = RegExp(/^[0-9]{10}$/);
  const signupValidationSchema = yup.object().shape({
    phonenumber: yup
      .string()
      .required("Mobile number is required")
      .matches(phoneNumber, "Invalid Mobile Number"),
  });

  const RequestSubmit = async (values) => {
    if (props_params == "Already_Invite") {
      let ApiInstance = await new APIKit().init();
      let awaitresp = await ApiInstance.get(
        constants.checkMobileExist + "?phone_number=" + values.phonenumber
      );
      console.log("check mobile exist", awaitresp);

      if (awaitresp.status == 1) {
        checkInviteExists(values.phonenumber);
      } else {
        setVisible(true);
        setResponseErrMsg(awaitresp.err_msg);
      }
    } else {
      let ApiInstance = await new APIKit().init();
      const payload = { phone_number: values.phonenumber };
      let awaitresp = await ApiInstance.post(constants.requestInvite, payload);
      console.log("request invite error", awaitresp);
      if (awaitresp.status == 1) {
        setButtonDisabled(true);
        setModalVisible(true);
        setErrorMsg(
          "Your request has been registered!,we will update you when you have an invite."
        );
      } else {
        setButtonDisabled(false);
        setModalVisible(true);
        setErrorMsg(awaitresp.err_msg);
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
        const confirmation = await auth().signInWithPhoneNumber(`+91 ${data}`);
        if (confirmation) {
          setLoading(false);
          let { _verificationId } = confirmation;
          navigation.navigate(verificationNav, {
            mobileNumber: data,
            verificationCode: _verificationId,
          });
        }
      } catch (error) {
        console.log("error", error);
        setLoading(false);
        // Alert.alert(error.code);
        if (error.code === "auth/too-many-requests") {
          Toast.show(
            "We have blocked all requests from this device due to unusual activity. Try again later",
            Toast.LONG
          );
        }
      }
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
          {props_params === "Already_Invite"
            ? "Enter your mobile number to check if you already have an invite"
            : "Enter your mobile number below. We will let you know when you have an invite"}
        </Text>
        <Formik
          validationSchema={signupValidationSchema}
          initialValues={{ phonenumber: "" }}
          onSubmit={(values) => RequestSubmit(values)}>
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
              <View style={{ marginVertical: 20, paddingTop: 30 }}>
                <ThemedButton
                  title="Submit"
                  onPress={handleSubmit}
                  disabled={buttonDisabled ? true : false}
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
          </View>
        </ModalComp>
      </ScrollView>
    </View>
  );
};
export default RequestInvite;
