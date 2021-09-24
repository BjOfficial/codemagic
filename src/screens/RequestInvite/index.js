import React, { useState } from "react";
import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
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
const RequestInvite = (props) => {
  const props_params = props?.route?.params?.params;
  const navigation = useNavigation();
  const [errorMessage, setErrorMsg] = useState("");
  const [visible, setVisible] = useState(false);
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
        constants.checkInviteExist + "?phone_number=" + values.phonenumber
      );
      if (awaitresp.status == 1) {
        navigation.navigate(verificationNav, {
          mobileNumber: values.phonenumber,
          status: "Already_Invite",
        });
      } else {
        setVisible(true);
      }
    } else {
      let ApiInstance = await new APIKit().init();
      let awaitresp = await ApiInstance.get(
        constants.requestInvite + "?phone_number=" + values.phonenumber
      );
      if (awaitresp.status == 1) {
        navigation.navigate(verificationNav, {
          mobileNumber: values.phonenumber,
        });
      } else {
        setErrorMsg(awaitresp.err_msg);
        setTimeout(() => {
          setErrorMsg("");
        }, 5000);
      }
    }
  };
  const closeModal = () => {
    setVisible(false);
    navigation.navigate(landingPageNav);
  };
  return (
    <View style={styles.container}>
      <ScrollView>
        <BackArrowComp />
        <Text style={styles.headerText}>Request An Invite</Text>
        <Text style={styles.Invitepara}>
          Enter your mobile number below. We will let you know when you have an
          invite.
        </Text>
        <Formik
          validationSchema={signupValidationSchema}
          initialValues={{ phonenumber: "" }}
          onSubmit={(values, actions) => RequestSubmit(values, actions)}>
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
            errors,
          }) => (
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
                // prefixCall={() => alert('')}
              />
              <Text style={styles.errorMsg}>{errorMessage}</Text>
              <View style={{ marginVertical: 20, paddingTop: 30 }}>
                <ThemedButton
                  title="Submit"
                  onPress={handleSubmit}
                  color={colorLightBlue}></ThemedButton>
              </View>
            </View>
          )}
        </Formik>

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
            <Text style={styles.header}>
              You have no invites, Please Register for an Invite
            </Text>
          </View>
        </ModalComp>
      </ScrollView>
    </View>
  );
};
export default RequestInvite;
