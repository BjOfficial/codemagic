/* eslint-disable indent */
/* eslint-disable unused-imports/no-unused-vars */
import style from "./style";
import React, { useState, useRef, useEffect } from "react";
import { colorAsh, colorBlack, colorLightBlue } from "@constants/Colors";
import {
  back_icon,
  defaultImage,
  brandname,
  no_image_icon,
} from "@constants/Images";
import * as RN from "react-native";
import HeaderwithArrow from "../../components/HeaderwithArrow";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIKit from "@utils/APIKit";
import { constants } from "@utils/config";
import { format } from "date-fns";
import RNFS from "react-native-fs";
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
    detectedPagenumberLimit = pagenumber_limit
      ? Math.ceil((pagenumber_limit + 1) / 10)
      : -1;
  console.log("detectedPagenumberLimit", pagenumber_limit);
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
  let temp_id = 0;
  useEffect(() => {
    console.log("coming inside......");
    if (applianceList.length > 0) {
      // console.log('appliance lenth', appliancedata.length);
      // console.log('appliance id', applianceDetails._id);
      // console.log('appliance finddata', finddata);
      if (applianceList.length >= detectedPagenumberLimit * 10) {
        console.log("appliance reached number", applianceList.length);
        let appliancedata = [...applianceList];
        let finddata =
          appliancedata &&
          appliancedata.findIndex((data) => data._id == applianceDetails._id);
        console.log("find data", finddata);
        if (finddata != -1) {
          // console.log('appliance lenth', appliancedata.length);
          // console.log('appliance finddata', finddata);
          // setCurrentID(finddata);
          // setTimeout(()=>{
          // },1000);
        }
      }
    }
  }, [applianceList]);
  // useEffect(() => {
  //   // if(carouselRef.current){
  //   // console.log("current current id",currentID);
  //   // setTimeout(()=>{
  //   _setCarouselToIndex(currentID);
  //   setTimeout(() => {
  //     _setCarouselToIndex(currentID);
  //   }, 1000);
  //   // carouselRef.current.snapToItem(currentID);
  //   // console.log("snappedItem",carouselRef.current.currentIndex);
  //   // },1000)
  //   // }
  // }, [currentID]);

  // Set the carousel to the proper index
  // const _setCarouselToIndex = React.useCallback(
  //   (index) => {
  //     console.log('Snapping carousel to index: ', index);
  //     console.log('The carousel ref is: ', carouselRef.current);

  //     if (carouselRef && carouselRef.current) {
  //       // carouselRef.current?.snapToItem(index);`
  //       // setTimeout(()=>{
  //       // carouselRef.current?.snapToItem(index);
  //       // },1000)
  //       // setTimeout(
  //       // setTimeout(()=>{
  //       //     console.log("prevIndex",prev_index)
  //       //     // return index;
  //       //   });

  //       // },250);
  //       // 250,
  //       // );
  //     }

  //     // setCurrentSlideIndex(index);
  //     // setCarouselData(searchResult);

  //     // _animateToPosition({
  //     //   latitude: data.location_latitude,
  //     //   longitude: data.location_longitude,
  //     // });
  //   },
  //   [carouselRef]
  // );
  useEffect(() => {
    console.log("appliance details updated.....");
    setApplianceList([]);
    tempArray = [];
    // setTimeout(()=>{
    listAppliances(1, "reset");
    // },500);
  }, [applianceDetails]);
  let tempArray = [];
  function checkImageURL(URL) {
    let fileFound = RNFS.readFile(URL, "ascii")
      .then((res) => {
        return true;
      })
      .catch((e) => {
        return false;
      });
    return fileFound;
  }
  const onImageLoadingError = (event, index) => {
    let applianceListTemp = applianceList;
    let appliance = applianceList[index];
    appliance.fileData = false;
    // setDefaultUrl(appliance.defaultImage);
  };
  const listAppliances = async (data, reset, norepeat) => {
    setLoading(true);
    // console.log('page data', data);
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
      awaitlocationresp.data.data.forEach((list) => {
        try {
          let assetName = list.type.name.replace(/ /g, "");
          let brandName = list.brand.name.replace(/ /g, "");
          var defImg;
          defaultImage.forEach((assetType) => {
            defImg = assetType[assetName][brandName].url;
          });
        } catch (e) {
          defImg = no_image_icon;
        }
        if (list.image.length > 0) {
          if (checkImageURL(list.image[0].path)) {
            list.fileData = true;
            list.setImage = list.image[0].path;
          }
        } else {
          list.fileData = false;
          list.defaultImage = defImg;
        }
        list.defaultImage = defImg;
      });
      setApplianceList(awaitlocationresp.data.data);
      let clonedDocumentList = [...applianceList];
      if (reset) {
        clonedDocumentList = [];
        tempArray = [];
      }
      if (awaitlocationresp && awaitlocationresp.data.data.length > 0) {
        if (!norepeat) {
          tempArray = tempArray.concat(awaitlocationresp.data.data);
        } else {
          tempArray = clonedDocumentList.concat(awaitlocationresp.data.data);
        }
        // setPageNumber(data);
      }

      if (
        detectedPagenumberLimit > 1 &&
        data < detectedPagenumberLimit &&
        !norepeat
      ) {
        listAppliances(data + 1);
      } else {
        setPageNumber(data);
        let finddata = tempArray.findIndex(
          (data) => data._id == applianceDetails._id
        );
        let splicingIndexData = [...tempArray],
          splicedIndex = splicingIndexData.splice(finddata, 1),
          unshiftedData = splicingIndexData.unshift(tempArray[finddata]);
        // console.log("printshiftedData",splicingIndexData);
        // console.log("tempArray",tempArray.length)
        setApplianceList([...splicingIndexData]);
        // setTimeout(() => {
        // setCurrentID(pagenumber_limit);
        setLoading(false);
        // }, 1000);
        tempArray = [];
      }
    } else {
      console.log("not listed location type");
    }
  };
  const onSnapItem = (data_index) => {
    console.log("snap index", data_index);
    let clonedList = [...applianceList];
    // console.log('cloned index', clonedList && clonedList.length - 1);
    if (data_index == clonedList.length - 1) {
      //   // console.log('length reduce', clonedList && clonedList.length - 1);
      // setPageNumber(pagenumber + 1);
      listAppliances(pagenumber + 1, null, "norepeat");
    }
    // clonedList.map((obj,index)=>{
    //   console.log("index swipe",index);
    // })
    setCurrentID(data_index);
  };
  // useEffect(() => {
  //   if (IsFocused) {
  //     listAppliances(pagenumber, 'reset');
  //   }

  //   // viewAppliances();
  // }, [IsFocused]);
  const list_applicances = (data, index) => {
    // console.log("slidet data",data);
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
              <RN.Image
                source={
                  !data.fileData
                    ? data.defaultImage
                    : { uri: "file:///" + data.setImage }
                }
                style={{
                  height: RN.Dimensions.get("screen").height / 8,
                  width: RN.Dimensions.get("screen").width * 0.4,
                  borderRadius: 20,
                  marginTop: 20,
                  marginLeft: 10,
                }}
                onError={(e) => onImageLoadingError(e, index)}
              />
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
    // setCurrentID(currentIndex);
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
  console.log("currentIndex", currentID);
  return (
    <RN.View style={style.container}>
      <HeaderwithArrow
        title={title}
        color={colorBlack}
        arrow_icon={back_icon}
      />

      {applianceList && applianceList.length > 0 && (
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
