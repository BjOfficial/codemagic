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
import { defaultImage, no_image_icon } from '@constants/Images';

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
  let apicalling=false;
	const navigateToAddAsset = () => {
		navigation.navigate(AddAssetNav);
	};
	const [applianceList, setApplianceList] = useState([]);
	useEffect(() => {
		navigation.addListener('focus', () => {
      const newapi_calling=apicalling
      setPageNumber(1)
			listappliancecategory();
			setFilter(true)
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
		listAppliance(1, '',newapi_calling);
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
// console.log("appliance list======",applianceList);
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
    navigation.navigate(MyAppliancesNav, {
      applianceList: item,
      currentIndex: index,
      catID:category_id
    })
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
          margin: 5,
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
            elevation: 5,
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
        contentContainerStyle={{ flexGrow: 1 }}
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
        {totalrecords > 0 ? (
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
                justifyContent: 'center',
                alignItems: 'center',
              },
            ]}>
            <RN.Image
              source={require('../../assets/images/emptyStates/addasset.png')}
              style={style.image}
            />
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