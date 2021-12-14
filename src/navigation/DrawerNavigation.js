import React, { useState, useContext, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import * as RN from 'react-native';
import {
  colorLightWhite,
  colorBlueBlack,
  colorLightBlue,
  colorWhite,
  colorGray,
  colorOrange,
  colorDropText,
  colorAsh,
} from '@constants/Colors';
import {
  invitation_avatar,
  location,
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
  local_business_cs,
  delegate_cs,
} from '@constants/Images';
import { AuthContext } from '@navigation/AppNavigation';
import {
  ComingSoonNav,
  MyRewardsNav,
  AddLocationNav,
  MyProfileNav,
  MyAssetsVintageNav,
  SettingsNav,
} from '@navigation/NavigationConstant';
import { font14, font15 } from '@constants/Fonts';
import Logout from '@screens/Logout';
import { useDrawerStatus } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config'; 

const CustomDrawer = () => {
  let reminder_data = [
    '●   You can set your own customizable and mulltiple reminders in your calendar',
    '●   Important dates for end of warranty, AMC, Extended Warranty, Regular Service ',
    '●   Renewal related - Passport, Driving License for self and family, etc.,',
    '●  Payment due dates - EMI, Loan, ECS, Home mortgage, Insurance premium  etc',
    '●   Any important dates in your life',
  ];
  let delegate_data = [
    '●   Azzetta is designed for the entire family to update, maintain and plan for regular service',
    '●   Until this is enabled you can share your login credentials with your family members',
    '●   We plan to bring in Azzetta for small businesses later for multi locations',
    '●   Do share your feedback on this proposed feature at helpdesk@azzetta.com',
  ];

  let local_business_data = [
    '●   Azzetta intends to promote local businesses in your community.',
    '●   We start with services technicians for your appliances and gadgets, other professionals and businesses gets added ',
    '●  Your rating of local technicians will help them to get additional business in your area ensuring their availability to you for longterm',
    '●   Based on recommendations from your network you can choose the local businesses',
    '●   Proposed list of local businesses given under FAQ in www.azzetta.com',
  ];
  let resale_data = [
    '●   Your old appliances and gadgets can possibly fetch you better prices than exchange when you buy a new one.',
    '●   Azzetta helps to discover the price for your used items when you flag them for SALE. ',
    '●   Second hand dealers enlisted in our platform from your neighbourhood  to quote rates for your used item after details are shared.',
    '●   Buying a new one and replacing an old one can happen independently that gives you the best option',
    '●   Also, Azzetta helps you to donate your old appliances to charity organizations.',
  ];
  const navigation = useNavigation();
  const [locationView, setLocationView] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [selectedLocation, setLocation] = useState([]);
  let { userDetails } = useContext(AuthContext);
  const [isVisible, setIsVisible] = useState(false);
  const [menu] = useState([
    {
      name: 'Home',
      icon: home,
      height: RN.Dimensions.get('window').height * 0.04,
      width: RN.Dimensions.get('window').width * 0.05,
      route: 'bottomTab',
      color: '#393939',
    },
    {
      name: 'My Appliances',
      icon: my_appliances,
      height: RN.Dimensions.get('window').height * 0.04,
      width: RN.Dimensions.get('window').width * 0.05,
      route: 'MyAssets',
      color: '#393939',
    },
    {
      name: 'My Documents',
      icon: document_menu,
      height: RN.Dimensions.get('window').height * 0.04,
      width: RN.Dimensions.get('window').width * 0.05,
      route: 'Documents',
      color: '#393939',
    },
    {
      name: 'My Reminders',
      icon: my_remainders,
      height: RN.Dimensions.get('window').height * 0.04,
      width: RN.Dimensions.get('window').width * 0.05,
      route: 'Remainders',
      color: '#393939',
    },
    {
      name: 'Delegate',
      icon: delegate_menu,
      height: RN.Dimensions.get('window').height * 0.04,
      width: RN.Dimensions.get('window').width * 0.05,
      route: '',
      color: '#393939',
    },
    {
      name: 'Local Business',
      icon: local_business,
      height: RN.Dimensions.get('window').height * 0.04,
      width: RN.Dimensions.get('window').width * 0.05,
      route: '',
      color: '#393939',
    },
    {
      name: 'My Resale',
      icon: my_resale,
      height: RN.Dimensions.get('window').height * 0.04,
      width: RN.Dimensions.get('window').width * 0.05,
      marginTop: 7,
      route: '',
      color: '#393939',
    },
    {
      name: 'My Rewards',
      icon: my_rewards,
      height: RN.Dimensions.get('window').height * 0.04,
      width: RN.Dimensions.get('window').width * 0.05,
      marginTop: 6,
      route: '',
      color: '#393939',
    },
    {
      name: 'My Assests Vintage',
      icon: my_vintage,
      height: RN.Dimensions.get('window').height * 0.04,
      width: RN.Dimensions.get('window').width * 0.05,
      marginTop: 4,
      route: '',
      color: '#393939',
    },
    {
      name: 'Log Out',
      icon: logout,
      height: RN.Dimensions.get('window').height * 0.04,
      width: RN.Dimensions.get('window').width * 0.05,
      marginTop: 4,
      color: '#da6161',
      route: 'logout',
    },
  ]);

  const getLocationList = async() => { 
    let uid = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(uid);
    let awaitresp = await ApiInstance.get(constants.listAddLocation);
    if (awaitresp.status == 1) {
      setLocationList(awaitresp.data.data);
      setErrorMsg('');
      setLocationData(awaitresp.data.data[0]);
    } else {
      setErrorMsg(awaitresp.err_msg);
    }
  };
  const setLocationData = async (item) => {
    console.log("location",item.name,item._id);
    await AsyncStorage.setItem('locationData_ID', item._id);
    await AsyncStorage.setItem('locationData_Name', item.name);
    await setLocation(item);
    await setLocationView(false);
    navigation.navigate('Dashboard');
  }

  const navigateRoutes = (data) => {
    if (data.name == 'Log Out') {
      setIsVisible(true);
    } else if (data.name == 'My Appliances') {
      navigation.navigate('MyAssets');
    } else if (data.name == 'My Documents') {
      navigation.navigate('Documents');
    } else if (data.name == 'Home') {
      navigation.navigate('Dashboard');
    } else if (data.name == 'My Reminders') {
      navigation.navigate('Remainders');
    } else if (data.name == 'Delegate') {
      navigation.navigate(ComingSoonNav, {
        title: 'Delegate',
        content: delegate_data,
        icon: delegate_cs,
      });
    } else if (data.name == 'Local Business') {
      navigation.navigate(ComingSoonNav, {
        title: 'Local Business',
        content: local_business_data,
        icon: local_business_cs,
      });
    } else if (data.name == 'My Resale') {
      navigation.navigate(ComingSoonNav, {
        title: 'My Resale',
        content: resale_data,
        icon: my_resale_cs,
      });
    } else if (data.name == 'My Rewards') {
      navigation.navigate(MyRewardsNav);
    } else if (data.name == 'My Assests Vintage') {
      navigation.navigate(MyAssetsVintageNav);
    }
  };
  const isDrawerOpen = useDrawerStatus() === 'open';

  useEffect(() => {
    if (isDrawerOpen) {
      setLocationView(false);
    }
  }, [isDrawerOpen]);

  useEffect(() => {
    getLocationList();
  }, []);

  return (
    <RN.View style={{ flex: 1, flexDirection: 'column' }}>
      <RN.View style={{ marginTop: RN.Platform.OS === 'ios' ? 4 : 0 }}>
        <RN.View
          style={{
            backgroundColor: colorLightBlue,
            borderBottomEndRadius: 40,
            height: RN.Dimensions.get('window').height * 0.16,
            top: 0,
            marginTop: -4,
            paddingHorizontal: 10,
          }}>
          <RN.View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingRight: 12,
            }}>
            <RN.TouchableOpacity
              style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'flex-start',
                paddingRight: 12,
              }}
              onPress={() => navigation.navigate(MyProfileNav)}>
              <RN.View style={{ flexDirection: 'row', alignItems: 'center' }}>
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
                      alignSelf: 'center',
                    }}
                  />
                </RN.View>
              </RN.View>
              <RN.View
                style={{
                  flex: 1,
                  flexDirection: 'column',
                  paddingHorizontal: 10,
                  paddingRight: 15,
                }}>
                <RN.Text
                  numberOfLines={1}
                  style={{
                    color: colorWhite,
                    fontFamily: 'Rubik-Regular',
                    fontSize: 18,
                  }}>
                  {userDetails}
                </RN.Text>
                <RN.Text
                  style={{
                    color: colorLightWhite,
                    fontFamily: 'Rubik-Regular',
                    fontSize: 15,
                    marginTop: 5,
                  }}>
									{selectedLocation.name}
                </RN.Text>
              </RN.View>
            </RN.TouchableOpacity>
            <RN.View
              style={{
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-end',
                height: 40,
              }}>
              {!locationView ? (
                <RN.TouchableOpacity
                  style={{ flexDirection: 'row' }}
                  onPress={() => {
                    setLocationView(!locationView);
                  }}>
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
                      position: 'absolute',
                      right: 14,
                    }}
                    resizeMode="cover"
                  />
                </RN.TouchableOpacity>
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
                    transform: [{ rotate: locationView ? '180deg' : '0deg' }],
                  }}
                  source={arrow_down_menu}
                />
              </RN.TouchableOpacity>
            </RN.View>
          </RN.View>
        </RN.View>
      </RN.View>
      {/* <DrawerContentScrollView {...props}> */}

      {/* <DrawerItemList {...props} /> */}
      <RN.ScrollView style={{ flex: 0.82 }}>
        <Logout isVisible={isVisible} onClose={() => setIsVisible(false)} />
        {!locationView ? (
          menu.map((menuItems, index) => (
            <RN.View key={index}>
              <RN.TouchableOpacity onPress={() => navigateRoutes(menuItems)}>
                <RN.View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    alignItems: 'center',
                    marginLeft: 20,
                    marginTop: 20,
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Image
                      source={menuItems.icon}
                      style={{
                        height: menuItems.height,
                        width: menuItems.width,
                        resizeMode: 'contain',
                      }}
                    />
                  </RN.View>
                  <RN.View style={{ flex: 7 }}>
                    <RN.Text
                      style={{
                        fontFamily: 'Rubik-Regular',
                        fontSize: font15,
                        color: menuItems.color,
                      }}>
                      {menuItems.name}
                    </RN.Text>
                  </RN.View>
                </RN.View>
              </RN.TouchableOpacity>
            </RN.View>
          ))
        ) : (
          
          <RN.View>
            {locationList && locationList.map((item,index)=>{
                  return <RN.TouchableOpacity 
                  onPress = {() => setLocationData(item)}> 
                    <RN.View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          marginTop: 10,
                          marginLeft: 10,
                        }}
                        >
                        <RN.View style={{ flex: 1 }}>
                          <RN.View
                            style={{
                              flexDirection: 'row',
                              justifyContent: 'flex-start',
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
                                    alignSelf: 'center',
                                  }}
                                />
                              </RN.View>
                            </RN.View>
                            <RN.View
                              style={{
                                flex: 1,
                                marginLeft: 1,
                                marginTop: RN.Dimensions.get('window').height * 0.025,
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
                                    alignSelf: 'center',
                                    marginTop: 5,
                                    // elevation: 2,
                                  }}
                                />
                              </RN.View>
                            </RN.View>
                          </RN.View>
                        </RN.View>
                        <RN.View style={{ flex: 3 }} >
                          <RN.Text
                            style={{
                              fontFamily: 'Rubik-Regular',
                              fontSize: font14,
                              marginTop: 15,
                              color: colorDropText,
                            }}>
                            {item.name}
                          </RN.Text>
                        </RN.View>
                      </RN.View>
                  </RN.TouchableOpacity>
                })}
            <RN.View
              style={{
                borderWidth: 0.2,
                borderColor: colorGray,
                marginTop: 20,
              }}
            />
            <RN.TouchableOpacity
              onPress={() =>
                navigation.navigate(AddLocationNav, {
                  icon: my_reminder,
                })
              }>
              <RN.View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
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
                      fontFamily: 'Rubik-Regular',
                      fontSize: 15,
                      marginTop: 3,
                      color: colorDropText,
                    }}>
                    {'Add New Location'}
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
      </RN.ScrollView>
      {/* </DrawerContentScrollView> */}
      <RN.View style={{ borderWidth: 0.3, borderColor: colorAsh }} />
      {!locationView ? (
        <RN.TouchableOpacity
          onPress={() => {
            navigation.navigate(SettingsNav);
          }}>
          <RN.View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              marginLeft: 15,
              paddingTop: 20,
              paddingBottom: 20,
            }}>
            <RN.View style={{ flex: 1 }}>
              <RN.Image
                source={settings_menu}
                style={{
                  height: RN.Dimensions.get('window').height * 0.03,
                  width: RN.Dimensions.get('window').width * 0.06,
                  resizeMode: 'contain',
                }}
              />
            </RN.View>
            <RN.View style={{ flex: 7 }}>
              <RN.Text
                style={{
                  fontFamily: 'Rubik-Regular',
                  fontSize: font14,
                  marginTop: 5,
                  color: colorDropText,
                }}>
                {'Settings'}
              </RN.Text>
            </RN.View>
          </RN.View>
        </RN.TouchableOpacity>
      ) : null}
    </RN.View>
  );
};

export default CustomDrawer;
