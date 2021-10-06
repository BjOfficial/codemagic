import React, { useEffect, useRef, useState } from "react";
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

const AddAsset = () => {
  // const category_data = [{ value: 1, label: 'Kitchen Appliances' }, { value: 2, label: 'Home Appliances' }, { value: 3, label: 'Gadgets' }, { value: 4, label: 'Other' },]
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
  const [applianceModelList, setApplianceModelList] = useState([]);
  const [showExpiry, setShowExpiry] = useState(false);
  const [cameraVisible, setCameraVisible] = useState(false);

  const onSelectCategory = (data, setFieldValue) => {
    // alert(data)
    setFieldValue("category", applianceCategory[data]);
    setCategory(applianceCategory[data]);
  };
  const onSelectApplianceType = (data, setFieldValue) => {
    // alert(data)
    setFieldValue("applianceType", applianceType[data]);
    setApplianceType(applianceType[data]);
    applianceBrand(applianceType[data]);
  };
  const onSelectBrand = (data, setFieldValue) => {
    // alert(data)
    setFieldValue("brand", applianceBrandList[data]);
    setApplianceBrandList(applianceBrandList[data]);
    applianceModel(applianceBrandList[data]);
  };
  const onSelectModelName = (data, setFieldValue) => {
    // alert(data)
    setFieldValue("modelName", applianceModelList[data]);
    setApplianceModelList(applianceModelList[data]);
  };
  const AddAsssetSubmit = (values) => {
    console.log("inn");
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
  const applianceTypeList = async () => {
    console.log("in");
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(constants.applianceType);
    if (awaitlocationresp.status == 1) {
      setApplianceType(awaitlocationresp.data.data);
    } else {
      console.log("not listed location type");
    }
  };
  const closeSucessModal = () => {
    setVisible(false);
  };

  const applianceBrand = async (applianceType) => {
    console.log("awaitbrandlocationresp", applianceType._id);

    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.applianceBrand + "?appliance_type_id=" + applianceType._id
    );

    if (awaitlocationresp.status == 1) {
      setApplianceBrandList(awaitlocationresp.data.data);
    } else {
      console.log("  brand not listed  type");
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
        id: applianceType._id,
        other_value: values.otherApplianceType,
      },
      appliance_brand_id: {
        id: applianceBrandList._id,
        other_value: values.otherBrand,
      },
      appliance_model_id: {
        id: applianceModelList._id,
        other_value: values.otherModel,
      },
      serial_number: values.documentNumber,
      image: resourcePath,
      purchase_date: moment(new Date(expiryDate)).format("YYYY-MM-DD"),
      price: values.price,
    };
    console.log("payload", payload);
    let ApiInstance = await new APIKit().init(getToken);
    console.log("-----------", payload);
    let awaitresp = await ApiInstance.post(constants.addAppliance, payload);
    if (awaitresp.status == 1) {
      setVisible(true);
    } else {
      console.log(awaitresp);
      RN.Alert.alert(awaitresp.err_msg);
    }
  };
  const applianceModel = async (brand) => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.listApplianceModel +
        "?appliance_type_id=" +
        applianceType._id +
        "&appliance_brand_id=" +
        brand._id
    );
    console.log("awaitmodellocation", JSON.stringify(awaitlocationresp));
    if (awaitlocationresp.status == 1) {
      setApplianceModelList(awaitlocationresp.data.data);
    } else {
      console.log("  brand not listed  type");
    }
  };
  useEffect(() => {
    applianceCategoryList();
    applianceTypeList();
  }, []);
  // console.log("applianceBrandList", applianceBrandList);

  const openModal = () => {
    return (
      <ModalComp visible={visible}>
        <RN.View>
          <RN.View style={style.closeView}>
            <RN.TouchableOpacity onPress={() => closeSucessModal()}>
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
              title="Yes"
              mode={"outline"}
              color={colorLightBlue}
              buttonStyle={{
                width: RN.Dimensions.get("screen").width * 0.5,
                height: RN.Dimensions.get("screen").width * 0.1,
                alignSelf: "center",
              }}></ThemedButton>
            <RN.Text style={style.skip}>Skip for now</RN.Text>
          </RN.View>
        </RN.View>
      </ModalComp>
    );
  };
  const selectOptions = () => {
    console.log("in");
    console.log(cameraVisible);
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
          "/storage/emulated/0/assetta/document/" + localTime + ".jpg";
        moveAttachment(source.assets[0].uri, destinationPath);
      }
    });
  };
  const moveAttachment = async (filePath, newFilepath) => {
    return new Promise((resolve, reject) => {
      RNFS.mkdir("/storage/emulated/0/assetta/document")
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
  console.log(applianceType);
  return (
    <RN.View style={{ backgroundColor: colorWhite }}>
      {selectOptions()}
      {openModal()}
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
              <RN.Text style={style.navbarName}>{"Add Asset "}</RN.Text>
            </RN.View>
          </RN.View>
        </RN.View>
        <RN.View>
          <Formik
            initialValues={{
              category: null,
              applianceType: null,
              brand: null,
              modelName: null,
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
                  dropdownStyle={{ elevation: 8, borderRadius: 8 }}
                  renderSeparator={(obj) => null}>
                  <FloatingInput
                    placeholder="select"
                    editable_text={false}
                    type="dropdown"
                    value={values.category && category.name}
                    error={errors.category}
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
                    placeholder="Other category type"
                    value={values.otherCategoryType}
                    onChangeText={(data) =>
                      setFieldValue("otherCategoryType", data)
                    }
                    error={errors.otherCategoryType}
                    autoCapitalize={"characters"}
                    inputstyle={style.inputStyle}
                    containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                  />
                ) : null}
                <RN.View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>{"Appliance type"}</RN.Text>

                    <ModalDropdown
                      onSelect={(data) =>
                        onSelectApplianceType(data, setFieldValue)
                      }
                      loading={true}
                      ref={dropdownApplianceref}
                      options={applianceType}
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
                        value={values.applianceType && applianceType.name}
                        error={errors.applianceType}
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
                    {applianceType && applianceType.name === "Others" ? (
                      <FloatingInput
                        placeholder="Other appliance type"
                        value={values.otherApplianceType}
                        onChangeText={(data) =>
                          setFieldValue("otherApplianceType", data)
                        }
                        error={errors.otherApplianceType}
                        autoCapitalize={"characters"}
                        inputstyle={style.inputStyle}
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
                      dropdownStyle={{ elevation: 8, borderRadius: 8 }}
                      renderSeparator={(obj) => null}>
                      <FloatingInput
                        placeholder="select"
                        editable_text={false}
                        type="dropdown"
                        value={values.brand && applianceBrandList.name}
                        error={errors.brand}
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
                    {applianceBrandList &&
                    applianceBrandList.name === "Others" ? (
                      <FloatingInput
                        placeholder="Other Brand type"
                        value={values.otherBrand}
                        onChangeText={(data) =>
                          setFieldValue("otherDocumentType", data)
                        }
                        error={errors.otherBrand}
                        autoCapitalize={"characters"}
                        inputstyle={style.inputStyle}
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
                      />
                    ) : null}
                  </RN.View>
                </RN.View>

                <RN.Text style={style.label}>{"Model name"}</RN.Text>
                <ModalDropdown
                  onSelect={(data) => onSelectModelName(data, setFieldValue)}
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
                  dropdownStyle={{ elevation: 8, borderRadius: 8 }}
                  renderSeparator={(obj) => null}>
                  <FloatingInput
                    placeholder="select"
                    editable_text={false}
                    type="dropdown"
                    value={values.modelName && applianceModelList.name}
                    error={errors.modelName}
                    inputstyle={style.inputStyle}
                    containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
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
                {applianceModelList && applianceModelList.name === "Others" ? (
                  <FloatingInput
                    placeholder="Other model"
                    value={values.otherModel}
                    onChangeText={(otherModel) =>
                      setFieldValue("otherDocumentType", otherModel)
                    }
                    error={errors.otherModel}
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
                <RN.View style={{ flexDirection: "row" }}>
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
                        padding: 17,
                        right: RN.Dimensions.get("screen").width * 0.13,
                      }}>
                      {"( Optional )"}
                    </RN.Text>
                  </RN.View>
                </RN.View>
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
                        setCameraVisible(true);
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
                <RN.View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>{"Date of purchase"}</RN.Text>
                    <RN.TouchableOpacity onPress={() => setShowExpiry(true)}>
                      <FloatingInput
                        placeholder={"dd/mm/yyyy"}
                        value={moment(new Date(expiryDate)).format(
                          "DD/MM/YYYY"
                        )}
                        editable_text={false}
                        inputstyle={style.inputStyles}
                        selectTextOnFocus={false}
                        leftIcon={
                          <RN.Image
                            source={calendar}
                            style={{
                              width: 35,
                              height: 35,
                              marginTop:
                                RN.Dimensions.get("screen").height * 0.04,
                              left: RN.Dimensions.get("screen").width * 0.04,
                              position: "absolute",
                            }}
                          />
                        }
                        containerStyle={{
                          borderBottomWidth: 0,
                          marginBottom: 0,
                        }}
                      />
                    </RN.TouchableOpacity>
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

                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>{"Price "}</RN.Text>
                    <FloatingInput
                      placeholder="ex: SJ93RNFKD0"
                      value={values.price}
                      onChangeText={(data) => setFieldValue("price", data)}
                      error={errors.price}
                      autoCapitalize={"characters"}
                      leftIcon={
                        <RN.Image
                          source={rupee}
                          style={{
                            width: 35,
                            height: 35,
                            marginTop:
                              RN.Dimensions.get("screen").height * 0.04,
                            left: RN.Dimensions.get("screen").width * 0.04,
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
                    title="Add Appliance"
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
