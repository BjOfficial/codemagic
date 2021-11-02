import StatusBar from "@components/StatusBar";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import * as RN from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import style from "./style";
import {
  colorAsh,
  colorBlack,
  colorLightBlue,
  colorWhite,
} from "@constants/Colors";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { AuthContext } from "@navigation/AppNavigation";
import {
  AddAssetNav,
  DocumentViewNav,
  MyAppliancesNav,
  invitefriendsNav,
  ComingSoonNav,
} from "@navigation/NavigationConstant";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CarouselData from "@constants/CarouselData";
import { AddDocumentNav } from "@navigation/NavigationConstant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { constants } from "@utils/config";
import APIKit from "@utils/APIKit";
import { no_image_icon } from "@constants/Images";
import { colorDropText } from "@constants/Colors";
import { my_reminder } from "@constants/Images";
import { font12 } from "@constants/Fonts";
import { defaultImage, brandname } from "@constants/Images";

export const SLIDER_WIDTH = RN.Dimensions.get("window").width + 70;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);
const Dashboard = () => {
  const isFocused = useNavigation();
  const navigation = useNavigation();
  const [url, setUrl] = useState("");
  let { userDetails } = useContext(AuthContext);
  const date = moment(new Date()).format("LL");
  const [applianceList, setApplianceList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [pagenumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const isCarousel = React.useRef(null);
  const [index, setIndex] = React.useState(0);
  const [totalcountAppliance, setTotalCountAppliance] = React.useState(null);
  const [totalcountdocuments, setTotalCountDoucment] = React.useState(null);

  const navigateToAddDocument = () => {
    navigation.navigate(AddDocumentNav);
  };
  const onImageLoadingError = (event, index) => {
    let applianceListTemp = applianceList;
    let appliance = applianceList[index];
    appliance.image[0]["isNotImageAvailable"] = true;
    applianceListTemp[index] = appliance;
    setApplianceList(applianceListTemp);
  };

  // const getUrl = (item) => {
  //   const categoryName = item.category.name.replace(/ /g, "");
  //   const assetName = item.type.name.replace(/ /g, "");
  //   const brandName = item.brand.name.replace(/ /g, "");
  //   const url = `../../assets/images/default_images/${categoryName}/${assetName}/${assetName}${brandName}.png`;
  //   console.log("dynamic", url);
  //   setUrl(
  //     "../../assets/images/default_images/HomeAppliance/K-WashingMachine/WashingMachineWhirlpool.png"
  //   );
  //   return url;
  // };

  const requestPermission = async () => {
    try {
      const grantedWriteStorage = await RN.PermissionsAndroid.request(
        RN.PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Permission",
          message:
            "App needs access storage permission" +
            "so you can view upload images.",
          // buttonNeutral: "Ask Me Later",
          //  buttonNegative: 'Cancel',
          buttonPositive: "OK",
        }
      );
      const grantedReadStorage = await RN.PermissionsAndroid.request(
        RN.PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      if (
        grantedWriteStorage &&
        grantedReadStorage === RN.PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log("Permission Granted");
      }
      if (
        grantedWriteStorage &&
        grantedReadStorage === RN.PermissionsAndroid.RESULTS.DENIED
      ) {
        // RN.Alert.alert(
        //   "Please allow Camera and Storage permissions in application settings to upload an image"
        // );
        console.log("denied");
      } else {
        console.log("error");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const listAppliance = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.listAppliance +
        "?page_no=" +
        pagenumber +
        "&page_limit=" +
        pageLimit
    );
    if (awaitlocationresp.status == 1) {
      setTotalCountAppliance(awaitlocationresp.data.total_count);
      setApplianceList(awaitlocationresp.data.data);
    } else {
      console.log("not listed location type");
    }
  };
  const listDocument = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);

    let awaitlocationresp = await ApiInstance.get(
      constants.listDocument +
        "?page_no=" +
        pagenumber +
        "&page_limit=" +
        pageLimit +
        "&category_id=" +
        ""
    );
    console.log("lst appliance", awaitlocationresp);
    if (awaitlocationresp.status == 1) {
      setTotalCountDoucment(awaitlocationresp.data.total_count);
      setDocumentList(awaitlocationresp.data.data);
    } else {
      console.log("not listed location type");
    }
  };
  const renderItem = ({ item, index }) => {
    try {
      let categoryName = item.category.name.replace(/ /g, "");
      let assetName = item.type.name.replace(/ /g, "");
      let brandName = item.brand.name.replace(/ /g, "");
      var defImg;

      defaultImage.forEach((category) => {
        if (categoryName === "Others") {
          defImg = brandname;
        } else if (typeof category[categoryName] === undefined) {
          defImg = brandname;
        } else {
          category[categoryName].forEach((asset) => {
            if (typeof asset === undefined) {
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
      <RN.View key={index} style={{ flex: 1, margin: 5 }}>
        <RN.TouchableOpacity
          style={{
            // height: RN.Dimensions.get("window").height * 0.25,
            width: RN.Dimensions.get("window").width * 0.45,
            backgroundColor: colorWhite,
            borderRadius: 10,
            elevation: 6,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
            marginLeft: 10,
            marginBottom: 20,
          }}
          onPress={() =>
            navigation.navigate(MyAppliancesNav, { applianceList: item })
          }>
          {item.image[0] && item.image[0].isNotImageAvailable ? (
            <RN.Image
              source={defImg}
              style={{
                height: RN.Dimensions.get("window").height / 8,
                width: "100%",
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}
            />
          ) : item.image[0] && item.image ? (
            <RN.Image
              source={{
                uri: "file:///" + item.image[0].path,
              }}
              onError={(e) => onImageLoadingError(e, index)}
              style={{
                height: RN.Dimensions.get("window").height / 8,
                width: "100%",
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}
            />
          ) : (
            <RN.Image
              source={defImg}
              style={{
                height: RN.Dimensions.get("window").height / 8,
                width: "100%",
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
              }}
            />
          )}
          <RN.Text
            style={{
              fontFamily: "Rubik-Medium",
              paddingLeft: 10,
              marginTop: 20,
              color: colorBlack,
              fontSize: 12,
            }}>
            {item.type.name ? item.type.name : item.type.other_value}
          </RN.Text>
          <RN.Text
            style={{
              fontFamily: "Rubik-Regular",
              paddingLeft: 10,
              marginTop: 5,
              color: colorAsh,
              fontSize: 12,
              marginBottom: 5,
            }}>
            {item.brand.name ? item.brand.name : item.brand.other_value}
          </RN.Text>
          <RN.View
            style={{
              borderBottomColor: colorAsh,
              borderBottomWidth: 0.5,
            }}
          />
          <RN.View
            style={{
              flexDirection: "row",
              alignItems: "center",
              alignSelf: "center",
            }}>
            <RN.View style={{ flex: 1 }}>
              <RN.Image
                source={require("../../assets/images/home/expirycalender.png")}
                style={{
                  height: 17,
                  width: 15,
                  marginTop: 15,
                  marginBottom: 10,
                  marginLeft: 10,
                }}
              />
            </RN.View>
            <RN.View style={{ flex: 4, marginTop: 5 }}>
              <RN.Text
                style={{
                  color: "#72351C",
                  fontFamily: "Rubik-medium",
                  marginTop: 10,
                  marginBottom: 10,
                  fontSize: font12,
                }}>
                {moment(new Date(item.purchase_date)).format("DD/MM/YYYY")}
              </RN.Text>
            </RN.View>
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  const renderdocumentsItem = ({ item, index }) => {
    return (
      <RN.TouchableOpacity
        // onPress={() =>{  console.log('item._id', item._id); navigation.navigate(DocumentViewNav, { documentId : item._id });}}>
        onPress={() =>
          navigation.navigate(DocumentViewNav, {
            document_id: item,
          })
        }>
        <RN.View
          style={{
            margin: 8,
            elevation: 6,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
            marginBottom: 0,
            borderRadius: 10,
            backgroundColor: colorWhite,
            height: 70,
            width: 70,
          }}>
          {item.image[0] && item.image ? (
            <RN.ImageBackground
              source={{
                uri: "file:///" + item.image[0].path,
              }}
              imageStyle={{ borderRadius: 10 }}
              style={{
                height: "100%",
                width: "100%",
                borderRadius: 10,
              }}
              resizeMode="cover"></RN.ImageBackground>
          ) : (
            <RN.ImageBackground
              source={no_image_icon}
              style={{
                height: "100%",
                width: "100%",
              }}
              resizeMode="contain"></RN.ImageBackground>
          )}
        </RN.View>
        <RN.View
          style={{
            width: 70,
            margin: 8,
            // marginHorizontal: 15,
            marginTop: 5,
          }}>
          <RN.Text
            style={{
              width: "100%",
              fontFamily: "Rubik-Medium",
              textAlign: "center",
              color: colorDropText,
              fontSize: 12,
              marginVertical: 5,
            }}
            numberOfLines={2}>
            {item.document_type.name
              ? item.document_type.name
              : item.document_type.other_value}
          </RN.Text>
        </RN.View>
      </RN.TouchableOpacity>
    );
  };

  useEffect(() => {
    navigation.addListener("focus", () => {
      listDocument();
      listAppliance();
      requestPermission();
    });
    requestPermission();
    listDocument();
    listAppliance();
  }, [isFocused]);
  const DrawerScreen = () => {
    return navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const carouselCard = ({ item, index }) => {
    return (
      <RN.View key={index}>
        <RN.ImageBackground
          source={item.img}
          style={style.doYouKnowCardBackground}>
          <RN.View style={style.doYouKnowCardRow}>
            <RN.View style={{ flex: 1 }}>
              <RN.Text style={style.doYouKnowCardTitle}>{item.title}</RN.Text>
              <RN.Text style={style.doYouKnowcardText}>{item.body}</RN.Text>
              <RN.TouchableOpacity
                style={style.doYouKnowCardButton}
                onPress={() => {
                  navigation.navigate(ComingSoonNav, {
                    content: item.content,
                    icon: item.icon,
                    title: item.title,
                  });
                }}>
                <RN.Text
                  style={[
                    style.doYouKnowCardButtonTitle,
                    { color: item.color },
                  ]}>
                  {item.explore}
                </RN.Text>
              </RN.TouchableOpacity>
            </RN.View>
            <RN.View style={{ flex: 1 }}></RN.View>
          </RN.View>
        </RN.ImageBackground>
      </RN.View>
    );
  };

  return (
    <RN.View style={style.container}>
      <StatusBar />
      <RN.ScrollView showsVerticalScrollIndicator={false}>
        <RN.View style={style.navbar}>
          <RN.View style={style.navbarRow}>
            <RN.View
              style={{
                flex: 1,
                paddingTop: RN.Platform.OS === "ios" ? 20 : 0,
              }}>
              <RN.TouchableOpacity
                onPress={() => {
                  DrawerScreen();
                }}>
                <RN.Image
                  source={require("../../assets/images/home/menu.png")}
                  style={style.notificationIcon}
                />
              </RN.TouchableOpacity>
            </RN.View>
            <RN.View
              style={{
                flex: 0,
                paddingTop: RN.Platform.OS === "ios" ? 20 : 0,
              }}>
              <RN.TouchableOpacity
                onPress={() => {
                  navigation.navigate(ComingSoonNav, {
                    title: "Calender",
                    content: [
                      "\u2B24   The important dates that you need to take any action will get added to your calendar within Azzetta",
                      "\u2B24   We also plan to integrate the reminders as chosen by you to the native calendar of the phone",
                      "\u2B24   Do suggest your expectations in the feedback form by clicking here (to open Google Form)",
                    ],
                    icon: my_reminder,
                  });
                }}>
                <AntDesign
                  name="calendar"
                  color={colorWhite}
                  size={22}
                  style={{ margin: 20 }}
                />
              </RN.TouchableOpacity>
            </RN.View>
          </RN.View>
          <RN.View style={{ flexDirection: "row", marginTop: -10, flex: 1 }}>
            {/* <RN.View style={{ flex: 1 }}> */}
            <RN.Text style={style.namaste}>Namaste</RN.Text>
            <RN.Text style={style.navbarName} numberOfLines={1}>
              {`${
                userDetails.length > 10
                  ? userDetails.substring(0, 10) + "... "
                  : userDetails + " "
              }`}
            </RN.Text>
            {/* </RN.View> */}
            <RN.View style={{ flex: 1 }}>
              <RN.ImageBackground
                source={require("../../assets/images/home/namaste.png")}
                style={style.namasteIcon}
                resizeMode="contain"
              />
            </RN.View>
            <RN.View style={{ flex: 1 }}>
              <RN.ImageBackground
                source={require("../../assets/images/home/switchaccount.png")}
                style={style.namasteIcon}
                resizeMode="contain"
              />
            </RN.View>
          </RN.View>
          <RN.Text style={style.navbarCalendar}>{date}</RN.Text>
        </RN.View>
        <RN.View>
          {applianceList.length > 0 ? (
            <RN.View>
              <RN.View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 20,
                }}>
                <RN.View style={{ flex: 0.45 }}>
                  <RN.Text style={style.title}>{"My Appliances"}</RN.Text>
                </RN.View>
                <RN.View style={{ flex: 0.25 }}>
                  <RN.TouchableOpacity
                    onPress={() => navigation.navigate(AddAssetNav)}
                    style={style.addBtn}>
                    <RN.Text style={style.addNewBtn}>{"Add new + "}</RN.Text>
                  </RN.TouchableOpacity>
                </RN.View>
                <RN.View
                  style={{
                    flex: 0.3,
                    alignItems: "flex-end",
                    marginRight: 10,
                  }}>
                  <RN.TouchableOpacity
                    onPress={() => navigation.navigate("MyAssets")}>
                    <RN.Text style={style.viewallText}>
                      view all ({totalcountAppliance && totalcountAppliance})
                    </RN.Text>
                  </RN.TouchableOpacity>
                </RN.View>
              </RN.View>

              <RN.FlatList
                horizontal={true}
                style={{ marginBottom: 0, marginLeft: 5 }}
                data={applianceList}
                renderItem={renderItem}
                keyExtractor={(item, index) => {
                  return item.id;
                }}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={5}
              />
            </RN.View>
          ) : (
            <RN.View>
              <RN.Text style={style.title}>{"My Assets"}</RN.Text>

              <RN.TouchableOpacity
                onPress={() => navigation.navigate(AddAssetNav)}>
                <RN.View style={style.card}>
                  <RN.ImageBackground
                    source={require("../../assets/images/emptyStates/emptybg.png")}
                    style={style.cardBackgroundImage}
                    imageStyle={{ borderRadius: 20 }}>
                    <AntDesign
                      name="pluscircle"
                      color={colorLightBlue}
                      size={30}
                      style={style.plusCircleIcon}
                    />
                    <RN.Text style={style.cardTitle}>{"Add Assets"}</RN.Text>
                    <RN.Text style={style.cardText}>
                      {"Manage your assests like an expert"}
                    </RN.Text>
                  </RN.ImageBackground>
                </RN.View>
              </RN.TouchableOpacity>
            </RN.View>
          )}
          <RN.View>
            {documentList.length > 0 ? (
              <RN.View>
                <RN.View style={{ flexDirection: "row", alignItems: "center" }}>
                  <RN.View style={{ flex: 0.45 }}>
                    <RN.Text style={style.title}>{"My Documents"}</RN.Text>
                  </RN.View>
                  <RN.View style={{ flex: 0.25 }}>
                    <RN.TouchableOpacity
                      onPress={() => navigateToAddDocument()}
                      style={style.addBtn}>
                      <RN.Text style={style.addNewBtn}>{"Add new + "}</RN.Text>
                    </RN.TouchableOpacity>
                  </RN.View>
                  <RN.View
                    style={{
                      flex: 0.3,
                      alignItems: "flex-end",
                      marginRight: 10,
                    }}>
                    <RN.TouchableOpacity
                      onPress={() => navigation.navigate("Documents")}>
                      <RN.Text style={style.viewallText}>
                        view all ({totalcountdocuments && totalcountdocuments})
                      </RN.Text>
                    </RN.TouchableOpacity>
                  </RN.View>
                </RN.View>
                <RN.View style={{ marginLeft: 15 }}>
                  <RN.FlatList
                    horizontal={true}
                    // style={{ marginBottom: 0, marginLeft: 5, marginTop: 10 }}
                    data={documentList}
                    renderItem={renderdocumentsItem}
                    showsHorizontalScrollIndicator={false}
                    initialNumToRender={4}
                  />
                </RN.View>
              </RN.View>
            ) : (
              <RN.View>
                <RN.Text style={style.title}>{"My Documents"}</RN.Text>

                <RN.TouchableOpacity onPress={() => navigateToAddDocument()}>
                  <RN.View style={style.card}>
                    <RN.ImageBackground
                      source={require("../../assets/images/emptyStates/emptybg.png")}
                      style={style.cardBackgroundImage}
                      imageStyle={{ borderRadius: 20 }}>
                      <AntDesign
                        name="pluscircle"
                        color={colorLightBlue}
                        size={30}
                        style={style.plusCircleIcon}
                      />
                      <RN.Text style={style.cardTitle}>
                        {"Add Document"}
                      </RN.Text>
                      <RN.Text style={style.cardText}>
                        {"Be on Top of all renwals of documents"}
                      </RN.Text>
                      <RN.Text style={style.cardText}>{"and payments"}</RN.Text>
                    </RN.ImageBackground>
                  </RN.View>
                </RN.TouchableOpacity>
              </RN.View>
            )}
            <RN.TouchableOpacity
              style={style.inviteCard}
              onPress={() => navigation.navigate(invitefriendsNav)}>
              <RN.View style={style.inviteCardRow}>
                <RN.View style={{ flex: 0.4 }}>
                  <RN.Image
                    source={require("../../assets/images/home/inviteimg.png")}
                    style={style.inviteCardImage}
                    resizeMode="contain"
                  />
                </RN.View>
                <RN.View style={{ flex: 0.6, flexDirection: "column" }}>
                  <RN.Text style={style.inviteCardTitle}>
                    {"Invite your friends to Azzetta"}
                  </RN.Text>
                  <RN.Text style={style.inviteCardText}>
                    {"Invite contacts to download and use Azzetta App."}
                  </RN.Text>
                  <RN.TouchableOpacity
                    style={style.inviteCardButton}
                    onPress={() => navigation.navigate(invitefriendsNav)}>
                    <RN.Text style={style.inviteCardButtonText}>
                      {"Invite Now"}
                    </RN.Text>
                  </RN.TouchableOpacity>
                </RN.View>
              </RN.View>
            </RN.TouchableOpacity>
          </RN.View>
        </RN.View>
        <RN.View>
          <RN.ImageBackground
            source={require("@assets/images/home/replace.png")}
            style={style.doYouKnowCardBackgroundRed}>
            <RN.View style={style.doYouKnowCardRow}>
              <RN.View style={{ flex: 1.7 }}>
                <RN.Text style={style.doYouKnowCardTitle}>
                  Looking to replace or upgrade any appliance?
                </RN.Text>
                <RN.Text style={style.doYouKnowcardText}>
                  Exchange your old appliance with new one!
                </RN.Text>
                <RN.TouchableOpacity
                  style={style.doYouKnowCardButtonRed}
                  onPress={() => {
                    navigation.navigate(ComingSoonNav, {
                      title: "Looking to replace or upgrade any appliance",
                      icon: my_reminder,
                      content: [
                        "Looking to replace or upgrade any appliance? Exchange your old appliance with new one!",
                      ],
                    });
                  }}>
                  <RN.Text style={style.doYouKnowCardButtonTitleRed}>
                    {"Choose Now"}
                  </RN.Text>
                </RN.TouchableOpacity>
              </RN.View>
              <RN.View style={{ flex: 1 }}></RN.View>
            </RN.View>
          </RN.ImageBackground>
        </RN.View>
        <RN.View>
          <RN.Text style={style.doYouKnow}>{"Do you know?"}</RN.Text>
          <RN.View style={{ flex: 1, flexDirection: "row" }}>
            <RN.View style={{ flex: 1 }}>
              <Carousel
                data={CarouselData}
                ref={isCarousel}
                renderItem={carouselCard}
                sliderWidth={SLIDER_WIDTH}
                itemWidth={ITEM_WIDTH}
                useScrollView={true}
                layoutCardOffset={9}
                inactiveSlideShift={0}
                onSnapToItem={(index) => setIndex(index)}
              />
            </RN.View>
            <RN.View
              style={{
                flex: 1,
                marginTop: RN.Dimensions.get("screen").height * 0.15,
                alignSelf: "center",
              }}>
              <Pagination
                dotsLength={CarouselData.length}
                activeDotIndex={index}
                carouselRef={isCarousel}
                dotStyle={{
                  width: 15,
                  height: 4,
                  borderRadius: 2,
                  marginHorizontal: -10,
                  backgroundColor: colorWhite,
                }}
                inactiveDotOpacity={0.5}
                inactiveDotScale={0.4}
                tappableDots={true}
              />
            </RN.View>
          </RN.View>
        </RN.View>
      </RN.ScrollView>
    </RN.View>
  );
};

export default Dashboard;
