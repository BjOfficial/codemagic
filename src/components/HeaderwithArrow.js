import React from "react";
import {
  Text,
  View,
  StyleSheet,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  white_arrow,
  appliance_option,
  add_remainder,
  my_reminder,
} from "@constants/Images";
import { colorWhite } from "@constants/Colors";
import { font16 } from "@constants/Fonts";
import { ComingSoonNav } from "@navigation/NavigationConstant";
import MyAssets from "@screens/MyAssets";
const HeaderwithArrow = (props) => {
  let edit = [
    "● There are several attributes included for each asset that will be enabled in the beta version ",
    "● The rating of the brand, retailers, service technicians and comments are to help your network in their own purchase decisions",
    "● Also you will earn Azzeti coins when the Brands and Retailers get your ratings and comments that will help them to serve you better ",
    "● Do add as many documents, appliances, gadgets and others as you can to test the Alpha version ",
    "● You will be able to edit and add these additional details in Beta version in the next 3 weeks",
  ];
  let reminder_data = [
    "You can set up fully customizable reminders for dates (1 week / 1 month or any period in advance of the end date) for end of warranty, AMC, Extended Warranty, Maintenance Service due dates for all your appliances and gadgets so that you can raise issues within the due dates. ",

    "Similarly, you can set up renewal dates for your Passport, Driving License, etc., and payment due dates of your EMI or ECS mandate, etc. Further, these alerts will get populated in your native calendar in your cell phone.",

    "\u{2B24}   You can set your own customizable and mul",
    "\u{2B24}   Important dates for end of warranty, AMC, Extended Warranty, Regular Service ",
    "\u{2B24}   Renewal related - Passport, Driving License for self and family, etc.,",
    "\u{2B24}  Payment due dates - EMI, Loan, ECS, Home mortgage, Insurance premium  etc",
    "\u{2B24}   Any important dates in your life",
  ];
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={{ flex: 0.8, flexDirection: "row" }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={props?.arrow_icon ? props?.arrow_icon : white_arrow}
            style={styles.arrowImg}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.title,
            { color: props?.color ? props?.color : colorWhite },
          ]}>
          {props.title}
        </Text>
      </View>
      {props?.rightIcon && (
        <>
          <View style={styles.iconSection}>
            {props?.remainder && (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate(ComingSoonNav, {
                    title: "My Reminders",
                    content: reminder_data,
                    icon: my_reminder,
                  });
                }}>
                <Image source={add_remainder} style={styles.remainderImg} />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                if ((props.from === "myAppliances")) {
                  navigation.navigate(MyAssets);
                } else {
                  navigation.navigate(ComingSoonNav, {
                    title: "Edit",
                    content: edit,
                    icon: my_reminder,
                  });
                }
              }}>
              <Image source={appliance_option} style={styles.optionImg} />
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
};
export default HeaderwithArrow;
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    paddingTop: Platform.OS == "ios" ? 50 : 20,
    paddingLeft: 18,
  },
  arrowImg: {
    width: 20,
    height: 18,
  },
  title: {
    paddingLeft: 12,
    fontSize: font16,
    fontFamily: "Rubik-Medium",
  },
  optionImg: {
    width: 3,
    height: 15,
    marginLeft: 20,
  },
  remainderImg: {
    width: 20,
    height: 22,
  },
  iconSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 0.2,
    paddingRight: 20,
  },
});
