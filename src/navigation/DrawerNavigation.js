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
} from "@constants/Images";
import auth from "@react-native-firebase/auth";
import { AuthContext } from "@navigation/AppNavigation";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { font14 } from "@constants/Fonts";
import { AddAssetNav, AddDocumentNav } from "./NavigationConstant";

const CustomDrawer = (props) => {
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
      route: AddAssetNav,
    },
    {
      name: "My Documents",
      icon: document_menu,
      height: 20,
      width: 16,
      route: AddDocumentNav,
    },
    {
      name: "My Remainders",
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
      route: "",
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
          }}>
          <RN.View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              marginTop: 20,
            }}>
            <RN.View
              style={{
                flexDirection: "column",
                justifyContent: "flex-start",
                marginTop: 5,
              }}>
              <RN.View
                style={{
                  flex: 1,
                  marginLeft: 15,
                }}>
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
                  flex: 0,
                  marginLeft: RN.Dimensions.get("screen").width / 5,
                  marginTop: 3,
                }}>
                <RN.Text
                  style={{
                    color: colorWhite,
                    fontFamily: "Rubik-Regular",
                    fontSize: 18,
                    fontWeight: "600",
                  }}>
                  {userDetails}
                </RN.Text>
                <RN.View style={{ flex: 0 }}>
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
              </RN.View>
            </RN.View>
            {!locationView ? (
              <RN.View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  marginTop: 5,
                }}>
                <RN.View
                  style={{
                    flex: 0,
                    marginLeft: RN.Dimensions.get("screen").width / 5,
                    left: 7,
                    marginTop: 6,
                  }}>
                  <RN.Image
                    source={location}
                    style={{ height: 20, width: 20 }}
                  />
                </RN.View>
                <RN.View style={{ flex: 1, marginLeft: 1, marginTop: 6 }}>
                  <RN.Image
                    source={location}
                    style={{ height: 20, width: 20 }}
                  />
                </RN.View>
              </RN.View>
            ) : null}
          </RN.View>
          <RN.TouchableOpacity
            onPress={() => {
              setLocationView(!locationView);
            }}>
            <RN.Image
              source={arrow_down_menu}
              style={{
                height: 10,
                width: 10,
                marginTop: RN.Dimensions.get("window").height * 0.01,
                left: RN.Dimensions.get("window").width * 0.55,
                transform: [{ rotate: locationView ? "180deg" : "0deg" }],
              }}
            />
          </RN.TouchableOpacity>
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
