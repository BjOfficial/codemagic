/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState, Fragment, useRef, useEffect } from "react";
import {
  View,
  ImageBackground,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Animated,
  Dimensions,
} from "react-native";
import styles from "./styles";
import {
  colorBlack,
  colorLightBlue,
  colorDropText,
  colorWhite,
} from "@constants/Colors";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as yup from "yup";
import { isEmpty } from "lodash";
import { Formik } from "formik";
import {
  brandname,
  brandTag,
  serialnumber,
  doc_img,
  warrantyending,
  pricebought,
  uploadeddoc,
  reminderdate,
  addreminder_white,
  lastservice,
  invoice,
  boughtfrom,
  freeservice,
  satisfactionlevel,
  star,
  calendar_check,
  remarks,
  defaultImage,
  alert_icon,
  edit_appliance,
  move,
  arrow_down,
  resell,
  archive,
  arrowLocation,
  no_image_icon,
  my_reminder
} from "@constants/Images";
import BottomSheetComp from "@components/BottomSheetComp";
import { useNavigation } from "@react-navigation/native";
import APIKit from "@utils/APIKit";
import moment from "moment";
import { constants } from "@utils/config";
import BackArrowComp from "@components/BackArrowComp";
import style from "@screens/Dashboard/style";
import FloatingInput from "@components/FloatingInput";
import ModalDropdownComp from "@components/ModalDropdownComp";
import ThemedButton from "@components/ThemedButton";
import ModalComp from "@components/ModalComp";
import RadioForm from "react-native-simple-radio-button";
import { ComingSoonNav, EditAssetsNav } from "@navigation/NavigationConstant";

const ApplianceMoreDetails = (props) => {
  let edit = [
    "● There are several attributes included for each asset that will be enabled in the beta version ",
    "● The rating of the brand, retailers, service technicians and comments are to help your network in their own purchase decisions",
    "● Also you will earn Azzeti coins when the Brands and Retailers get your ratings and comments that will help them to serve you better ",
    "● Do add as many documents, appliances, gadgets and others as you can to test the Alpha version ",
    "● You will be able to edit and add these additional details in Beta version in the next 3 weeks",
  ];

  const formikRef = useRef();

  const appliance_id = props?.route?.params?.appliance_id;
  const appliance_data = props?.route?.params?.appliance_data;
  const navigation = useNavigation();
  const animatedtab = useRef(new Animated.Value(0)).current;
  const [selecttabs, setSelectTabs] = useState(1);
  const [moredetails, setMoredetails] = useState([]);
  const [remarksVisible, setRemarksBox] = useState(false);
  const [modalVisible, setmodalVisible] = useState(false);
  const [modalInvoiceVisible, setmodalInvoiceVisible] = useState(false);
  const [applianceListValue, setApplianceValue] = useState(null);
  const [bottomImage, setBottomImage] = useState("");
  const [applianceOptionVisible, setApplianceOptionVisible] = useState(false);
  const [moveVisible, setMoveVisible] = useState(false);
  const [locationName, setLocationName] = useState(null);
  const dropdownModelref = useRef(null);
  const dropdownModelNewref = useRef(null);
  const [assetId, setAssetId] = useState();
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [archiveVisible, setArchiveVisible] = useState(false);
  const [moveArchiveVisible, setMoveArchiveVisible] = useState(false);
  const [radio, setRadio] = useState(0);
  const [defImage, setDefImage] = useState([]);
  const [applianceID, setApplianceId] = useState(null);
  const [invoiceUploaded, setInvoiceUploaded] = useState(null);
  const [defaultImageView, setDefaultImageView] = useState(false);
  const [maintainanceDetails, setMaintainanceDetails] = useState("");
  const [noImageFoundText,setNoImageFoundText ] = useState(false);
  const [noInoviceFoundText,setNoInvoiceFoundText ] = useState(false);

  const title =
    appliance_data && appliance_data?.type?.is_other_value
      ? appliance_data?.type?.other_value
      : appliance_data?.type?.name;

  let applianceDetails = [
    {
      id: 1,
      label: "Brand Name",
      value: "Whirlpool",
      icon: brandTag,
      key: "brand",
    },
    {
      id: 2,
      label: "Serial Number",
      value: "2345 6789 9876 5432",
      icon: serialnumber,
      key: "serial_number",
    },
    {
      id: 3,
      label: "Date Of Purchase",
      value: "25/03/2019",
      months: "4 years and 8 months",
      icon: calendar_check,
      key: "purchase_date",
    },
    {
      id: 4,
      label: "Warranty Ending On",
      value: "25/04/2023",
      icon: warrantyending,
      key: "warranty_date",
    },
    {
      id: 5,
      label: "Price Bought",
      value: "₹4,050",
      icon: pricebought,
      key: "price",
    },
    {
      id: 6,
      label: "Uploaded Document",
      value: [],
      icon: uploadeddoc,
      key: "uploaded_doc",
    },
    {
      id: 7,
      label: "Reminder Date",
      value: moment("25/03/2023").format("YYYY-MM-DD"),
      icon: reminderdate,
      months: "",
      key: "reminder_date",
    },
  ];
  let serviceDetails = [
    { id: 1, label: "Invoice/Bill", value: doc_img, icon: invoice },
    {
      id: 2,
      label: "Bought From",
      value: !isEmpty(moredetails) ? moredetails.shop_name?.name : "",
      icon: boughtfrom,
    },
    {
      id: 3,
      label: "Free Service Availability",
      value: "",
      icon: freeservice,
      key: "free_service",
    },
    {
      id: 4,
      label: "Satisfaction Level",
      value: !isEmpty(moredetails) ? moredetails.service_person_rating : "",
      icon: satisfactionlevel,
      star: !isEmpty(moredetails) ? moredetails.share_rating : false,
    },
  ];
  let applicanceValue = {
    brand: "",
    serial_number: "",
    purchase_date: "",
    warranty_date: "",
    title: "",
    price: "",
    uploaded_doc: "",
    reminder_date: "",
    remarks: "",
    free_service: "",
    amountPaid: '',
  };

  const viewdocuments = (data) => {
    setmodalVisible(true);
  };
  useEffect(() => {
    viewAppliances();
  }, [appliance_id]);

  useEffect(() => {
    getLocationDropDown();
  }, []);

  const signupValidationSchema = yup.object().shape({
    primarylocation: yup.string().required("Primary Location is required"),
    newlocation: yup.string().required("Appliance Location is required"),
  });

  const [radioProps] = useState([
    { label: "Sold", value: 0 },
    { label: "Damaged", value: 1 },
    { label: "Donated", value: 2 },
  ]);

  const viewAppliances = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.viewAppliance + "?appliance_id=" + appliance_id
    );
    if (awaitlocationresp.status == 1) {
      setBottomImage(awaitlocationresp.data.data);
      setDefImage(awaitlocationresp.data.data.default_url);
      let appliancemoredetails = awaitlocationresp.data.data;
      console.log('====================================');
  console.log('maintanceDetails', appliancemoredetails);
  console.log('====================================');

      setMoredetails(appliancemoredetails);
      setApplianceId(appliancemoredetails._id);
      if (appliancemoredetails) {
        let clonedData = { ...applicanceValue };
        clonedData.brand =
          appliancemoredetails.brand.name &&
          appliancemoredetails.brand.is_other_value
            ? appliancemoredetails.brand.other_value
            : appliancemoredetails.brand.name;
        clonedData.free_service = appliancemoredetails.service_over == undefined ? '' : appliancemoredetails.service_over;
        clonedData.serial_number = appliancemoredetails?.serial_number;
        clonedData.purchase_date = appliancemoredetails
          ? moment(new Date(appliancemoredetails.purchase_date)).format(
              "DD/MM/YYYY"
            )
          : "";
        // clonedData.warranty_date = appliancemoredetails
        // 	? moment(new Date(appliancemoredetails.reminder.date)).format('DD/MM/YYYY')
        // 	: '';
        clonedData.title =
          appliancemoredetails && appliancemoredetails.reminder
            ? appliancemoredetails.reminder.title.name &&
              appliancemoredetails.reminder.title.is_other_value
              ? appliancemoredetails.reminder.title.other_value
              : appliancemoredetails.reminder.title.name
            : "";
        clonedData.price =
          appliancemoredetails?.price
            ? "\u20B9 " + appliancemoredetails?.price
            : '';
            // {data?.price ? '\u20B9 ' + data?.price : ''}
        clonedData.uploaded_doc = appliancemoredetails
          ? appliancemoredetails.image.length > 0
            ? appliancemoredetails.image[0].path
            : ""
          : appliancemoredetails.default_url;
        clonedData.reminder_date =
          appliancemoredetails && appliancemoredetails.reminder
            ? moment(new Date(appliancemoredetails.reminder.date)).format(
                "DD/MM/YYYY"
              )
            : "";

          clonedData.amountPaid = appliancemoredetails.labour_cost + appliancemoredetails.spare_cost;
        appliancemoredetails.maintenance.map((reminder) => {
          setMaintainanceDetails(reminder);
          clonedData.remarks = reminder?.remarks;
        });
        setApplianceValue(clonedData);
        const invoice_imgs = awaitlocationresp.data.data.invoice;
        setInvoiceUploaded(invoice_imgs);
      }
    } else {
      console.log("not listed location type");
    }
  };
  const setShowSelectedTabs = (val) => {
    setSelectTabs(val);
    Animated.timing(animatedtab, {
      toValue: val == 1 ? 0 : 1,
      duration: 500,
    }).start();
  };

  const animateTabStyle = {
    left: animatedtab.interpolate({
      inputRange: [0, 1],
      outputRange: ["5%", "55%"],
    }),
    backgroundColor: colorLightBlue,
    position: "absolute",
    height: "100%",
    borderRadius: 8,
    width: "50%",
  };
  const openRemarks = () => {
    setRemarksBox(true);
  };

  try {
    let assetName = bottomImage.type.name.replace(/ /g, "").toLowerCase();
    let brandName = "Others";
    var defImg;
    defaultImage.forEach((assetType) => {
      defImg = assetType[assetName][brandName].url;
    });
  } catch (e) {
    defImg = no_image_icon;
  }

  const getLocationDropDown = async () => {
    let uid = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(uid);
    let awaitresp = await ApiInstance.get(constants.listAddLocation);
    if (awaitresp.status == 1) {
      if (awaitresp.data.data.length > 0) {
        let responseData = awaitresp.data.data?.map((obj) => {
          return { label: obj.name, asset_id: obj._id };
        });
        setLocationName(responseData);
      }
    } else {
      setErrorMsg(awaitresp.err_msg);
    }
  };

  const onSelectLocation = (data, setFieldValue) => {
    setFieldValue("primarylocation", locationName[data].label);
    getLocationDropDown();
  };

  const onSelectNewLocation = (data, setFieldValue) => {
    setFieldValue("newlocation", locationName[data].label);
    setAssetId(locationName[data].asset_id);
    getLocationDropDown();
  };

  const moveLocationSubmit = async (values, { resetForm }) => {
    if (values.primarylocation == values.newlocation) {
      setErrorMsg(
        "Primary Location and Appliance Location are Same, Please Select Different Location"
      );
    } else {
      let uid = await AsyncStorage.getItem("loginToken");

      let payload = {
        appliance_id: appliance_id,
        asset_location_id: { id: assetId, other_value: "" },
      };
      let ApiInstance = await new APIKit().init(uid);
      let awaitresp = await ApiInstance.post(constants.moveLocation, payload);
      if (awaitresp.status == 1) {
        resetForm(values);
        setErrorMsg("");
        setSuccessMsg(awaitresp.data.message);
        setTimeout(() => {
          setSuccessMsg("");
          setMoveVisible(false);
        }, 3000);
      } else {
        setErrorMsg(awaitresp.err_msg);
      }
    }
  };

  const submitArchiveLocation = async () => {
    const appliance_archive =
      radio == 0
        ? "Sold"
        : radio == 1
        ? "Damaged"
        : radio == 2
        ? "Donated"
        : "";
    let uid = await AsyncStorage.getItem("loginToken");
    const payload = {
      appliance_id: appliance_id,
      appliance_archive: appliance_archive,
    };
    let ApiInstance = await new APIKit().init(uid);
    let awaitresp = await ApiInstance.post(constants.archiveLocation, payload);
    if (awaitresp.status == 1) {
      setErrorMsg("");
      setSuccessMsg(awaitresp.data.message);
      setTimeout(() => {
        setSuccessMsg("");
        setMoveArchiveVisible(false);
      }, 2000);
    } else {
      setErrorMsg(awaitresp.err_msg);
    }
  };

  const navigatePage = () => {
    console.log("Edit option");
    setApplianceOptionVisible(false);
    navigation.navigate(EditAssetsNav, { appliance_id: appliance_id });
  };
 
 
  
  console.log('maintanceDetails', maintainanceDetails.spare_cost);
  return (
    <View style={styles.container}>
      
        <View
          style={{
            flexDirection: "row",
            marginTop: 20,
            marginLeft: 20,
            marginBottom: 10,
            paddingTop: Platform.OS === "ios" ? 30 : 0,
          }}>
          <View style={{ flex: 1 }}>
            <BackArrowComp />
          </View>
          <View style={{ flex: 9 }}>
            <Text
              style={{
                fontFamily: "Rubik-Bold",
                fontSize: 15,
                color: colorBlack,
              }}>
              {title}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("DocumentRemainder", {
                  document_ids: bottomImage._id,
                  reminder_data: "editAssetReminder",
                  comments: bottomImage.reminder.comments,
                  title: bottomImage.reminder.title._id,
                  date: bottomImage.reminder.date,
                });
              }}>
              {bottomImage && !bottomImage.reminder ? null : (
                <EvilIcons name="bell" color={colorBlack} size={25} />
              )}
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1}}>
            <TouchableOpacity 
            onPress={() => setApplianceOptionVisible(true)} // needed for MVP Full
      
            // onPress={() => {
            //   navigation.navigate(ComingSoonNav, {
            //     title: 'Edit Appliance',
            //     content: edit,
            //     icon: my_reminder,
            //   });
            // }}
            >
              <Text>
                <MaterialCommunityIcons
                  name="dots-vertical"
                  color={colorBlack}
                  size={20}
                />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.productSection}>
          <View style={{height:120,width:120}}>
          <Image
            source={
              applianceListValue && applianceListValue.uploaded_doc && !defaultImageView? {
               uri: "file:///" + applianceListValue.uploaded_doc 
            } : defImg}
            onError={(e) => setDefaultImageView(true)}
            style={styles.productImg}
          />
        </View>
        </View>
        <View style={styles.tabContainer}>
          <View style={styles.tabSection}>
            <Animated.View style={animateTabStyle}></Animated.View>
            <View style={{ flex: 0.5 }}>
              <TouchableOpacity
                onPress={() => setShowSelectedTabs(1)}
                style={selecttabs == 1 ? styles.activeBtn : styles.inactiveBtn}>
                <Text
                  style={selecttabs == 1 ? styles.activeText : styles.btnText}>
                  Appliance Details
                </Text>
              </TouchableOpacity>
            </View>
            <View style={{ flex: 0.5 }}>
              <TouchableOpacity
                style={selecttabs == 2 ? styles.activeBtn : styles.inactiveBtn}
                onPress={() => setShowSelectedTabs(2)}>
                <Text
                  style={selecttabs == 2 ? styles.activeText : styles.btnText}>
                  Service Details
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {selecttabs == 1 && (
            <View style={styles.tabcontentContainer}>
              {applianceDetails &&
                applianceDetails.map((item) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <View style={styles.contentDisplay}>
                      <View
                        style={{
                          flex: 0.5,
                          flexDirection: "row",
                          alignItems: "center",
                        }}>
                        <ImageBackground
                          source={item.icon}
                          style={{ width: 21, height: 24 }}
                          resizeMode="contain"
                        />

                        <Text numberOfLines={1} style={styles.detailsLabel}>
                          {item.label}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0.5,
                          flexDirection: "row",
                          justifyContent: "flex-end",
                        }}>
                        {item.label == "Uploaded Document" ? (
                          // <>
                          //   {item && item.value.length > 0 && (
                          <Fragment>
                            <TouchableOpacity
                              style={{ paddingLeft: 10 }}
                              onPress={() => {
                                viewdocuments();
                              }}>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "flex-end",
                                  justifyContent: "flex-end",
                                }}>
                                {applianceListValue &&
                                applianceListValue.uploaded_doc ? (
                                  <>
                                    {bottomImage?.image
                                      ?.slice(0, 2)
                                      .map((img, index) => {
                                        const imgLength =
                                          bottomImage?.image?.length - 1;
                                        return (
                                          <View style={styles.overTop}>
                                            <Image
                                              source={
                                                applianceListValue && applianceListValue.uploaded_doc && !defaultImageView? {
                                                 uri: "file:///" + applianceListValue.uploaded_doc 
                                              } : defImg}
                                              onError={(e) => setDefaultImageView(true)}
                                              style={styles.uploadedImg}
                                            />
                                            <View
                                              style={
                                                index == 1
                                                  ? styles.overlay
                                                  : styles.overlayNon
                                              }>
                                              <Text
                                                style={{
                                                  color: "#FFFFFF",
                                                  fontSize: 16,
                                                }}>
                                                {index == 1
                                                  ? "+" + imgLength
                                                  : ""}
                                              </Text>
                                            </View>
                                            <View></View>
                                          </View>
                                        );
                                      })}
                                  </>
                                ) : (
                                  <Image
                                    source={defImg}
                                    style={styles.uploadedImg}
                                  />
                                )}
                                {/* <Image
                									source={
                										applianceListValue &&
                                    applianceListValue.uploaded_doc
                											? {
                												uri:
                                            'file:///' +
                                            applianceListValue.uploaded_doc,
                											}
                											: defImg
															// defImg
                									}
                									style={styles.uploadedImg}
                								/> */}
                              </View>
                            </TouchableOpacity>
                            {item.value.length > 1 && (
                              <TouchableOpacity
                                style={{ paddingLeft: 10 }}
                                onPress={() => viewdocuments(item.value)}>
                                <View
                                  // eslint-disable-next-line no-mixed-spaces-and-tabs
                                  style={[
                                    styles.uploadedImg,
                                    {
                                      backgroundColor: "rgba(0,0,0,0.5)",
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      fontFamily: "Rubik-Regular",
                                    },
                                  ]}>
                                  <Text style={{ color: "white" }}>
                                    +{applianceListValue[item.key].length - 1}
                                  </Text>
                                </View>
                              </TouchableOpacity>
                            )}
                          </Fragment>
                        ) : (
                          //   )}
                          // </>
                          <>
                            {item.months ? (
                              <View style={styles.labelDisplay}>
                                <Text style={styles.detailsvalue}>
                                  {applianceListValue != null
                                    ? applianceListValue[item.key]
                                    : null}
                                </Text>
                                {/* <Text
																	numberOfLines={1}
																	style={styles.addtionalLabel}>
																	{item.months}
																</Text> */}
                              </View>
                            ) : (
                              <Text
                                numberOfLines={2}
                                style={styles.detailsvalue}>
                                {/* {applianceListValue[item.key]} */}
                                {applianceListValue != null
                                  ? applianceListValue[item.key]
                                  : null}
                              </Text>
                            )}
                          </>
                        )}
                      </View>
                    </View>
                  );
                })}

              <View style={styles.reminderBtnView}>
                {bottomImage && !bottomImage.reminder ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("DocumentRemainder", {
                        document_ids: bottomImage._id,
                        reminder_data: 'assetReminder',
                      });
                    }}
                    style={styles.reminderBtnn}>
                    <Image
                      source={addreminder_white}
                      style={styles.reminderIcon}
                    />
                    <Text style={styles.reminderText}>Add Reminder</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          )}
          {selecttabs == 2 && (
            <View style={styles.tabcontentContainer}>
              <View style={styles.servicecontentDisplay}>
                <View style={{ flex: 0.5, flexDirection: "column" }}>
                  <View
                    style={{
                      flex: 0.5,
                      flexDirection: "row",
                    }}>
                    <ImageBackground
                      source={lastservice}
                      style={{ width: 25, height: 19 }}
                      resizeMode="contain"
                    />
                    <View style={{ flexDirection: "column" }}>
                      <Text numberOfLines={1} style={styles.detailsLabel}>
                        Last Service On
                      </Text>
                      <Text style={[styles.detailsLabel, styles.labelstyle]}>
                        {moment(maintainanceDetails.date).format("DD/MM/YYYY")}
                      </Text>
                      <TouchableOpacity onPress={() => openRemarks()}>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                          }}>
                          <Text
                            style={[styles.detailsLabel, styles.remarkStyle]}>
                            Remarks
                          </Text>
                          <Image source={remarks} style={styles.remarkIcon} />
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                <View style={{ flex: 0.5, flexDirection: "column" }}>
                  <View
                    style={{
                      flex: 0.5,
                      flexDirection: "row",
                    }}>
                    <ImageBackground
                      source={pricebought}
                      style={{ width: 21, height: 19 }}
                      resizeMode="contain"
                    />
                    <View style={{ flexDirection: "column" }}>
                      <Text numberOfLines={1} style={styles.detailsLabel}>
                        Amount Paid
                      </Text>
                      <Text style={[styles.detailsLabel, styles.labelstyle]}>
                       {applianceListValue.amountPaid ?  applianceListValue.amountPaid : ''}
                      </Text>
                    </View>
                  </View>
                  {/* <Text style={styles.labelstyle}>₹2,500</Text> */}
                </View>
              </View>

              {serviceDetails &&
                serviceDetails.map((item) => {
                  return (
                    // eslint-disable-next-line react/jsx-key
                    <View style={styles.contentDisplay}>
                      <View
                        style={{
                          flex: 0.5,
                          flexDirection: "row",
                          alignItems: "center",
                        }}>
                        <ImageBackground
                          source={item.icon}
                          style={{ width: 21, height: 24 }}
                          resizeMode="contain"
                        />

                        <Text numberOfLines={1} style={styles.detailsLabel}>
                          {item.label}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 0.5,
                          flexDirection: "row",
                          justifyContent: "flex-end",
                        }}>
                        {item.label == "Invoice/Bill" ? (
                          invoiceUploaded?.slice(0, 2).map((img, index) => {
                            const imgLength = invoiceUploaded?.length - 1;
                            return (
                              <TouchableOpacity
                                style={{ paddingLeft: 10 }}
                                onPress={() => {
                                  setmodalInvoiceVisible(true);
                                }}>
                                <View style={styles.overTop}>
                                  <Image
                                    source={{ uri: "file:///" + img.path }}
                                    style={styles.uploadedImg}
                                  />
                                  <View
                                    style={
                                      index == 1
                                        ? styles.overlay
                                        : styles.overlayNon
                                    }>
                                    <Text
                                      style={{
                                        color: "#FFFFFF",
                                        fontSize: 16,
                                      }}>
                                      {index == 1 ? "+" + imgLength : ""}
                                    </Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            );
                          })
                        ) : (
                          // <Image
                          // 	source={''}
                          // 	style={styles.uploadedImgService}
                          // />
                          <View style={styles.labelDisplayService}>
                            <Text numberOfLines={1} style={styles.detailsvalue}>
                              {applianceListValue != null
                                ? item.label == "Free Service Availability"
                                  ? applianceListValue[item.free_service] == undefined ? '' :  applianceListValue[item.key] + 'Service Available'
                                  : applianceListValue[item.key]
                                : null}
                            </Text>
                            {item.star && (
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                }}>
                                <Text>
                                  {!isEmpty(moredetails)
                                    ? moredetails.service_person_rating
                                    : ""}
                                </Text>
                                <ImageBackground
                                  source={star}
                                  style={styles.starIcon}
                                  resizeMode="contain"
                                />
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  );
                })}
              <View style={styles.reminderBtnView}>
                {bottomImage && !bottomImage.reminder ? (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("DocumentRemainder", {
                        document_ids: bottomImage._id,
                        reminder_data: "assetReminder",
                      });
                    }}
                    style={styles.reminderBtnn}>
                    <Image
                      source={addreminder_white}
                      style={styles.reminderIcon}
                    />
                    <Text style={styles.reminderText}>Add Reminder</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
      {bottomImage && bottomImage.reminder ? (
        <View style={styles.bottomFixed}>
          <View style={styles.warningView}>
            <View
              style={{
                flex: 0.1,
                alignItems: "center",
                justifyContent: "center",
              }}>
              <ImageBackground
                source={alert_icon}
                resizeMode="contain"
                style={styles.warningImg}
              />
            </View>
            <View style={{ flex: 0.65 }}>
              <Text style={styles.warrantytext}>
                {applianceListValue != null ? applianceListValue.title : null}
                {" - "}
                {applianceListValue != null
                  ? applianceListValue.reminder_date
                  : null}
              </Text>
            </View>
            <View style={{ flex: 0.25 }}>
              <TouchableOpacity
                style={styles.viewalertBtn}
                onPress={() => {
                  navigation.navigate("DocumentRemainder", {
                    document_ids: bottomImage._id,
                    reminder_data: "editAssetReminder",
                    comments: bottomImage.reminder.comments,
                    title: bottomImage.reminder.title._id,
                    date: bottomImage.reminder.date,
                  });
                }}>
                <Text style={styles.viewalertlabel}>View alert</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ) : null}
      <BottomSheetComp
        sheetVisible={modalVisible}
        closePopup={() => setmodalVisible(false)}>
        <View style={styles.uploadedView}>
          <Text style={styles.uploadedLable}>Uploaded Documents</Text>
          {bottomImage && bottomImage.image.length == 0 && (
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#000000" }}>Attachment is not available in this device</Text>
              <Text style={{ color: "#000000" }}></Text>
            </View>
          )}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {bottomImage &&
              bottomImage.image.map((img) => {
                return (
                  // eslint-disable-next-line react/jsx-key
                  <View
                    style={{
                      borderRadius: 30,
                      marginLeft: 10,
                      marginBottom: 20,
                    }}>
                      {!noImageFoundText ? 
                    <ImageBackground
                      source={
                        bottomImage && bottomImage.image
                          ? {
                              uri: "file:///" + img.path,
                            }
                          : null
                      }
                    onError={(e) => setNoImageFoundText(true)}
                    style={styles.productImage}
                    /> : 
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ color: "#000000" }}>Attachment is not available in this device.</Text>
                      
                  </View>
                    }
                    
                    <View style={styles.overlayBottom}></View>
                  </View>
                );
              })}
          </ScrollView>
        </View>
      </BottomSheetComp>

      <BottomSheetComp
        sheetVisible={modalInvoiceVisible}
        closePopup={() => setmodalInvoiceVisible(false)}>
        <View style={styles.uploadedView}>
          <Text style={styles.uploadedLable}>Uploaded Documents</Text>
          {invoiceUploaded && invoiceUploaded.length == 0 && (
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: "#000000" }}>No Image Found</Text>
            </View>
          )}
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {invoiceUploaded &&
              invoiceUploaded.map((img) => {
                return (
                  // eslint-disable-next-line react/jsx-key
                  <View
                    style={{
                      borderRadius: 30,
                      marginLeft: 10,
                      marginBottom: 20,
                    }}>
                   {!noInoviceFoundText ? 
                    <ImageBackground
                      source={
                        bottomImage && bottomImage.image
                          ? {
                              uri: "file:///" + img.path,
                            }
                          : null
                      }
                    onError={(e) => setNoInvoiceFoundText(true)}
                    style={styles.productImage}
                    /> : 
                    <View style={{ alignItems: "center" }}>
                      <Text style={{ color: "#000000" }}>Attachment is not available in this device.</Text>
                      
                  </View>
                    }
                    
                    <View style={styles.overlayBottom}></View>
                  </View>
                );
              })}
          </ScrollView>
        </View>
      </BottomSheetComp>

      <BottomSheetComp
        sheetVisible={remarksVisible}
        closePopup={() => setRemarksBox(false)}>
        <View style={styles.uploadedView}>
          <Text style={styles.uploadedLable}>
            Remarks during last service :{" "}
            <Text style={styles.serviceLast}>
              {" "}
              {moment(maintainanceDetails.date).format("DD/MM/YYYY")}
            </Text>
          </Text>
          <Text style={[styles.dateDisplay, { color: "#747474" }]}>
            {applianceListValue &&
              applianceListValue.remarks &&
              applianceListValue.remarks}
          </Text>
          <Text style={styles.remarkDesc}></Text>
        </View>
      </BottomSheetComp>

      {/* <BottomSheetComp
				sheetVisible={applianceOptionVisible}
				closePopup={() => setRemarksBox(false)}>
				<View style={styles.uploadedView}>
					<TouchableOpacity style={styles.listOption}>
						<Image source={edit_appliance} style={styles.applianceOptImg} />
					</TouchableOpacity>
					<TouchableOpacity>
						<Image source={move} style={styles.applianceOptImg} />
					</TouchableOpacity>
					<TouchableOpacity>
						<Image source={resell} style={styles.applianceOptImg} />
					</TouchableOpacity>
					<TouchableOpacity>
						<Image source={archive} style={styles.applianceOptImg} />
					</TouchableOpacity>
				</View>
			</BottomSheetComp> */}

      <BottomSheetComp
        sheetVisible={applianceOptionVisible}
        closePopup={() => setApplianceOptionVisible(false)}>
        <View style={styles.uploadedView}>
          <TouchableOpacity
            style={styles.listOption}
            onPress={() => navigatePage()}>
            <Image source={edit_appliance} style={styles.applianceOptImg} />
            <Text style={styles.optnTxt}>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setMoveVisible(true);
              setApplianceOptionVisible(false);
            }}
            style={styles.listOption}>
            <Image
              source={move}
              style={[styles.applianceOptImg, { width: 16, height: 16 }]}
            />
            <Text style={styles.optnTxt}>Move</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.listOption}>
            <Image
              source={resell}
              style={[styles.applianceOptImg, { width: 17, height: 17 }]}
            />
            <Text style={styles.optnTxt}>Resell</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.listOption}
            onPress={() => {
              setArchiveVisible(true);
              setApplianceOptionVisible(false);
            }}>
            <Image
              source={archive}
              style={[styles.applianceOptImg, { width: 14, height: 12 }]}
            />
            <Text style={styles.optnTxt}>Archive</Text>
          </TouchableOpacity>
        </View>
      </BottomSheetComp>

      <BottomSheetComp
        sheetVisible={moveVisible}
        closePopup={() => setMoveVisible(false)}>
        <Formik
          innerRef={(p) => (formikRef.current = p)}
          validationSchema={signupValidationSchema}
          initialValues={{
            primarylocation: "",
            newlocation: "",
          }}
          onSubmit={(values, action) => moveLocationSubmit(values, action)}>
          {({
            handleSubmit,
            values,
            setFieldValue,
            handleChange,
            errors,
            touched,
            setFieldError,
            setTouched,
          }) => (
            <View style={styles.uploadedView}>
              <View style={styles.yellowBox}>
                <View>
                  <Text style={styles.locaTxt}>Current Location:</Text>
                  <Text style={styles.moveTxt}> {"Home > Bedroom"}</Text>
                </View>
                <View style={{ justifyContent: "center" }}>
                  <Image
                    source={arrowLocation}
                    style={{
                      width: 20,
                      height: 13,
                    }}
                  />
                </View>
                <View>
                  <Text style={styles.locaTxt}>New Location:</Text>
                  <Text style={styles.moveTxt}>{" Home > Bedroom"}</Text>
                </View>
              </View>
              <Text style={styles.moveHeader}>Move to:</Text>

              <View>
                <Text style={styles.label}>Primary Location</Text>

                <ModalDropdownComp
                  onSelect={(data) => onSelectLocation(data, setFieldValue)}
                  ref={dropdownModelref}
                  options={locationName ? locationName : []}
                  isFullWidth
                  renderRow={(props) => (
                    <Text
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        fontSize: 14,
                        color: colorDropText,
                        fontFamily: "Rubik-Regular",
                      }}>
                      {props.label}
                    </Text>
                  )}
                  dropdownStyle={{
                    elevation: 8,
                    borderRadius: 8,
                  }}
                  renderSeparator={(obj) => null}>
                  <FloatingInput
                    placeholder="Select"
                    editable_text={false}
                    type="dropdown"
                    value={values.primarylocation ? values.primarylocation : ""}
                    error={touched.primarylocation && errors.primarylocation}
                    inputstyle={styles.inputStyle}
                    containerStyle={{
                      borderBottomWidth: 0,
                      marginBottom: 0,
                    }}
                    onChangeText={handleChange("primarylocation")}
                    dropdowncallback={() => dropdownModelref.current.show()}
                    rightIcon={
                      <Image
                        source={arrow_down}
                        style={{
                          width: 12,
                          position: "absolute",
                          height: 8.3,
                          right: Dimensions.get("screen").width * 0.11,
                          top: 23,
                        }}
                      />
                    }
                  />
                </ModalDropdownComp>
              </View>
              <View>
                <Text style={styles.label}>{"Appliance Location"}</Text>
                <ModalDropdownComp
                  onSelect={(data) => onSelectNewLocation(data, setFieldValue)}
                  ref={dropdownModelNewref}
                  options={locationName ? locationName : []}
                  isFullWidth
                  renderRow={(props) => (
                    <Text
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        fontSize: 14,
                        color: colorDropText,
                        fontFamily: "Rubik-Regular",
                      }}>
                      {props.label}
                    </Text>
                  )}
                  dropdownStyle={{
                    elevation: 8,
                    borderRadius: 8,
                  }}
                  renderSeparator={(obj) => null}>
                  <FloatingInput
                    placeholder="Select"
                    editable_text={false}
                    type="dropdown"
                    value={values.newlocation ? values.newlocation : ""}
                    error={touched.newlocation && errors.newlocation}
                    inputstyle={styles.inputStyle}
                    containerStyle={{
                      borderBottomWidth: 0,
                      marginBottom: 0,
                    }}
                    onChangeText={handleChange("newlocation")}
                    dropdowncallback={() => dropdownModelNewref.current.show()}
                    rightIcon={
                      <Image
                        source={arrow_down}
                        style={{
                          width: 12,
                          position: "absolute",
                          height: 8.3,
                          right: Dimensions.get("screen").width * 0.11,
                          top: 23,
                        }}
                      />
                    }
                  />
                </ModalDropdownComp>
              </View>
              <View style={{ flex: 1, marginTop: 20 }}>
                <Text style={styles.errorMsg}>{errorMsg}</Text>
              </View>
              <View style={{ flex: 1, marginTop: 20 }}>
                <Text style={styles.successMsg}>{successMsg}</Text>
              </View>
              <View style={{ width: "95%", marginTop: 60 }}>
                <ThemedButton
                  title="Save Changes"
                  onPress={handleSubmit}
                  color={colorLightBlue}
                  btnStyle={{ letterSpacing: 0 }}></ThemedButton>
              </View>
            </View>
          )}
        </Formik>
      </BottomSheetComp>

      <ModalComp visible={archiveVisible}>
        <View style={{ marginBottom: 25 }}>
          <View style={styles.glitterView}>
            <Text style={styles.succesAdded}>Move to Archive</Text>
            <Text style={styles.asstes}>
              Do you want to move this asset to archive?
            </Text>
            <Text style={styles.restores}>
              (You can restore this from archive history later)
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 25,
            }}>
            <ThemedButton
              title="No, Cancel"
              onPress={() => setArchiveVisible(false)}
              color={"#FFFFFF"}
              style={styles.btnDefault}
              btnStyle={{ letterSpacing: 0, color: "#747474" }}
              fontRegular={true}></ThemedButton>
            <ThemedButton
              title="Yes, Archive"
              onPress={() => {
                setMoveArchiveVisible(true);
                setArchiveVisible(false);
              }}
              color={colorLightBlue}
              btnStyle={{ letterSpacing: 0 }}
              style={{
                width: "45%",
                borderRadius: 25,
                justifyContent: "center",
              }}></ThemedButton>
          </View>
        </View>
      </ModalComp>

      <BottomSheetComp
        sheetVisible={moveArchiveVisible}
        closePopup={() => setMoveArchiveVisible(false)}>
        <View style={styles.uploadedView}>
          <View>
            <Text style={styles.archiveTxt}>
              Say why you're moving this to archive?
            </Text>
          </View>
          <View>
            <Text
              style={{
                color: "#393939",
                fontFamily: "Rubik-Medium",
                marginTop: 20,
              }}>
              Choose reason
            </Text>
            <RadioForm
              radio_props={radioProps}
              initial={0}
              value={radio}
              buttonSize={15}
              buttonColor={colorLightBlue}
              buttonInnerColor={colorWhite}
              formHorizontal={true}
              labelHorizontal={true}
              buttonOuterColor={colorLightBlue}
              labelStyle={{ fontFamily: "Rubik-Rergular" }}
              radioStyle={{ paddingRight: 20 }}
              style={{ marginTop: 15, justifyContent: "space-between" }}
              onPress={(value) => {
                setRadio(value);
              }}
            />
          </View>
          <View style={{ flex: 1, marginTop: 20 }}>
            <Text style={styles.errorMsg}>{errorMsg}</Text>
          </View>
          <View style={{ flex: 1, marginTop: 20 }}>
            <Text style={styles.successMsg}>{successMsg}</Text>
          </View>
          <View style={{ width: "95%", marginTop: 60 }}>
            <ThemedButton
              title="Move to Archive"
              onPress={() => submitArchiveLocation()}
              color={colorLightBlue}
              btnStyle={{ letterSpacing: 0 }}></ThemedButton>
          </View>
        </View>
      </BottomSheetComp>
    </View>
  );
};
export default ApplianceMoreDetails;
