import StatusBar from "@components/StatusBar";
import ThemedButton from "@components/ThemedButton";
import { colorAsh, colorLightBlue, colorWhite } from "@constants/Colors";
import {
  useNavigation,
  DrawerActions,
  useIsFocused,
} from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import * as RN from "react-native";
import APIKit from "@utils/APIKit";
import FilterButtons from "@components/FilterButtons";
import style from "./styles";
import { AddAssetNav, MyAppliancesNav } from "@navigation/NavigationConstant";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { constants } from "@utils/config";
import moment from "moment";

const MyAssets = () => {
  const isFouced = useIsFocused();
  const navigation = useNavigation();
  const [pagenumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [filterStateOption, setFilterStateOption] = useState([]);
  const [category_id, setCategoryid] = useState("");
  const navigateToAddAsset = () => {
    navigation.navigate(AddAssetNav);
  };
  const [applianceList, setApplianceList] = useState([]);
  useEffect(() => {
    listAppliance(pagenumber, "");
    listappliancecategory();
  }, [isFouced]);

  const listAppliance = async (data, cate_id) => {
    const getToken = await AsyncStorage.getItem("loginToken");
    let ApiInstance = await new APIKit().init(getToken);
    console.log(
      "filter api payload",
      constants.listAppliance +
        "?page_no=" +
        data +
        "&page_limit=" +
        pageLimit +
        "&category_id=" +
        cate_id
    );
    let awaitlocationresp = await ApiInstance.get(
      constants.listAppliance +
        "?page_no=" +
        data +
        "&page_limit=" +
        pageLimit +
        "&category_id=" +
        cate_id
    );
    console.log("filter response", awaitlocationresp.data.data.length);
    if (awaitlocationresp.status == 1) {
      if (awaitlocationresp.data.data.length > 0) {
        setPageNumber(data);
      }
      setLoading(false);
      let clonedDocumentList = data == 1 ? [] : [...applianceList];
      setApplianceList(clonedDocumentList.concat(awaitlocationresp.data.data));
    } else {
      console.log("not listed location type");
    }
  };
  const listappliancecategory = async () => {
    const getToken = await AsyncStorage.getItem("loginToken");
    console.log("token", getToken);
    let ApiInstance = await new APIKit().init(getToken);

    let awaitlocationresp = await ApiInstance.get(
      constants.listApplianceCategory
    );
    if (awaitlocationresp.status == 1) {
      let alloption = [
        {
          isSelected: true,
          name: "All",
        },
      ];
      let concatdata = [...alloption, ...awaitlocationresp.data.data];
      setFilterStateOption(concatdata);
    } else {
      console.log("not listed location type");
    }
  };
  const DrawerScreen = () => {
    return navigation.dispatch(DrawerActions.toggleDrawer());
  };
  const LoadMoreRandomData = () => {
    listAppliance(pagenumber + 1, category_id);
  };
  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  const FiltersApply = async (data, index) => {
    setCategoryid(data._id);
    console.log("filetrs data", data);
    let filterStateOption1 = [...filterStateOption];
    filterStateOption1.map((obj, index_item) => {
      let obj2 = obj;
      if (index_item != index) {
        obj2.isSelected = false;
      }
      return obj2;
    });

    filterStateOption1[index].isSelected = {}.propertyIsEnumerable.call(
      filterStateOption1[index],
      "isSelected"
    )
      ? !filterStateOption1[index].isSelected
      : true;
    setPageNumber(1);
    if (data.name == "All") {
      setCategoryid("");
      listAppliance(1, "");
    } else {
      listAppliance(1, data._id);
    }
    setFilterStateOption(filterStateOption1);
  };
  const renderItem = ({ item, index }) => {
    return (
      <RN.View key={index} style={{ margin: 5, elevation: 5 }}>
        <RN.TouchableOpacity
          style={{
            height: RN.Dimensions.get("screen").height * 0.3,
            width: RN.Dimensions.get("window").width * 0.45,
            backgroundColor: colorWhite,
            elevation: 5,
            borderRadius: 20,
          }}
          onPress={() =>
            navigation.navigate(MyAppliancesNav, { applianceList: item })
          }>
          {item.image[0] && item.image ? (
            <RN.Image
              source={{
                uri: "file:///" + item.image[0].path,
              }}
              style={{
                borderWidth: 1,
                height: RN.Dimensions.get("screen").height / 8,
                width: RN.Dimensions.get("screen").width * 0.4,
                borderRadius: 20,
                marginTop: 20,
                marginLeft: 10,
              }}
            />
          ) : (
            <RN.Image
              source={require("../../assets/images/asset_detail_and_edit/ac.png")}
              style={{
                borderWidth: 1,
                height: RN.Dimensions.get("screen").height / 8,
                width: RN.Dimensions.get("screen").width * 0.4,
                borderRadius: 20,
                marginTop: 20,
                marginLeft: 10,
              }}
            />
          )}
          <RN.Text
            style={{
              fontFamily: "Rubik-Regular",
              paddingLeft: 20,
              marginTop: 20,
            }}>
            {item.type.name ? item.type.name : item.type.other_value}
          </RN.Text>
          <RN.Text
            style={{
              fontFamily: "Rubik-Regular",
              paddingLeft: 20,
              marginTop: 5,
              color: colorAsh,
              fontSize: 12,
              marginBottom: 5,
            }}>
            {item.brand.name ? item.brand.name : item.brand.other_value}
          </RN.Text>
          <RN.View
            style={{
              borderBottomColor: colorAsh,
              borderBottomWidth: 0.5,
            }}
          />
          <RN.View style={{ flexDirection: "row" }}>
            <RN.View style={{ flex: 1 }}>
              <RN.Image
                source={require("../../assets/images/home/expirycalender.png")}
                style={{ height: 22, width: 20, marginTop: 10, marginLeft: 20 }}
              />
            </RN.View>
            <RN.View style={{ flex: 2.3 }}>
              <RN.Text
                style={{
                  color: "#8a520d",
                  fontFamily: "Rubik-Regular",
                  marginTop: 15,
                }}>
                {moment(new Date(item.purchase_date)).format("DD/MM/YYYY")}
              </RN.Text>
            </RN.View>
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
    );
  };

  return (
    <RN.View style={{ backgroundColor: colorWhite, flex: 1, marginBottom: 50 }}>
      <StatusBar />
      <RN.View style={style.navbar}>
        <RN.View style={style.navbarRow}>
          <RN.TouchableOpacity
            onPress={() => {
              DrawerScreen();
            }}>
            <RN.View style={{ flex: 1 }}>
              <RN.Image
                source={require("../../assets/images/home/menu.png")}
                style={style.notificationIcon}
              />
            </RN.View>
          </RN.TouchableOpacity>
          <RN.View style={{ flex: 1 }}>
            <RN.TouchableOpacity>
              <RN.Text style={style.navbarName}>{"My Assets "}</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
        </RN.View>
      </RN.View>
      {/* {applianceList&&applianceList.length>0&& */}

      <RN.View style={[style.FilterButtongrp, { height: null }]}>
        <RN.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}>
          {filterStateOption &&
            filterStateOption.map((obj, index) => {
              return (
                <FilterButtons
                  buttonClick={() => FiltersApply(obj, index)}
                  // buttonClick={() => clickFilter(obj, index)}
                  buttonTitle={obj.name}
                  key={index}
                  buttonLeftSize={10}
                  buttonRightSize={10}
                  isSelected={obj.isSelected}
                />
              );
            })}
        </RN.ScrollView>
      </RN.View>
      {/* } */}
      <RN.ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            console.log("reached bottom");
            // enableSomeButton();
            if (!loading) {
              setLoading(true);
              setTimeout(() => {
                LoadMoreRandomData();
              }, 1000);
              // setPageNumber(pagenumber+1);
            }
          }
        }}
        scrollEventThrottle={400}>
        {applianceList.length > 0 ? (
          <RN.FlatList
            style={{ marginBottom: 20, marginLeft: 5, marginTop: 0 }}
            data={applianceList}
            renderItem={renderItem}
            numColumns={2}
          />
        ) : (
          <RN.View
            style={[
              style.center,
              {
                flex: 1,
                marginBottom: 50,
                justifyContent: "center",
                alignItems: "center",
              },
            ]}>
            <RN.Image
              source={require("../../assets/images/emptyStates/addasset.png")}
              style={style.image}
            />
            <RN.Text style={style.text}>
              {"Manage your Assets like an Expert"}
            </RN.Text>
            <RN.TouchableOpacity onPress={() => navigateToAddAsset()}>
              <ThemedButton
                title="+ Add Asset"
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

export default MyAssets;
