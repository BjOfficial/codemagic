import React, { Fragment } from "react";
import { Text, View } from "react-native";
import HomeHeader from "@components/HomeHeader";
const TermsConditions = () => {
  return (
    <Fragment>
      <HomeHeader title="Terms and Conditions" />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Text style={{ textAlign: "center" }}>Terms and Conditions</Text>
      </View>
    </Fragment>
  );
};

export default TermsConditions;
