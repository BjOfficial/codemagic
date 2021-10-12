import BackArrowComp from "@components/BackArrowComp";
import React from "react";
import * as RN from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colorLightskyBlue } from "@constants/Colors";

function LocalBusiness(props) {
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
        source={require("../../assets/images/emptyStates/local_business.png")}
      />
      <RN.Text style={{ padding: 20 }}>
        <RN.Text style={{ fontWeight: "bold" }}>Local Business</RN.Text>
        {"\n"}
        {"\n"}
        One of the objectives of Azzetta is to promote local businesses in your
        area. We plan to start with service and repair of appliances and gadgets
        before expanding to a wider set of services / professionals. You can add
        details of your trusted AC technician, carpenter, electrician, plumber
        and handyman and you can send WhatsApp messages to them or call them
        when needed.{"\n"}
        {"\n"}You can also provide rating and comments for local businesses that
        your network can benefit with your recommendations and more opportunity
        through this digital listing in Azzetta. You can check the list of local
        businesses we plan to onboard in our FAQ section of our website
        www.azzetta.com
      </RN.Text>
    </RN.View>
  );
}

export default LocalBusiness;
