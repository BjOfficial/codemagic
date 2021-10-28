import React, { useRef, useState, useEffect } from "react";
import * as RN from "react-native";
import style from "./style";
import HomeHeader from "@components/HomeHeader";
import FloatingInput from "@components/FloatingInput";
import { Formik } from "formik";
import ModalDropdown from "react-native-modal-dropdown";
import {
  arrow_down,
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
import moment from "moment";
import APIKit from "@utils/APIKit";
import { constants } from "@utils/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "react-native-image-picker";
import * as RNFS from "react-native-fs";
import { useNavigation } from "@react-navigation/native";
import { DateOfPurchase } from "./DateOfPurchase";
import { DateOfExpiry } from "./DateOfExpiry";
import * as yup from "yup";
import { ButtonHighLight } from "@components/debounce";

const AddDocument = (props) => {
  let reminder_data = [
    "You can set up fully customizable reminders for dates (1 week / 1 month or any period in advance of the end date) for end of warranty, AMC, Extended Warranty, Maintenance Service due dates for all your appliances and gadgets so that you can raise issues within the due dates. ",

    "Similarly, you can set up renewal dates for your Passport, Driving License, etc., and payment due dates of your EMI or ECS mandate, etc. Further, these alerts will get populated in your native calendar in your cell phone.",

    "\u{2B24}   You can set your own customizable and mul",
    "\u{2B24}   Important dates for end of warranty, AMC, Extended Warranty, Regular Service ",
    "\u{2B24}   Renewal related - Passport, Driving License for self and family, etc.,",
    "\u{2B24}  Payment due dates - EMI, Loan, ECS, Home mortgage, Insurance premium  etc",
    "\u{2B24}   Any important dates in your life",
  ];
  const [documentData, setDocumentData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const dropdownDocumentref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const dropdownOriginalDocumentref = useRef(null);
  const [show, setShow] = useState(false);
  const [response, setResponse] = useState();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [showExpiry, setShowExpiry] = useState(false);
  const [originalDocument, setOriginalDocument] = useState(null);
  const [document, setDocument] = useState();
  const [resourcePath, setResourcePath] = useState([]);
  const [initial, setInitial] = useState(0);
  const navigation = useNavigation();
  const formikRef = useRef();
  const localTime = new Date().getTime();
  const platfromOs =
    RN.Platform.OS === "ios"
      ? `${RNFS.DocumentDirectoryPath}/.azzetta/document`
      : `${RNFS.ExternalStorageDirectoryPath}/.azzetta/document`;
  const destinationPath = platfromOs + localTime + ".jpg";
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

  const removePhoto = (url) => {
    let result = resourcePath.filter((item, index) => item != url);
    setResourcePath(result);
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
      issue_date: moment(new Date(values.issue_date)).format("YYYY-MM-DD"),
      expire_date: moment(new Date(values.expire_date)).format("YYYY-MM-DD"),
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
        setResponse(awaitresp.data.data._id);
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
        setResourcePath([]);
        setInitial(0);
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
            <RN.TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                navigation.navigate("bottomTab");
              }}>
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
                setModalVisible(false);
                navigation.navigate("DocumentRemainder", {
                  document_ids: response,
                });
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
                setModalVisible(false);
                navigation.navigate("bottomTab");
              }}
              style={style.skip}>
              Skip for now
            </RN.Text>
          </RN.View>
        </RN.View>
      </ModalComp>
    );
  };

  const requestPermission = async () => {
    try {
      const granted = await RN.PermissionsAndroid.request(
        RN.PermissionsAndroid.PERMISSIONS.CAMERA,
        {
          title: "Permission",
          message:
            "App needs access to your camera and storage " +
            "so you can take photos and store.",
          // buttonNeutral: "Ask Me Later",
          //  buttonNegative: 'Cancel',
          buttonPositive: "OK",
        }
      );
      const grantedWriteStorage = await RN.PermissionsAndroid.request(
        RN.PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      );
      const grantedReadStorage = await RN.PermissionsAndroid.request(
        RN.PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      if (
        granted &&
        grantedWriteStorage &&
        grantedReadStorage === RN.PermissionsAndroid.RESULTS.GRANTED
      ) {
        setCameraVisible(true);
        console.log("You can use the storage");
      }
      if (
        granted &&
        grantedWriteStorage &&
        grantedReadStorage === RN.PermissionsAndroid.RESULTS.DENIED
      ) {
        RN.Alert.alert(
          "Please allow Camera and Storage permissions in application settings to upload an image"
        );
        console.log("denied");
      } else {
        console.log("error");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const selectOptions = () => {
    return (
      <ModalComp visible={cameraVisible}>
        <RN.View>
          <RN.View style={style.closeView}>
            <RN.TouchableOpacity onPress={() => closeOptionsModal()}>
              <RN.Image source={close_round} style={style.close_icon} />
            </RN.TouchableOpacity>
          </RN.View>
          <RN.Text style={style.successPara}>Select Options</RN.Text>
          <RN.View style={style.optionsBox}>
            <ButtonHighLight onPress={() => selectImage()}>
              <RN.Text style={style.successHeader}>Select Image</RN.Text>
            </ButtonHighLight>
            <ButtonHighLight
              onPress={() => {
                selectCamera();
              }}>
              <RN.Text style={style.successHeader}>Open Camera</RN.Text>
            </ButtonHighLight>
          </RN.View>
        </RN.View>
      </ModalComp>
    );
  };

  const selectImage = () => {
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
        moveAttachment(source.assets[0].uri, destinationPath);
      }
    });
  };

  const selectCamera = () => {
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
        moveAttachment(source.assets[0].uri, destinationPath);
      }
    });
  };
  const moveAttachment = async (filePath, newFilepath) => {
    var path = platfromOs;
    return new Promise((resolve, reject) => {
      RNFS.mkdir(path)
        .then(() => {
          RNFS.moveFile(filePath, newFilepath)
            .then((res) => {
              console.log("FILE MOVED", filePath, newFilepath);
              setResourcePath([...resourcePath, { path: newFilepath }]);
              resolve(true);
              closeOptionsModal();
            })
            .catch((error) => {
              console.log("moveFile error", error);
              reject(error);
            });
        })
        .catch((err) => {
          console.log("mkdir error", err);
          reject(err);
        });
    });
  };
  const closeOptionsModal = () => {
    setCameraVisible(false);
  };

  const closeModal = () => {
    setVisible(false);
    requestPermission();
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
    issue_date: yup.string().required("Date is Required"),
    expire_date: yup.string().required("Date is Required"),
  });
  return (
    <RN.View style={{ backgroundColor: colorWhite }}>
      {selectOptions()}
      {openModal()}
      {openSucessModal()}
      <RN.ScrollView showsVerticalScrollIndicator={false}>
        <HomeHeader title="Add Documents" />
        <RN.View>
          <Formik
            validationSchema={signupValidationSchema}
            innerRef={formikRef}
            initialValues={{
              document: null,
              originalDocument: null,
              issue_date: "",
              expire_date: "",
            }}
            onSubmit={(values, actions) => AddDocumentSubmit(values, actions)}>
            {({ handleSubmit, values, setFieldValue, errors, handleBlur }) => (
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
                    errorStyle={{ marginLeft: 20, marginBottom: 10 }}
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
                    errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                    autoCapitalize={"none"}
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
                  errorStyle={{ marginLeft: 20, backgroundColor: "green" }}
                  autoCapitalize={"none"}
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
                    <DateOfPurchase
                      errors={errors}
                      values={values}
                      setFieldValue={setFieldValue}
                      handleBlur={handleBlur}
                    />
                  </RN.View>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>{"Date of Expiry "}</RN.Text>
                    <DateOfExpiry
                      errors={errors}
                      values={values}
                      setFieldValue={setFieldValue}
                      handleBlur={handleBlur}
                    />
                  </RN.View>
                </RN.View>
                <RN.Text style={style.label}>{"Upload Document"}</RN.Text>
                <RN.ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  <RN.View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-end",
                    }}>
                    {resourcePath.map((image, index) => {
                      return (
                        <>
                          <RN.View style={{ flex: 1 }} key={index}>
                            <RN.Image
                              source={{ uri: "file:///" + image.path }}
                              style={{
                                borderStyle: "dashed",
                                borderWidth: 1,
                                borderColor: colorAsh,
                                height: RN.Dimensions.get("screen").height / 6,
                                width: RN.Dimensions.get("screen").width / 4,
                                marginLeft: 20,
                                marginRight: 10,
                                borderRadius: 20,
                                paddingLeft: 5,
                              }}
                            />
                            <RN.View
                              style={{
                                position: "absolute",
                                top: 0,
                                right: 0,
                              }}>
                              <RN.TouchableOpacity
                                onPress={() => {
                                  RNFS.unlink("file:///" + image.path)
                                    .then(() => {
                                      removePhoto(image);
                                    })
                                    .catch((err) => {
                                      console.log(err.message);
                                    });
                                }}>
                                <RN.Image
                                  source={require("../../assets/images/add_asset/close.png")}
                                  style={{ height: 20, width: 20 }}
                                />
                              </RN.TouchableOpacity>
                            </RN.View>
                          </RN.View>
                        </>
                      );
                    })}
                    <RN.View style={{ flex: 1 }}>
                      <RN.TouchableOpacity
                        onPress={() => {
                          if (initial == 0) {
                            setInitial(initial + 1);
                            setVisible(true);
                          } else {
                            closeModal();
                          }
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
                            style={{
                              height: 30,
                              width: 30,
                              alignSelf: "center",
                            }}
                          />
                        </RN.View>
                      </RN.TouchableOpacity>
                    </RN.View>
                  </RN.View>
                </RN.ScrollView>
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
                    errorStyle={{ marginLeft: 20, marginBottom: 10 }}
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
                    errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                    autoCapitalize={"none"}
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
