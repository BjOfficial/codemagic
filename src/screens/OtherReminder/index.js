import React,{useRef,useState,useEffect} from "react";
import * as RN from "react-native";
import { white_arrow, arrow_down } from "@constants/Images";
import { colorDropText, colorLightBlue, colorWhite } from "@constants/Colors";
import style from "./styles";
import FloatingInput from "@components/FloatingInput";
import { Formik } from "formik";
import { DateOfRemainder } from "@screens/DocumentRemainder/DateOfRemainder";
import ModalDropdownComp from "@components/ModalDropdownComp";
import { font14 } from "@constants/Fonts";
import * as yup from "yup";
import APIKit from "@utils/APIKit";
import ThemedButton from "@components/ThemedButton";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { constants } from "@utils/config";
const index = (props) => {
   
    const [titleData, setTitle] = useState([]);

    const [applianceRemainder, setApplianceRemainder] = useState([]);

    const dropdownTitleref = useRef(null);

    useEffect(() => {
        listDocumentReminder();
    }, []);

    const listDocumentReminder = async () => {
        const getToken = await AsyncStorage.getItem("loginToken");
        let ApiInstance = await new APIKit().init(getToken);
          let awaitresp = await ApiInstance.get(constants.listGeneralReminder);
          if (awaitresp.status == 1) {
            setApplianceRemainder(awaitresp.data.data);
                // setTitle(
                //   awaitresp.data.data.find((appliance) => appliance._id == title)
                // );
          } 
          else {
            console.log("not listed other remainder");
          }
        }
   const setOtherReminder = (values,actions) => {
       console.log("v----------->",values)
   }
    const onSelectPromisedService = (data, setFieldValue) => {
        setFieldValue("title", applianceRemainder[data]);
        setTitle(applianceRemainder[data]);
      };
    const signupValidationSchema = yup.object().shape({
        issue_date: yup.string().required('Date is Required'),
        title_dropdown: yup
          .object()
          .nullable()
          .required("Title  is Required"),
          comments: yup
          .object()
          .nullable()
          .required("comment is Required"),
      });

  return (
    <RN.View style={{ flex: 1, backgroundColor: colorWhite }}>
      <RN.View style={style.navbar}>
        <RN.View style={style.navbarRow}>
          <RN.TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}>
            <RN.View>
              <RN.Image source={white_arrow} style={style.notificationIcon} />
            </RN.View>
          </RN.TouchableOpacity>
          <RN.View>
            <RN.Text style={style.navbarName}>{"Add Reminder"}</RN.Text>
          </RN.View>
        </RN.View>
      </RN.View>
      <Formik
            initialValues={{
              issue_date: '',
              title: '',
              comments: '',
            }}
            validationSchema={signupValidationSchema}
            onSubmit={(values, actions) => setOtherReminder(values, actions)}>
            {({ handleSubmit, values, setFieldValue, errors, handleBlur }) => (
                <RN.View>
                  <RN.View>
                    <RN.Text style={style.label}>
                     Set date & time
                    </RN.Text>
                    <DateOfRemainder
                      errors={errors}
                      values={values}
                      setFieldValue={setFieldValue}
                      handleBlur={handleBlur}
                    />
                  </RN.View>
                  <RN.View>
                    <RN.Text style={style.label}>{"Add Titile"}</RN.Text>
                    <ModalDropdownComp
                      onSelect={(data) =>
                        onSelectPromisedService(data, setFieldValue)
                      }
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
                        value={values.title && titleData && titleData.name}
                        error={values.title == "" ? errors.title_dropdown: false}
                        errorStyle={{ marginLeft: 20, marginBottom: 10 }}
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
                    </ModalDropdownComp>
                    {titleData && titleData.name === "Others" ? (
                      <FloatingInput
                        placeholder="Enter brand name"
                        value={values.otherTitle}
                        onChangeText={(data) =>
                          setFieldValue("otherTitle", data)
                        }
                        error={errors.otherTitle}
                        errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                        inputstyle={style.othersInputStyle}
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
                      />
                    ) : null}
                  </RN.View>
                <RN.Text style={style.label}>{"Comments"}</RN.Text>
                <FloatingInput
                  placeholder="Comments"
                  value={values.comments}
                  onChangeText={(data) => setFieldValue("comments", data)}
                  error={values.comments == "" ? errors.comments: false}
                  errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                  inputstyle={style.inputStyle}
                  containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                />
                  <RN.View style={{ marginVertical: 20, padding: 20 }}>
                    <ThemedButton
                      title="Add Reminder"
                      onPress={handleSubmit}
                      color={colorLightBlue}></ThemedButton>
                  </RN.View>
              </RN.View>
            )}
          </Formik>
    </RN.View>
  );
};

export default index;
