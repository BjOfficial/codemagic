import {
  colorAsh,
  colorBlack,
  colorGray,
  colorLightskyBlue,
  colorWhite,
} from "@constants/Colors";
import React from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from "react-native";
import { assets_vintage } from "@constants/Images";
import { font10 } from "@constants/Fonts";
import style from "./styles";
import { useNavigation } from "@react-navigation/native";

export default function MyAssetsVintage() {
  const navigation = useNavigation();
  return (
    <View style={{ flex: 1, backgroundColor: "lightGrey" }}>
      <StatusBar />
      <View style={style.navbar}>
        <View style={style.navbarRow}>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}>
            <View style={{ flex: 1 }}>
              <Image
                source={require("../../assets/images/invite/arrowwhite.png")}
                style={style.notificationIcon}
              />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={style.navbarName}>{"My Assets Vintage"}</Text>
          </View>
        </View>
      </View>
      <ScrollView>
        <View
          style={{
            height: 320,
            width: "80%",
            alignSelf: "center",
            elevation: 5,
            margin: 20,
            backgroundColor: colorWhite,
            borderRadius: 20,
          }}>
          <Text
            style={{
              marginLeft: 20,
              marginTop: 20,
              fontWeight: "bold",
              color: colorBlack,
            }}>
            My Assets Vintage:
          </Text>
          <Image
            style={{
              marginTop: 20,
              height: 150,
              width: 250,
              alignSelf: "center",
              resizeMode: "contain",
            }}
            source={assets_vintage}
          />
          <View
            style={{
              height: 50,
              width: "80%",
              alignSelf: "center",
              elevation: 5,
              margin: 20,
              backgroundColor: colorLightskyBlue,
              borderRadius: 10,
            }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 5,
              }}>
              <Image
                style={{ height: 15, width: 15 }}
                source={require("@assets/images/comingsoon/info-circle-line.png")}
              />
              <Text style={{ fontSize: font10, margin: 10 }}>
                Above number indicate the number of appliances used during the
                time period
              </Text>
            </View>
          </View>
        </View>

        {/* <View
          style={{
            height: 320,
            width: "80%",
            alignSelf: "center",
            elevation: 5,
            margin: 20,
            backgroundColor: colorWhite,
            borderRadius: 20,
          }}>
          <Text
            style={{
              marginLeft: 20,
              marginTop: 20,
              fontWeight: "bold",
              color: colorBlack,
            }}>
            Purchase value of your appliance and gadgets:
          </Text>
          <Image
            style={{
              marginTop: 20,
              height: 150,
              width: 250,
              alignSelf: "center",
              resizeMode: "contain",
            }}
            source={require("@assets/images/emptyStates/purchase_value.png")}
          />
          <View
            style={{
              height: 50,
              width: "80%",
              alignSelf: "center",
              elevation: 5,
              margin: 20,
              backgroundColor: colorLightskyBlue,
              borderRadius: 10,
            }}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                marginLeft: 5,
              }}>
              <Image
                style={{ height: 20, width: 20 }}
                source={require("@assets/images/comingsoon/info-circle-line.png")}
              />
              <Text style={{ fontSize: font10, margin: 10 }}>
                Above numbers indicate the purchase value of your Appliances and
                Gadgets.
              </Text>
            </View>
          </View>
        </View> */}

        {/* <View
          style={{
            height: 320,
            width: "80%",
            alignSelf: "center",
            elevation: 5,
            margin: 20,
            backgroundColor: colorWhite,
            borderRadius: 20,
          }}>
          <Text
            style={{
              marginLeft: 20,
              marginTop: 20,
              fontWeight: "bold",
              color: colorBlack,
            }}>
            Purchase value average:
          </Text>
          <View style={{ display: "flex", flexDirection: "row" }}>
            <View
              style={{ display: "flex", flexDirection: "column", width: 140 }}>
              <Image
                style={{
                  marginTop: 20,
                  height: 150,
                  width: 170,
                  alignSelf: "center",
                  resizeMode: "contain",
                }}
                source={require("@assets/images/comingsoon/pinkbar.png")}
              />
              <Text style={{ margin: 20,fontSize:font10}}>
                Total purchase value at cost price that you own
              </Text>
            </View>
            <View
              style={{ display: "flex", flexDirection: "column", width: 140 }}>
              <Image
                style={{
                  marginTop: 20,
                  height: 170,
                  width: 50,
                  alignSelf: "center",
                  resizeMode: "contain",
                }}
                source={require("@assets/images/comingsoon/greenbar.png")}
              />
              <Text style = {{fontSize:font10}}>
              Depreciated value of your assets as per assumed normal life
              </Text>
            </View> */}
        {/* </View> */}
        {/* </View> */}
      </ScrollView>
    </View>
  );
}
