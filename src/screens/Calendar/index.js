import React, { useState } from "react";
import * as RN from "react-native";
import { white_arrow } from "@constants/Images";
import { Calendar } from "react-native-calendars";
import { colorWhite } from "@constants/Colors";
import { appliance_alert, blue_bell } from "@constants/Images";
import AntDesign from "react-native-vector-icons/AntDesign";
import style from "./styles";
import moment from "moment";
import {
  AddReaminderNav,
  OtherReminderNav,
} from "@navigation/NavigationConstant";
const index = (props) => {
  const vacation = { key: "vacation", color: "red", selectedDotColor: "blue" };
  const massage = { key: "massage", color: "blue", selectedDotColor: "blue" };
  const workout = { key: "workout", color: "green" };
  const [selecterdDate, setSelectedDate] = useState("");
  const [markedDate, setMarkedDate] = useState({});
  const customMarkedDate = {
    ...markedDate,
    selecterdDate,
    "2021-11-25": { dots: [vacation, massage, workout] },
    "2021-11-26": { dots: [massage, workout] },
  };

  const getSelectedDayEvents = (date) => {
    console.warn(date);
    let markedDates = {};
    markedDates[date] = {
      selected: true,
      color: "#00B0BF",
      textColor: "#FFFFFF",
    };
    let serviceDate = moment(date);
    serviceDate = serviceDate.format("DD.MM.YYYY");
    console.warn(serviceDate);
    setSelectedDate(serviceDate);
    setMarkedDate(markedDates);
  };
  const weekStyle = {
    dayTextAtIndex0: {
      color: "black",
    },
    dayTextAtIndex1: {
      color: "black",
    },
    dayTextAtIndex2: {
      color: "black",
    },
    dayTextAtIndex3: {
      color: "black",
    },
    dayTextAtIndex4: {
      color: "black",
    },
    dayTextAtIndex5: {
      color: "black",
    },
    dayTextAtIndex6: {
      color: "black",
    },
  };
  const calendarTop = (date) => {
    return (
      <RN.View
        style={{ backgroundColor: "red", flex: 1, flexDirection: "row" }}>
        <RN.Text>data</RN.Text>
      </RN.View>
    );
  };
  const todaysAlerts = (image, title, data) => {
    return (
      <RN.TouchableOpacity style={{ paddingBottom: 15 }}>
        <RN.View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 15,
            flex: 1,
            flexDirection: "row",
            borderRadius: 20,
            backgroundColor: "#F3FAF8",
            alignItems: "center",
          }}>
          <RN.View
            style={{
              height: 40,
              width: 40,
            }}>
            <RN.Image
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
              source={image}
            />
          </RN.View>

          <RN.View style={{ flex: 1, paddingHorizontal: 10 }}>
            <RN.Text
              style={{
                color: "#393939",
                alignSelf: "flex-start",
                fontFamily: "Rubik-Medium",
                paddingBottom: 5,
                fontSize: 12,
              }}>
              {title}
            </RN.Text>
            <RN.Text
              style={{
                color: "#393939",
                fontFamily: "Rubik-Regular",
                fontSize: 12,
                lineHeight: 15,
              }}>
              {data}
            </RN.Text>
          </RN.View>
        </RN.View>
      </RN.TouchableOpacity>
    );
  };
  return (
    <RN.View style={{ flex: 1, backgroundColor: colorWhite }}>
      <RN.View style={style.navbar}>
        <RN.View style={style.navbarRow}>
          <RN.TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}>
            <RN.View>
              <RN.Image source={white_arrow} style={style.notificationIcon} />
            </RN.View>
          </RN.TouchableOpacity>
          <RN.View>
            <RN.Text style={style.navbarName}>{"Calender"}</RN.Text>
          </RN.View>
        </RN.View>
      </RN.View>
      <RN.ScrollView
        style={{ margin: 15 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <RN.View
          style={{
            padding: 5,
            marginBottom: 30,
            borderRadius: 20,
            borderColor: "#CBCBCB",
            borderWidth: 1,
          }}>
          <Calendar
            theme={{ "stylesheet.calendar.header": weekStyle }}
            markingType={"multi-dot"}
            // hideArrows={true}
            // renderHeader={(date) => calendarTop(date)}
            onDayPress={(day) => {
              getSelectedDayEvents(day.dateString);
            }}
            markedDates={customMarkedDate}
          />
        </RN.View>
        <RN.View
          style={{
            paddingTop: 20,
            paddingBottom: 10,
          }}>
          <RN.View style={{ paddingVertical: 10 }}>
            <RN.Text style={{ fontFamily: "Rubik-Medium", color: "#393939" }}>
              Alerts:
            </RN.Text>
          </RN.View>
          {todaysAlerts(
            appliance_alert,
            "Warranty Ending",
            "Warranty end date for Whirlpool Fridge"
          )}
          {todaysAlerts(
            appliance_alert,
            "Free Service Due",
            "Free Service Due for Voltas 2T AC"
          )}
        </RN.View>
        <RN.View style={{ paddingBottom: 20 }}>
          <RN.View style={style.center}>
            <RN.TouchableOpacity
              style={{
                flexDirection: "row",
                paddingHorizontal: 25,
                paddingVertical: 10,
                borderWidth: 1,
                borderRadius: 20,
                borderColor: "#1D7BC3",
              }}
              onPress={() => props.navigation.navigate(OtherReminderNav)}>
              <RN.View style={{ height: 20, width: 20 }}>
                <RN.Image
                  style={{
                    flex: 1,
                    width: "100%",
                    height: "100%",
                    resizeMode: "contain",
                  }}
                  source={blue_bell}
                />
              </RN.View>
              <RN.Text style={{ paddingLeft: 10, color: "#1D7BC3" }}>
                Add new Reminder
              </RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
        </RN.View>
        <RN.View
          style={{
            paddingVertical: 20,
            borderTopColor: "#F5F5F5",
            borderTopWidth: 1,
          }}>
          <RN.View style={{ flexDirection: "row", justifyContent: "center" }}>
            <RN.Text>You have </RN.Text>
            <RN.Text
              style={{ color: "#F3A13B", textDecorationLine: "underline" }}>
              14 alerts{" "}
            </RN.Text>
            <RN.Text>for this month</RN.Text>
          </RN.View>
          <RN.Text style={{ textAlign: "center", paddingVertical: 10 }}>
            (1 renewal, 1 warranty end date, 7 payments due dates,1 service
            reminders, 1 appliance anniversary, 4 personal reminders)
          </RN.Text>
          <RN.View style={style.center}>
            <RN.TouchableOpacity
              onPress={() => {
                props.navigation.navigate("Remainders");
              }}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: "#393939",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
              }}>
              <RN.Text>View all</RN.Text>
              <RN.Text style={{ paddingHorizontal: 2 }}>{""}</RN.Text>
              <AntDesign name="right" size={15} />
            </RN.TouchableOpacity>
          </RN.View>
        </RN.View>
      </RN.ScrollView>
    </RN.View>
  );
};

export default index;
