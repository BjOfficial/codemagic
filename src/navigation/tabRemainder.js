import React from "react";
import { View, Text, ImageBackground, ScrollView } from "react-native";
import BackArrowComp from "@components/BackArrowComp";
import styles from "./tabRemainderStyle";
import { my_reminder } from "@constants/Images";

export default function TabRemainder() {
  return (
    <View style={styles.container}>
      <BackArrowComp />
      <View style={styles.imageLayer}>
        <ImageBackground
          source={my_reminder}
          style={styles.centerImage}
          resizeMode="contain"
        />
      </View>
      <ScrollView>
        <Text style={styles.title}>My Remainders</Text>
        <Text style={styles.content}>
          You can set up fully customizable reminders for dates (1 week / 1
          month or any period in advance of the end date) for end of warranty,
          AMC, Extended Warranty, Maintenance Service due dates for all your
          appliances and gadgets so that you can raise issues within the due
          dates. Similarly, you can set up renewal dates for your Passport,
          Driving License, etc., and payment due dates of your EMI or ECS
          mandate, etc. Further, these alerts will get populated in your native
          calendar in your cell phone.{"\n"}
          {"\n"}● You can set your own customizable and multiple reminders in
          your calendar{"\n"}
          {"\n"}● Important dates for end of warranty, AMC, Extended Warranty,
          Regular Service{"\n"}
          {"\n"}● Renewal related - Passport, Driving License for self and
          family, etc.,{"\n"}
          {"\n"}● Payment due dates - EMI, Loan, ECS, Home mortgage, Insurance
          premium etc {"\n"}
          {"\n"}● Any important dates in your life{"\n"}
          {"\n"}
        </Text>
      </ScrollView>
    </View>
  );
}
