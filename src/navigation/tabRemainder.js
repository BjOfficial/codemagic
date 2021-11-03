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
        <Text style={styles.title}>My Reminders</Text>
        <Text style={styles.content}>
          ● You can set your own customizable and multiple reminders in your
          calendar{"\n"}
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
