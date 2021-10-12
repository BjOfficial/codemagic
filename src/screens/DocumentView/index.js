import { constants } from "@utils/config";
import React, { useState, useEffect } from "react";
import * as RN from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import APIKit from "@utils/APIKit";
import BackArrowComp from "@components/BackArrowComp";
import {
  colorAsh,
  colorBlack,
  colorBrown,
  colorLightBlue,
  colorplaceholder,
  colorWhite,
} from "@constants/Colors";
import { addreminder_white, alert_icon } from "@constants/Images";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import moment from "moment";
import { font13, font12 } from "@constants/Fonts";

const DocumentView = (props) => {
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
        flex: 1,
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
            flex: 1,
            elevation: 4,
            width: RN.Dimensions.get("screen").width * 0.95,
            alignSelf: "center",
            borderRadius: 20,
            marginTop: 20,
            backgroundColor: colorWhite,
          }}>
          <RN.View
            style={{
              borderWidth: 1,
              borderColor: "#e7f5ff",
              backgroundColor: "#e7f5ff",
              width: RN.Dimensions.get("screen").width * 0.8,
              alignSelf: "center",
              borderRadius: 20,
              height: 50,
              marginTop: 20,
            }}>
            <RN.Text
              style={{
                color: colorLightBlue,
                alignSelf: "center",
                marginTop: 15,
                fontFamily: "Rubik-Regular",
                fontSize: 17,
              }}>
              {"Document Details:"}
            </RN.Text>
          </RN.View>

          <RN.View style={{ marginTop: 20 }}>
            <RN.View style={{ flexDirection: "row" }}>
              <RN.View style={{ flex: 1 }}>
                <RN.Image
                  source={require("../../assets/images/asset_detail_and_edit/serialnumber.png")}
                  style={{
                    height: 15,
                    width: 20,
                    marginTop: 20,
                    marginLeft: 30,
                  }}
                />
              </RN.View>
              <RN.View style={{ flex: 5 }}>
                <RN.View>
                  <RN.Text
                    style={{
                      color: "#747474",
                      fontFamily: "Rubik-Regular",
                      fontSize: 13,
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
                borderBottomColor: colorAsh,
                borderBottomWidth: 0.5,
                width: RN.Dimensions.get("screen").width * 0.8,
                alignSelf: "center",
                marginTop: 20,
              }}
            />
            <RN.View style={{ flexDirection: "row", marginTop: 10 }}>
              <RN.View style={{ flex: 1 }}>
                <RN.Image
                  source={require("../../assets/images/asset_detail_and_edit/warrantyending.png")}
                  style={{
                    height: 18,
                    width: 17,
                    marginTop: 20,
                    marginLeft: 30,
                  }}
                />
              </RN.View>
              <RN.View style={{ flex: 5 }}>
                <RN.View>
                  <RN.Text
                    style={{
                      color: "#747474",
                      fontFamily: "Rubik-Regular",
                      fontSize: 14,
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
                borderBottomColor: colorAsh,
                borderBottomWidth: 0.5,
                width: RN.Dimensions.get("screen").width * 0.8,
                alignSelf: "center",
                marginTop: 20,
              }}
            />
            <RN.View style={{ flexDirection: "row" }}>
              <RN.View style={{ flex: 1 }}>
                <RN.Image
                  source={require("../../assets/images/asset_detail_and_edit/warrantyending.png")}
                  style={{
                    height: 18,
                    width: 17,
                    marginTop: 20,
                    marginLeft: 30,
                  }}
                />
              </RN.View>
              <RN.View style={{ flex: 5 }}>
                <RN.View>
                  <RN.Text
                    style={{
                      color: "#747474",
                      fontFamily: "Rubik-Regular",
                      fontSize: 14,
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
                borderBottomColor: colorAsh,
                borderBottomWidth: 0.5,
                width: RN.Dimensions.get("screen").width * 0.8,
                alignSelf: "center",
                marginTop: 20,
              }}
            />
            <RN.View style={{ flexDirection: "row" }}>
              <RN.View style={{ flex: 1 }}>
                <RN.Image
                  source={require("../../assets/images/asset_detail_and_edit/reminderdate.png")}
                  style={{
                    height: 18,
                    width: 17,
                    marginTop: 20,
                    marginLeft: 30,
                  }}
                />
              </RN.View>
              <RN.View style={{ flex: 5 }}>
                <RN.View>
                  <RN.Text
                    style={{
                      color: "#747474",
                      fontFamily: "Rubik-Regular",
                      fontSize: 14,
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

            {view &&
              view.image.map((image, index) => {
                return (
                  <RN.View style={{ marginBottom: 10 }} key={index}>
                    <RN.Image
                      source={{ uri: "file:///" + image.path }}
                      style={{
                        borderStyle: "dashed",
                        borderWidth: 1,
                        borderRadius: 15,
                        height: RN.Dimensions.get("screen").height / 4,
                        width: RN.Dimensions.get("screen").width * 0.85,
                        marginLeft: 20,
                        marginRight: 10,
                        paddingLeft: 5,
                        marginTop: 30,
                        elevation: 2,
                      }}
                    />
                  </RN.View>
                );
              })}
          </RN.View>
        </RN.View>
        {/* <RN.View
					style={{ marginVertical: 20, paddingTop: 20, marginBottom: 80 }}>
					<ThemedButton
						icon={
							<RN.Image
								source={require('../../assets/images/calendar_reminder_and_menu/viewalert.png')}
								style={{ height: 20, width: 20, tintColor: colorWhite }}
							/>
						}
						title="Add Remainder"
						color={colorLightBlue}
						style={{
							width: '60%',
							alignSelf: 'center',
							borderRadius: 20,
							height: '23%',
						}}></ThemedButton>
				</RN.View> */}
        <RN.View style={styles.reminderBtnView}>
          <RN.TouchableOpacity style={styles.reminderBtnn}>
            <RN.Image source={addreminder_white} style={styles.reminderIcon} />
            <RN.Text style={styles.reminderText}>Add Reminder</RN.Text>
          </RN.TouchableOpacity>
        </RN.View>
      </RN.ScrollView>
      <RN.View style={styles.bottomFixed}>
        <RN.View style={styles.warningView}>
          <RN.View
            style={{
              flex: 0.1,
              alignItems: "center",
              justifyContent: "center",
            }}>
            <RN.ImageBackground
              source={alert_icon}
              resizeMode="contain"
              style={styles.warningImg}
            />
          </RN.View>
          <RN.View style={{ flex: 0.67 }}>
            <RN.Text style={styles.warrantytext}>
              Validity ending on{" "}
              {view &&
                view.expire_date &&
                moment(new Date(view.expire_date)).format("DD/MM/YYYY")}
            </RN.Text>
          </RN.View>
          <RN.View style={{ flex: 0.23 }}>
            <RN.TouchableOpacity style={styles.viewalertBtn}>
              <RN.Text style={styles.viewalertlabel}>View alert</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
        </RN.View>
      </RN.View>
    </RN.View>
  );
};

export default DocumentView;
const styles = RN.StyleSheet.create({
  reminderBtnn: {
    backgroundColor: colorLightBlue,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 30,
    padding: 12,
    justifyContent: "center",
  },
  reminderIcon: {
    width: 20,
    height: 20,
  },
  reminderText: {
    color: colorWhite,
    fontSize: 13,
    fontFamily: "Rubik-Medium",
    marginLeft: 10,
  },
  reminderBtnView: {
    width: "60%",
    marginLeft: "20%",
    marginVertical: 30,
    paddingBottom: 70,
  },
  bottomFixed: {
    backgroundColor: colorWhite,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingVertical: 30,
    shadowColor: colorplaceholder,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.4,
    shadowRadius: 7,
    elevation: 24,
  },
  warningView: {
    backgroundColor: colorBrown,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    justifyContent: "center",
  },
  warningImg: {
    width: 20,
  },
  warrantytext: {
    color: colorWhite,
    fontFamily: "Rubik-Regular",
    fontSize: font13,
  },
  viewalertBtn: {
    backgroundColor: colorWhite,
    borderRadius: 30,
    padding: 5,
    paddingHorizontal: 10,
  },
  viewalertlabel: {
    fontSize: font12,
    color: colorBrown,
    fontFamily: "Rubik-Regular",
  },
});
