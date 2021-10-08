import StatusBar from "@components/StatusBar";
import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import * as RN from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import style from "./style";
import {
  colorAsh,
  colorLightBlue,
  colorplaceholder,
  colorWhite,
} from "@constants/Colors";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { AuthContext } from "@navigation/AppNavigation";
import {
  AddAssetNav,
  DocumentViewNav,
  MyAppliancesNav,
} from "@navigation/NavigationConstant";
import { invitefriendsNav } from "@navigation/NavigationConstant";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CarouselData from "@constants/CarouselData";
import { AddDocumentNav } from "@navigation/NavigationConstant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { constants } from "@utils/config";
import APIKit from "@utils/APIKit";
import { font12 } from "@constants/Fonts";

export const SLIDER_WIDTH = RN.Dimensions.get("window").width + 70;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);
const Dashboard = () => {
  const navigation = useNavigation();
  let { userDetails } = useContext(AuthContext);
  const date = moment(new Date()).format("LL");
  const [applianceList, setApplianceList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const isCarousel = React.useRef(null);
  const [index, setIndex] = React.useState(0);
  const navigateToAddDocument = () => {
    navigation.navigate(AddDocumentNav);
  };
  const listDocument = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(constants.listAppliance);
    if (awaitlocationresp.status == 1) {
      setApplianceList(awaitlocationresp.data.data);
    } else {
      console.log("not listed location type");
    }
  };
  const listAppliance = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(constants.listDocument);
    if (awaitlocationresp.status == 1) {
      setDocumentList(awaitlocationresp.data.data);
    } else {
      console.log("not listed location type");
    }
  };
  const renderItem = ({ item, index }) => {
    console.log("item", item);
    return (
      <RN.View key={index} style={{ flex: 1, margin: 5 }}>
        <RN.TouchableOpacity
          style={{
            height: RN.Dimensions.get("screen").height * 0.3,
            width: RN.Dimensions.get("window").width * 0.45,
            backgroundColor: colorWhite,
            borderRadius: 20,
            elevation: 10,
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
                borderWidth: 1,
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
                borderWidth: 1,
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
  const renderApplianceItem = ({ item, index }) => {
    console.log(item);
    return (
      <RN.View
        key={index}
        style={{ flex: 1, marginLeft: 5, marginTop: 20, marginBottom: 20 }}>
        <RN.TouchableOpacity
          onPress={() =>
            navigation.navigate(DocumentViewNav, { id: item._id })
          }>
          {item.image[0] && item.image ? (
            <RN.Image
              source={{
                uri: "file:///" + item.image[0].path,
              }}
              style={{
                borderWidth: 1,
                height: RN.Dimensions.get("screen").height / 6,
                width: RN.Dimensions.get("screen").width / 4,
                marginLeft: 20,
                marginRight: 10,
                borderRadius: 20,
                paddingLeft: 5,
              }}
            />
          ) : (
            <RN.Image
              source={require("../../assets/images/home/placeholder.jpg")}
              style={{
                borderWidth: 1,
                height: RN.Dimensions.get("screen").height / 6,
                width: RN.Dimensions.get("screen").width / 4,
                marginLeft: 20,
                marginRight: 10,
                borderRadius: 20,
              }}
            />
          )}
          <RN.Text style={{ alignSelf: "center" }}>
            {item.document_type.name
              ? item.document_type.name
              : item.document_type.other_value}
          </RN.Text>
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  useEffect(() => {
    listDocument();
    listAppliance();
  }, []);
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
              <RN.TouchableOpacity style={style.doYouKnowCardButton}>
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
            <RN.View style={{ flex: 1 }}>
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
            <RN.View style={{ flex: 0 }}>
              <AntDesign
                name="calendar"
                color={colorWhite}
                size={22}
                style={{ margin: 20 }}
              />
            </RN.View>
          </RN.View>
          <RN.Text style={style.navbarName} numberOfLines={1}>
            {`Namaste ${userDetails}`}
            <RN.Image
              source={require("../../assets/images/home/namaste.png")}
              style={style.namasteIcon}
            />
          </RN.Text>
          <RN.Text style={style.navbarCalendar}>{date}</RN.Text>
        </RN.View>
        <RN.View>
          {applianceList.length > 0 ? (
            <RN.View>
              <RN.View style={{ flexDirection: "row" }}>
                <RN.View style={{ flex: 1 }}>
                  <RN.Text style={style.title}>{"My Appliances"}</RN.Text>
                </RN.View>
                <RN.View style={{ flex: 1.9 }}>
                  <RN.TouchableOpacity
                    onPress={() => navigation.navigate(AddAssetNav)}
                    style={{
                      height: RN.Dimensions.get("window").height * 0.04,
                      borderColor: "#f3a03c",
                      width: 100,
                      marginTop: 15,
                      borderWidth: 1,
                      borderRadius: 20,
                    }}>
                    <RN.Text
                      style={{
                        fontFamily: "Rubik-Regular",
                        color: "#f3a03c",
                        marginTop: 5,
                        alignSelf: "center",
                      }}>
                      {"Add new + "}
                    </RN.Text>
                  </RN.TouchableOpacity>
                  {/* <RN.View style={{ flex: 1.9 }}>
										<RN.TouchableOpacity onPress = {() => navigation.navigate('MyAssets')}>
											<RN.Text style={{
												color: colorplaceholder,
												fontSize: font12,
												fontFamily: 'Rubik-Regular',
											}}>
                      view all({applianceList && applianceList.length})
											</RN.Text>
										</RN.TouchableOpacity>
									</RN.View> */}
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
                <RN.View style={{ flexDirection: "row" }}>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.title}>{"My Documents"}</RN.Text>
                  </RN.View>
                  <RN.View style={{ flex: 1.8 }}>
                    <RN.TouchableOpacity
                      onPress={() => navigateToAddDocument()}
                      style={{
                        height: RN.Dimensions.get("window").height * 0.04,
                        borderColor: "#f3a03c",
                        width: 100,
                        marginTop: 15,
                        borderWidth: 1,
                        borderRadius: 20,
                      }}>
                      <RN.Text
                        style={{
                          fontFamily: "Rubik-Regular",
                          color: "#f3a03c",
                          marginTop: 5,
                          alignSelf: "center",
                        }}>
                        {"Add new + "}
                      </RN.Text>
                    </RN.TouchableOpacity>
                    {/* <RN.View
											style={{
												flex: 0.3,
												alignItems: 'flex-end',
												marginRight: 10,
												color: colorplaceholder,
												fontSize: font12,
												fontFamily: 'Rubik-Regular',
											}}>
											<RN.TouchableOpacity onPress = {() => navigation.navigate('Documents')}>
												<RN.Text style={style.viewallText}>
                      view all({documentList && documentList.length})
												</RN.Text>
											</RN.TouchableOpacity>
										</RN.View> */}
                  </RN.View>
                </RN.View>
                <RN.FlatList
                  horizontal={true}
                  style={{ marginBottom: 0, marginLeft: 5, marginTop: 10 }}
                  data={documentList}
                  renderItem={renderApplianceItem}
                  showsHorizontalScrollIndicator={false}
                  initialNumToRender={5}
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
            <RN.View style={style.inviteCard}>
              <RN.View style={style.inviteCardRow}>
                <RN.View style={{ flex: 1 }}>
                  <RN.Image
                    source={require("../../assets/images/home/inviteimg1.png")}
                    style={style.inviteCardImage}
                  />
                </RN.View>
                <RN.TouchableOpacity
                  onPress={() => navigation.navigate(invitefriendsNav)}
                  style={{ flex: 1 }}>
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
                </RN.TouchableOpacity>
              </RN.View>
            </RN.View>
          </RN.View>
        </RN.View>
        <RN.View>
          <RN.Text style={style.title}>{"Do you know?"}</RN.Text>
          <RN.View style={{ flex: 1, flexDirection: "row", marginBottom: 20 }}>
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
