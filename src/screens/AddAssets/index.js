import React, { useEffect, useRef, useState } from "react";
import * as RN from "react-native";
import style from "./style";
import HomeHeader from "@components/HomeHeader";
import FloatingInput from "@components/FloatingInput";
import { Formik } from "formik";
import ModalDropdown from "react-native-modal-dropdown";
import { useNavigation } from "@react-navigation/native";
import {
  arrow_down,
  calendar,
  add_img,
  rupee,
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
} from "@constants/Colors";
import ThemedButton from "@components/ThemedButton";
import ModalComp from "@components/ModalComp";
import APIKit from "@utils/APIKit";
import { constants } from "@utils/config";
import * as ImagePicker from "react-native-image-picker";
import * as RNFS from "react-native-fs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import { AddReaminderNav } from "@navigation/NavigationConstant";
import * as yup from "yup";

const AddAsset = () => {
  const formikRef = useRef();
  const navigation = useNavigation();
  const dropdownCategoryref = useRef(null);
  const dropdownApplianceref = useRef(null);
  const dropdownModelref = useRef(null);
  const dropdownBrandref = useRef(null);
  const [resourcePath, setResourcePath] = useState([]);
  const [applianceBrandList, setApplianceBrandList] = useState([]);
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [visible, setVisible] = useState(false);
  const [category, setCategory] = useState(null);
  const [applianceCategory, setApplianceCategory] = useState([]);
  const [applianceType, setApplianceType] = useState([]);
  const [selectedApplianceType, setSelectedApplianceType] = useState([]);
  const [selectedApplianceModelList, setSelectedApplianceModelList] = useState(
    []
  );
  const [selectedApplianceBrandList, setSelectedApplianceBrandList] = useState(
    []
  );

  const [applianceModelList, setApplianceModelList] = useState([]);
  const [showExpiry, setShowExpiry] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);
  const onSelectCategory = (data, setFieldValue) => {
    // alert(data)
    setFieldValue("category", applianceCategory[data]);
    setCategory(applianceCategory[data]);
    if (category != data) {
      formikRef.current.resetForm(
        setFieldValue({
          values: {
            applianceType: "",
            brand: "",
            modelName: "",
            serialNumber: "",
          },
        })
      );
      setFieldValue("category", applianceCategory[data]);
      setCategory(applianceCategory[data]);
    }
    applianceTypeList(applianceCategory[data]);
  };
  const onSelectApplianceType = (data, setFieldValue) => {
    // alert(data)
    setFieldValue("applianceType", applianceType[data]);
    setSelectedApplianceType(applianceType[data]);
    applianceBrand(applianceType[data]);
  };
  const onSelectBrand = (data, setFieldValue) => {
    // alert(data)
    setFieldValue("brand", applianceBrandList[data]);
    setSelectedApplianceBrandList(applianceBrandList[data]);
    applianceModel(applianceBrandList[data]);
  };
  const onSelectModelName = (data, setFieldValue) => {
    // alert(data)
    setFieldValue("modelName", applianceModelList[data]);
    setSelectedApplianceModelList(applianceModelList[data]);
  };
  const AddAsssetSubmit = (values) => {
    console.log("in");
    addAppliance(values);
  };

  const applianceCategoryList = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(constants.applianceCategory);
    if (awaitlocationresp.status == 1) {
      setApplianceCategory(awaitlocationresp.data.data);
    } else {
      console.log("not listed location type");
    }
  };
  const applianceTypeList = async (applianceCategory) => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.applianceType +
        "?appliance_category_id=" +
        applianceCategory._id
    );
    if (awaitlocationresp.status == 1) {
      setApplianceType(awaitlocationresp.data.data);
    } else {
      console.log("not listed location type");
    }
  };

  const applianceBrand = async (applianceType) => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.applianceBrand +
        "?appliance_type_id=" +
        applianceType._id +
        "&appliance_category_id=" +
        category._id
    );

    if (awaitlocationresp.status == 1) {
      setApplianceBrandList(awaitlocationresp.data.data);
    } else {
      console.log("brand not listed  type");
    }
  };
  const addAppliance = async (values) => {
    const getToken = await AsyncStorage.getItem("loginToken");
    const payload = {
      appliance_category_id: {
        id: category._id,
        other_value: values.otherCategoryType,
      },
      appliance_type_id: {
        id: selectedApplianceType._id,
        other_value: values.otherApplianceType,
      },
      appliance_brand_id: {
        id: selectedApplianceBrandList._id,
        other_value: values.otherBrand,
      },
      appliance_model_id: {
        id: selectedApplianceModelList._id,
        other_value: values.otherModel,
      },
      serial_number: values.serialNumber,
      image: resourcePath,
      purchase_date: moment(new Date(expiryDate)).format("YYYY-MM-DD"),
      price: values.price,
    };
    console.log("payload ======>", payload);
    let ApiInstance = await new APIKit().init(getToken);
    let awaitresp = await ApiInstance.post(constants.addAppliance, payload);
    if (awaitresp.status == 1) {
      setVisible(true);
      if (formikRef.current) {
        formikRef.current.resetForm();
      }
    } else {
      console.log(awaitresp);
      RN.Alert.alert(awaitresp.err_msg);
    }
  };
  const applianceModel = async (applianceBrandList) => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.listApplianceModel +
        "?appliance_type_id=" +
        selectedApplianceType._id +
        "&appliance_brand_id=" +
        applianceBrandList._id +
        "&appliance_category_id=" +
        category._id
    );
    if (awaitlocationresp.status == 1) {
      setApplianceModelList(awaitlocationresp.data.data);
    } else {
      console.log("  brand not listed  type");
    }
  };
  const signupValidationSchema = yup.object().shape({
    category: yup.object().nullable().required("Category is Required"),
    applianceType: yup.object().nullable().required("Asset type  is Required"),
    brand: yup.object().nullable().required("Brand  is Required"),
    modelName: yup.object().nullable().required("Model name  is Required"),
  });
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (formikRef.current) {
        formikRef.current.resetForm();
        setResourcePath([]);
      }
    });
    applianceCategoryList();
    applianceTypeList();
    return unsubscribe;
  }, []);

  // useEffect(() => {
  // 	if (formikValues.category != category) {
  // 		formikRef.current.resetForm();
  // 	}
  // }, [category]);
  console.log("qqqq", resourcePath);
  console.log("modal", visible);
  const openModal = () => {
    return (
      <ModalComp visible={visible}>
        <RN.View>
          <RN.View style={style.closeView}>
            <RN.TouchableOpacity
              onPress={() => {
                setVisible(false);
                navigation.navigate("bottomTab");
              }}>
              <RN.Image source={close_round} style={style.close_icon} />
            </RN.TouchableOpacity>
          </RN.View>
          <RN.View style={style.glitterView}>
            <RN.Image style={style.glitterStar} source={glitter} />
          </RN.View>
          <RN.Text style={style.para}>
            Your appliance added successfully!
          </RN.Text>
          <RN.View style={style.box}>
            <RN.Text style={style.header}>
              Would you like to add additional details and set reminder for free
              or paid service?
            </RN.Text>
            <ThemedButton
              onPress={() => {
                navigation.navigate(AddReaminderNav);
              }}
              title="Yes"
              mode={"outline"}
              color={colorLightBlue}
              labelStyle={{ marginTop: 1 }}
              buttonStyle={{
                width: RN.Dimensions.get("screen").width * 0.47,
                height: RN.Dimensions.get("screen").width * 0.07,
                alignSelf: "center",
              }}></ThemedButton>
            <RN.Text
              onPress={() => {
                setVisible(false);
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

  return (
    <RN.View style={{ backgroundColor: colorWhite }}>
      {selectOptions()}
      {openModal()}
      <RN.ScrollView showsVerticalScrollIndicator={false}>
        <HomeHeader title="Asset Details" />
        <RN.View>
          <Formik
            validationSchema={signupValidationSchema}
            innerRef={formikRef}
            enableReinitialize={true}
            initialValues={{
              category: "",
              applianceType: "",
              brand: "",
              modelName: "",
              serialNumber: "",
            }}
            onSubmit={(values, actions) => AddAsssetSubmit(values, actions)}>
            {({ handleSubmit, values, setFieldValue, errors }) => (
              <RN.View>
                <RN.Text style={style.label}>{"Category"}</RN.Text>
                <ModalDropdown
                  onSelect={(data) => onSelectCategory(data, setFieldValue)}
                  loading={true}
                  ref={dropdownCategoryref}
                  options={applianceCategory}
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
                    width: RN.Dimensions.get("screen").width * 0.9,
                    marginLeft: 20,
                    marginTop: -10,
                  }}
                  renderSeparator={(obj) => null}>
                  <FloatingInput
                    placeholder="Select"
                    editable_text={false}
                    type="dropdown"
                    value={values.category && category.name}
                    error={errors.category}
                    errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                    inputstyle={style.inputStyle}
                    containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    dropdowncallback={() => dropdownCategoryref.current.show()}
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
                {category && category.name === "Others" ? (
                  <FloatingInput
                    placeholder="Enter category name"
                    value={values.otherCategoryType}
                    onChangeText={(data) =>
                      setFieldValue("otherCategoryType", data)
                    }
                    error={errors.otherCategoryType}
                    errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                    autoCapitalize={"characters"}
                    inputstyle={style.otherInputStyle}
                    containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                  />
                ) : null}
                <RN.View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>
                      {category &&
                      category.name &&
                      category.name.includes("Appliances")
                        ? "Appliance type"
                        : "Asset type"}
                    </RN.Text>

                    <ModalDropdown
                      onSelect={(data) =>
                        onSelectApplianceType(data, setFieldValue)
                      }
                      loading={true}
                      ref={dropdownApplianceref}
                      options={applianceType && applianceType}
                      isFullWidth
                      renderRow={(props) => {
                        return (
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
                        );
                      }}
                      dropdownStyle={{
                        elevation: 8,
                        borderRadius: 8,
                        width: RN.Dimensions.get("screen").width * 0.4,
                        marginLeft: 20,
                        marginTop: -10,
                      }}
                      renderSeparator={(obj) => null}>
                      <FloatingInput
                        placeholder="Select"
                        editable_text={false}
                        type="dropdown"
                        value={
                          values.applianceType && selectedApplianceType.name
                        }
                        error={errors.applianceType}
                        errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                        inputstyle={style.inputStyle}
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
                        dropdowncallback={() =>
                          dropdownApplianceref.current.show()
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
                    {selectedApplianceType &&
                    selectedApplianceType.name === "Others" ? (
                      <FloatingInput
                        placeholder="Enter appliance type"
                        value={values.otherApplianceType}
                        onChangeText={(data) =>
                          setFieldValue("otherApplianceType", data)
                        }
                        error={errors.otherApplianceType}
                        errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                        autoCapitalize={"characters"}
                        inputstyle={style.othersInputStyle}
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
                      />
                    ) : null}
                  </RN.View>

                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>{"Brand "}</RN.Text>

                    <ModalDropdown
                      onSelect={(data) => onSelectBrand(data, setFieldValue)}
                      loading={true}
                      ref={dropdownBrandref}
                      options={applianceBrandList}
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
                        width: RN.Dimensions.get("screen").width * 0.4,
                        marginLeft: 20,
                        marginTop: -10,
                      }}
                      renderSeparator={(obj) => null}>
                      <FloatingInput
                        placeholder="Select"
                        editable_text={false}
                        type="dropdown"
                        value={values.brand && selectedApplianceBrandList.name}
                        error={errors.brand}
                        errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                        inputstyle={style.inputStyle}
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
                        dropdowncallback={() => dropdownBrandref.current.show()}
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
                    {selectedApplianceBrandList &&
                    selectedApplianceBrandList.name === "Others" ? (
                      <FloatingInput
                        placeholder="Enter brand name"
                        value={values.otherBrand}
                        onChangeText={(data) =>
                          setFieldValue("otherDocumentType", data)
                        }
                        error={errors.otherBrand}
                        errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                        autoCapitalize={"characters"}
                        inputstyle={style.othersInputStyle}
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
                      />
                    ) : null}
                  </RN.View>
                </RN.View>
                {selectedApplianceBrandList &&
                selectedApplianceBrandList.name === "Others" ? (
                  <RN.View>
                    <RN.Text style={style.label}>{"Model number"}</RN.Text>
                    <FloatingInput
                      placeholder="ex: SJ93RNFKD0"
                      value={values.modelNumber}
                      onChangeText={(data) =>
                        setFieldValue("modelNumber", data)
                      }
                      error={errors.modelNumber}
                      errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                      autoCapitalize={"characters"}
                      inputstyle={style.inputStyle}
                      containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    />
                  </RN.View>
                ) : (
                  <RN.View>
                    <RN.Text style={style.label}>{"Model name"}</RN.Text>
                    <ModalDropdown
                      onSelect={(data) =>
                        onSelectModelName(data, setFieldValue)
                      }
                      loading={true}
                      ref={dropdownModelref}
                      options={applianceModelList}
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
                        width: RN.Dimensions.get("screen").width * 0.9,
                        marginLeft: 20,
                        marginTop: -10,
                      }}
                      renderSeparator={(obj) => null}>
                      <FloatingInput
                        placeholder="Select"
                        editable_text={false}
                        type="dropdown"
                        value={
                          values.modelName && selectedApplianceModelList.name
                        }
                        error={errors.modelName}
                        errorStyle={{ marginLeft: 20, marginBottom: 10 }}
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
                  </RN.View>
                )}

                <RN.Text style={style.label}>{"Serial number"}</RN.Text>
                <FloatingInput
                  placeholder="ex: SJ93RNFKD0"
                  value={values.serialNumber}
                  onChangeText={(data) => setFieldValue("serialNumber", data)}
                  error={errors.serialNumber}
                  errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                  autoCapitalize={"characters"}
                  inputstyle={style.inputStyle}
                  containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                />
                <RN.View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>
                      {"Upload appliance image"}
                    </RN.Text>
                  </RN.View>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text
                      style={{
                        fontFamily: "Rubik-Regular",
                        fontSize: 13,
                        color: colorGray,
                        marginLeft: 5,
                        padding: 17,
                        right: RN.Dimensions.get("screen").width * 0.13,
                      }}>
                      {"( Optional )"}
                    </RN.Text>
                  </RN.View>
                </RN.View>

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
                    <RN.Text style={style.label}>{"Date of purchase"}</RN.Text>
                    <FloatingInput
                      placeholder={"dd/mm/yyyy"}
                      value={moment(new Date(expiryDate)).format("DD/MM/YYYY")}
                      onPressCalendar={() => setShowExpiry(true)}
                      editable_text={false}
                      disabled={true}
                      inputstyle={style.inputStyles}
                      selectTextOnFocus={false}
                      type="calendar"
                      show_keyboard={false}
                      leftIcon={
                        <RN.Image
                          source={calendar}
                          style={{
                            width: 35,
                            height: 35,
                            top: RN.Dimensions.get("screen").height * 0.01,
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
                        maximumDate={new Date()}
                        onChange={(event, selectedExpiryDate) => {
                          const ExpiryDate = selectedExpiryDate || expiryDate;
                          setExpiryDate(ExpiryDate);
                          setShowExpiry(false);
                        }}
                      />
                    )}
                  </RN.View>

                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>{"Price "}</RN.Text>
                    <FloatingInput
                      placeholder="18,999"
                      value={values.price}
                      onChangeText={(data) => setFieldValue("price", data)}
                      error={errors.price}
                      errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                      keyboard_type={"numeric"}
                      autoCapitalize={"characters"}
                      leftIcon={
                        <RN.Image
                          source={rupee}
                          style={{
                            width: 35,
                            height: 35,
                            top: RN.Dimensions.get("screen").height * 0.01,
                            left: RN.Dimensions.get("screen").width * 0.06,
                            position: "absolute",
                          }}
                        />
                      }
                      inputstyle={style.inputStyles}
                      containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    />
                  </RN.View>
                </RN.View>
                <RN.Text
                  style={{
                    fontFamily: "Rubik-Regular",
                    fontSize: 13,
                    color: colorGray,
                    marginLeft: 15,
                  }}>
                  {"Enter approx. date if you don't remember the exact date"}
                </RN.Text>

                <RN.View
                  style={{ marginVertical: 20, paddingTop: 40, padding: 20 }}>
                  <ThemedButton
                    title={
                      category &&
                      category.name &&
                      category.name.includes("Appliances")
                        ? "Add Appliance"
                        : "Add Asset"
                    }
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

export default AddAsset;
