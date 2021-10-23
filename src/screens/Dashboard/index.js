import StatusBar from "@components/StatusBar";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import * as RN from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import style from "./style";
import { colorAsh, colorLightBlue, colorWhite } from "@constants/Colors";
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

export const SLIDER_WIDTH = RN.Dimensions.get("window").width + 70;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);
const Dashboard = () => {
  const isFocused = useNavigation();
  const navigation = useNavigation();
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
    return (
      <RN.View key={index} style={{ flex: 1, margin: 5 }}>
        <RN.TouchableOpacity
          style={{
            height: RN.Dimensions.get("screen").height * 0.3,
            width: RN.Dimensions.get("window").width * 0.45,
            backgroundColor: colorWhite,
            borderRadius: 20,
            elevation: 10,
            shadowColor: "#000",
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
          }}
          onPress={() =>
            navigation.navigate(MyAppliancesNav, { applianceList: item })
          }>
          {item.image[0] && item.image ? (
            <RN.Image
              source={{
                uri: "file:///" + item.image[0].path,
              }}
              style={{
                height: RN.Dimensions.get("screen").height / 8,
                width: RN.Dimensions.get("screen").width * 0.4,
                borderRadius: 20,
                marginTop: 20,
                marginLeft: 10,
              }}
            />
          ) : (
            <RN.Image
              source={require("../../assets/images/asset_detail_and_edit/ac.png")}
              style={{
                height: RN.Dimensions.get("screen").height / 8,
                width: RN.Dimensions.get("screen").width * 0.4,
                borderRadius: 20,
                marginTop: 20,
                marginLeft: 10,
              }}
            />
          )}
          <RN.Text
            style={{
              fontFamily: "Rubik-Regular",
              paddingLeft: 20,
              marginTop: 20,
            }}>
            {item.type.name ? item.type.name : item.type.other_value}
          </RN.Text>
          <RN.Text
            style={{
              fontFamily: "Rubik-Regular",
              paddingLeft: 20,
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
          <RN.View style={{ flexDirection: "row" }}>
            <RN.View style={{ flex: 1 }}>
              <RN.Image
                source={require("../../assets/images/home/expirycalender.png")}
                style={{ height: 22, width: 20, marginTop: 10, marginLeft: 20 }}
              />
            </RN.View>
            <RN.View style={{ flex: 2.3 }}>
              <RN.Text
                style={{
                  color: "#8a520d",
                  fontFamily: "Rubik-Regular",
                  marginTop: 15,
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
            elevation: 12,
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
            height: 80,
            width: 80,
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
            width: 80,
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
                  });
                }}>
                <RN.Text style={style.doYouKnowCardButtonTitle}>
                  {"Explore Now"}
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
          <RN.View
            style={{ display: "flex", flexDirection: "row", marginTop: -10 }}>
            <RN.View style={{ flex: 1 }}>
              <RN.Text style={style.navbarName} numberOfLines={1}>
                {`Namaste ${userDetails}`}
              </RN.Text>
            </RN.View>
            <RN.View style={{ flex: 1 }}>
              <RN.ImageBackground
                source={require("../../assets/images/home/namaste.png")}
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
              <RN.View style={{ flexDirection: "row", alignItems: "center" }}>
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
                <RN.FlatList
                  horizontal={true}
                  // style={{ marginBottom: 0, marginLeft: 5, marginTop: 10 }}
                  data={documentList}
                  renderItem={renderdocumentsItem}
                  showsHorizontalScrollIndicator={false}
                  initialNumToRender={4}
                />
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
                    source={require("../../assets/images/home/inviteimg1.png")}
                    style={style.inviteCardImage}
                    resizeMode="contain"
                  />
                </RN.View>
                <RN.View style={{ flex: 0.6, flexDirection: "column" }}>
                  <RN.Text style={style.inviteCardTitle}>
                    {"Invite your friends to MyHomeAssets"}
                  </RN.Text>
                  <RN.Text style={style.inviteCardText}>
                    {"Invite contacts to download and use MyHomeAssets"}
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
          <RN.Text style={style.title}>{"Do you know?"}</RN.Text>
          <RN.View
            style={{ flex: 1, flexDirection: "row", backgroundColor: "red" }}>
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
                marginTop: RN.Dimensions.get("screen").height * 0.23,
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
