import BackArrowComp from "@components/BackArrowComp";
import React from "react";
import * as RN from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colorLightskyBlue } from "@constants/Colors";

function Delegate(props) {
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
        source={require("../../assets/images/emptyStates/delegate.png")}
      />
      <RN.Text style={{ padding: 20 }}>
        <RN.Text style={{ fontWeight: "bold" }}>Delegate:</RN.Text>
        {"\n"}
        {"\n"}
        Azzetta is designed to be a family App and family members should be able
        to share the responsibility to update and take action for all
        maintenance and upkeep of all assets at your residence (primary
        location). Until this feature is made available you can open Azzetta
        with your credentials in your family member cell phone and all updates
        required for onboarding of appliances / gadgets can be done in a
        transparent manner.{"\n"}
        {"\n"}Further, we would like to get your feedback to use this feature
        for adding your admin manager as your Delegate in your office, factory,
        or business premises. We plan to charge a nominal fee for multi-location
        if you would like to use Azzetta for managing assets across multiple
        locations.
      </RN.Text>
    </RN.View>
  );
}

export default Delegate;
