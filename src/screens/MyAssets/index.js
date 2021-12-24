import StatusBar from '@components/StatusBar';
import ThemedButton from '@components/ThemedButton';
import {
  colorAsh,
  colorBlack,
  colorLightBlue,
  colorWhite,
} from '@constants/Colors';
import {
  useNavigation,
  DrawerActions,
  useIsFocused
} from '@react-navigation/native';  
import Loader from '@components/Loader';
import React, { useEffect, useState,useContext } from 'react';
import { AuthContext } from '@navigation/AppNavigation';
import * as RN from 'react-native';
import APIKit from '@utils/APIKit';
import FilterButtons from '@components/FilterButtons';
import style from './styles';
import {PouchDBContext} from '@utils/PouchDB';
import { AddAssetNav, MyAppliancesNav } from '@navigation/NavigationConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constants } from '@utils/config';
import moment from 'moment';
import { defaultImage, no_image_icon, alertclock} from '@constants/Images';

const MyAssets = () => {
	const navigation = useNavigation();
  let {networkStatus } = useContext(AuthContext);
	const isFocused=useIsFocused();
  let {API} = useContext(PouchDBContext);
	const [pagenumber, setPageNumber] = useState(1);
	const [pageLimit, setPageLimit] = useState(10);
	const [errorMsg, setErrorMsg] = useState('');
	const [loading, setLoading] = useState(false);
	const [filterStateOption, setFilterStateOption] = useState([]);
	const [category_id, setCategoryid] = useState('');
	const [totalrecords, settotalrecords] = useState(0);
	const [updatedCount, setupdatedCount] = useState(0);
	const [fullLoder, setFullLoder] = useState(true);
  const [filter, setFilter] = useState(false);
  const [applianceAlert, setApplianceAlert] = useState([]);
  const [applianceDefImgeView, setApplianceDefImgeView] = useState(false);
  let apicalling=false;
	const navigateToAddAsset = () => {
		navigation.navigate(AddAssetNav);
	};
	const [applianceList, setApplianceList] = useState([]);
	useEffect(() => {
		navigation.addListener('focus', () => {
      const newapi_calling=apicalling;
      setPageNumber(1);
			listappliancecategory();
      // setCategoryid('');
			setFilter(true);
			if(pagenumber == 1){
				listAppliance(1, '',newapi_calling);
			}
      if(apicalling==false){
        apicalling=true
      }
			
			setApplianceList([]);
			setFullLoder(true);
		});
	},[pagenumber]);

  useEffect(()=>{
		// if(isFocused){
		console.log("network staus in document",networkStatus)
    const newapi_calling=apicalling;
    settotalrecords(0);
		listAppliance(1, '',newapi_calling);
    setApplianceAlert([]);
    getApplianceAlert();
    if(apicalling==false){
      apicalling=true
    }
		// }
		// if(networkStatus==true){
		// 	setFullLoder(false);
		// }
		
	  },[networkStatus,isFocused]);
  const applianceResultHandling =(records)=>{
    records.forEach((list) => {
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
        list.fileData = true;
        list.setImage = 'file://' + list.image[0].path;
      } else {
        list.fileData = false;
        list.defaultImage = defImg;
      }
      list.defaultImage = defImg;
    });
    return records;
  }


  const notifyMessage = (msg) => {
    if (RN.Platform.OS === 'android') {
      RN.ToastAndroid.show(msg, RN.ToastAndroid.SHORT);
    } else {
      RN.Alert.alert(msg);
    }
  };

      const getApplianceAlert = async () => {
      const getToken = await AsyncStorage.getItem('loginToken');
      let ApiInstance = await new APIKit().init(getToken);
      const asset_location_id = await AsyncStorage.getItem('locationData_ID');
      let getApplianceAlertresp = await ApiInstance.get(constants.listApplianceAlert + '?asset_location_id=' + asset_location_id);
      if (getApplianceAlertresp.status == 1) {
        setApplianceAlert(getApplianceAlertresp.data.data);
        try {
          let assetName = getApplianceAlertresp.data.data[0].type.name.replace(/ /g, '').toLowerCase();
          let brandName = 'Others';
          defaultImage.forEach((assetType) => {
            setApplianceDefImgeView(assetType[assetName][brandName].url);
          });
        } catch (e) {
          setApplianceDefImgeView(no_image_icon);
        }
      } else {
  
        notifyMessage(JSON.stringify(getApplianceAlertresp));
      }
    };

	const listAppliance = async (pagenumber, cate_id, filter,api_calling) => {
		setPageNumber(1);
		const getToken = await AsyncStorage.getItem('loginToken');
    let currentLocationId = await AsyncStorage.getItem('locationData_ID');
		let ApiInstance = await new APIKit().init(getToken);
		let awaitlocationresp = await ApiInstance.get(
			constants.listAppliance +
        '?page_no=' +
		pagenumber +
        '&page_limit=' +
        pageLimit +
        '&category_id=' +
        cate_id +
        '&asset_location_id=' +
        currentLocationId
    );
    if(awaitlocationresp.network_error){
      
      // console.log("offline results",API.)
      API.getApplicatnDocs((response)=>{
        // setApplianceList(response.)
        let newarray=[];
        
        if(response&&response.rows&&Array.isArray(response.rows)){
          settotalrecords(response?.rows.length);
          response.rows.map((obj)=>{
            newarray.push(obj.doc)
          })
          setApplianceList([...newarray].reverse());
        }
      })
      setFullLoder(false);
      return;
    }
		if (awaitlocationresp.status == 1) {
      setLoading(false);
			setFullLoder(false);
      let applicantResults=applianceResultHandling(awaitlocationresp.data.data);
			if(applicantResults&&applicantResults.length>0){
        let removeDouble_=JSON.stringify(applicantResults).replace(/("__v":0,)/g,"");
        // API.getApplicatnDocs();
        if(api_calling==false){
        API.resetApplicantDB((err,success)=>{
          if(success){
            console.log("dbdestroyed",success);
            console.log("removedData",removeDouble_);
            API.update_applicant_db(JSON.parse(removeDouble_));
          }else{
            console.log("error",err);
          }
        })
      }
        setApplianceList(awaitlocationresp.data.data);
        if (awaitlocationresp.data.data.length > 0) {
          setPageNumber(pagenumber);
          setFilter(false);
        }
        if (filter) {
          if (awaitlocationresp && awaitlocationresp.data.data.length == 0) {
            setErrorMsg('No data available');
          }
        }
        let clonedDocumentList = pagenumber == 1 ? [] : [...applianceList];
        setApplianceList(clonedDocumentList.concat(awaitlocationresp.data.data));
        settotalrecords(
          clonedDocumentList.concat(awaitlocationresp.data.data).length
        );
        setupdatedCount(awaitlocationresp.data.total_count);
      }

		
		} else {
			console.log('not listed location type');
			setFullLoder(false);
		}
	};
	const listappliancecategory = async () => {
		const getToken = await AsyncStorage.getItem('loginToken');
		let ApiInstance = await new APIKit().init(getToken);

		let awaitlocationresp = await ApiInstance.get(
			constants.listApplianceCategory
		);
		if (awaitlocationresp.status == 1) {
			let alloption = [
				{
					isSelected: true,
					name: 'All',
				},
			];
			let concatdata = [...alloption, ...awaitlocationresp.data.data];
			setFilterStateOption(concatdata);
		} else {
			console.log('not listed location type');
		}
	};
	const DrawerScreen = () => {
		return navigation.dispatch(DrawerActions.toggleDrawer());
	};
	const LoadMoreRandomData = () => {
		// setPageNumber(1);
		 if(filter == true){
			listAppliance(pagenumber, category_id);
		}
		else{ 
		  listAppliance(pagenumber+1, category_id);
		}
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
		setFullLoder(true);
		setApplianceList([]);
		setErrorMsg('');
		setCategoryid(data._id);
		let filterStateOption1 = [...filterStateOption];
		filterStateOption1.map((obj, index_item) => {
			let obj2 = obj;
			if (index_item != index) {
				obj2.isSelected = false;
			} 
			return obj2;
		});
		filterStateOption1[index].isSelected = true;
		 if (data.name == 'All') {
			setFilter(true);
			setCategoryid('');
			// setPageNumber(1);
			listAppliance(1, '');
		} else {
			// setPageNumber(1);
			setFilter(true);
			listAppliance(pagenumber, data._id, 'filter');
		}
		setFilterStateOption(filterStateOption1);
	};
  const onImageLoadingError = (event, index) => {
    event.preventDefault();
    let applianceListTemp = applianceList;
    applianceListTemp[index].fileData = false;
    setApplianceList([...applianceListTemp]);
  };

  const renderApplianceBrandTitle = (item) => {
    let typeCheck =
      item.brand.name && item.brand.is_other_value
      	? item.brand.other_value
      	: item.brand.name;
    typeCheck = typeCheck == undefined?  ' ' : typeCheck;
    if (typeCheck.length > 19) {
      return typeCheck.substring(0, 19) + '...';
    } else {
      return typeCheck;
    }
  };
  const navigatePage =(item,index)=>{
    // alert(category_id);
    setTimeout(()=>{

      navigation.navigate(MyAppliancesNav, {
        applianceList: item,
        currentIndex: index,
        catID:category_id
      });
    },200);
  }
  const renderApplianceTitle = (item) => {
    let typeCheck =
      item?.type?.name && item.type.is_other_value
      	? item.type.other_value
      	: item.type.name;
		  typeCheck = typeCheck == undefined?  ' ' : typeCheck;
    if (typeCheck.length > 19) {
      return typeCheck.substring(0, 19) + '...';
    } else {
      return typeCheck;
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <RN.View
        key={index}
        style={{
          marginHorizontal: 5,
          marginTop: 10,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 5,
          },
          shadowOpacity: 0.34,
          shadowRadius: 6.27,
        }}>
        <RN.TouchableOpacity
          style={{
            width: RN.Dimensions.get('window').width * 0.46,
            backgroundColor: colorWhite,
            borderRadius: 10,
          }}
          onPress={() => navigatePage(item,index)}>
          <RN.View
            style={{
              height: 120,
              width: 120,
              flex: 1,
              alignSelf: 'center',
              paddingVertical: 20,
            }}>
            <RN.Image
              source={{
                uri: item.fileData
                  ? item.setImage
                  : RN.Image.resolveAssetSource(item.defaultImage).uri,
              }}
              style={{
                height: '100%',
                width: '100%',
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                resizeMode: 'contain',
                marginTop: 10,
              }}
              onError={(e) => onImageLoadingError(e, index)}
            />
          </RN.View>
          <RN.Text
            style={{
              fontFamily: 'Rubik-Medium',
              paddingLeft: 10,
              marginTop: 20,
              color: colorBlack,
            }}>
            {renderApplianceTitle(item)}
          </RN.Text>
          <RN.Text
            style={{
              fontFamily: 'Rubik-Regular',
              paddingLeft: 10,
              marginTop: 5,
              color: colorAsh,
              fontSize: 12,
              marginBottom: 5,
            }}>
            {renderApplianceBrandTitle(item)}
          </RN.Text>
          <RN.View
            style={{
              borderBottomColor: colorAsh,
              borderBottomWidth: 0.5,
            }}
          />
          <RN.View style={{ flexDirection: 'row' }}>
            <RN.View style={{ flex: 1 }}>
              <RN.Image
                source={require('../../assets/images/home/expirycalender.png')}
                style={{
                  height: 17,
                  width: 15,
                  marginTop: 10,
                  marginBottom: 10,
                  marginLeft: 10,
                }}
              />
            </RN.View>
            <RN.View style={{ flex: 4 }}>
              <RN.Text
                style={{
                  color: '#8a520d',
                  fontFamily: 'Rubik-Regular',
                  marginTop: 10,
                  marginBottom: 10,
                }}>
                {moment(new Date(item.purchase_date)).format('DD/MM/YYYY')}
              </RN.Text>
            </RN.View>
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
    );
  };

  return (
    <RN.View style={{ backgroundColor: colorWhite, flex: 1, marginBottom: 50 }}>
      <RN.SafeAreaView style={{ backgroundColor: colorLightBlue }} />
      {fullLoder&& <Loader/>}
      <StatusBar />
      <RN.View style={style.navbar}>
        <RN.View style={style.navbarRow}>
          <RN.TouchableOpacity
            onPress={() => {
              DrawerScreen();
            }}>
            <RN.View style={{ flex: 1 }}>
              <RN.Image
                source={require('../../assets/images/home/menu.png')}
                style={style.notificationIcon}
              />
            </RN.View>
          </RN.TouchableOpacity>
          <RN.View style={{ flex: 1 }}>
            <RN.Text style={style.navbarName}>{'My Assets '}</RN.Text>
          </RN.View>
        </RN.View>
      </RN.View>
      {/* {applianceList&&applianceList.length>0&& */}
      {(category_id != '' ||
        (category_id == '' && applianceList && applianceList.length > 0)) && (
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
      )}
      <RN.View>
        <RN.Text style={{ textAlign: 'center' }}>{errorMsg}</RN.Text>
      </RN.View>
      {/* } */}
      <RN.ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1,marginLeft: 10}}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
            console.log('reached bottom');
            // enableSomeButton();
            if (!loading) {
              setLoading(true);
              setTimeout(() => {
                if (totalrecords != updatedCount) {
                  LoadMoreRandomData();
                } else {
                  setLoading(false);
                }
              }, 1000);
            }
          }
        }}
        scrollEventThrottle={400}>
          {applianceAlert.length > 0 &&
                <RN.TouchableOpacity onPress={() => { navigation.navigate('DocumentRemainder', {
                  from: 'myReminders',
                  document_ids: applianceAlert[0]._id,
                  reminder_data: 'editAssetReminder',
                  comments: applianceAlert[0].reminder.comments,
                  title: applianceAlert[0].reminder.title._id,
                  date: applianceAlert[0].reminder.date,
                  otherTitle: applianceAlert[0].reminder.title.other_value,
                });}} 
                 style={{ marginHorizontal: 10, marginBottom: 10, marginTop: 5, backgroundColor: '#EDF0F7', flexDirection: 'row', padding: 10, borderRadius: 10,}}>
                  <RN.View style={{ height: 100, width: 100, borderRadius: 10, alignSelf: 'center',paddingRight:10}}>
                    <RN.Image
                      source={applianceDefImgeView}
                      style={{ height: '100%', width: '100%', resizeMode: 'contain', borderRadius: 10 }} />
                  </RN.View>
                  <RN.View style={{alignSelf: 'center',flex:1}}>
                    <RN.View style={{flexDirection:'row',justifyContent:'space-between'}}>
                      <RN.View style={{paddingBottom:10,flex:1,paddingRight:10}}>
                      <RN.Text style={{ color: '#393939', fontFamily: 'Rubik-Medium', fontSize: 12}}>{applianceAlert[0]?.type.name == 'Others'? applianceAlert[0].type.other_value : applianceAlert[0]?.type.name}</RN.Text>
                      <RN.Text style={{ color: '#393939', fontFamily: 'Rubik-Regular', fontSize: 11, marginTop: 5}}>{applianceAlert[0]?.brand.name == 'Others'? applianceAlert[0].brand.other_value : applianceAlert[0]?.brand.name}</RN.Text>
                      </RN.View>
                      <RN.View style={{ height: 30, width: 30}}>
                        <RN.Image source={alertclock} style={{ height: '100%', width: '100%', resizeMode: 'cover' }} />
                      </RN.View>
                    </RN.View>
                    <RN.View style={{ backgroundColor: '#6BB3B3', padding: 10, borderRadius: 8,marginRight:15}}>
                      <RN.Text style={{ color: '#FFFFFF', fontFamily: 'Rubik-Medium', fontSize: 13, paddingBottom: 6 }}>Alert:</RN.Text>
                      <RN.Text style={{ color: '#FFFFFF', fontFamily: 'Rubik-Regular', fontSize: 12, }}>{applianceAlert[0].reminder.title.name == 'Others'
                        ? applianceAlert[0].reminder.title.other_value + ` on ${moment(new Date(applianceAlert[0]?.reminder.date)).format('DD/MM/YYYY')}`
                        : applianceAlert[0].reminder.title.name + ` on ${moment(new Date(applianceAlert[0]?.reminder.date)).format('DD/MM/YYYY')}`}</RN.Text>
                    </RN.View>
                  </RN.View>
                </RN.TouchableOpacity>
              }
        {totalrecords > 0 ? (
          <RN.FlatList
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
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <RN.View style={{height:120,width:120}}>
            <RN.Image
              source={require('../../assets/images/emptyStates/addasset.png')}
              style={{height:'100%', width:'100%', resizeMode:'contain'}}
            />
            </RN.View>
            <RN.Text style={style.text}>
              {'Manage your Assets like an Expert'}
            </RN.Text>
            <RN.TouchableOpacity onPress={() => navigateToAddAsset()}>
              <ThemedButton
                title="+ Add Asset"
                mode="outline"
                color={colorLightBlue}
                buttonStyle={{ marginTop: 20 }}
                btnStyle={{ fontFamily: 'Rubik-Medium' }}></ThemedButton>
            </RN.TouchableOpacity>
          </RN.View>
        )}
      </RN.ScrollView>
      {loading && <RN.ActivityIndicator size="large" color={colorLightBlue} />}
    </RN.View>
  );
};

export default MyAssets;