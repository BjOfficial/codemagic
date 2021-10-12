import BackArrowComp from "@components/BackArrowComp";
import React from "react";
import * as RN from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colorLightskyBlue } from "@constants/Colors";

function MyRewards(props) {
  const recieveProps = props?.route;
  const navigation = useNavigation();
  return (
    <RN.View style={{ flex: 1, backgroundColor: colorLightskyBlue }}>
      <RN.View style={{ marginLeft: 20, marginTop: 20 }}>
        <BackArrowComp />
      </RN.View>
      <RN.Image
        style={{
          // width: RN.Dimensions.get('screen').width,
          // height: RN.Dimensions.get('screen').height / 1.8,
          height: 200,
          width: 200,
          alignSelf: "center",
          resizeMode: "contain",
          marginTop: 20,
        }}
        source={require("../../assets/images/emptyStates/my_rewards.png")}
      />
      <RN.ScrollView>
        <RN.Text style={{ padding: 20 }}>
          <RN.Text style={{ fontWeight: "bold" }}>My Rewards</RN.Text>
          {"\n"}
          {"\n"}
          Azzetta is going to be an ‘invitation only’ application and the reward
          points are called Azzeti coins. You get rewarded by inviting your
          friends and family to download Azzetta. Each invite sent out gets you
          5 coins and based on your invitation every download and install gets
          you 50 Azzeti coins. Your invitees get to choose whose invitation they
          accept and hence sooner you send out your invitation the likelihood of
          that being the only invite your contact gets to choose when they
          download and install. You also get additional 20 coins when your first
          circle of users send invitations to your second circle, and they
          install and start using Azzetta.{"\n"}
          {"\n"}These sets of users are your trusted network who could give you
          recommendations for buying new appliances or gadgets and hence higher
          the number of users in your network the better the feedback coverage
          and comments. The Azzeti coins can be redeemed when you buy new
          appliances or gadgets and get discounts for your AMC and wide variety
          of services from local businesses. You can also upgrade your
          membership as a premium member by redeeming Azzeti coins. You will
          have the opportunity to support designated NGO partners with 10% of
          Azzeti coins earned by you during the year as part of giving back to
          our society.
        </RN.Text>
      </RN.ScrollView>
    </RN.View>
  );
}

export default MyRewards;
