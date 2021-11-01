/* eslint-disable indent */
/* eslint-disable unused-imports/no-unused-vars */
import style from "./style";
import React, { useState, useRef, useEffect } from "react";
import { colorAsh, colorBlack, colorLightBlue } from "@constants/Colors";
import { back_icon, defaultImage, brandname } from "@constants/Images";
import * as RN from "react-native";
import HeaderwithArrow from "../../components/HeaderwithArrow";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIKit from "@utils/APIKit";
import { constants } from "@utils/config";
import { format } from "date-fns";
import { ApplianceMoreDetailsNav } from "@navigation/NavigationConstant";
import SnapCarouselComponent from "@components/SnapCarouselComponent";
export const SLIDER_WIDTH = RN.Dimensions.get("screen").width + 70;
export const deviceWidth = RN.Dimensions.get("window").width;

const CARD_WIDTH = RN.Dimensions.get("window").width * 0.8;
const CARD_HEIGHT = RN.Dimensions.get("window").height * 0.65;
const PADDING_TOP = RN.Dimensions.get("window").scale * 28;
const SPACING_FOR_CARD_INSET = RN.Dimensions.get("window").width * 0.1 - 10;

const images = [
  "https://cdn.pixabay.com/photo/2019/04/21/21/29/pattern-4145023_960_720.jpg",
  "https://cdn.pixabay.com/photo/2017/12/28/15/06/background-3045402_960_720.png",
  "https://cdn.pixabay.com/photo/2017/12/28/15/06/background-3045402_960_720.png",
];

export default function MyAppliances(props) {
  const IsFocused = useIsFocused();
  let applianceDetails = props?.route?.params?.applianceList,
    pagenumber_limit = props?.route?.params?.currentIndex,
    detectedPagenumberLimit = pagenumber?.Math.ceil(
      (pagenumber_limit + 1) / 10
    );
  const navigation = useNavigation();

  const [imageActive, setImageActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagenumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const carouselRef = useRef(null);
  // console.log("applianceDetails",applianceDetails);
  const [applianceID, setApplianceID] = useState(applianceDetails?._id);

  const [index, setIndex] = React.useState(0);
  const [view, setView] = React.useState([]);
  const [applianceList, setApplianceList] = useState([]);
  const [currentID, setCurrentID] = useState(0);

  useEffect(() => {
    if (applianceList.length > 0) {
      let appliancedata = applianceList;
      console.log("appliance data", applianceList && applianceList.length);
      let finddata =
        appliancedata &&
        appliancedata.findIndex((data) => data._id == applianceDetails._id);
      console.log("find data", finddata);
      if (finddata != -1) {
        carouselRef.current.snapToItem(finddata);
        setCurrentID(finddata);
      }
    }
  }, [applianceDetails, applianceList]);

  const listAppliances = async (data, reset) => {
    setLoading(true);
    console.log("page data", data);
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);

    let awaitlocationresp = await ApiInstance.get(
      constants.listAppliance +
        "?page_no=" +
        data +
        "&page_limit=" +
        pageLimit +
        "&category_id=" +
        ""
    );
    // console.log("awaitlocationresp length",);
    if (awaitlocationresp.status == 1) {
      // setLoading(false);
      let clonedDocumentList = [...applianceList];
      if (reset) {
        clonedDocumentList = [];
      }
      if (awaitlocationresp && awaitlocationresp.data.data.length > 0) {
        setPageNumber(data);
        setApplianceList(
          clonedDocumentList.concat(awaitlocationresp.data.data)
        );
      }

      if (data != 1 && data <= detectedPagenumberLimit) {
        listAppliances(data + 1);
      } else {
        setLoading(false);
      }
    } else {
      console.log("not listed location type");
    }
  };
  const onSnapItem = (data_index) => {
    console.log("snap index", data_index);
    let clonedList = [...applianceList];
    console.log("cloned index", clonedList && clonedList.length - 1);
    if (data_index == clonedList.length - 1) {
      console.log("length reduce", clonedList && clonedList.length - 1);
      // setPageNumber(pagenumber + 1);
      listAppliances(pagenumber + 1);
    }
    // clonedList.map((obj,index)=>{
    //   console.log("index swipe",index);
    // })
    setCurrentID(data_index);
  };
  useEffect(() => {
    if (IsFocused) {
      listAppliances(pagenumber, "reset");
    }

    // viewAppliances();
  }, [IsFocused]);
  const onImageLoadingError = (event, index) => {
    let applianceListTemp = applianceList;
    let appliance = applianceList[index];
    if (appliance != undefined) {
      appliance.image[0]["isNotImageAvailable"] = true;
      applianceListTemp[index] = appliance;
      setApplianceList(applianceListTemp);
    }
  };
  const list_applicances = (data, index) => {
    try {
      let categoryName = data.category.name.replace(/ /g, "");
      let assetName = data.type.name.replace(/ /g, "");
      let brandName = data.brand.name.replace(/ /g, "");
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
      <RN.View>
        <RN.View style={style.mainLayoutcarousel}>
          <RN.Text style={style.title}>APPLIANCE DETAILS</RN.Text>
          <RN.Text
            style={{
              alignSelf: "center",
              borderTopColor: "gold",
              borderTopWidth: 2,
              width: "10%",
              marginTop: 5,
            }}>
            {"  "}
          </RN.Text>
          <RN.View></RN.View>
          <RN.View
            style={{
              paddingLeft: 30,
              paddingBottom: 30,
              paddingRight: 30,
            }}>
            <RN.View style={{ flexDirection: "row", justifyContent: "center" }}>
              {data.image[0] && data.image[0].isNotImageAvailable ? (
                <RN.Image
                  source={defImg}
                  style={{
                    height: RN.Dimensions.get("screen").height / 8,
                    width: RN.Dimensions.get("screen").width * 0.4,
                    borderRadius: 20,
                    marginTop: 20,
                    marginLeft: 10,
                  }}
                />
              ) : data.image[0] && data.image ? (
                <RN.Image
                  source={{
                    uri: "file:///" + data.image[0].path,
                  }}
                  onError={(e) => onImageLoadingError(e, index)}
                  style={{
                    height: RN.Dimensions.get("screen").height / 8,
                    width: "100%",
                    // borderRadius: 20,
                    // marginTop: 10,
                    // marginLeft: 10,
                  }}
                />
              ) : (
                <RN.Image
                  source={defImg}
                  style={{
                    height: RN.Dimensions.get("screen").height / 8,
                    width: "100%",
                    borderRadius: 20,
                  }}
                />
              )}
              {/* {data.image.length > 0 && data.image[0] ? (
              <RN.Image
                source={{
                  uri: 'file:///' + data.image[0].path,
                }}
                style={{ width: 200, height: 100 }}
              />
            ) : (
              <RN.Image source={ac_image} style={{ width: 200, height: 100 }} />
            )} */}
            </RN.View>
            <RN.View style={style.content}>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>BrandName</RN.Text>
                <RN.Text style={style.bottomText}>{data?.brand?.name}</RN.Text>
              </RN.View>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>Retailer</RN.Text>
                <RN.Text style={style.bottomText}></RN.Text>
              </RN.View>
            </RN.View>
            <RN.View
              style={{
                borderBottomColor: colorAsh,
                borderBottomWidth: 0.3,
              }}
            />
            <RN.View style={style.content}>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>Model Name</RN.Text>
                <RN.Text style={style.bottomText}>
                  {data.model.name ? data.model.name : data.model.other_value}
                </RN.Text>
              </RN.View>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>Serial Number</RN.Text>
                <RN.Text style={style.bottomText}>{data.serial_number}</RN.Text>
              </RN.View>
            </RN.View>
            <RN.View
              style={{
                borderBottomColor: colorAsh,
                borderBottomWidth: 0.3,
              }}
            />
            <RN.View style={style.content}>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>Date Of Purchase</RN.Text>
                <RN.Text style={style.bottomText}>
                  {format(new Date(data.purchase_date), "dd/MM/yyyy")}
                </RN.Text>
              </RN.View>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>Price Bought</RN.Text>
                <RN.Text style={style.bottomText}>
                  {data.price ? "\u20B9 " + data.price : ""}
                </RN.Text>
              </RN.View>
            </RN.View>
            <RN.View
              style={{
                borderBottomColor: colorAsh,
                borderBottomWidth: 0.3,
              }}
            />
            <RN.View style={style.content}>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>Warenty Ending On</RN.Text>
                <RN.Text style={style.bottomText}>{""}</RN.Text>
              </RN.View>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>Service Cost</RN.Text>
                <RN.Text style={style.bottomText}>
                  {data.maintenance.map(
                    (labour) => "\u20B9 " + labour.labour_cost
                  )}
                </RN.Text>
              </RN.View>
            </RN.View>
            <RN.View
              style={{
                borderBottomColor: colorAsh,
                borderBottomWidth: 0.3,
              }}
            />
            <RN.View style={style.content}>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>Spare Cost</RN.Text>
                <RN.Text style={style.bottomText}>
                  {data.maintenance.map(
                    (spare) => "\u20B9 " + spare.spare_cost
                  )}
                </RN.Text>
              </RN.View>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>Location</RN.Text>
                <RN.Text style={style.bottomText}>{""}</RN.Text>
              </RN.View>
            </RN.View>
          </RN.View>
        </RN.View>
      </RN.View>
      // </RN.View>
    );
  };
  const LoadMoreRandomData = () => {
    setPageNumber(pagenumber + 1);
    setApplianceList(pagenumber + 1);
  };
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  const getCurrentIndex = (index) => {
    let xvalue = index?.contentOffset.x;
    let cardvalue = Math.round(CARD_WIDTH + 10);
    let currentIndex = xvalue / cardvalue;
    setCurrentID(currentIndex);
    if (applianceList && applianceList.length - 1 == currentIndex) {
      setApplianceID(applianceList[applianceList.length - 1]._id);
      LoadMoreRandomData();
    } else {
      setApplianceID(applianceList[currentIndex]?._id);
    }
  };
  // console.log("appliance list", applianceList && applianceList.length);
  const title =
    applianceList?.length > 0
      ? applianceList[currentID] && applianceList[currentID].type.name
      : "";
  return (
    <RN.View style={style.container}>
      <HeaderwithArrow
        title={title}
        color={colorBlack}
        arrow_icon={back_icon}
      />

      {applianceList && (
        <SnapCarouselComponent
          sendSnapItem={(index_val) => onSnapItem(index_val)}
          carouselRef={carouselRef}
          carouselItems={applianceList}
          renderItem={({ item, index }) => list_applicances(item, index)}
          currentIndex={1}
        />
      )}
      {loading && (
        <RN.View>
          <RN.ActivityIndicator size="large" color={colorLightBlue} />
        </RN.View>
      )}
      <RN.View style={style.reminderBtnView}>
        <RN.TouchableOpacity
          style={style.reminderBtnn}
          onPress={() =>
            navigation.navigate(ApplianceMoreDetailsNav, {
              appliance_id: applianceList[currentID]?._id,
              appliance_data: applianceList[currentID],
              defaultImage,
            })
          }>
          <RN.Text style={style.reminderText}>View More Details</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    </RN.View>
  );
}
