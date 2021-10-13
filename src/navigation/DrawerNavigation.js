import React, { useState, useContext } from "react";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import * as RN from "react-native";
import { invitation_avatar } from "@constants/Images";
import {
  colorLightWhite,
  colorBlueBlack,
  colorLightBlue,
  colorWhite,
  colorGray,
  colorOrange,
} from "@constants/Colors";
import { location } from "@constants/Images";
import {
  home,
  map,
  my_appliances,
  arrow_down_menu,
  document_menu,
  add_location,
  my_remainders,
  delegate_menu,
  local_business,
  my_resale,
  my_rewards,
  my_vintage,
  logout,
  settings_menu,
  my_reminder,
  my_resale_cs,
  my_rewards_sn,
  local_business_cs,
  delegate_cs,
} from "@constants/Images";
import auth from "@react-native-firebase/auth";
import { AuthContext } from "@navigation/AppNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { font14 } from "@constants/Fonts";
import { ComingSoonNav } from "@navigation/NavigationConstant";

const CustomDrawer = (props) => {
  let reminder_data = [
    "You can set up fully customizable reminders for dates (1 week / 1 month or any period in advance of the end date) for end of warranty, AMC, Extended Warranty, Maintenance Service due dates for all your appliances and gadgets so that you can raise issues within the due dates,Similarly, you can set up renewal dates for your Passport, Driving License, etc., and payment due dates of your EMI or ECS mandate, etc. Further, these alerts will get populated in your native calendar in your cell phone",
  ];
  let delegate_data = [
    "Azzetta is designed to be a family App and family members should be able to share the responsibility to update and take action for all maintenance and upkeep of all assets at your residence (primary location). Until this feature is made available you can open Azzetta with your credentials in your family member cell phone and all updates required for onboarding of appliances / gadgets can be done in a transparent manner.",

    "Further, we would like to get your feedback to use this feature for adding your admin manager as your Delegate in your office, factory, or business premises. We plan to charge a nominal fee for multi-location if you would like to use Azzetta for managing assets across multiple locations",
  ];
  let local_business_data = [
    "One of the objectives of Azzetta is to promote local businesses in your area. We plan to start with service and repair of appliances and gadgets before expanding to a wider set of services / professionals. You can add details of your trusted AC technician, carpenter, electrician, plumber and handyman and you can send WhatsApp messages to them or call them when needed.",

    "You can also provide rating and comments for local businesses that your network can benefit with your recommendations and more opportunity through this digital listing in Azzetta. You can check the list of local businesses we plan to onboard in our FAQ section of our website www.azzetta.com",
  ];
  let resale_data = [
    "Your end-of-life appliances can possibly fetch a better price than what is prevailing in the market. More often than not your new appliance purchase and disposal of old one is a combined decision. Your old appliance is carted away when the new appliance is delivered. Azzetta plans to explore the opportunity to dispose of your old appliances at a higher price than what is traditionally offered by the retailer for the exchange deal. We plan to identify second-hand dealers for each type of appliance / gadget in the top 100 cities in a phased manner.",

    "Now you have the option to take your decision of disposing of your used appliances and buying replacements independently. You can discover the price for the appliance (based on brand. model, vintage and working condition, etc.,) through Azzetta  by flagging an item where accredited second-hand dealers will bid for the same. You pick the best price offered by the dealers through this feature in Azzetta. ",

    "Also, you can donate your appliance to a designated charity organization or training centre when we roll out for your city.",
  ];
  let rewards_data = [
    "Azzetta is going to be an ‘invitation only’ application and the reward points are called Azzeti coins. You get rewarded by inviting your friends and family to download Azzetta. Each invite sent out gets you 5 coins and based on your invitation every download and install gets you 50 Azzeti coins. Your invitees get to choose whose invitation they accept and hence sooner you send out your invitation the likelihood of that being the only invite your contact gets to choose when they download and install. You also get additional 20 coins when your first circle of users send invitations to your second circle, and they install and start using Azzetta.",

    "These sets of users are your trusted network who could give you recommendations for buying new appliances or gadgets and hence higher the number of users in your network the better the feedback coverage and comments. The Azzeti coins can be redeemed when you buy new appliances or gadgets and get discounts for your AMC and wide variety of services from local businesses. You can also upgrade your membership as a premium member by redeeming Azzeti coins. You will have the opportunity to support designated NGO partners with 10% of Azzeti coins earned by you during the year as part of giving back to our society. ",
  ];
  const navigation = useNavigation();
  const [locationView, setLocationView] = useState(false);
  let { logout_Call, userDetails } = useContext(AuthContext);
  const [menu] = useState([
    {
      name: "Home",
      icon: home,
      height: 19,
      width: 20,
      route: "bottomTab",
    },
    {
      name: "My Appliances",
      icon: my_appliances,
      height: 20,
      width: 17,
      route: "MyAssets",
    },
    {
      name: "My Documents",
      icon: document_menu,
      height: 20,
      width: 16,
      route: "Documents",
    },
    {
      name: "My Reminders",
      icon: my_remainders,
      height: 20,
      width: 17,
      route: "",
    },
    {
      name: "Delegate",
      icon: delegate_menu,
      height: 21,
      width: 20,
      route: "",
    },
    {
      name: "Local Business",
      icon: local_business,
      height: 23,
      width: 22,
      route: "",
    },
    {
      name: "My Resale",
      icon: my_resale,
      height: 15,
      width: 25,
      marginTop: 7,
      route: "",
    },
    {
      name: "My Rewards",
      icon: my_rewards,
      height: 15,
      width: 25,
      marginTop: 6,
      route: "",
    },
    {
      name: "My Assests Vintage",
      icon: my_vintage,
      height: 20,
      width: 20,
      marginTop: 4,
      route: "",
    },
    {
      name: "Log Out",
      icon: logout,
      height: 17,
      width: 20,
      marginTop: 4,
      color: "#da6161",
      route: "logout",
    },
  ]);
  const logoutCall = () => {
    auth()
      .signOut()
      .then(() => {
        AsyncStorage.removeItem("loginToken");
        AsyncStorage.removeItem("userDetails");
        logout_Call();
      });
  };
  const navigateRoutes = (data) => {
    if (data.name == "Log Out") {
      logoutCall();
    } else if (data.name == "My Appliances") {
      navigation.navigate("MyAssets");
    } else if (data.name == "My Documents") {
      navigation.navigate("Documents");
    } else if (data.name == "Home") {
      navigation.navigate("Dashboard");
    } else if (data.name == "My Reminders") {
      navigation.navigate(ComingSoonNav, {
        title: "My Reminders",
        content: reminder_data,
        icon: my_reminder,
      });
    } else if (data.name == "Delegate") {
      navigation.navigate(ComingSoonNav, {
        title: "Delegate",
        content: delegate_data,
        icon: delegate_cs,
      });
    } else if (data.name == "Local Business") {
      navigation.navigate(ComingSoonNav, {
        title: "Local Business",
        content: local_business_data,
        icon: local_business_cs,
      });
    } else if (data.name == "My Resale") {
      navigation.navigate(ComingSoonNav, {
        title: "My Resale",
        content: resale_data,
        icon: my_resale_cs,
      });
    } else if (data.name == "My Rewards") {
      navigation.navigate(ComingSoonNav, {
        title: "My Rewards",
        content: rewards_data,
        icon: my_rewards_sn,
      });
    }
  };
  return (
    <RN.View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <RN.View
          style={{
            backgroundColor: colorLightBlue,
            borderBottomEndRadius: 40,
            height: RN.Dimensions.get("window").height * 0.16,
            top: 0,
            marginTop: -4,
            paddingHorizontal: 10,
          }}>
          <RN.View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start",
              paddingRight: 12,
            }}>
            <RN.View style={{ flexDirection: "row", alignItems: "center" }}>
              <RN.View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 20,
                  backgroundColor: colorBlueBlack,
                }}>
                <RN.Image
                  source={invitation_avatar}
                  style={{
                    width: 23,
                    height: 30,
                    marginTop: 10,
                    alignSelf: "center",
                  }}
                />
              </RN.View>
            </RN.View>
            <RN.View
              style={{
                flex: 1,
                flexDirection: "column",
                paddingHorizontal: 10,
                paddingRight: 15,
              }}>
              <RN.Text
                numberOfLines={1}
                style={{
                  color: colorWhite,
                  fontFamily: "Rubik-Regular",
                  fontSize: 18,
                  fontWeight: "600",
                }}>
                {userDetails}
              </RN.Text>
              <RN.Text
                style={{
                  color: colorLightWhite,
                  fontFamily: "Rubik-Regular",
                  fontSize: 15,
                  marginTop: 5,
                  fontWeight: "600",
                }}>
                Home
              </RN.Text>
            </RN.View>
            <RN.View
              style={{
                flexDirection: "column",
                justifyContent: "space-between",
                alignItems: "flex-end",
                height: 40,
              }}>
              {!locationView ? (
                <RN.View style={{ flexDirection: "row" }}>
                  <RN.ImageBackground
                    source={location}
                    style={{ width: 20, height: 20 }}
                    resizeMode="cover"
                  />
                  <RN.ImageBackground
                    source={location}
                    style={{
                      width: 20,
                      height: 20,
                      position: "absolute",
                      right: 14,
                    }}
                    resizeMode="cover"
                  />
                </RN.View>
              ) : null}
              <RN.TouchableOpacity
                onPress={() => {
                  setLocationView(!locationView);
                }}>
                <RN.Image
                  style={{
                    width: 13,
                    height: 8,
                    marginRight: 2.5,
                    marginTop: locationView ? 30 : 0,
                    transform: [{ rotate: locationView ? "180deg" : "0deg" }],
                  }}
                  source={arrow_down_menu}
                />
              </RN.TouchableOpacity>
            </RN.View>
          </RN.View>
        </RN.View>
        {/* <DrawerItemList {...props} /> */}

        {!locationView ? (
          menu.map((menu, index) => (
            <RN.View key={index}>
              <RN.TouchableOpacity onPress={() => navigateRoutes(menu)}>
                <RN.View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                    marginTop: 20,
                    marginLeft: 20,
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Image
                      source={menu.icon}
                      style={{
                        height: menu.height,
                        width: menu.width,
                        marginTop: menu.marginTop,
                      }}
                    />
                  </RN.View>
                  <RN.View style={{ flex: 7 }}>
                    <RN.Text
                      style={{
                        fontFamily: "Rubik-Regular",
                        fontSize: font14,
                        marginTop: 3,
                        color: menu.color,
                      }}>
                      {menu.name}
                    </RN.Text>
                  </RN.View>
                </RN.View>
              </RN.TouchableOpacity>
            </RN.View>
          ))
        ) : (
          <RN.View>
            <RN.TouchableOpacity>
              <RN.View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  marginTop: 20,
                  marginLeft: 20,
                }}>
                <RN.View style={{ flex: 1 }}>
                  <RN.View
                    style={{
                      flexDirection: "row",
                      justifyContent: "flex-start",
                      marginTop: 5,
                    }}>
                    <RN.View style={{ flex: 0 }}>
                      <RN.View
                        style={{
                          width: 35,
                          height: 35,
                          borderRadius: 15,
                          backgroundColor: colorOrange,
                        }}>
                        <RN.Image
                          source={invitation_avatar}
                          style={{
                            width: 12,
                            height: 15,
                            marginTop: 10,
                            alignSelf: "center",
                          }}
                        />
                      </RN.View>
                    </RN.View>
                    <RN.View
                      style={{
                        flex: 1,
                        marginLeft: 1,
                        marginTop: RN.Dimensions.get("screen").height * 0.025,
                      }}>
                      <RN.View
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: 30,
                          backgroundColor: colorWhite,
                          left: -15,
                          elevation: 5,
                        }}>
                        <RN.Image
                          source={map}
                          style={{
                            height: 10,
                            width: 8,
                            alignSelf: "center",
                            marginTop: 5,
                            elevation: 2,
                          }}
                        />
                      </RN.View>
                    </RN.View>
                  </RN.View>
                </RN.View>
                <RN.View style={{ flex: 3 }}>
                  <RN.Text
                    style={{
                      fontFamily: "Rubik-Regular",
                      fontSize: font14,
                      marginTop: 15,
                    }}>
                    {"Office"}
                  </RN.Text>
                </RN.View>
              </RN.View>
            </RN.TouchableOpacity>
            <RN.View
              style={{
                borderWidth: 0.2,
                borderColor: colorGray,
                marginTop: 20,
              }}
            />
            <RN.TouchableOpacity>
              <RN.View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  marginTop: 20,
                  marginLeft: 20,
                }}>
                <RN.View style={{ flex: 1 }}>
                  <RN.Image
                    source={add_location}
                    style={{ height: 21, width: 17 }}
                  />
                </RN.View>
                <RN.View style={{ flex: 7 }}>
                  <RN.Text
                    style={{
                      fontFamily: "Rubik-Regular",
                      fontSize: 15,
                      marginTop: 3,
                    }}>
                    {"Add New Location"}
                  </RN.Text>
                </RN.View>
              </RN.View>
            </RN.TouchableOpacity>
            <RN.View
              style={{
                borderWidth: 0.15,
                borderColor: colorGray,
                marginTop: 20,
              }}
            />
          </RN.View>
        )}
      </DrawerContentScrollView>
      <RN.View style={{ borderWidth: 0.2, borderColor: colorGray }} />
      {!locationView ? (
        <RN.TouchableOpacity>
          <RN.View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              margin: 15,
            }}>
            <RN.View style={{ flex: 1 }}>
              <RN.Image
                source={settings_menu}
                style={{ height: 27, width: 24 }}
              />
            </RN.View>
            <RN.View style={{ flex: 7 }}>
              <RN.Text
                style={{
                  fontFamily: "Rubik-Regular",
                  fontSize: font14,
                  marginTop: 5,
                }}>
                {"Settings"}
              </RN.Text>
            </RN.View>
          </RN.View>
        </RN.TouchableOpacity>
      ) : null}
    </RN.View>
  );
};

export default CustomDrawer;
