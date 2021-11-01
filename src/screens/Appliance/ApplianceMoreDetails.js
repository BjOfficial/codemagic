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
} from "react-native";
import styles from "./styles";
import HeaderwithArrow from "@components/HeaderwithArrow";
import { colorBlack, colorLightBlue } from "@constants/Colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  back_icon,
  brandname,
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
} from "@constants/Images";
import BottomSheetComp from "@components/BottomSheetComp";
import { useNavigation } from "@react-navigation/native";
import APIKit from "@utils/APIKit";
import moment from "moment";
import { constants } from "@utils/config";
const ApplianceMoreDetails = (props) => {
  let reminder_data = [
    "You can set up fully customizable reminders for dates (1 week / 1 month or any period in advance of the end date) for end of warranty, AMC, Extended Warranty, Maintenance Service due dates for all your appliances and gadgets so that you can raise issues within the due dates. ",

    "Similarly, you can set up renewal dates for your Passport, Driving License, etc., and payment due dates of your EMI or ECS mandate, etc. Further, these alerts will get populated in your native calendar in your cell phone.",

    "\u{2B24}   You can set your own customizable and mul",
    "\u{2B24}   Important dates for end of warranty, AMC, Extended Warranty, Regular Service ",
    "\u{2B24}   Renewal related - Passport, Driving License for self and family, etc.,",
    "\u{2B24}  Payment due dates - EMI, Loan, ECS, Home mortgage, Insurance premium  etc",
    "\u{2B24}   Any important dates in your life",
  ];
  let edit = [
    "● There are several attributes included for each asset that will be enabled in the beta version ",
    "● The rating of the brand, retailers, service technicians and comments are to help your network in their own purchase decisions",
    "● Also you will earn Azzeti coins when the Brands and Retailers get your ratings and comments that will help them to serve you better ",
    "● Do add as many documents, appliances, gadgets and others as you can to test the Alpha version ",
    "● You will be able to edit and add these additional details in Beta version in the next 3 weeks",
  ];
  const appliance_id = props?.route?.params?.appliance_id;
  const appliance_data = props?.route?.params?.appliance_data;
  const navigation = useNavigation();
  const animatedtab = useRef(new Animated.Value(0)).current;
  const [selecttabs, setSelectTabs] = useState(1);
  const [setImage, setViewImage] = useState(null);
  const [remarksVisible, setRemarksBox] = useState(false);
  const [modalVisible, setmodalVisible] = useState(false);
  const [applianceListValue, setApplianceValue] = useState(null);
  const [bottomImage, setBottomImage] = useState("");
  const [defImage, setDefImage] = useState();
  const title = appliance_data && appliance_data.type.name;
  console.log("appliance_data", title);

  let applianceDetails = [
    {
      id: 1,
      label: "Brand Name",
      value: "Whirlpool",
      icon: brandname,
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
      key: "warrenty_date",
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
      value: "25/03/2023",
      icon: reminderdate,
      months: "",
      key: "reminder_date",
    },
  ];
  let serviceDetails = [
    { id: 1, label: "Invoice/Bill", value: doc_img, icon: invoice },
    { id: 2, label: "Bought From", value: "", icon: boughtfrom },
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
      value: "",
      icon: satisfactionlevel,
      star: false,
    },
  ];
  let applicanceValue = {
    brand: "",
    serial_number: "",
    purchase_date: "",
    warrenty_date: "",
    price: "",
    uploaded_doc: "",
    reminder_date: "",
    remarks: "",
    free_service: "",
  };

  const viewdocuments = (data) => {
    setmodalVisible(true);
    // setViewImage(data);
  };
  useEffect(() => {
    viewAppliances();
  }, [appliance_id]);

  const viewAppliances = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.viewAppliance + "?appliance_id=" + appliance_id
    );
    if (awaitlocationresp.status == 1) {
      console.log(awaitlocationresp.data.data);
      setBottomImage(awaitlocationresp.data.data);
      setDefImage(awaitlocationresp.data.data.default_url);
      let appliancemoredetails = awaitlocationresp.data.data;

      if (appliancemoredetails) {
        let clonedData = { ...applicanceValue };
        clonedData.brand = appliancemoredetails?.brand.name;
        clonedData.free_service = appliancemoredetails?.service_over;
        clonedData.serial_number = appliancemoredetails?.serial_number;
        clonedData.purchase_date = appliancemoredetails
          ? moment(new Date(appliancemoredetails.purchase_date)).format(
              "DD/MM/YYYY"
            )
          : "";
        // clonedData.warrenty_date = appliancemoredetails
        // 	? moment(new Date(appliancemoredetails.purchase_date)).format('DD/MM/YYYY')
        // 	: '';
        clonedData.price =
          appliancemoredetails.price !== "undefined"
            ? "\u20B9 " + appliancemoredetails?.price
            : appliancemoredetails.price === "undefined"
            ? ""
            : "";
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

        appliancemoredetails.maintenance.map((reminder) => {
          console.log("aaaaa", reminder.remarks);
          clonedData.remarks = reminder?.remarks;
        });
        setApplianceValue(clonedData);
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
  console.log("uploaded list", setImage);
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
  const onImageLoadingError = (event, index) => {
    let applianceListTemp = applianceListValue;
    let appliance = applianceListValue[index];
    appliance.image[0]["isNotImageAvailable"] = true;
    applianceListTemp[index] = appliance;
    setApplianceValue(applianceListTemp);
  };
  console.log("appliance", applianceListValue);
  try {
    let categoryName =
      bottomImage && bottomImage.category.name.replace(/ /g, "");
    let assetName = bottomImage && bottomImage.type.name.replace(/ /g, "");
    let brandName = bottomImage && bottomImage.brand.name.replace(/ /g, "");
    var defImg;

    defaultImage.forEach((category) => {
      if (categoryName === "Others") {
        defImg = brandname;
      } else if (typeof category[categoryName] === undefined) {
        defImg = brandname;
      } else {
        category[categoryName].forEach((asset) => {
          if (assetName === "Others") {
            defImg = brandname;
          } else if (typeof asset === undefined) {
            defImg = brandname;
          } else {
            defImg = asset ? asset[assetName][brandName].url : brandname;
          }
        });
      }
    });
  } catch (e) {
    defImg = brandname;
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <HeaderwithArrow
          title={title}
          color={colorBlack}
          arrow_icon={back_icon}
          remainder={true}
          rightIcon={true}
        />
        <View style={styles.productSection}>
          {applianceListValue && applianceListValue.isNotImageAvailable ? (
            <ImageBackground
              source={
                applianceListValue && applianceListValue.uploaded_doc
                  ? {
                      uri: "file:///" + applianceListValue.uploaded_doc,
                    }
                  : defImg
              }
              onError={(e) =>
                onImageLoadingError(e, applianceListValue.uploaded_doc)
              }
              style={styles.productImg}
            />
          ) : (
            <ImageBackground source={defImg} style={styles.productImg} />
          )}
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
                                applianceListValue.isNotImageAvailable ? (
                                  <ImageBackground
                                    source={
                                      applianceListValue &&
                                      applianceListValue.uploaded_doc
                                        ? {
                                            uri:
                                              "file:///" +
                                              applianceListValue.uploaded_doc,
                                          }
                                        : defImg
                                    }
                                    onError={(e) =>
                                      onImageLoadingError(
                                        e,
                                        applianceListValue.uploaded_doc
                                      )
                                    }
                                    style={styles.uploadedImg}
                                  />
                                ) : (
                                  <ImageBackground
                                    source={defImg}
                                    style={styles.uploadedImg}
                                  />
                                )}
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
                                numberOfLines={1}
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
                        reminder_data: 1,
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
                      <Text
                        style={[styles.detailsLabel, styles.labelstyle]}></Text>
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
                      <Text
                        style={[styles.detailsLabel, styles.labelstyle]}></Text>
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
                          <Image
                            source={""}
                            style={styles.uploadedImgService}
                          />
                        ) : (
                          <View style={styles.labelDisplayService}>
                            <Text numberOfLines={1} style={styles.detailsvalue}>
                              {/* {applianceListValue[item.key]} */}
                              {applianceListValue != null
                                ? applianceListValue[item.key]
                                : null}
                            </Text>
                            {item.star && (
                              <ImageBackground
                                source={star}
                                style={styles.starIcon}
                                resizeMode="contain"
                              />
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
                        reminder_data: 1,
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
      {bottomImage && !bottomImage.reminder ? (
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
                Warranty ending on{" "}
                {applianceListValue != null
                  ? applianceListValue.warrenty_date
                  : null}
              </Text>
            </View>
            <View style={{ flex: 0.25 }}>
              <TouchableOpacity style={styles.viewalertBtn}>
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
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            {/* {bottomImage && 
              bottomImage.image.map((img) => {
              	return (
              	// eslint-disable-next-line react/jsx-key
              		<View
              			style={{
              				borderRadius: 30,
              				marginLeft: 10,
              				marginBottom: 20,
              			}}>
              			<ImageBackground
              				source={
              					bottomImage && bottomImage.image
              						? {
              							uri: 'file:///' + img.path,
              						}
              						: null
              				}
              				style={styles.productImage}
              			/>
              		</View>
              	);
              })} */}
          </ScrollView>
        </View>
      </BottomSheetComp>
      <BottomSheetComp
        sheetVisible={remarksVisible}
        closePopup={() => setRemarksBox(false)}>
        <View style={styles.uploadedView}>
          <Text style={styles.uploadedLable}>
            Remarks during last service:{" "}
          </Text>
          <Text style={styles.dateDisplay}>
            {applianceListValue &&
              applianceListValue.remarks &&
              applianceListValue.remarks}
          </Text>
          <Text style={styles.remarkDesc}></Text>
        </View>
      </BottomSheetComp>
    </View>
  );
};
export default ApplianceMoreDetails;
