import BackArrowComp from "@components/BackArrowComp";
import React from "react";
import * as RN from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colorLightskyBlue } from "@constants/Colors";

function ComingSoon(props) {
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
        source={require("../../assets/images/emptyStates/coming.png")}
      />
      {recieveProps.name == "Remainders" ? (
        <RN.Text style={{ padding: 20 }}>
          <RN.Text style={{ fontWeight: "bold" }}>My Reminders:</RN.Text>
          {"\n"}
          {"\n"}
          You can set up fully customizable reminders for dates (1 week / 1
          month or any period in advance of the end date) for end of warranty,
          AMC, Extended Warranty, Maintenance Service due dates for all your
          appliances and gadgets so that you can raise issues within the due
          dates. Similarly, you can set up renewal dates for your Passport,
          Driving License, etc., and payment due dates of your EMI or ECS
          mandate, etc. Further, these alerts will get populated in your native
          calendar in your cell phone.
        </RN.Text>
      ) : (
        <RN.Text style={{ padding: 20 }}>
          <RN.Text style={{ fontWeight: "bold" }}>{recieveProps.title}</RN.Text>
          {"\n"}
          {"\n"}
          <RN.Text>{recieveProps.content}</RN.Text>
        </RN.Text>
      )}
    </RN.View>
  );
}

export default ComingSoon;
