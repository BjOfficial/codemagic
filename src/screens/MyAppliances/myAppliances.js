/* eslint-disable indent */
/* eslint-disable unused-imports/no-unused-vars */
import style from "./style";
import React, { useState, useRef, useEffect } from "react";
import { colorAsh, colorBlack } from "@constants/Colors";
import { back_icon, ac_image } from "@constants/Images";
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
  let applianceDetails = props?.route?.params?.applianceList;
  console.log("employee detail", applianceDetails);
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

  const onSnapItem = (data_index) => {
    setCurrentID(data_index);
  };
  useEffect(() => {
    if (applianceList.length > 0) {
      let appliancedata = applianceList;
      let finddata =
        appliancedata &&
        appliancedata.findIndex((data) => data._id == applianceDetails._id);

      if (finddata != -1) {
        console.log("carouselRef");
        carouselRef.current.snapToItem(finddata);
        setCurrentID(finddata);
      }
    }
  }, [applianceDetails, applianceList]);

  const listAppliances = async (data, reset) => {
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
    if (awaitlocationresp.status == 1) {
      setLoading(false);
      let clonedDocumentList = [...applianceList];
      if (reset) {
        clonedDocumentList = [];
      }
      setApplianceList(clonedDocumentList.concat(awaitlocationresp.data.data));
    } else {
      console.log("not listed location type");
    }
  };

  useEffect(() => {
    if (IsFocused) {
      listAppliances(pagenumber, "reset");
    }

    // viewAppliances();
  }, [IsFocused]);
  const list_applicances = (data, index) => {
    console.log("index", index);
    return (
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
            {data.image.length > 0 && data.image[0] ? (
              <RN.Image
                source={{
                  uri: "file:///" + data.image[0].path,
                }}
                style={{ width: 200, height: 100 }}
              />
            ) : (
              <RN.Image source={ac_image} style={{ width: 200, height: 100 }} />
            )}
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
                {"\u20B9 "} {data.price ? data.price : ""}
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
                {"\u20B9 "}
                {data.maintenance.map((labour) => labour.labour_cost)}
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
                {"\u20B9 "}
                {data.maintenance.map((spare) => spare.spare_cost)}
              </RN.Text>
            </RN.View>
            <RN.View style={{ flex: 1 }}>
              <RN.Text style={style.topText}>Location</RN.Text>
              <RN.Text style={style.bottomText}>{""}</RN.Text>
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
  console.log("appliance list", applianceList && applianceList.length);
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
      <RN.View style={style.reminderBtnView}>
        <RN.TouchableOpacity
          style={style.reminderBtnn}
          onPress={() =>
            navigation.navigate(ApplianceMoreDetailsNav, {
              appliance_id: applianceList[currentID]?._id,
              appliance_data: applianceList[currentID],
            })
          }>
          <RN.Text style={style.reminderText}>View More Details</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    </RN.View>
  );
}
