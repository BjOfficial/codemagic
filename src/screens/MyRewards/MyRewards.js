import React from "react";
import { View, Text, Image } from "react-native";
import HomeHeader from "@components/HomeHeader";
import {
  font10,
  font12,
  font14,
  font15,
  font18,
  font20,
} from "@constants/Fonts";
import { ScrollView } from "react-native-gesture-handler";
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
              // width: "100%",
              height: 90,
              marginLeft: 10,
              fontWeight: "bold",
            }}>
            Earn 5 Coins For Each Invite {"\n"}
            {"\n"}You Send And 50 Coins If{"\n"}
            {"\n"} They Install Azzetta.
          </Text>
        </View>
        <Text style={{ marginLeft: 20, fontWeight: "bold" }}>
          How it works:
        </Text>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            margin: 20,
          }}>
          <Image
            source={require("@assets/images/rewards/howitworks1.png")}
            style={{ height: 20, width: 20, resizeMode: "contain" }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: font12,
              // width: "100%",
              height: 30,
              marginLeft: 10,
            }}>
            Invite your friends to use Azzetta App and earn 5 {"\n"}Azzeti coins
            for each invitation sent by you.
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
          }}>
          <Image
            source={require("@assets/images/rewards/howitworks2.png")}
            style={{ height: 20, width: 20, resizeMode: "contain" }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: font12,
              // width: "100%",
              height: 30,
              marginLeft: 10,
            }}>
            After your friend downloads and installs Azzetta App {"\n"}within 60
            days you earn 50 Azzeti coins.
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
          }}>
          <Image
            source={require("@assets/images/rewards/howitworks3.png")}
            style={{ height: 20, width: 20, resizeMode: "contain" }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: font12,
              // width: "100%",
              height: 45,
              marginLeft: 10,
            }}>
            Your direct contacts who are already using Azzetta {"\n"}App are
            automatically added to your network as {"\n"}first circle (FC).
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
          }}>
          <Image
            source={require("@assets/images/rewards/howitworks4.png")}
            style={{ height: 20, width: 20, resizeMode: "contain" }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: font12,
              // width: "100%",
              height: 60,
              marginLeft: 10,
            }}>
            When your FC users invite their friends and those who {"\n"}install
            Azzetta App within 60 days of receiving their {"\n"}invitation
            become your second circle (SC) of {"\n"}trusted network.
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
          }}>
          <Image
            source={require("@assets/images/rewards/howitworks5.png")}
            style={{ height: 20, width: 20, resizeMode: "contain" }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: font12,
              // width: "100%",
              height: 30,
              marginLeft: 10,
            }}>
            For every second circle users you get 20 more Azzeti {"\n"}coins as
            your reward.
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
          }}>
          <Image
            source={require("@assets/images/rewards/howitworks6.png")}
            style={{ height: 20, width: 20, resizeMode: "contain" }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: font12,
              // width: "100%",
              height: 50,
              marginLeft: 10,
            }}>
            You need to subscribe to join Azzetta Club with 200 {"\n"}Azzeti
            coins and renew membership subscription at {"\n"}200 Azzeti coins
            per year.
          </Text>
        </View>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            margin: 20,
          }}>
          <Image
            source={require("@assets/images/rewards/howitworks7.png")}
            style={{ height: 20, width: 20, resizeMode: "contain" }}
          />
          <Text
            style={{
              flex: 1,
              fontSize: font12,
              // width: "100%",
              height: 30,
              marginLeft: 10,
            }}>
            Each year 10% of your Azzetta coins will be donated {"\n"}to our
            charity partners.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

export default MyRewards;
