import StatusBar from "@components/StatusBar";
import ThemedButton from "@components/ThemedButton";
import { colorLightBlue,colorWhite} from "@constants/Colors";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import React from "react";
import * as RN from "react-native";
import { home_icon,options, appliance_alert, doc_alert, all_alert } from "@constants/Images";
import AntDesign from "react-native-vector-icons/AntDesign";
import style from "./styles";
import { AddReaminderNav } from "@navigation/NavigationConstant";
import { useState } from "react/cjs/react.development";

const Remainders = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const [remainderData] = useState([
    {
      date: "jul 20",
      image: all_alert,
	    color: "#E55895",
      title: "EMI Due",
      data: "Rs.36,980 for Home mortgage HDFC and Rs. 3,500 for RWA Maintenance",
    },
    {
      date: "Jul 04",
      image: doc_alert,
	    color:"#35AF92",
      title: "Appliance Anniversary",
      data: "7th Year completion of Panasonic 1.5T AC at Guest Bedroom",
    },
    {
      date: "Jul 10",
      image: appliance_alert,
	    color:"#5858DD",
      title: "Monthly Payment",
      data: "Payment for EB and Cable TV",
    },
    {
      date: "Jul 04",
      image: doc_alert,
	    color: "#E55895",
      title: "Appliance Anniversary",
      data: "7th Year completion of Panasonic 1.5T AC at Guest Bedroom",
    },
    {
      date: "Jul 04",
      image: doc_alert,
	    color:"#35AF92",
      title: "Appliance Anniversary",
      data: "7th Year completion of Panasonic 1.5T AC at Guest Bedroom",
    },
    {
      date: "Jul 10",
      image: all_alert,
	    color: "#E55895",
      title: "Family Functiont",
      data: "Anniversary for In-Laws and Alumni Club dues",
    },
    {
      date: "Jul 10",
      image: doc_alert,
	    color:"#35AF92",
      title: "Free Service due",
      data: "Free service due for Voltas 2T AC at Living Room",
    },
  ]);
  const DrawerScreen = () => {
    return navigation.dispatch(DrawerActions.toggleDrawer());
  };
  const renderItem = ({ item, index }) => {
    return (
      <RN.View key={index} style={{ marginTop: 10, marginBottom: 10}}>
        <RN.View style={{ paddingHorizontal: 20 }}>
          <RN.View
            style={{
              backgroundColor: "#F6F6F6",
              borderTopRightRadius:10,
              borderTopLeftRadius:10,
              paddingTop:5,
              paddingHorizontal: 10,
              alignSelf: "flex-start",
            }}>
            <RN.Text
              adjustsFontSizeToFit
              style={{ textAlign: "center", fontSize: 12, color: "#393939" , fontFamily: 'Rubik-Medium'}}>
              {item.date}
            </RN.Text>
          </RN.View>
        </RN.View>
        <RN.View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 15,
            flex: 1,
            flexDirection: "row",
			      borderRadius:20,
            backgroundColor: "#F6F6F6",
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
              source={item.image}
            />
          </RN.View>

          <RN.View style={{ flex: 1, paddingHorizontal: 10 }}>
            <RN.Text
              style={{
                color: "#393939",
                alignSelf: "flex-start",
                fontFamily:"Rubik-Medium",
                paddingBottom:5,
                fontSize:12
              }}>
              {item.title}
            </RN.Text>
            <RN.Text style={{ color: "#393939" , fontFamily:"Rubik-Regular", fontSize:12, lineHeight:15}}>{item.data}</RN.Text>
          </RN.View>

          <RN.TouchableOpacity
            style={{
              height: 40,
              width: 43,
              padding: 10,
              borderRadius: 50,
            }}>
            <RN.Image
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
              source={options}
            />
          </RN.TouchableOpacity>
        </RN.View>
      </RN.View>
    );
  };

  return (
    <RN.View style={{flex: 1, marginBottom: 50, backgroundColor:colorWhite}} >
      <StatusBar />
      <RN.View style={style.navbar}>
        <RN.View style={style.navbarRow}>
          <RN.TouchableOpacity
            onPress={() => {
              DrawerScreen();
            }}>
            <RN.View style={{ flex: 1 }}>
              <RN.Image source={home_icon} style={style.notificationIcon} />
            </RN.View>
          </RN.TouchableOpacity>
          <RN.View style={{ flex: 1 }}>
            <RN.TouchableOpacity>
              <RN.Text style={style.navbarName}>{"My Remainders "}</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
          <RN.View style={{ flex: 0 }}>
            <RN.TouchableOpacity>
              <AntDesign
                name="calendar"
                color="#FFFFFF"
                size={22}
                style={{ margin: 17 }}
              />
            </RN.TouchableOpacity>
          </RN.View>
        </RN.View>
      </RN.View>
	  <RN.ScrollView
        contentContainerStyle={{ flexGrow: 1}}>
      {remainderData.length > 0 ? (
        <RN.View
          style={{
            padding: 10,
            backgroundColor:colorWhite
          }}>
          <RN.FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={remainderData}
            renderItem={renderItem}
            keyExtractor={(item, index) => index.toString()}
          />
        </RN.View>
      ) : (
        <RN.View style={style.center}>
          <RN.Image
            source={require("../../assets/images/emptyStates/addreminder.png")}
            style={style.image}
          />
          <RN.Text style={style.text}>{"Set Alerts for Remainders"}</RN.Text>
          <RN.TouchableOpacity
            onPress={() => navigation.navigate(AddReaminderNav)}>
            <ThemedButton
              title="+ Add Remainder"
              mode="outline"
              color={colorLightBlue}
              buttonStyle={{ marginTop: 20 }}
              btnStyle={{ fontFamily: "Rubik-Medium" }}></ThemedButton>
          </RN.TouchableOpacity>
        </RN.View>
      )}
	  </RN.ScrollView>
	  {loading && <RN.ActivityIndicator size="large" color={colorLightBlue} />}
    </RN.View>
  );
};

export default Remainders;
