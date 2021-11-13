import React from "react";
import { View, Text, Image, Dimensions } from "react-native";
import HomeHeader from "@components/HomeHeader";
import { font12, font15 } from "@constants/Fonts";
import { ScrollView } from "react-native-gesture-handler";
import { colorDropText } from "@constants/Colors";
// import {reward} from '@constants/Images/reward'

function MyRewards() {
  return (
    <View style={{ flex: 1 }}>
      <HomeHeader title="My Rewards" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
            justifyContent: "space-between",
          }}>
          <Image
            source={require("@assets/images/rewards/reward.png")}
            style={{ height: 120, width: 120, resizeMode: "contain" }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: font15,
              //   width: "155%",
              height: Dimensions.get("screen").height / 9,
              marginLeft: 10,
              fontWeight: "bold",
              color: colorDropText,
            }}>
            Earn 25 Coins For Each Invite {"\n"}
            {"\n"}You Send And 500 Coins If{"\n"}
            {"\n"} They Install Azzetta.
          </Text>
        </View>
        <Text
          style={{ marginLeft: 20, fontWeight: "bold", color: colorDropText }}>
          How it works:
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
            marginRight: 10,
            marginLeft: 20
          }}>
          <Image
            source={require("@assets/images/rewards/howitworks1.png")}
            style={{ height: 15, width: 20, resizeMode: "contain" }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: font12,
              // width: "100%",
              height: 40,
              marginLeft: 10,
              color: colorDropText,
              lineHeight: 18
            }}>
            Invite your friends to use Azzetta App and earn 25 Azzeti coins
            for each invitation sent by you.
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            marginRight: 10,
            marginLeft: 20
          }}>
          <Image
            source={require("@assets/images/rewards/howitworks2.png")}
            style={{ height: 15, width: 20, resizeMode: "contain" }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: font12,
              // width: "100%",
              height: 40,
              marginLeft: 10,
              color: colorDropText,
              lineHeight: 18
            }}>
            After your friend downloads and installs Azzetta App within 60
            days you earn 500 Azzeti coins.
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            marginRight: 10,
            marginLeft: 20
          }}>
          <Image
            source={require("@assets/images/rewards/howitworks3.png")}
            style={{ height: 15, width: 20, resizeMode: "contain" }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: font12,
              // width: "100%",
              height: 55,
              marginLeft: 10,
              color: colorDropText,
              lineHeight: 18
            }}>
            Your direct contacts who are already using Azzetta App are
            automatically added to your network as first circle (FC).
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            marginRight: 10,
            marginLeft: 20
          }}>
          <Image
            source={require("@assets/images/rewards/howitworks4.png")}
            style={{ height: 15, width: 20, resizeMode: "contain" }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: font12,
              // width: "100%",
              height: 70,
              marginLeft: 10,
              color: colorDropText,
              lineHeight: 18
            }}>
            When your FC users invite their friends and those who install
            Azzetta App within 60 days of receiving their invitation
            become your second circle (SC) of trusted network.
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            marginRight: 10,
            marginLeft: 20
          }}>
          <Image
            source={require("@assets/images/rewards/howitworks5.png")}
            style={{ height: 15, width: 20, resizeMode: "contain" }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: font12,
              // width: "100%",
              height: 40,
              marginLeft: 10,
              color: colorDropText,
              lineHeight: 18
            }}>
            For every second circle users you get 20 more Azzeti coins as
            your reward.
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            marginRight: 10,
            marginLeft: 20
          }}>
          <Image
            source={require("@assets/images/rewards/howitworks6.png")}
            style={{ height: 15, width: 20, resizeMode: "contain" }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: font12,
              //   width: "100%",
              height: 70,
              marginLeft: 10,
              color: colorDropText,
              lineHeight: 18
            }}>
            You need to subscribe to join Azzetta Club with 200 Azzeti
            coins and renew membership subscription at 200 Azzeti coins
            per year.
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            marginTop: 10,
            marginRight: 10,
            marginLeft: 20
          }}>
          <Image
            source={require("@assets/images/rewards/howitworks7.png")}
            style={{ height: 15, width: 20, resizeMode: "contain" }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: font12,
              // width: "100%",
              height: 40,
              marginLeft: 10,
              color: colorDropText,
            }}>
            Each year 10% of your Azzetta coins will be donated to our
            charity partners.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default MyRewards;
