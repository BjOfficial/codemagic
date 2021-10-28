import HomeHeader from "@components/HomeHeader";
import { colorDropText, colorLightBlue, colorWhite } from "@constants/Colors";
import React, { useEffect } from "react";
import * as RN from "react-native";
import { Formik } from "formik";
import ModalDropdown from "react-native-modal-dropdown";
import FloatingInput from "@components/FloatingInput";
import { arrow_down } from "@constants/Images";
import { font12, font14 } from "@constants/Fonts";
import { useState } from "react";
import { useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIKit from "@utils/APIKit";
import { constants } from "@utils/config";
import { DateOfRemainder } from "./DateOfRemainder";
import ThemedButton from "@components/ThemedButton";
import { useNavigation } from "@react-navigation/native";
const DocumentRemainder = (props) => {
  const navigation = useNavigation();
  const formikRef = useRef();
  const documentId = props?.route?.params?.document_ids;
  const dropdownTitleref = useRef(null);
  const [applianceRemainder, setApplianceRemainder] = useState([]);
  const [titleData, setTitle] = useState([]);
  const onSelectPromisedService = (data, setFieldValue) => {
    setFieldValue("title", applianceRemainder[data]);
    setTitle(applianceRemainder[data]);
  };
  const listDocumentReminder = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitresp = await ApiInstance.get(constants.listDocumentReminder);
    if (awaitresp.status == 1) {
      setApplianceRemainder(awaitresp.data.data);
    } else {
      console.log("not listed appliance remainder");
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (formikRef.current) {
        formikRef.current.resetForm();
        listDocumentReminder();
      }
    });
    return unsubscribe;
  }, []);
  const sendRemainder = async (values, actions) => {
    console.log(documentId);
    const getToken = await AsyncStorage.getItem("loginToken");
    const payload = {
      document_id: documentId,
      reminder: {
        date: values.issue_date,
        title: {
          id: values.title._id,
          other_value: values.title.name,
        },
        comments: values.comments,
      },
    };
    console.log("payload", payload);
    let ApiInstance = await new APIKit().init(getToken);
    let awaitresp = await ApiInstance.post(
      constants.updateDocumentExtra,
      payload
    );
    if (awaitresp.status == 1) {
      navigation.navigate("bottomTab");
    } else {
      console.log(awaitresp);
      RN.Alert.alert(awaitresp.err_msg);
    }
  };
  useEffect(() => {
    listDocumentReminder();
  }, []);
  return (
    <RN.View style={{ backgroundColor: colorWhite }}>
      <RN.ScrollView showsVerticalScrollIndicator={false}>
        <HomeHeader title="Add Reminder" />
        <Formik
          initialValues={{ issue_date: "" }}
          onSubmit={(values, actions) => sendRemainder(values, actions)}>
          {({ handleSubmit, values, setFieldValue, errors, handleBlur }) => (
            <RN.View>
              <RN.View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}>
                <RN.View style={{ flex: 1 }}>
                  <RN.Text style={style.label}>{"Set Remainder"}</RN.Text>
                  <DateOfRemainder
                    errors={errors}
                    values={values}
                    setFieldValue={setFieldValue}
                    handleBlur={handleBlur}
                  />
                </RN.View>
                <RN.View style={{ flex: 1 }}>
                  <RN.Text style={style.label}>{"Add Titile"}</RN.Text>
                  <ModalDropdown
                    onSelect={(data) =>
                      onSelectPromisedService(data, setFieldValue)
                    }
                    loading={true}
                    ref={dropdownTitleref}
                    options={applianceRemainder}
                    isFullWidth
                    renderRow={(props) => (
                      <RN.Text
                        style={{
                          paddingVertical: 8,
                          paddingHorizontal: 15,
                          fontSize: font14,
                          color: colorDropText,
                          fontFamily: "Rubik-Regular",
                        }}>
                        {props.name}
                      </RN.Text>
                    )}
                    dropdownStyle={{ elevation: 8, borderRadius: 8 }}
                    renderSeparator={(obj) => null}>
                    <FloatingInput
                      placeholder="select"
                      editable_text={false}
                      type="dropdown"
                      value={values.title && titleData.name}
                      error={errors.title}
                      inputstyle={style.inputStyle}
                      containerStyle={{
                        borderBottomWidth: 0,
                        marginBottom: 0,
                      }}
                      dropdowncallback={() => dropdownTitleref.current.show()}
                      rightIcon={
                        <RN.Image
                          source={arrow_down}
                          style={{
                            width: 12,
                            position: "absolute",
                            height: 8.3,
                            right: RN.Dimensions.get("screen").width * 0.11,
                            top: 23,
                          }}
                        />
                      }
                    />
                  </ModalDropdown>
                </RN.View>
              </RN.View>
              <RN.Text style={style.label}>{"Comments"}</RN.Text>
              <FloatingInput
                placeholder="Comments"
                value={values.comments}
                onChangeText={(data) => setFieldValue("comments", data)}
                error={errors.comments}
                errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                inputstyle={style.inputStyle}
                containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
              />
              <RN.Text
                onPress={() => {
                  navigation.navigate("bottomTab");
                }}
                style={style.skip}>
                Skip for now
              </RN.Text>
              <RN.View style={{ marginVertical: 20, padding: 20 }}>
                <ThemedButton
                  title="Finish"
                  onPress={handleSubmit}
                  color={colorLightBlue}></ThemedButton>
              </RN.View>
            </RN.View>
          )}
        </Formik>
      </RN.ScrollView>
    </RN.View>
  );
};

const style = RN.StyleSheet.create({
  label: {
    fontFamily: "Rubik-Regular",
    fontSize: 12,
    margin: 15,
  },
  inputStyle: {
    alignSelf: "center",
    height: RN.Dimensions.get("screen").height * 0.07,
    borderWidth: 0.5,
    borderRadius: 30,
    marginLeft: RN.Dimensions.get("screen").width * 0.03,
    paddingLeft: 20,
  },
  skip: {
    fontFamily: "Rubik-Regular",
    fontSize: font12,
    color: colorDropText,
    textAlign: "center",
    marginTop: RN.Dimensions.get("screen").height * 0.25,
    textDecorationLine: "underline",
    paddingVertical: 15,
  },
});
export default DocumentRemainder;
