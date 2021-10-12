import BackArrowComp from "@components/BackArrowComp";
import React from "react";
import * as RN from "react-native";
import { useNavigation } from "@react-navigation/native";
import { colorLightskyBlue } from "@constants/Colors";

function MyResale(props) {
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
        source={require("../../assets/images/emptyStates/my_resale.png")}
      />
      <RN.ScrollView>
        <RN.Text style={{ padding: 20 }}>
          <RN.Text style={{ fontWeight: "bold" }}>My Resale</RN.Text>
          {"\n"}
          {"\n"}
          Your end-of-life appliances can possibly fetch a better price than
          what is prevailing in the market. More often than not your new
          appliance purchase and disposal of old one is a combined decision.
          Your old appliance is carted away when the new appliance is delivered.
          Azzetta plans to explore the opportunity to dispose of your old
          appliances at a higher price than what is traditionally offered by the
          retailer for the exchange deal. We plan to identify second-hand
          dealers for each type of appliance / gadget in the top 100 cities in a
          phased manner.{"\n"}
          {"\n"}Now you have the option to take your decision of disposing of
          your used appliances and buying replacements independently. You can
          discover the price for the appliance (based on brand. model, vintage
          and working condition, etc.,) through Azzetta by flagging an item
          where accredited second-hand dealers will bid for the same. You pick
          the best price offered by the dealers through this feature in Azzetta.
          {"\n"}
          {"\n"}Also, you can donate your appliance to a designated charity
          organization or training centre when we roll out for your city.
        </RN.Text>
      </RN.ScrollView>
    </RN.View>
  );
}

export default MyResale;
