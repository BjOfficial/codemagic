import { useNavigation } from "@react-navigation/native";
import { constants } from "@utils/config";
import React, { useState, useEffect } from "react";
import * as RN from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIKit from "@utils/APIKit";
import BackArrowComp from "@components/BackArrowComp";
import { colorBlack, colorLightBlue, colorWhite } from "@constants/Colors";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import ThemedButton from "@components/ThemedButton";

const DocumentView = (props) => {
  const navigation = useNavigation();
  const { id } = props.route.params;
  console.log("id", id);
  const [view, setView] = useState(null);
  console.log("params", id);
  useEffect(() => {
    viewDocument();
  }, []);
  const viewDocument = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.viewDocument + "?document_id=" + id
    );
    if (awaitlocationresp.status == 1) {
      console.log("awaitlocationresp", awaitlocationresp);
      setView(awaitlocationresp.data.data);
    } else {
      console.log("not listed location type");
    }
  };
  console.log("view", view);
  return (
    <RN.View
      style={{
        backgroundColor: colorWhite,
        height: RN.Dimensions.get("screen").height,
      }}>
      <RN.View style={{ flexDirection: "row", marginTop: 20, marginLeft: 20 }}>
        <RN.View style={{ flex: 1 }}>
          <BackArrowComp />
        </RN.View>
        <RN.View style={{ flex: 9 }}>
          <RN.Text
            style={{
              fontFamily: "Rubik-Regular",
              fontSize: 15,
              color: colorBlack,
            }}>
            {view && view.document_type && view.document_type.other_value}
          </RN.Text>
        </RN.View>
        <RN.View style={{ flex: 1 }}>
          <EvilIcons name="bell" color={colorBlack} size={25} />
        </RN.View>
        <RN.View style={{ flex: 1 }}>
          <RN.Text>
            <MaterialCommunityIcons
              name="dots-vertical"
              color={colorBlack}
              size={20}
            />
          </RN.Text>
        </RN.View>
      </RN.View>
      <RN.ScrollView>
        <RN.View
          style={{
            borderWidth: 1,
            borderColor: colorWhite,
            width: RN.Dimensions.get("screen").width * 0.95,
            alignSelf: "center",
            borderRadius: 20,
            marginTop: 20,
          }}>
          <RN.View
            style={{
              borderWidth: 1,
              borderColor: "#e7f5ff",
              backgroundColor: "#e7f5ff",
              width: RN.Dimensions.get("screen").width * 0.7,
              alignSelf: "center",
              borderRadius: 20,
              height: 40,
              marginTop: 20,
            }}>
            <RN.Text
              style={{
                color: colorLightBlue,
                alignSelf: "center",
                marginTop: 10,
                fontFamily: "Rubik-Regular",
                fontSize: 10,
              }}>
              {"Document Details :"}
            </RN.Text>
          </RN.View>

          <RN.View>
            <RN.View style={{ flexDirection: "row" }}>
              <RN.View style={{ flex: 1 }}>
                <RN.Image
                  source={require("../../assets/images/asset_detail_and_edit/serialnumber.png")}
                  style={{
                    height: 20,
                    width: 30,
                    marginTop: 20,
                    marginLeft: 20,
                  }}
                />
              </RN.View>
              <RN.View style={{ flex: 5 }}>
                <RN.View>
                  <RN.Text
                    style={{
                      color: "#747474",
                      fontFamily: "Rubik-Regular",
                      fontSize: 12,
                      marginTop: 20,
                    }}>
                    {"Document Number"}
                  </RN.Text>
                </RN.View>
                <RN.View>
                  <RN.Text
                    style={{
                      fontFamily: "Rubik-Regular",
                      fontSize: 14,
                      marginTop: 10,
                    }}>
                    {view && view.document_type && view.document_number}
                  </RN.Text>
                </RN.View>
              </RN.View>
            </RN.View>
            <RN.View
              style={{
                height: 10,
                width: RN.Dimensions.get("screen").width * 0.3,
                color: "#BCBCBC",
              }}
            />
            <RN.View style={{ flexDirection: "row" }}>
              <RN.View style={{ flex: 1 }}>
                <RN.Image
                  source={require("../../assets/images/asset_detail_and_edit/warrantyending.png")}
                  style={{
                    height: 26,
                    width: 25,
                    marginTop: 20,
                    marginLeft: 20,
                  }}
                />
              </RN.View>
              <RN.View style={{ flex: 5 }}>
                <RN.View>
                  <RN.Text
                    style={{
                      color: "#747474",
                      fontFamily: "Rubik-Regular",
                      fontSize: 12,
                      marginTop: 20,
                    }}>
                    {"Date Of Issue"}
                  </RN.Text>
                </RN.View>
                <RN.View>
                  <RN.Text
                    style={{
                      fontFamily: "Rubik-Regular",
                      fontSize: 14,
                      marginTop: 10,
                    }}>
                    {view &&
                      view.document_type &&
                      moment(new Date(view.issue_date)).format("DD/MM/YYYY")}
                  </RN.Text>
                </RN.View>
              </RN.View>
            </RN.View>
            <RN.View
              style={{
                height: 10,
                width: RN.Dimensions.get("screen").width * 0.3,
                color: "#BCBCBC",
              }}
            />
            <RN.View style={{ flexDirection: "row" }}>
              <RN.View style={{ flex: 1 }}>
                <RN.Image
                  source={require("../../assets/images/asset_detail_and_edit/warrantyending.png")}
                  style={{
                    height: 26,
                    width: 25,
                    marginTop: 20,
                    marginLeft: 20,
                  }}
                />
              </RN.View>
              <RN.View style={{ flex: 5 }}>
                <RN.View>
                  <RN.Text
                    style={{
                      color: "#747474",
                      fontFamily: "Rubik-Regular",
                      fontSize: 12,
                      marginTop: 20,
                    }}>
                    {"Date Of Expiry"}
                  </RN.Text>
                </RN.View>
                <RN.View>
                  <RN.Text
                    style={{
                      fontFamily: "Rubik-Regular",
                      fontSize: 14,
                      marginTop: 10,
                    }}>
                    {view &&
                      view.expire_date &&
                      moment(new Date(view.expire_date)).format("DD/MM/YYYY")}
                  </RN.Text>
                </RN.View>
              </RN.View>
            </RN.View>
            <RN.View
              style={{
                height: 10,
                width: RN.Dimensions.get("screen").width * 0.3,
                color: "#BCBCBC",
              }}
            />
            <RN.View style={{ flexDirection: "row" }}>
              <RN.View style={{ flex: 1 }}>
                <RN.Image
                  source={require("../../assets/images/asset_detail_and_edit/reminderdate.png")}
                  style={{
                    height: 26,
                    width: 25,
                    marginTop: 20,
                    marginLeft: 20,
                  }}
                />
              </RN.View>
              <RN.View style={{ flex: 5 }}>
                <RN.View>
                  <RN.Text
                    style={{
                      color: "#747474",
                      fontFamily: "Rubik-Regular",
                      fontSize: 12,
                      marginTop: 20,
                    }}>
                    {"Reminder Date"}
                  </RN.Text>
                </RN.View>
                <RN.View>
                  <RN.Text
                    style={{
                      fontFamily: "Rubik-Regular",
                      fontSize: 14,
                      marginTop: 10,
                    }}>
                    {view &&
                      view.expire_date &&
                      moment(new Date(view.expire_date)).format("DD/MM/YYYY")}
                  </RN.Text>
                </RN.View>
              </RN.View>
            </RN.View>
            <RN.View
              style={{
                height: 10,
                width: RN.Dimensions.get("screen").width * 0.3,
                color: "#BCBCBC",
              }}
            />
            <RN.View
              style={{
                height: 10,
                width: RN.Dimensions.get("screen").width * 0.3,
                color: "#BCBCBC",
              }}
            />

            {view &&
              view.image.map((image, index) => {
                return (
                  <RN.View style={{ marginBottom: 10 }} key={index}>
                    <RN.Image
                      source={{ uri: "file:///" + image.path }}
                      style={{
                        borderStyle: "dashed",
                        borderWidth: 1,
                        borderRadius: 1,
                        height: RN.Dimensions.get("screen").height / 6,
                        width: RN.Dimensions.get("screen").width * 0.8,
                        marginLeft: 20,
                        marginRight: 10,
                        paddingLeft: 5,
                      }}
                    />
                  </RN.View>
                );
              })}
          </RN.View>
        </RN.View>
        <RN.View
          style={{ marginVertical: 20, paddingTop: 20, marginBottom: 80 }}>
          <ThemedButton
            title="Add Remainder"
            color={colorLightBlue}></ThemedButton>
        </RN.View>
      </RN.ScrollView>
    </RN.View>
  );
};

export default DocumentView;
