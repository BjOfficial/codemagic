/* eslint-disable indent */
/* eslint-disable unused-imports/no-unused-vars */
import style from "./style";
import React, { useState, useRef, useEffect } from "react";
import { colorAsh, colorBlack } from "@constants/Colors";
import { back_icon } from "@constants/Images";
import * as RN from "react-native";
import HeaderwithArrow from "../../components/HeaderwithArrow";
import { Animated } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Paginator from "./paginator";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIKit from "@utils/APIKit";
import { constants } from "@utils/config";

export const SLIDER_WIDTH = RN.Dimensions.get("window").width + 70;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);

const images = [
  "https://cdn.pixabay.com/photo/2019/04/21/21/29/pattern-4145023_960_720.jpg",
  "https://cdn.pixabay.com/photo/2017/12/28/15/06/background-3045402_960_720.png",
  "https://cdn.pixabay.com/photo/2017/12/28/15/06/background-3045402_960_720.png",
];

export default function MyAppliances(props) {
  const navigation = useNavigation();
  const scrollX = useRef(new Animated.Value(0)).current;
  const slideRef = useRef(null);
  const [imageActive, setImageActive] = useState(0);

  const viewableItemChanged = useRef(({ viewableItems }) => {
    setIndex(viewableItems[0].index);
  }).current;
  const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const isCarousel = React.useRef(null);
  const [index, setIndex] = React.useState(0);
  const [view, setView] = React.useState([]);
  const onChange = (nativeEvent) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurent.width
    );
    if (slide != imageActive) {
      setImageActive(slide);
    }
  };

  const viewAppliances = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(constants.viewAppliance);
    if (awaitlocationresp.status == 1) {
      console.log("==========>", JSON.stringify(awaitlocationresp));
      setView(view.concat(awaitlocationresp.data.data));
      console.log("----------->", view);
    } else {
      console.log("not listed location type");
    }
  };

  useEffect(() => {
    viewAppliances();
  }, []);

  // const renderItem = ({ item, index }) => {
  //   return (
  //     <RN.View key={index}>
  //       <RN.Image source={item.img} />
  //     </RN.View>
  //   );
  // };

  return (
    <RN.View style={style.container}>
      <HeaderwithArrow
        title={"Air Conditioner"}
        color={colorBlack}
        arrow_icon={back_icon}
      />
      <RN.ScrollView
        data={view}
        horizontal={true}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}>
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
                onEndReached={viewAppliances}
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
                    <RN.Text>{item.category.name}</RN.Text>
                    {/* <RN.Text>{item.name}</RN.Text>
                      <RN.Text>{item.name}</RN.Text>
                      <RN.Text>{item.name}</RN.Text>
                      <RN.Text>{item.name}</RN.Text> */}
                    {/* 
<RN.Image   
 style={[
  style.image,
  {
    height: RN.Dimensions.get('screen').height / 1.6,
    width: RN.Dimensions.get('window').width * 1,
    resizeMode: 'contain',
    borderRadius: 60,
    // backgroundColor:"red"
  },
]}                                                          
    source={
    (item)=>{
     item.image.path;
}} /> */}

                    {/* {item.map((img, index) => {
                      return (
                        <RN.Image
                          key={(_, index) => index.toString()}
                          source={{ uri: img.image.path }}
                          style={[
                            style.image,
                            {
                              height: RN.Dimensions.get('screen').height / 1.6,
                              width: RN.Dimensions.get('window').width * 1,
                              resizeMode: 'contain',
                              borderRadius: 60,
                              // backgroundColor:"red"
                            },
                          ]}
                        />
                      );
                    })} */}

                    {/* <RN.Image
                      source={{uri : item.image.path}}
                      style={[
                        style.image,
                        {
                          height: RN.Dimensions.get('screen').height / 1.6,
                          width: RN.Dimensions.get('window').width * 1,
                          resizeMode: 'contain',
                          borderRadius: 60,
                          // backgroundColor:"red"
                        },
                      ]}
                    />  */}
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
            <RN.View style={{ alignSelf: "center" }}>
              <Paginator data={view} scrollX={scrollX} />
            </RN.View>
          </RN.View>
          <RN.View
            style={{ paddingLeft: 30, paddingBottom: 30, paddingRight: 30 }}>
            <RN.View style={style.content}>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>BrandName</RN.Text>
                <RN.Text style={style.bottomText}>{"name"}</RN.Text>
              </RN.View>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>Retailer</RN.Text>
                <RN.Text style={style.bottomText}>{"vivek T nagar"}</RN.Text>
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
                  {"256 dc 1.5 ton air condioner"}
                </RN.Text>
              </RN.View>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>Serial Number</RN.Text>
                <RN.Text style={style.bottomText}>
                  {"167 726 827 7287 8278"}
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
                <RN.Text style={style.bottomText}>{"30-11-4994"}</RN.Text>
              </RN.View>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>Price Bought</RN.Text>
                <RN.Text style={style.bottomText}>{"rs 100000"}</RN.Text>
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
                <RN.Text style={style.bottomText}>{"83-3-3007"}</RN.Text>
              </RN.View>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>Service Cost</RN.Text>
                <RN.Text style={style.bottomText}>{"rs 1000"}</RN.Text>
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
                <RN.Text style={style.bottomText}>{"rs 377"}</RN.Text>
              </RN.View>
              <RN.View style={{ flex: 1 }}>
                <RN.Text style={style.topText}>Location</RN.Text>
                <RN.Text style={style.bottomText}>{"chennai"}</RN.Text>
              </RN.View>
            </RN.View>
          </RN.View>
        </RN.View>
      </RN.ScrollView>
      <RN.View style={style.reminderBtnView}>
        <RN.TouchableOpacity
          style={style.reminderBtnn}
          onPress={() => navigation.navigate(MyAppliances)}>
          <RN.Text style={style.reminderText}>View More Details</RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
      {/* <RN.Button style = {style.reminderBtnn}>
        ViewMoreDetails
      </RN.Button> */}
    </RN.View>
  );
}
