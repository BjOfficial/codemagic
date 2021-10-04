import React, { Fragment } from "react";
import { Text, View } from "react-native";
import HomeHeader from "@components/HomeHeader";
const PrivacyPolicy = () => {
  return (
    <Fragment>
      <HomeHeader title="Privacy Policy" />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Text style={{ textAlign: "center" }}>Privacy Policy</Text>
      </View>
    </Fragment>
  );
};

export default PrivacyPolicy;
