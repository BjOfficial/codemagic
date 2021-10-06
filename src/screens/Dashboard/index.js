import StatusBar from "@components/StatusBar";
import moment from "moment";
import React, { useContext } from "react";
import * as RN from "react-native";
import AntDesign from "react-native-vector-icons/AntDesign";
import style from "./style";
import { colorLightBlue, colorWhite } from "@constants/Colors";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import { AddAssetNav } from "@navigation/NavigationConstant";
import {
  invitefriendsNav,
  ApplianceMoreDetailsNav,
} from "@navigation/NavigationConstant";
import { logout } from "@constants/Images";
import auth from "@react-native-firebase/auth";
import { AuthContext } from "@navigation/AppNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Carousel, { Pagination } from "react-native-snap-carousel";
import CarouselData from "@constants/CarouselData";
import { AddDocumentNav } from "@navigation/NavigationConstant";

export const SLIDER_WIDTH = RN.Dimensions.get("window").width + 70;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);
const Dashboard = () => {
  const navigation = useNavigation();
  let { logout_Call } = useContext(AuthContext);
  const date = moment(new Date()).format("LL");
  const logoutCall = () => {
    auth()
      .signOut()
      .then(() => {
        AsyncStorage.removeItem("loginToken");
        logout_Call();
      });
  };

  const isCarousel = React.useRef(null);
  const [index, setIndex] = React.useState(0);

  const navigateToAddDocument = () => {
    navigation.navigate(AddDocumentNav);
  };

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
              <RN.TouchableOpacity onPress={() => logoutCall()}>
                <RN.Image
                  source={logout}
                  style={{ width: 25, height: 22, margin: 10 }}
                />

                {/* 
                                Need future design
                                <AntDesign name="calendar" color={colorWhite} size={22} style={{ margin: 20 }} /> */}
              </RN.TouchableOpacity>
            </RN.View>
          </RN.View>
          <RN.Text style={style.navbarName}>
            {"Namaste Krish "}
            <RN.Image
              source={require("../../assets/images/home/namaste.png")}
              style={style.namasteIcon}
            />
          </RN.Text>
          <RN.Text style={style.navbarCalendar}>{date}</RN.Text>
        </RN.View>
        <RN.View>
          <RN.Text style={style.title}>{"My Assets"}</RN.Text>
          <RN.TouchableOpacity onPress={() => navigation.navigate(AddAssetNav)}>
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
                  <RN.Text style={style.cardTitle}>{"Add Document"}</RN.Text>
                  <RN.Text style={style.cardText}>
                    {"Be on Top of all renwals of documents"}
                  </RN.Text>
                  <RN.Text style={style.cardText}>{"and payments"}</RN.Text>
                </RN.ImageBackground>
              </RN.View>
            </RN.TouchableOpacity>
            <RN.View style={style.inviteCard}>
              <RN.View style={style.inviteCardRow}>
                <RN.View style={{ flex: 1 }}>
                  <RN.Image
                    source={require("../../assets/images/home/inviteimg1.png")}
                    style={style.inviteCardImage}
                  />
                </RN.View>
                <RN.View style={{ flex: 1 }}>
                  <RN.Text style={style.inviteCardTitle}>
                    {"Invite your friends to MyHomeAssets"}
                  </RN.Text>
                  <RN.Text style={style.inviteCardText}>
                    {"Invite contacts to download and use MyHomeAssets"}
                  </RN.Text>
                  <RN.TouchableOpacity
                    style={style.inviteCardButton}
                    onPress={() => navigation.navigate("invitefriends")}>
                    <RN.Text style={style.inviteCardButtonText}>
                      {"Invite Now"}
                    </RN.Text>
                  </RN.TouchableOpacity>
                </RN.View>
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
