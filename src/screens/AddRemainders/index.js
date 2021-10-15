import React, { useRef, useState } from "react";
import * as RN from "react-native";
import style from "./style";
import FloatingInput from "@components/FloatingInput";
import { Formik } from "formik";
import ModalDropdown from "react-native-modal-dropdown";
import {
  arrow_down,
  calendar,
  add_img,
  close_round,
  rupee,
} from "@constants/Images";
import * as ImagePicker from "react-native-image-picker";
import * as RNFS from "react-native-fs";
import { font14 } from "@constants/Fonts";
import {
  colorLightBlue,
  colorDropText,
  colorAsh,
  colorWhite,
} from "@constants/Colors";
import ThemedButton from "@components/ThemedButton";
import ModalComp from "@components/ModalComp";
import RadioForm from "react-native-simple-radio-button";
import HomeHeader from "@components/HomeHeader";

const AddRemainders = () => {
  const dropdownServiceDataref = useRef(null);
  const service_data = [
    { value: 1, label: "1" },
    { value: 2, label: "2" },
    { value: 3, label: "3" },
    { value: 3, label: "4" },
    { value: 3, label: "5" },
  ];
  const [radioProps] = useState([
    { label: "Yes", value: 0 },
    { label: "No", value: 1 },
  ]);
  const [titleData] = useState([
    {
      value: 1,
      name: "Warranty Ending",
    },
    {
      value: 2,
      name: "Service Due",
    },
  ]);
  const dropdownModelref = useRef(null);
  const [title, setTitle] = useState(null);
  const [serviceData, setServiceData] = useState(null);
  const [radio, setRadio] = useState(0);
  const [resourcePath, setResourcePath] = useState([]);
  const [cameraVisible, setCameraVisible] = useState(false);
  const localTime = new Date().getTime();
  const platfromOs =
    RN.Platform.OS === "ios"
      ? `${RNFS.DocumentDirectoryPath}/assetta/document`
      : `${RNFS.ExternalStorageDirectoryPath}/assetta/document`;
  const destinationPath = platfromOs + localTime + ".jpg";
  const onSelectPromisedService = (data, setFieldValue) => {
    // alert(data)
    setFieldValue("service", service_data[data]);
    setServiceData(service_data[data]);
    console.log(serviceData);
  };
  const onSelectModelName = (data, setFieldValue) => {
    setFieldValue("title", titleData[data]);
    setTitle(titleData[data]);
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
            <RN.Text style={style.successHeader} onPress={() => selectImage()}>
              Select Image
            </RN.Text>
            <RN.TouchableOpacity
              onPress={() => {
                selectCamera();
              }}>
              <RN.Text style={style.successHeader}>Open Camera</RN.Text>
            </RN.TouchableOpacity>
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

  const AddDocumentSubmit = (values) => console.log("values", values);

  return (
    <RN.View style={{ backgroundColor: colorWhite }}>
      {selectOptions()}
      <RN.ScrollView showsVerticalScrollIndicator={false}>
        <HomeHeader title="Maintenance & Reminder" />
        <RN.View>
          <Formik
            initialValues={{
              documentNumber: "",
              document: null,
              serviceData: null,
            }}
            onSubmit={(values, actions) => AddDocumentSubmit(values, actions)}>
            {({ handleSubmit, values, setFieldValue, errors }) => (
              <RN.View>
                <RN.Text style={style.label}>
                  {"Free service availability"}
                </RN.Text>
                <RadioForm
                  radio_props={radioProps}
                  initial={0}
                  value={radio}
                  formHorizontal={true}
                  style={{ marginLeft: 20 }}
                  onPress={(value) => {
                    setRadio({ value: value });
                  }}
                />
                <RN.Text style={style.label}>
                  {"How many free services promised?"}
                </RN.Text>
                <RN.View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <ModalDropdown
                      onSelect={(data) =>
                        onSelectPromisedService(data, setFieldValue)
                      }
                      loading={true}
                      ref={dropdownServiceDataref}
                      options={service_data}
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
                          {props.label}
                        </RN.Text>
                      )}
                      dropdownStyle={{ elevation: 8, borderRadius: 8 }}>
                      <FloatingInput
                        placeholder="select"
                        editable_text={false}
                        type="dropdown"
                        value={values.serviceData && serviceData.label}
                        error={errors.serviceData}
                        inputstyle={style.inputStyle}
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
                        dropdowncallback={() =>
                          dropdownServiceDataref.current.show()
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
                  </RN.View>
                  <RN.View style={{ flex: 1 }}>
                    <FloatingInput
                      placeholder="How many services are over?"
                      containerStyle={{
                        width: RN.Dimensions.get("screen").width * 0.5,
                      }}
                    />
                  </RN.View>
                </RN.View>
                <RN.Text style={style.label}>
                  {"Previous maintenance details"}
                </RN.Text>
                <RN.View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <FloatingInput
                      placeholder={"dd/mm/yyyy"}
                      inputstyle={style.inputStyles}
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
                      containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    />
                  </RN.View>
                  <RN.View style={{ flex: 1 }}>
                    <FloatingInput
                      placeholder={"Labour cost"}
                      inputstyle={style.inputStyles}
                      leftIcon={
                        <RN.Image
                          source={rupee}
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
                      containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    />
                  </RN.View>
                </RN.View>
                <RN.View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <FloatingInput
                      placeholder="Spare part name"
                      inputstyle={style.inputStyle}
                      containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    />
                  </RN.View>
                  <RN.View style={{ flex: 1 }}>
                    <FloatingInput
                      placeholder={"Spare cost"}
                      inputstyle={style.inputStyles}
                      leftIcon={
                        <RN.Image
                          source={rupee}
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
                      containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    />
                  </RN.View>
                </RN.View>
                <FloatingInput
                  placeholder="Remarks"
                  containerStyle={{
                    width: RN.Dimensions.get("screen").width * 0.9,
                    marginBottom: 0,
                    alignSelf: "center",
                    marginTop: -15,
                  }}
                />
                <RN.Text
                  style={{
                    marginTop: -12,
                    fontSize: 13,
                    color: colorAsh,
                    marginLeft: 25,
                    textDecorationLine: "underline",
                  }}>
                  {"Add Another"}
                </RN.Text>

                <RN.Text style={style.label}>{"Upload invoice"}</RN.Text>
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
                        </RN.View>
                      );
                    })}
                    <RN.View style={{ flex: 1 }}>
                      <RN.TouchableOpacity
                        onPress={() => {
                          requestPermission();
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

                <RN.View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>{"Set remainder"}</RN.Text>
                    <FloatingInput
                      placeholder={"dd/mm/yyyy"}
                      inputstyle={style.inputStyles}
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
                      containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    />
                  </RN.View>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>{"Add Title"}</RN.Text>
                    <ModalDropdown
                      onSelect={(data) =>
                        onSelectModelName(data, setFieldValue)
                      }
                      loading={true}
                      ref={dropdownModelref}
                      options={titleData}
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
                        value={values.modelName && title.name}
                        error={errors.modelName}
                        inputstyle={style.inputStyle}
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
                        dropdowncallback={() => dropdownModelref.current.show()}
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
                    {title && title.name === "Others" ? (
                      <FloatingInput
                        placeholder="Other Location"
                        value={values.otherDocumentLocation}
                        onChangeText={(data) => setFieldValue("title", data)}
                        error={errors.otherDocumentLocation}
                        inputstyle={style.inputStyle}
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
                      />
                    ) : null}
                  </RN.View>
                </RN.View>
                <RN.Text style={style.label}>{"Comments"}</RN.Text>
                <FloatingInput
                  value={"Warranty end date for Whirlpool AC"}
                  inputstyle={style.inputStyle}
                  containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                />
                <RN.Text
                  style={{
                    marginTop: 20,
                    fontSize: 13,
                    color: colorAsh,
                    alignSelf: "center",
                    textDecorationLine: "underline",
                  }}>
                  {"Skip for now"}
                </RN.Text>
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

export default AddRemainders;
