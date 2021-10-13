/* eslint-disable indent */
/* eslint-disable unused-imports/no-unused-vars */
import style from "./style";
import React, { useState, useRef, useEffect } from "react";
import { colorAsh, colorBlack, colorLightBlue } from "@constants/Colors";
import { back_icon, ac_image } from "@constants/Images";
import * as RN from "react-native";
import HeaderwithArrow from "../../components/HeaderwithArrow";
import { Animated } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIKit from "@utils/APIKit";
import { constants } from "@utils/config";
import { format } from "date-fns";
import { ApplianceMoreDetailsNav } from "@navigation/NavigationConstant";

export const SLIDER_WIDTH = RN.Dimensions.get("screen").width + 70;
export const deviceWidth = RN.Dimensions.get("window").width;

const CARD_WIDTH = RN.Dimensions.get("window").width * 0.8;
const CARD_HEIGHT = RN.Dimensions.get("window").width * 0.7;
const SPACING_FOR_CARD_INSET = RN.Dimensions.get("window").width * 0.1 - 10;

const images = [
  "https://cdn.pixabay.com/photo/2019/04/21/21/29/pattern-4145023_960_720.jpg",
  "https://cdn.pixabay.com/photo/2017/12/28/15/06/background-3045402_960_720.png",
  "https://cdn.pixabay.com/photo/2017/12/28/15/06/background-3045402_960_720.png",
];

export default function MyAppliances(props) {
  const IsFocused = useIsFocused();
  let applianceDetails = props?.route?.params?.applianceList;
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideRef = useRef(null);
  const scrollRef = useRef(null);
  const [imageActive, setImageActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagenumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  // console.log("applianceDetails",applianceDetails);
  const [applianceID, setApplianceID] = useState(applianceDetails?._id);

  const viewableItemChanged = useRef(({ viewableItems }) => {
    setIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const isCarousel = React.useRef(null);
  const [index, setIndex] = React.useState(0);
  const [view, setView] = React.useState([]);
  const [applianceList, setApplianceList] = useState([]);
  const onChange = (nativeEvent) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurent.width
    );
    if (slide != imageActive) {
      setImageActive(slide);
    }
  };
  useEffect(() => {
    if (applianceList.length > 0) {
      let appliancedata = applianceList;
      let finddata =
        appliancedata &&
        appliancedata.findIndex((data) => data._id == applianceDetails._id);
      if (finddata != -1) {
        setTimeout(() => {
          scrollRef.current.scrollTo({
            x: (CARD_WIDTH + 10) * finddata,
            y: 0,
            animated: true,
          });
        }, 200);
      }
    }
  }, [applianceDetails, applianceList]);

  const listAppliances = async (data) => {
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
      setApplianceList(clonedDocumentList.concat(awaitlocationresp.data.data));
    } else {
      console.log("not listed location type");
    }
  };

  useEffect(() => {
    listAppliances(pagenumber);

    // viewAppliances();
  }, [IsFocused]);

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
    if (applianceList && applianceList.length - 1 == currentIndex) {
      setApplianceID(applianceList[applianceList.length - 1]._id);
      LoadMoreRandomData();
    } else {
      setApplianceID(applianceList[currentIndex]?._id);
    }
  };
  return (
    <RN.View style={style.container}>
      <HeaderwithArrow
        title={applianceDetails?.type?.name}
        color={colorBlack}
        arrow_icon={back_icon}
      />
      <RN.ScrollView
        data={view}
        ref={scrollRef}
        horizontal={true}
        contentInset={{
          top: 0,
          left: SPACING_FOR_CARD_INSET,
          bottom: 0,
          right: SPACING_FOR_CARD_INSET,
        }}
        contentContainerStyle={{
          paddingHorizontal:
            RN.Platform.OS === "android" ? SPACING_FOR_CARD_INSET : 0,
        }}
        snapToInterval={CARD_WIDTH + 10} //your element width
        nestedScrollEnabled={true}
        snapToEnd={false}
        decelerationRate={"fast"}
        scrollEventThrottle={200}
        showsHorizontalScrollIndicator={false}
        // onScrollEndDrag ={()=>console.log("onScrollEndDrag")}
        onMomentumScrollEnd={({ nativeEvent }) => getCurrentIndex(nativeEvent)}>
        {applianceList &&
          applianceList.length > 0 &&
          applianceList.map((obj) => {
            return (
              // eslint-disable-next-line react/jsx-key
              <RN.View style={style.card}>
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
                <RN.View>
                  <RN.View>
                    <FlatList
                      nestedScrollEnabled={true}
                      data={view}
                      keyExtractor={(item, index) => index.toString()}
                      // renderItem={({ item }) => <Items item={item} />}
                      onEndReached={listAppliances}
                      renderItem={({ item }) => (
                        <RN.View
                          style={[
                            style.contain,
                            {
                              height: RN.Dimensions.get("screen").height / 6,
                              width: RN.Dimensions.get("window").width * 0.9,
                            },
                          ]}>
                          {/* <RN.Text>{item.image.}</RN.Text> */}
                          <RN.Text style={{ fontFamily: "Rubik-Regular" }}>
                            {item.category.name}
                          </RN.Text>
                        </RN.View>
                      )}
                      onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        {
                          useNativeDriver: false,
                        }
                      )}
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      pagingEnabled
                      bounces={false}
                      onViewableItemChanged={viewableItemChanged}
                      viewabilityConfig={viewConfig}
                      ref={slideRef}
                    />
                  </RN.View>
                </RN.View>
                <RN.View
                  style={{
                    paddingLeft: 30,
                    paddingBottom: 30,
                    paddingRight: 30,
                  }}>
                  <RN.View
                    style={{ flexDirection: "row", justifyContent: "center" }}>
                    {obj.image.length > 0 && obj.image[0] ? (
                      <RN.Image
                        source={{
                          uri: "file:///" + obj.image[0].path,
                        }}
                        style={{ width: 200, height: 100 }}
                      />
                    ) : (
                      <RN.Image
                        source={ac_image}
                        style={{ width: 200, height: 100 }}
                      />
                    )}
                  </RN.View>
                  <RN.View style={style.content}>
                    <RN.View style={{ flex: 1 }}>
                      <RN.Text style={style.topText}>BrandName</RN.Text>
                      <RN.Text style={style.bottomText}>
                        {obj?.brand?.name}
                      </RN.Text>
                    </RN.View>
                    <RN.View style={{ flex: 1 }}>
                      <RN.Text style={style.topText}>Retailer</RN.Text>
                      <RN.Text style={style.bottomText}>
                        {"vivek T nagar"}
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
                      <RN.Text style={style.topText}>Model Name</RN.Text>
                      <RN.Text style={style.bottomText}>
                        {obj.model.name
                          ? obj.model.name
                          : obj.model.other_value}
                      </RN.Text>
                    </RN.View>
                    <RN.View style={{ flex: 1 }}>
                      <RN.Text style={style.topText}>Serial Number</RN.Text>
                      <RN.Text style={style.bottomText}>
                        {obj.serial_number}
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
                      <RN.Text style={style.topText}>Date Of Purchase</RN.Text>
                      <RN.Text style={style.bottomText}>
                        {format(new Date(obj.purchase_date), "dd/MM/yyyy")}
                      </RN.Text>
                    </RN.View>
                    <RN.View style={{ flex: 1 }}>
                      <RN.Text style={style.topText}>Price Bought</RN.Text>
                      <RN.Text style={style.bottomText}>
                        {"\u20B9"} {""}
                        {obj.price ? obj.price : " 0"}
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
                      <RN.Text style={style.bottomText}>{"03/03/3007"}</RN.Text>
                    </RN.View>
                    <RN.View style={{ flex: 1 }}>
                      <RN.Text style={style.topText}>Service Cost</RN.Text>
                      <RN.Text style={style.bottomText}>
                        {"\u20B9"} {" 1000"}
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
                        {"\u20B9"} {" 377"}
                      </RN.Text>
                    </RN.View>
                    <RN.View style={{ flex: 1 }}>
                      <RN.Text style={style.topText}>Location</RN.Text>
                      <RN.Text style={style.bottomText}>{"chennai"}</RN.Text>
                    </RN.View>
                  </RN.View>
                </RN.View>
              </RN.View>
            );
          })}
        {loading && (
          <RN.ActivityIndicator size="large" color={colorLightBlue} />
        )}
      </RN.ScrollView>

      <RN.View style={style.reminderBtnView}>
        <RN.TouchableOpacity
          style={style.reminderBtnn}
          onPress={() =>
            navigation.navigate(ApplianceMoreDetailsNav, {
              appliance_id: applianceID,
            })
          }>
          <RN.Text style={style.reminderText}>View More Details</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    </RN.View>
  );
}
