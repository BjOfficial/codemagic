import React, { useRef, useState, useEffect } from "react";
import * as RN from "react-native";
import style from "./style";
import BackArrowComp from "@components/BackArrowComp";
import FloatingInput from "@components/FloatingInput";
import { Formik } from "formik";
import ModalDropdown from "react-native-modal-dropdown";
import {
  arrow_down,
  calendar,
  add_img,
  suggestion,
  close_round,
  glitter,
} from "@constants/Images";
import { font14 } from "@constants/Fonts";
import {
  colorLightBlue,
  colorDropText,
  colorAsh,
  colorWhite,
  colorGray,
  colorBlack,
} from "@constants/Colors";
import ThemedButton from "@components/ThemedButton";
import ModalComp from "@components/ModalComp";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import APIKit from "@utils/APIKit";
import { constants } from "@utils/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "react-native-image-picker";
import * as RNFS from "react-native-fs";
import { useNavigation } from "@react-navigation/native";
import { AddReaminderNav, dashboardNav } from "@navigation/NavigationConstant";
import * as yup from "yup";

const AddDocument = () => {
  const [documentData, setDocumentData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const dropdownDocumentref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const dropdownOriginalDocumentref = useRef(null);
  const [date, setDate] = useState(new Date());
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [show, setShow] = useState(false);
  const [showExpiry, setShowExpiry] = useState(false);
  const [originalDocument, setOriginalDocument] = useState(null);
  const [document, setDocument] = useState();
  const [selectOption, setSelectOption] = useState(false);
  const [resourcePath, setResourcePath] = useState([]);
  const navigation = useNavigation();
  const formikRef = useRef();

  const onSelectDocument = (data, setFieldValue) => {
    setFieldValue("document", documentData[data]);
    setDocument(documentData[data]);
  };
  const onSelectOriginalDocument = (data, setFieldValue) => {
    setFieldValue("originalDocument", locationData[data]);
    setOriginalDocument(locationData[data]);
  };
  const AddDocumentSubmit = (values) => {
    addDocument(values);
  };
  const listDocumentLocation = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.listDocumentLocation
    );
    if (awaitlocationresp.status == 1) {
      setLocationData(awaitlocationresp.data.data);
    } else {
      console.log("not listed location type");
    }
  };
  const listDocumentType = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitresp = await ApiInstance.get(constants.listDocumentType);
    if (awaitresp.status == 1) {
      setDocumentData(awaitresp.data.data);
    } else {
      console.log("not listed document type");
    }
  };

  const addDocument = async (values) => {
    console.log("in");
    const getToken = await AsyncStorage.getItem("loginToken");
    const payload = {
      document_type: {
        id: document._id,
        other_value: values.otherDocumentType,
      },
      document_number: values.documentNumber,
      issue_date: moment(new Date(date)).format("YYYY-MM-DD"),
      expire_date: moment(new Date(expiryDate)).format("YYYY-MM-DD"),
      image: resourcePath,
      document_location: {
        id: originalDocument._id,
        other_value: values.otherDocumentLocation,
      },
    };
    try {
      let ApiInstance = await new APIKit().init(getToken);
      let awaitresp = await ApiInstance.post(constants.addDocument, payload);
      if (awaitresp.status == 1) {
        setModalVisible(true);
        if (formikRef.current) {
          formikRef.current.resetForm();
        }
      } else {
        RN.Alert.alert(awaitresp.err_msg);
      }
    } catch (error) {
      RN.Alert.alert(error);
    }
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (formikRef.current) {
        formikRef.current.resetForm();
      }
    });
    listDocumentType();
    listDocumentLocation();
    return unsubscribe;
  }, []);
  const openModal = () => {
    return (
      <ModalComp visible={visible}>
        <RN.View>
          <RN.View style={style.closeView}>
            <RN.TouchableOpacity onPress={() => closeModal()}>
              <RN.Image source={close_round} style={style.close_icon} />
            </RN.TouchableOpacity>
          </RN.View>
          <RN.View style={style.sugesstionView}>
            <RN.Image style={style.sugesstion} source={suggestion} />
          </RN.View>
          <RN.Text style={style.para}>
            We suggest that you keep all the documents in DigiLocker (from
            government of India with 100MB free storage for each citizen) so
            that the documents do not add to the size of Azzetta App. We only
            need a few data points for you to set reminders. Help us to keep
            Azzetta light by keeping all photos or documents in DigiLocker or
            your Google Drive.
          </RN.Text>
        </RN.View>
      </ModalComp>
    );
  };
  const openSucessModal = () => {
    return (
      <ModalComp visible={modalVisible}>
        <RN.View>
          <RN.View style={style.closeView}>
            <RN.TouchableOpacity onPress={() => closeSucessModal()}>
              <RN.Image source={close_round} style={style.close_icon} />
            </RN.TouchableOpacity>
          </RN.View>
          <RN.View style={style.glitterView}>
            <RN.Image style={style.glitterStar} source={glitter} />
          </RN.View>
          <RN.Text style={style.successPara}>
            Your document added successfully!
          </RN.Text>
          <RN.View style={style.box}>
            <RN.Text style={style.successHeader}>
              Would you like to add a reminder?
            </RN.Text>
            <ThemedButton
              onPress={() => {
                navigation.navigate(AddReaminderNav);
              }}
              title="Yes"
              mode={"outline"}
              color={colorLightBlue}
              buttonStyle={{
                width: RN.Dimensions.get("screen").width * 0.5,
                height: RN.Dimensions.get("screen").width * 0.1,
                alignSelf: "center",
              }}></ThemedButton>
            <RN.Text
              onPress={() => {
                navigation.navigate(navigation.navigate("bottomTab"));
              }}
              style={style.skip}>
              Skip for now
            </RN.Text>
          </RN.View>
        </RN.View>
      </ModalComp>
    );
  };

  const selectOptions = () => {
    return (
      <ModalComp visible={selectOption}>
        <RN.View>
          <RN.View style={style.closeView}>
            <RN.TouchableOpacity onPress={() => closeOptionsModal()}>
              <RN.Image source={close_round} style={style.close_icon} />
            </RN.TouchableOpacity>
          </RN.View>
          <RN.Text style={style.successPara}>Select Options</RN.Text>
          <RN.View style={style.optionsBox}>
            <RN.Text style={style.successHeader} onPress={() => selectImage()}>
              Select Image
            </RN.Text>
            <RN.Text style={style.successHeader} onPress={() => selectCamera()}>
              Open Camera
            </RN.Text>
          </RN.View>
        </RN.View>
      </ModalComp>
    );
  };
  const selectImage = () => {
    const localTime = new Date().getTime();

    var options = {
      title: "Select Image",
      customButtons: [
        {
          name: "customOptionKey",
          title: "Choose file from Custom Option",
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    ImagePicker.launchImageLibrary(options, (res) => {
      if (res.didCancel) {
        console.log("User cancelled image picker");
      } else if (res.error) {
        console.log("ImagePicker Error: ", res.error);
      } else if (res.customButton) {
        console.log("User tapped custom button: ", res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        let destinationPath =
          "/storage/emulated/0/assetta/document/" + localTime + ".jpg";
        moveAttachment(source.assets[0].uri, destinationPath);
      }
    });
  };
  const selectCamera = () => {
    const localTime = new Date().getTime();
    let options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    ImagePicker.launchCamera(options, (res) => {
      console.log("Response = ", res);
      if (res.didCancel) {
        console.log("User cancelled image picker");
      } else if (res.error) {
        console.log("ImagePicker Error: ", res.error);
      } else if (res.customButton) {
        console.log("User tapped custom button: ", res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        let destinationPath =
          `${RNFS.ExternalStorageDirectoryPath}/assetta/document` +
          localTime +
          ".jpg";
        moveAttachment(source.assets[0].uri, destinationPath);
      }
    });
  };
  const moveAttachment = async (filePath, newFilepath) => {
    var path = `${RNFS.ExternalStorageDirectoryPath}/assetta/document`;
    return new Promise((resolve, reject) => {
      RNFS.mkdir(path)
        .then(() => {
          RNFS.moveFile(filePath, newFilepath)
            .then(() => {
              console.log("FILE MOVED", filePath, newFilepath);
              setResourcePath([...resourcePath, { path: newFilepath }]);
              resolve(true);
              setSelectOption(false);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
  };
  const closeSucessModal = () => {
    setModalVisible(false);
  };
  const closeOptionsModal = () => {
    setSelectOption(false);
  };
  const closeModal = () => {
    setVisible(false);
    setSelectOption(true);
  };
  const signupValidationSchema = yup.object().shape({
    document: yup
      .object()
      .nullable()
      .required("Document location type  is Required"),
    originalDocument: yup
      .object()
      .nullable()
      .required("Document location type  is Required"),
  });
  return (
    <RN.View>
      {selectOptions()}
      {openModal()}
      {openSucessModal()}
      <RN.ScrollView showsVerticalScrollIndicator={false}>
        <RN.View style={style.navbar}>
          <RN.View style={style.navbarRow}>
            <RN.TouchableOpacity>
              <RN.View
                style={{
                  flex: 1,
                  marginTop: 16,
                  marginLeft: RN.Dimensions.get("screen").width * 0.06,
                }}>
                <BackArrowComp />
              </RN.View>
            </RN.TouchableOpacity>
            <RN.View style={{ flex: 1 }}>
              <RN.Text style={style.navbarName}>{"Add Document "}</RN.Text>
            </RN.View>
          </RN.View>
        </RN.View>
        <RN.View>
          <Formik
            validationSchema={signupValidationSchema}
            innerRef={formikRef}
            initialValues={{ document: null, originalDocument: null }}
            onSubmit={(values, actions) => AddDocumentSubmit(values, actions)}>
            {({ handleSubmit, values, setFieldValue, errors }) => (
              <RN.View>
                <RN.Text style={style.label}>{"Document type"}</RN.Text>
                <ModalDropdown
                  onSelect={(data) => onSelectDocument(data, setFieldValue)}
                  loading={true}
                  ref={dropdownDocumentref}
                  options={documentData}
                  isFullWidth
                  renderRow={(props) => (
                    <RN.Text
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        fontSize: font14,
                        color: colorBlack,
                        fontFamily: "Rubik-Regular",
                      }}>
                      {props.name}
                    </RN.Text>
                  )}
                  dropdownStyle={{
                    elevation: 8,
                    borderRadius: 8,
                    marginTop: -16,
                    width: RN.Dimensions.get("screen").width * 0.9,
                    marginLeft: RN.Dimensions.get("screen").width * 0.05,
                    height: RN.Dimensions.get("screen").height * 0.14,
                  }}
                  renderSeparator={(obj) => null}>
                  <FloatingInput
                    placeholder="select"
                    editable_text={false}
                    type="dropdown"
                    value={values.document && document.name}
                    error={errors.document}
                    inputstyle={style.inputStyle}
                    containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    dropdowncallback={() => dropdownDocumentref.current.show()}
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
                {document && document.name === "Others" ? (
                  <FloatingInput
                    placeholder="Document type"
                    value={values.otherDocumentType}
                    onChangeText={(data) =>
                      setFieldValue("otherDocumentType", data)
                    }
                    error={errors.otherDocumentType}
                    autoCapitalize={"characters"}
                    inputstyle={style.inputStyle}
                    containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                  />
                ) : null}
                <RN.Text style={style.label}>{"Document number"}</RN.Text>
                <FloatingInput
                  placeholder="ex: SJ93RNFKD0"
                  value={values.documentNumber}
                  onChangeText={(data) => setFieldValue("documentNumber", data)}
                  error={errors.documentNumber}
                  autoCapitalize={"characters"}
                  inputstyle={style.inputStyle}
                  containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                />
                <RN.View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>{"Date of Issue"}</RN.Text>

                    <FloatingInput
                      placeholder={"dd/mm/yyyy"}
                      value={moment(new Date(date)).format("DD/MM/YYYY")}
                      inputstyle={style.inputStyles}
                      onPressCalendar={() => setShow(true)}
                      type="calendar"
                      selectTextOnFocus={false}
                      editable_text={false}
                      show_keyboard={false}
                      onPress={() => setShow(true)}
                      leftIcon={
                        <RN.Image
                          source={calendar}
                          style={{
                            width: 35,
                            height: 35,
                            top: -22,
                            marginTop:
                              RN.Dimensions.get("screen").height * 0.04,
                            left: RN.Dimensions.get("screen").width * 0.06,
                            position: "absolute",
                          }}
                        />
                      }
                      containerStyle={{
                        borderBottomWidth: 0,
                        marginBottom: 0,
                      }}
                    />
                  </RN.View>
                  <RN.View>
                    {show && (
                      <DateTimePicker
                        value={date}
                        mode={"date"}
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => {
                          const currentDate = selectedDate || date;
                          setShow(RN.Platform.OS === "ios");

                          setDate(currentDate);
                          setShow(false);
                        }}
                      />
                    )}
                  </RN.View>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>{"Date of Expiry "}</RN.Text>

                    <FloatingInput
                      placeholder={"dd/mm/yyyy"}
                      value={moment(new Date(expiryDate)).format("DD/MM/YYYY")}
                      editable_text={false}
                      onPressCalendar={() => setShowExpiry(true)}
                      type="calendar"
                      inputstyle={style.inputStyles}
                      selectTextOnFocus={false}
                      leftIcon={
                        <RN.Image
                          source={calendar}
                          style={{
                            width: 35,
                            height: 35,
                            top: -22,
                            marginTop:
                              RN.Dimensions.get("screen").height * 0.04,
                            left: RN.Dimensions.get("screen").width * 0.06,
                            position: "absolute",
                          }}
                        />
                      }
                      containerStyle={{
                        borderBottomWidth: 0,
                        marginBottom: 0,
                      }}
                    />
                  </RN.View>
                  <RN.View>
                    {showExpiry && (
                      <DateTimePicker
                        value={expiryDate}
                        mode={"date"}
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedExpiryDate) => {
                          const ExpiryDate = selectedExpiryDate || expiryDate;
                          setExpiryDate(ExpiryDate);
                          setShowExpiry(false);
                        }}
                      />
                    )}
                  </RN.View>
                </RN.View>
                <RN.Text style={style.label}>{"Upload Document"}</RN.Text>
                <RN.View
                  style={{ flexDirection: "row", justifyContent: "flex-end" }}>
                  {resourcePath.map((image, index) => {
                    return (
                      <RN.View style={{ flex: 1 }} key={index}>
                        <RN.Image
                          source={{ uri: "file:///" + image.path }}
                          style={{
                            borderStyle: "dashed",
                            borderWidth: 1,
                            borderRadius: 1,
                            borderColor: colorAsh,
                            height: RN.Dimensions.get("screen").height / 6,
                            width: RN.Dimensions.get("screen").width / 4,
                            marginLeft: 20,
                            marginRight: 10,
                            paddingLeft: 5,
                          }}
                        />
                      </RN.View>
                    );
                  })}
                  <RN.View style={{ flex: 1 }}>
                    <RN.TouchableOpacity
                      onPress={() => {
                        setVisible(true);
                      }}>
                      <RN.View
                        style={{
                          borderStyle: "dashed",
                          borderWidth: 1,
                          borderColor: colorAsh,
                          height: RN.Dimensions.get("screen").height / 6,
                          width: RN.Dimensions.get("screen").width / 4,
                          marginLeft: 20,
                          marginRight: 20,
                          backgroundColor: colorWhite,
                          borderRadius: 20,
                          justifyContent: "center",
                        }}>
                        <RN.Image
                          source={add_img}
                          style={{ height: 30, width: 30, alignSelf: "center" }}
                        />
                      </RN.View>
                    </RN.TouchableOpacity>
                  </RN.View>
                </RN.View>

                <RN.Text
                  style={{
                    fontFamily: "Rubik-Regular",
                    fontSize: 13,
                    color: colorGray,
                    padding: 10,
                  }}>
                  {
                    "(All documents should be uploaded either as a PDF file or as a JPG or PNG image files. Each document should not be larger than 4MB.)"
                  }
                </RN.Text>
                <RN.Text style={style.label}>
                  {"Original document location"}
                </RN.Text>
                <ModalDropdown
                  onSelect={(data) =>
                    onSelectOriginalDocument(data, setFieldValue)
                  }
                  loading={true}
                  ref={dropdownOriginalDocumentref}
                  options={locationData}
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
                  dropdownStyle={{
                    elevation: 8,
                    borderRadius: 8,
                    marginTop: -16,
                    width: RN.Dimensions.get("screen").width * 0.9,
                    marginLeft: RN.Dimensions.get("screen").width * 0.05,
                    height: RN.Dimensions.get("screen").height * 0.15,
                  }}
                  renderSeparator={(obj) => null}>
                  <FloatingInput
                    placeholder="select"
                    editable_text={false}
                    type="dropdown"
                    value={values.originalDocument && originalDocument.name}
                    error={errors.originalDocument}
                    inputstyle={style.inputStyle}
                    containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    dropdowncallback={() =>
                      dropdownOriginalDocumentref.current.show()
                    }
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
                {originalDocument && originalDocument.name === "Others" ? (
                  <FloatingInput
                    placeholder="Other Location"
                    value={values.otherDocumentLocation}
                    onChangeText={(data) =>
                      setFieldValue("otherDocumentLocation", data)
                    }
                    error={errors.otherDocumentLocation}
                    autoCapitalize={"characters"}
                    inputstyle={style.inputStyle}
                    containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                  />
                ) : null}

                <RN.View
                  style={{ marginVertical: 20, paddingTop: 40, padding: 20 }}>
                  <ThemedButton
                    title="Add Document"
                    onPress={handleSubmit}
                    color={colorLightBlue}></ThemedButton>
                </RN.View>
              </RN.View>
            )}
          </Formik>
        </RN.View>
      </RN.ScrollView>
    </RN.View>
  );
};

export default AddDocument;
