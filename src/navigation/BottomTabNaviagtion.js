import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "@screens/Dashboard";
import MyAssets from "@screens/MyAssets";
import Documents from "@screens/Documents";
import Remainders from "@screens/Remainders";
import * as RN from "react-native";
import Icons from "react-native-vector-icons/AntDesign";
import IonIcons from "react-native-vector-icons/Ionicons";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import Add from "@screens/Add";
import style from "./style";
import { my_appliances } from "@constants/Images";
const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#ffffff",
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          elevation: 0,
          opacity: 0.9,
        },
      }}>
      <Tab.Screen
        name="Dashboard"
        component={Dashboard}
        options={{
          tabStyle: {
            justifyContent: "center",
          },
          headerShown: false,
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <RN.View>
                <Icons name="home" color={color} size={size} />
                {focused ? (
                  <RN.Text style={style.dot}>{"\u2B24"}</RN.Text>
                ) : null}
              </RN.View>
            );
          },
        }}
      />
      <Tab.Screen
        name="MyAssets"
        component={MyAssets}
        options={{
          headerShown: false,
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({ focused, color }) => {
            return (
              <RN.View>
                <RN.Image
                  source={my_appliances}
                  style={[{ height: 21, width: 18 }, { tintColor: color }]}
                />
                {focused ? (
                  <RN.Text style={style.dot}>{"\u2B24"}</RN.Text>
                ) : null}
              </RN.View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Add"
        component={Add}
        options={{
          headerShown: false,
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <RN.View>
                <Icons name="pluscircleo" color={color} size={size} />
                {focused ? (
                  <RN.Text style={style.dot}>{"\u2B24"}</RN.Text>
                ) : null}
              </RN.View>
            );
          },
        }}
      />
      <Tab.Screen
        name="Documents"
        component={Documents}
        options={{
          headerShown: false,
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <RN.View>
                <IonIcons
                  name="document-text-outline"
                  color={color}
                  size={size}
                />
                {focused ? (
                  <RN.Text style={style.dot}>{"\u2B24"}</RN.Text>
                ) : null}
              </RN.View>
            );
          },
        }}
      />

      <Tab.Screen
        name="Remainders"
        component={Remainders}
        options={{
          headerShown: false,
          tabBarLabel: () => {
            return null;
          },
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <RN.View>
                <EvilIcons name="bell" color={color} size={size} />
                {focused ? (
                  <RN.Text style={style.dot}>{"\u2B24"}</RN.Text>
                ) : null}
              </RN.View>
            );
          },
        }}
      />
    </Tab.Navigator>
  );
}

export default function BottomTabNavigation() {
  return <MyTabs />;
}
