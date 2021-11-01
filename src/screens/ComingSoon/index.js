import React from "react";
import { Text, View, ImageBackground, ScrollView } from "react-native";
import BackArrowComp from "@components/BackArrowComp";
import styles from "./styles";
const ComingSoon = (props) => {
  let title = props?.route?.params?.title;
  let content = props?.route?.params?.content;
  let icon = props?.route?.params?.icon;
  console.log("content", content);
  return (
    <View style={styles.container}>
      <BackArrowComp />
      <View style={styles.imageLayer}>
        <ImageBackground
          source={icon}
          style={styles.centerImage}
          resizeMode="contain"
        />
      </View>
      <ScrollView>
        <Text style={styles.title}>{title}</Text>
        {content &&
          content.map((obj, index) => {
            return (
              <Text style={styles.content} key={index}>
                {obj}
              </Text>
            );
          })}
      </ScrollView>
    </View>
  );
};
export default ComingSoon;
