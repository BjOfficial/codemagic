import React, { useState } from "react";
import { Text, View, ScrollView } from "react-native";
import BackArrowComp from "@components/BackArrowComp";
import styles from "./styles";
import FloatingInput from "@components/FloatingInput";
import ThemedButton from "@components/ThemedButton";
import { colorLightBlue } from "@constants/Colors";
import { Formik } from "formik";
import firebase from "@react-native-firebase/app";
import * as yup from "yup";
import NetInfo from "@react-native-community/netinfo";
import SimpleToast from "react-native-simple-toast";

const ForgotPassword = () => {
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [disabled, setDisabled] = useState(false);
  const signupValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email("Please enter valid email")
      .required("Email Address is required"),
  });

  const ResendSubmit = (values) => {
    NetInfo.fetch().then((state) => {
      if (state.isConnected == true) {
        firebase
          .auth()
          .sendPasswordResetEmail(values.email)
          .then(
            () => {
              setDisabled(true);
              setErrorMsg("");
              setSuccessMsg(
                "Successfully sent the link to your Registered Email"
              );
            },
            (err) => {
              const msg =
                err.message || "Something went wrong. Try again later";
              console.log(msg);
              setErrorMsg("This Email address is not registered with us");
              setSuccessMsg("");
            }
          )
          .catch((err) => {
            const msg = err.message || "Something went wrong. Try again later";
            setErrorMsg(msg);
            setSuccessMsg("");
          });
      } else {
        SimpleToast.show("This is a long toast.", SimpleToast.LONG);
      }
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <BackArrowComp />
        <Text style={styles.headerText}>Reset Password</Text>
        <Text style={styles.Invitepara}>
          Enter email, We will send a link to your registered email.
        </Text>
        <Formik
          validationSchema={signupValidationSchema}
          initialValues={{ email: "" }}
          onSubmit={(values, actions) => ResendSubmit(values, actions)}>
          {({ handleSubmit, values, setFieldValue, errors }) => (
            <View>
              <FloatingInput
                placeholder_text="Email"
                value={values.email}
                onChangeText={(data) => setFieldValue("email", data)}
                error={errors.email}
              />
              <View>
                <Text style={styles.successMsg}>{successMsg}</Text>
              </View>
              <View>
                <Text style={styles.errMsg}>{errorMsg}</Text>
              </View>
              <View style={{ marginVertical: 20, paddingTop: 30 }}>
                <ThemedButton
                  title="Send Reset Link"
                  onPress={handleSubmit}
                  color={colorLightBlue}
                  disabled={disabled}
                  buttonStyle={{
                    marginBottom: 50,
                    width: "100%",
                    padding: 5,
                    backgroundColor: disabled ? "#CCC" : colorLightBlue,
                  }}></ThemedButton>
              </View>
            </View>
          )}
        </Formik>
      </ScrollView>
    </View>
  );
};
export default ForgotPassword;
