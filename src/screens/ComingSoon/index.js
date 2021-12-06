import React from 'react';
import {
  Text,
  View,
  ImageBackground,
  ScrollView,
  StatusBar,
  SafeAreaView,
} from 'react-native';
import BackArrowComp from '@components/BackArrowComp';
import styles from './styles';
import { colorLightBlue, colorWhite } from '@constants/Colors';
const ComingSoon = (props) => {
  let title = props?.route?.params?.title;
  let content = props?.route?.params?.content;
  let icon = props?.route?.params?.icon;
  const MyStatusBar = ({ backgroundColor }) => (
    <View style={[styles.statusBar, { backgroundColor: colorLightBlue }]}>
      <SafeAreaView>
        <StatusBar backgroundColor={backgroundColor} />
      </SafeAreaView>
    </View>
  );

  return (
    <View
      style={{
        backgroundColor: colorWhite,
        flex:1
      }}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <MyStatusBar backgroundColor={colorLightBlue} />
        <View style={{ padding: 10 }}>
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
      </ScrollView>
    </View>
  );
};
export default ComingSoon;
