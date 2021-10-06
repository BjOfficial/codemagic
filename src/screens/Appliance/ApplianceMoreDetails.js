/* eslint-disable no-mixed-spaces-and-tabs */
import React, { useState, Fragment, useRef } from "react";
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
import {
  back_icon,
  ac_image,
  brandname,
  serialnumber,
  doc_img,
  warrantyending,
  pricebought,
  uploadeddoc,
  reminderdate,
  addreminder_white,
  lastservice,
  alert_icon,
  invoice,
  boughtfrom,
  freeservice,
  satisfactionlevel,
  star,
  calendar_check,
  remarks,
} from "@constants/Images";
import BottomSheetComp from "@components/BottomSheetComp";
const ApplianceMoreDetails = () => {
  const animatedtab = useRef(new Animated.Value(0)).current;
  const [selecttabs, setSelectTabs] = useState(1);
  const [setImage, setViewImage] = useState(null);
  const [modalVisible, setmodalVisible] = useState(false);

  let applianceDetails = [
    { id: 1, label: "Brand Name", value: "Whirlpool", icon: brandname },
    {
      id: 2,
      label: "Serial Number",
      value: "2345 6789 9876 5432",
      icon: serialnumber,
    },
    {
      id: 3,
      label: "Date Of Purchase",
      value: "25/03/2019",
      months: "4 years and 8 months",
      icon: calendar_check,
    },
    {
      id: 4,
      label: "Warranty Ending On",
      value: "25/04/2023",
      icon: warrantyending,
    },
    { id: 5, label: "Price Bought", value: "₹4,050", icon: pricebought },
    {
      id: 6,
      label: "Uploaded Document",
      value: [
        { image: doc_img },
        { image: doc_img },
        { image: doc_img },
        { image: doc_img },
        { image: doc_img },
        { image: doc_img },
        { image: doc_img },
        { image: doc_img },
      ],
      icon: uploadeddoc,
    },
    { id: 7, label: "Reminder Date", value: "25/03/2023", icon: reminderdate },
  ];
  let serviceDetails = [
    { id: 1, label: "Invoice/Bill", value: doc_img, icon: invoice },
    { id: 2, label: "Bought From", value: "Vivek's", icon: boughtfrom },
    {
      id: 3,
      label: "Free Service Availability",
      value: "2 Service Available",
      icon: freeservice,
    },
    {
      id: 4,
      label: "Satisfaction Level",
      value: "4",
      icon: satisfactionlevel,
      star: true,
    },
  ];
  const viewdocuments = (data) => {
    setmodalVisible(true);
    setViewImage(data);
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
  console.log(animateTabStyle);
  return (
    <View style={styles.container}>
      <ScrollView>
        <HeaderwithArrow
          title="Air conditioner"
          color={colorBlack}
          arrow_icon={back_icon}
          remainder={true}
          rightIcon={true}
        />
        <View style={styles.productSection}>
          <ImageBackground source={ac_image} style={styles.productImg} />
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
                          <>
                            {item && item.value.length > 0 && (
                              <Fragment>
                                <TouchableOpacity style={{ paddingLeft: 10 }}>
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "flex-end",
                                      justifyContent: "flex-end",
                                    }}>
                                    <Image
                                      source={item.value[0].image}
                                      style={styles.uploadedImg}
                                    />
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
                                        },
                                      ]}>
                                      <Text style={{ color: "white" }}>
                                        +{item.value.length - 1}
                                      </Text>
                                    </View>
                                  </TouchableOpacity>
                                )}
                              </Fragment>
                            )}
                          </>
                        ) : (
                          <>
                            {item.months ? (
                              <View style={styles.labelDisplay}>
                                <Text style={styles.detailsvalue}>
                                  {item.value}
                                </Text>
                                <Text
                                  numberOfLines={1}
                                  style={styles.addtionalLabel}>
                                  {item.months}
                                </Text>
                              </View>
                            ) : (
                              <Text
                                numberOfLines={1}
                                style={styles.detailsvalue}>
                                {item.value}
                              </Text>
                            )}
                          </>
                        )}
                      </View>
                    </View>
                  );
                })}

              <View style={styles.reminderBtnView}>
                <TouchableOpacity style={styles.reminderBtnn}>
                  <Image
                    source={addreminder_white}
                    style={styles.reminderIcon}
                  />
                  <Text style={styles.reminderText}>Add Reminder</Text>
                </TouchableOpacity>
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
                      style={{ width: 21, height: 24 }}
                      resizeMode="contain"
                    />
                    <View style={{ flexDirection: "column" }}>
                      <Text numberOfLines={1} style={styles.detailsLabel}>
                        Last Service On
                      </Text>
                      <Text style={[styles.detailsLabel, styles.labelstyle]}>
                        25/03/2023
                      </Text>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}>
                        <Text style={[styles.detailsLabel, styles.remarkStyle]}>
                          Remarks
                        </Text>
                        <Image source={remarks} style={styles.remarkIcon} />
                      </View>
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
                      style={{ width: 21, height: 24 }}
                      resizeMode="contain"
                    />
                    <View style={{ flexDirection: "column" }}>
                      <Text numberOfLines={1} style={styles.detailsLabel}>
                        Amount Paid
                      </Text>
                      <Text style={[styles.detailsLabel, styles.labelstyle]}>
                        ₹2,500
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
                          <Image
                            source={item.value}
                            style={styles.uploadedImgService}
                          />
                        ) : (
                          <View style={styles.labelDisplayService}>
                            <Text style={styles.detailsvalue}>
                              {item.value}
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
                <TouchableOpacity style={styles.reminderBtnn}>
                  <Image
                    source={addreminder_white}
                    style={styles.reminderIcon}
                  />
                  <Text style={styles.reminderText}>Add Reminder</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
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
          <View style={{ flex: 0.67 }}>
            <Text style={styles.warrantytext}>
              Warranty ending on 25/03/2021
            </Text>
          </View>
          <View style={{ flex: 0.23 }}>
            <TouchableOpacity style={styles.viewalertBtn}>
              <Text style={styles.viewalertlabel}>View alert</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <BottomSheetComp
        sheetVisible={modalVisible}
        closePopup={() => setmodalVisible(false)}>
        <View style={styles.uploadedView}>
          <Text style={styles.uploadedLable}>Uploaded Documents</Text>
          <ScrollView horizontal>
            {setImage &&
              setImage.map((img) => {
                return (
                  // eslint-disable-next-line react/jsx-key
                  <Image
                    source={img.image}
                    resizeMode="contain"
                    style={styles.uploadedImgview}
                  />
                );
              })}
          </ScrollView>
        </View>
      </BottomSheetComp>
    </View>
  );
};
export default ApplianceMoreDetails;
