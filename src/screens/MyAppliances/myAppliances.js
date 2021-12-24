/* eslint-disable indent */
/* eslint-disable unused-imports/no-unused-vars */
import style from './style';
import React, { useState, useRef, useEffect,useContext } from 'react';
import { colorAsh, colorBlack, colorLightBlue } from '@constants/Colors';
import {
  back_icon,
  defaultImage,
  brandname,
  no_image_icon,
} from '@constants/Images';
import * as RN from 'react-native';
import HeaderwithArrow from '../../components/HeaderwithArrow';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config';
import { AuthContext } from '@navigation/AppNavigation';
import { format } from 'date-fns';
import RNFS from 'react-native-fs';
import { ApplianceMoreDetailsNav } from '@navigation/NavigationConstant';
import SnapCarouselComponent from '@components/SnapCarouselComponent';
import Loader from '@components/Loader';

export const SLIDER_WIDTH = RN.Dimensions.get('screen').width + 70;
export const deviceWidth = RN.Dimensions.get('window').width;

import ErrorBoundary from '@services/ErrorBoundary';
import { font11 } from '@constants/Fonts';

export default function MyAppliances(props) {
  let applianceDetails = props?.route?.params?.applianceList,
    pagenumber_limit = props?.route?.params?.currentIndex,
    catID = props?.route?.params?.catID,
    detectedPagenumberLimit = pagenumber_limit
      ? Math.ceil((pagenumber_limit + 1) / 10)
      : -1;
  console.log('detectedPagenumberLimit', pagenumber_limit);
  const navigation = useNavigation();
  let { locationID } = useContext(AuthContext);
  const [imageActive, setImageActive] = useState(0);
  const [loading, setLoading] = useState(false);
  const [pagenumber, setPageNumber] = useState(1);
  const [pageLimit, setPageLimit] = useState(10);
  const carouselRef = useRef(null);
  const [applianceID, setApplianceID] = useState(applianceDetails?._id);

  const [index, setIndex] = React.useState(0);
  const [view, setView] = React.useState([]);
  const [applianceList, setApplianceList] = useState([]);
  const [currentID, setCurrentID] = useState(0);
  let temp_id = 0;
  const focused = useIsFocused();

  useEffect(() => {
    if (applianceList.length > 0) {
      if (applianceList.length >= detectedPagenumberLimit * 10) {
        let appliancedata = [...applianceList];
        let finddata =
          appliancedata &&
          appliancedata.findIndex((data) => data?._id == applianceDetails?._id);
        if (finddata != -1) {
          // console.log('appliance lenth', appliancedata.length);
          // console.log('appliance finddata', finddata);
          // setCurrentID(finddata);
          // setTimeout(()=>{
          // },1000);
        }
      }
    }
  }, [applianceList]);

  useEffect(() => {
    console.log('appliance details updated.....');
    if (focused) {
    setApplianceList([]);
    tempArray = [];
    listAppliances(1, 'reset');
    }
  }, [applianceDetails, focused]);
  let tempArray = [];
  function checkImageURL(URL) {
    let fileFound = RNFS.readFile(URL, 'ascii')
      .then((res) => {
        return true;
      })
      .catch((e) => {
        return false;
      });
    return fileFound;
  }
  const onImageLoadingError = (event, index) => {
    let applianceListTemp = applianceList;
    let appliance = applianceList[index];
    appliance.fileData = false;
  };

  const latestSpareCost = (data) => {
    const temp = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    if(temp[0]?.labour_cost){
    return `\u20B9 ${temp[0]?.labour_cost}`;
    }
    else{
      return '';
    }
  };

  const latestServiceCost = (data) => {
    const temp = data.sort((a, b) => new Date(b.date) - new Date(a.date));
    if(temp[0]?.spare_cost){
    return `\u20B9 ${temp[0]?.spare_cost}`;
    }
    else{
      return '';
    }
  };

  const listAppliances = async (data, reset, norepeat) => {
    setLoading(true);
    const getToken = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(getToken),
    pageRequest=constants.listAppliance +
    '?page_no=' +
    data +
    '&page_limit=' +
    pageLimit +"&category_id=" + catID +'&asset_location_id=' +
    locationID
    console.log("pageRequest",pageRequest);
    let awaitlocationresp = await ApiInstance.get(
      pageRequest
    );
    if (awaitlocationresp.status == 1) {
      // console.log("------------------------>",awaitlocationresp.data.data[0])
      await awaitlocationresp.data.data.forEach((list) => {
        try {
          let assetName = list.type.name.replace(/ /g, '').toLowerCase();
          let brandName = 'Others';
          var defImg;
          defaultImage.forEach((assetType) => {
            defImg = assetType[assetName][brandName].url;
          });
        } catch (e) {
          defImg = no_image_icon;
        }
        if (list.image.length > 0) {
          if (checkImageURL(list.image[0].path)) {
            list.fileData = true;
            list.setImage = list.image[0].path;
          }
        } else {
          list.fileData = false;
          list.defaultImage = defImg;
        }
        list.defaultImage = defImg;
      });
      let clonedDocumentList = [...applianceList];
      if (reset) {
        clonedDocumentList = [];
        tempArray = [];
      }
      if (awaitlocationresp && awaitlocationresp.data.data.length > 0) {
        if (!norepeat) {
          tempArray = tempArray.concat(awaitlocationresp.data.data);
        } else {
          tempArray = clonedDocumentList.concat(awaitlocationresp.data.data);
        }
      }else{
        tempArray=[...clonedDocumentList];
      }

      if (
        detectedPagenumberLimit > 1 &&
        data < detectedPagenumberLimit &&
        !norepeat
      ) {
        listAppliances(data + 1);
      } else {
        setPageNumber(data);
        let finddata = tempArray.findIndex(
          (data1) => data1._id == applianceDetails._id
        );
        console.log('temparray',tempArray);
        if(finddata!=-1){
        let splicingIndexData = [...tempArray],
          splicedIndex = splicingIndexData.splice(finddata, 1),
          unshiftedData = splicingIndexData.unshift(tempArray[finddata]);
          console.log("splicing dtaa",splicingIndexData);
         setApplianceList([...splicingIndexData]);
        setLoading(false);
        tempArray = [];
      }else{
        console.log('finddata',finddata,applianceDetails._id,tempArray.length);
        setLoading(false);
        // setApplianceList([]);
      }
    }
    } else {
      console.log('not listed location type');
    }
  };
  const onSnapItem = (data_index) => {

    let clonedList = [...applianceList];
    if (data_index == clonedList.length - 1) {
      listAppliances(pagenumber + 1, null, 'norepeat');
    }
    setCurrentID(data_index);
  };

  const list_applicances = (data, index) => {
    console.log("list appliance error",data);
    try {
      let categoryName = data.category.name.replace(/ /g, '');
      let assetName = data.type.name.replace(/ /g, '');
      let brandName = data.brand.name.replace(/ /g, '');
      var defImg;

      defaultImage.forEach((category) => {
        if (categoryName === 'Others') {
          defImg = brandname;
        } else if (typeof category[categoryName] === undefined) {
          defImg = brandname;
        } else {
          category[categoryName].forEach((asset) => {
            if (assetName === 'Others') {
              defImg = brandname;
            } else if (typeof asset === undefined) {
              defImg = brandname;
            } else {
              defImg = asset ? asset[assetName][brandName].url : brandname;
            }
          });
        }
      });
    } catch (e) {
      console.log("catche error --===",e);
      defImg = brandname;
    }
    console.log("file data",data.fileData);
    return (
      <ErrorBoundary>
        <RN.View>
        <RN.StatusBar barStyle="dark-content" />
        <RN.View showsVerticalScrollIndicator={false} style={[style.mainLayoutcarousel]}>
            <RN.View style={style.titleWrapper}>
              <RN.Text style={style.title}>APPLIANCE DETAILS</RN.Text>
              <RN.View style={style.titleBorder} />
            </RN.View>
            {/* <RN.Text
              style={{
                alignSelf: 'center',
                borderTopColor: 'gold',
                borderTopWidth: 2,
                width: '10%',
                marginTop: 5,
              }}>
              {'  '}
            </RN.Text> */}
            <RN.View></RN.View>
            <RN.View
              style={{
                paddingLeft: 20,
                paddingBottom: 20,
                paddingRight: 20,
              }}>
              <RN.View
                style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <RN.Image
                  source={{
                    uri: data.fileData  ? data.setImage : RN.Image.resolveAssetSource(data.defaultImage).uri
                  }}
                  style={{
                    height: RN.Dimensions.get('screen').height / 6,
                    width: RN.Dimensions.get('screen').width * 0.75,
                    marginTop: 10,
                    marginBottom: 20,
                   alignSelf: 'center'
                  }}
                  resizeMode={'contain'}
                  onError={(e) => onImageLoadingError(e, index)}
                />
              </RN.View>
              <RN.View style={style.content}>
                <RN.View style={{ flex: 1 }}>
                  <RN.Text style={style.topText}>BrandName</RN.Text>
                  <RN.Text numberOfLines={1} ellipsizeMode='tail' style={style.bottomText}>
                    {data?.brand?.name && data?.brand?.is_other_value ? data?.brand?.other_value : data?.brand?.name}</RN.Text>
                </RN.View>
                <RN.View style={{ flex: 1, paddingLeft: 30 }}>
                  <RN.Text style={style.topText}>Retailer</RN.Text>
                  <RN.Text numberOfLines={1} ellipsizeMode='tail' style={style.bottomText}></RN.Text>
                </RN.View>
              </RN.View>
              <RN.View
                style={{
                  borderBottomColor: "#BCBCBC",
                  borderBottomWidth: 1,
                }}
              />
              <RN.View style={style.content}>
                <RN.View style={{ flex: 1 }}>
                  <RN.Text style={style.topText}>Model Name</RN.Text>
                  <RN.Text
                  numberOfLines={1} ellipsizeMode='tail'
                    style={
                      ([style.bottomText],
                      {
                        lineHeight: 15,
                        fontSize: font11,
                        color: colorBlack,
                        fontFamily: 'Rubik-Regular',
                      })
                      
                    }>
                    {data?.model?.name && data?.model?.is_other_value
                      ? (data?.model?.other_value) 
                      : (data?.model?.name) }
                  </RN.Text>
                </RN.View>
                <RN.View style={{ flex: 1, paddingLeft: 30 }}>
                  <RN.Text style={style.topText}>Serial Number</RN.Text>
                  <RN.Text numberOfLines={1} ellipsizeMode='tail' style={style.bottomText}>
                    {data?.serial_number}
                  </RN.Text>
                </RN.View>
              </RN.View>
              <RN.View
                style={{
                  borderBottomColor: "#BCBCBC",
                  borderBottomWidth: 1,
                }}
              />
              <RN.View style={style.content}>
                <RN.View style={{ flex: 1 }}>
                  <RN.Text style={style.topText}>Date Of Purchase</RN.Text>
                  <RN.Text style={style.bottomText}>
                    {format(new Date(data?.purchase_date), 'dd/MM/yyyy')}
                  </RN.Text>
                </RN.View>
                <RN.View style={{ flex: 1, paddingLeft: 30 }}>
                  <RN.Text style={style.topText}>Price Bought</RN.Text>
                  <RN.Text numberOfLines={1} ellipsizeMode='tail' style={style.bottomText}>
                    {data?.price ? '\u20B9 ' + data?.price : ''}
                  </RN.Text>
                </RN.View>
              </RN.View>
              <RN.View
                style={{
                  borderBottomColor: "#BCBCBC",
                  borderBottomWidth: 1,
                }}
              />
              <RN.View style={style.content}>
                <RN.View style={{ flex: 1 }}>
                  <RN.Text style={style.topText}>Warenty Ending On</RN.Text>
                  <RN.Text numberOfLines={1} ellipsizeMode='tail' style={style.bottomText}>{''}</RN.Text>
                </RN.View>
                <RN.View style={{ flex: 1, paddingLeft: 30 }}>
                  <RN.Text style={style.topText}>Service Cost</RN.Text>
                  <RN.Text numberOfLines={1} ellipsizeMode='tail' style={style.bottomText}>
                    {latestServiceCost(data?.maintenance)}
                  </RN.Text>
                </RN.View>
              </RN.View>
              <RN.View
                style={{
                  borderBottomColor: "#BCBCBC",
                  borderBottomWidth: 1,
                }}
              />
              <RN.View style={style.content}>
                <RN.View style={{ flex: 1 }}>
                  <RN.Text style={style.topText}>Spare Cost</RN.Text>
                  <RN.Text numberOfLines={1} ellipsizeMode='tail' style={style.bottomText}>
                     {latestSpareCost(data?.maintenance)}
                  </RN.Text>
                </RN.View>
                <RN.View style={{ flex: 1, paddingLeft: 30 }}>
                  <RN.Text style={style.topText}>Location</RN.Text>
                  <RN.Text numberOfLines={1} ellipsizeMode='tail' style={style.bottomText}>{''}</RN.Text>
                </RN.View>
              </RN.View>
            </RN.View>
          </RN.View> 
        </RN.View>
      </ErrorBoundary>
      // </RN.View>
    );
  };
  // const LoadMoreRandomData = () => {
  //   setPageNumber(pagenumber + 1);
  //   setApplianceList(pagenumber + 1);
  // };
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

  const title =
    applianceList?.length > 0
      ? applianceList[currentID] &&
        applianceList[currentID].type &&
        applianceList[currentID].type.name &&
        applianceList[currentID].type.is_other_value == true
        ? applianceList[currentID].type.other_value
        : applianceList[currentID] &&
          applianceList[currentID].type &&
          applianceList[currentID].type.name
      : '';

  return (
    <ErrorBoundary>
      <RN.View style={style.container}>
        <HeaderwithArrow
          title={title}
          color={colorBlack}
          arrow_icon={back_icon}
          rightIcon={true}
          from="myAppliances"
        />
        <RN.ScrollView style={{paddingTop: 10}}>
        {applianceList && applianceList.length > 0 && (
          <SnapCarouselComponent
            sendSnapItem={(index_val) => onSnapItem(index_val)}
            carouselRef={carouselRef}
            carouselItems={applianceList}
            renderItem={({ item, index }) => list_applicances(item, index)}
            currentIndex={1}
          />
        )}
        {applianceList && applianceList.length > 0 && (
          <RN.View style={[style.reminderBtnView]}>
            <RN.TouchableOpacity
              style={style.reminderBtnn}
              onPress={() =>
                navigation.navigate(ApplianceMoreDetailsNav, {
                  appliance_id: applianceList[currentID]?._id,
                  appliance_data: applianceList[currentID],
                  defaultImage,
                })
              }>
              <RN.Text style={style.reminderText}>View More Details</RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
        )}
        </RN.ScrollView>
        {loading && (
          <RN.View>
          <Loader />
          </RN.View>
        )}
      </RN.View>
    </ErrorBoundary>
  );
}
