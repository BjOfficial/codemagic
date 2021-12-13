import React, { useContext, useEffect, useState } from 'react';
import * as RN from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import style from './style';
import moment from 'moment';
import {
  colorAsh,
  colorBlack,
  colorLightBlue,
  colorWhite,
  colorDropText,
} from '@constants/Colors';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import { AuthContext } from '@navigation/AppNavigation';
import {
  AddAssetNav,
  DocumentViewNav,
  MyAppliancesNav,
  invitefriendsNav,
  ComingSoonNav,
  CalendarNav,
} from '@navigation/NavigationConstant';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import CarouselData from '@constants/CarouselData';
import { AddDocumentNav } from '@navigation/NavigationConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constants } from '@utils/config';
import APIKit from '@utils/APIKit';
import {PouchDBContext} from '@utils/PouchDB';
import {
  documentDefaultImages,
  no_image_icon,
  noDocument,
  my_reminder,
  defaultImage,
  home_icon,
  delegate_cs,
} from '@constants/Images';
import { font12 } from '@constants/Fonts';
import { storagePermission } from '@services/AppPermissions';
import Loader from '@components/Loader';
import StatusBar from '@components/StatusBar';
import { useDrawerStatus } from '@react-navigation/drawer';
export const SLIDER_HEIGHT = RN.Dimensions.get('window').height + 70;
export const SLIDER_WIDTH = RN.Dimensions.get('window').width + 70;
export const ITEM_WIDTH = Math.round(SLIDER_WIDTH * 1);
export const ITEM_HEIGHT = Math.round(SLIDER_HEIGHT * 1);

const Dashboard = (props) => {
  const navigation = useNavigation();
  let { userDetails,networkStatus } = useContext(AuthContext);
  let {API} = useContext(PouchDBContext);
  const date = moment(new Date()).format('LL');
  const [applianceList, setApplianceList] = useState([]);
  const [category_id, setcategoryID] = useState('');
  const [documentList, setDocumentList] = useState([]);
  const [pagenumber] = useState(1);
  const [pageLimit] = useState(10);
  const isCarousel = React.useRef(null);
  const [index, setIndex] = React.useState(0);
  const [totalcountAppliance, setTotalCountAppliance] = React.useState(null);
  const [totalcountdocuments, setTotalCountDoucment] = React.useState(null);
  const [loading, setLoading] = React.useState({
    appliance: true,
  });
  const isDrawerOpen = useDrawerStatus() === 'open';
  const delegate_data = [
    '●   Azzetta is designed for the entire family to update, maintain and plan for regular service',
    '●   Until this is enabled you can share your login credentials with your family members',
    '●   We plan to bring in Azzetta for small businesses later for multi locations',
    '●   Do share your feedback on this proposed feature at helpdesk@azzetta.com',
  ];
  const navigateToAddDocument = () => {
    navigation.navigate(AddDocumentNav);
  };
  const onImageLoadingError = (event, index) => {
    event.preventDefault();
    let applianceListTemp = applianceList;
    applianceListTemp[index].fileData = false;
    setApplianceList([...applianceListTemp]);
  };

  const onDocumentImageLoadingError = (event, index) => {
    event.preventDefault();
    let documentListTemp = documentList;
    documentListTemp[index].fileDataDoc = false;
    setDocumentList([...documentListTemp]);
  };

  useEffect(() => {
    navigation.addListener('focus', () => {
      if (props.from == 'Remainders') {
        notifyMessage('My Reminders Screen under Development');
      }
      listDocument();
      listAppliance();
    });

  }, []);

  useEffect(() => {
    storagePermission();
  }, []);

  useEffect(() => {
    if (!isDrawerOpen) {
      setLoading({ appliance: false });
      const newapi_calling=apicalling;
      listDocument(newapi_calling);
      listAppliance(newapi_calling);
      if(apicalling==false){
        apicalling=true
      }
    }
  }, [isDrawerOpen]);

  const requestPermission = async () => {
    try {
      requestMultiple([
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.PHOTO_LIBRARY,
        PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY,
      ]).then((statuses) => {
        console.log('Camera', statuses[PERMISSIONS.IOS.CAMERA]);
        console.log('FaceID', statuses[PERMISSIONS.IOS.MEDIA_LIBRARY]);
        console.log('PHOTO_LIBRARY', statuses[PERMISSIONS.IOS.PHOTO_LIBRARY]);
        console.log(
          'PHOTO_LIBRARY_ADD_ONLY',
          statuses[PERMISSIONS.IOS.PHOTO_LIBRARY_ADD_ONLY]
        );
      });
      const grantedWriteStorage = await RN.PermissionsAndroid.request(
        RN.PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: 'Permission',
          message:
            'App needs access storage permission' +
            'so you can view upload images.',
          // buttonNeutral: "Ask Me Later",
          //  buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      const grantedReadStorage = await RN.PermissionsAndroid.request(
        RN.PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
      );
      if (
        grantedWriteStorage &&
        grantedReadStorage === RN.PermissionsAndroid.RESULTS.GRANTED
      ) {
        console.log('Permission Granted');
      }
      if (
        grantedWriteStorage &&
        grantedReadStorage === RN.PermissionsAndroid.RESULTS.DENIED
      ) {
        // RN.Alert.alert(
        //   "Please allow Camera and Storage permissions in application settings to upload an image"
        // );
        console.log('denied');
      } else {
        console.log('error');
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const applicantResultHandling =(records)=>{
   records.forEach((list, index) => {
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
  const listAppliance = async (api_calling) => {
    console.log("list appliance calling");
    const getToken = await AsyncStorage.getItem('loginToken');
    let currentLocationId = await AsyncStorage.getItem('locationData_ID');
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.listAppliance +
        '?page_no=' +
        pagenumber +
        '&page_limit=' +
        pageLimit +
        '&asset_location_id=' +
        currentLocationId
    );
    if(awaitlocationresp==undefined){
      awaitlocationresp = {}
    }
    if(awaitlocationresp.network_error){
      
      // console.log("offline results",API.)
      API.getApplicatnDocs((response)=>{
        // setApplianceList(response.)
        let newarray=[];
        if(response&&response.rows&&Array.isArray(response.rows)){
          
          setTotalCountAppliance(response?.rows.length);
          response.rows.map((obj)=>{
            newarray.push(obj.doc)
          })
          setApplianceList([...newarray].reverse());
        }
      })
      setLoading({ appliance: false });
      return;
    }

    if (awaitlocationresp.status == 1) {
      let applicantResults=applicantResultHandling(awaitlocationresp.data.data);
      
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
  }
    
      
      setTotalCountAppliance(awaitlocationresp.data.total_count);
      setApplianceList(awaitlocationresp.data.data);
      setLoading({ appliance: false });
    } else {
      console.log(awaitlocationresp);
      setLoading({ appliance: false });
    }
      setLoading({ appliance: false });
  };
  const notifyMessage = (msg) => {
    if (RN.Platform.OS === 'android') {
      RN.ToastAndroid.show(msg, RN.ToastAndroid.SHORT);
    } else {
      RN.Alert.alert(msg);
    }
  };
  const documentResultHandling =(records)=>{
    records.forEach((list) => {
      var defImg;
      try {
        let documentName = list.document_type.name.replace(/ /g, '').toLowerCase();
        let categoryName = 'Others';
        documentDefaultImages.forEach((documentType) => {
          defImg = documentType[documentName][categoryName].url;
        });
      }  catch (e) {
        defImg = noDocument;
      }
      if (list.image.length > 0) {
        // if (checkImageURL(list.image[0].path,index)) {
        list.fileDataDoc = true;
        list.setImage = 'file://' + list.image[0].path;
        // }
      } else {
        list.fileDataDoc = false;
        list.defaultImage = defImg;
      }
      list.defaultImage = defImg;
    });
    return records;
  }
  const listDocument = async (api_calling) => {
    const getToken = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.listDocument +
        '?page_no=' +
        pagenumber +
        '&page_limit=' +
        pageLimit
    );
    if(awaitlocationresp==undefined){
      awaitlocationresp = {}
    }
    console.log("awaitlocationresp offline document",awaitlocationresp);
    if(awaitlocationresp.network_error){
      
      API.get_document_collections((response)=>{
        console.log("document response",response);
        // setApplianceList(response.)
        let newarray=[];
        if(response&&response.rows&&Array.isArray(response.rows)){
          
          setTotalCountDoucment(response?.rows.length);
          response.rows.map((obj)=>{
            newarray.push(obj.doc)
          })
          setDocumentList([...newarray].reverse());
        }
      })
      return;
    }
    if (awaitlocationresp.status == 1) {
      let documentResults=documentResultHandling(awaitlocationresp.data.data);
      if(documentResults&&documentResults.length>0){
        let removeDouble_=JSON.stringify(documentResults).replace(/("__v":0,)/g,"");
        // API.getApplicatnDocs();
        console.log("documentResults",documentResults);
        if(api_calling==false){
        API.resetDocumentDB((err,success)=>{
          if(success){
            // console.log("dbdestroyed",success);
            // console.log("removedData",removeDouble_);
            API.update_document_db(JSON.parse(removeDouble_));
          }else{
            console.log("error",err);
          }
        })
      }
    }
    

      setTotalCountDoucment(awaitlocationresp.data.total_count);
      setDocumentList(awaitlocationresp.data.data);
    } else {
      console.log('asset list not loadeds');
    }
  };
  useEffect(() => {
    navigation.addListener('focus', () => {
    
      if (props.from == 'Remainders') {
        notifyMessage('My Reminders Screen under Development');
      }
      const newapi_calling=apicalling
      listDocument(newapi_calling);
      listAppliance(newapi_calling);
      setLoading({ appliance: true });
      if(apicalling==false){
        apicalling=true
      }
    });
  }, []);
  useEffect(()=>{
    console.log("network status",networkStatus);
    const newapi_calling=apicalling;
    listAppliance(newapi_calling);
    listDocument(newapi_calling);
    if(apicalling==false){
      apicalling=true
    }
    if(networkStatus==false){
      setLoading({ appliance: false });
    }
  },[networkStatus]);
  const renderApplianceBrandTitle = (item) => {
    let typeCheck =
      item.brand.name && item.brand.is_other_value
        ? item.brand.other_value
        : item.brand.name;
    typeCheck = typeCheck == undefined ? ' ' : typeCheck;

    if (typeCheck.length > 19) {
      return typeCheck.substring(0, 19) + '...';
    } else {
      return typeCheck;
    }
  };

  const renderApplianceTitle = (item) => {
    let typeCheck =
      item?.type?.name && item.type.is_other_value
        ? item.type.other_value
        : item.type.name;
    typeCheck = typeCheck == undefined ? ' ' : typeCheck;
    if (typeCheck.length > 19) {
      return typeCheck.substring(0, 19) + '...';
    } else {
      return typeCheck;
    }
  };
  const renderItem = ({ item, index }) => {
    return (
      <RN.View key={index} style={{ flex: 1, margin: 5 }}>
        <RN.TouchableOpacity
          style={{
            width: RN.Dimensions.get('window').width * 0.45,
            backgroundColor: colorWhite,
            borderRadius: 10,
            elevation: 6,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
          }}
          onPress={() =>
            navigation.navigate(MyAppliancesNav, {
              applianceList: item,
              currentIndex: index,
              catID:''
            })
          }>
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
                uri: RN.Image.resolveAssetSource(item.defaultImage).uri,
              }}
              style={{
                height: '100%',
                width: '100%',
                borderTopRightRadius: 10,
                borderTopLeftRadius: 10,
                resizeMode: 'contain',
              }}
              onError={(e) => onImageLoadingError(e, index)}
            />
          </RN.View>
          <RN.Text
            numberOfLines={1}
            style={{
              fontFamily: 'Rubik-Medium',
              paddingLeft: 10,
              color: colorBlack,
              fontSize: 12,
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
          <RN.View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              alignSelf: 'center',
            }}>
            <RN.View style={{ flex: 1 }}>
              <RN.Image
                source={require('../../assets/images/home/expirycalender.png')}
                style={{
                  height: 17,
                  width: 15,
                  marginTop: 15,
                  marginLeft: 10,
                  marginBottom: 10,
                }}
              />
            </RN.View>
            <RN.View style={{ flex: 4, marginTop: 5 }}>
              <RN.Text
                style={{
                  color: '#72351C',
                  fontFamily: 'Rubik-medium',
                  marginTop: 10,
                  marginBottom: 10,
                  fontSize: font12,
                }}>
                {moment(new Date(item.purchase_date)).format('DD/MM/YYYY')}
              </RN.Text>
            </RN.View>
          </RN.View>
        </RN.TouchableOpacity>
      </RN.View>
    );
  };
  const renderdocumentsItem = ({ item, index }) => {
    return (
      <RN.TouchableOpacity
        onPress={() =>
          navigation.navigate(DocumentViewNav, {
            document_id: item,
          })
        }>
        <RN.View
          style={{
            elevation: 6,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 5,
            },
            shadowOpacity: 0.34,
            shadowRadius: 6.27,
            borderRadius: 10,
            backgroundColor: colorWhite,
            height: 60,
            width: 60,
          }}>
          <RN.Image
            source={{
              uri: item.fileDataDoc
                ? item.setImage
                : RN.Image.resolveAssetSource(item.defaultImage).uri,
            }}
            onError={(e) => {
              onDocumentImageLoadingError(e, index);
            }}
            style={{
							height: '100%',
							width: '100%',
							borderRadius: 10,
							resizeMode: item.fileDataDoc?'cover':'contain',
						}}
          />
        </RN.View>
        <RN.View
          style={{
            width: 70,
            // marginHorizontal: 15,
            marginTop: 5,
          }}>
          <RN.Text
            style={{
              width: '100%',
              fontFamily: 'Rubik-Medium',
              textAlign: 'center',
              color: colorDropText,
              fontSize: 12,
              marginVertical: 5,
            }}
            numberOfLines={2}>
            {item.document_type.name && item.document_type.is_other_value
              ? item.document_type.other_value
              : item.document_type.name}
          </RN.Text>
        </RN.View>
      </RN.TouchableOpacity>
    );
  };

  const DrawerScreen = () => {
    return navigation.dispatch(DrawerActions.toggleDrawer());
  };

  const carouselCard = ({ item, index }) => {
    return (
      <RN.View key={index}>
        <RN.ImageBackground
          source={item.img}
          style={style.doYouKnowCardBackground}>
          <RN.View style={style.doYouKnowCardRow}>
            <RN.View style={{ flex: 1 }}>
              <RN.Text style={style.doYouKnowCardTitle}>{item.title}</RN.Text>
              <RN.Text style={style.doYouKnowcardText}>{item.body}</RN.Text>
              <RN.TouchableOpacity
                style={style.doYouKnowCardButton}
                onPress={() => {
                  navigation.navigate(ComingSoonNav, {
                    content: item.content,
                    icon: item.icon,
                    title: item.title,
                  });
                }}>
                <RN.Text
                  style={[
                    style.doYouKnowCardButtonTitle,
                    { color: item.color },
                  ]}>
                  {item.explore}
                </RN.Text>
              </RN.TouchableOpacity>
            </RN.View>
            <RN.View style={{ flex: 1 }}></RN.View>
          </RN.View>
        </RN.ImageBackground>
      </RN.View>
    );
  };

  return (
    <RN.View style={{ flex: 1, backgroundColor: colorWhite }}>
      <RN.SafeAreaView style={{ backgroundColor: colorLightBlue }} />
      <StatusBar />
      {(loading.appliance) && <Loader />}
      <RN.View style={style.navbar}>
        <RN.View style={style.navbarRow}>
          <RN.View
            style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            <RN.TouchableOpacity
              onPress={() => {
                DrawerScreen();
              }}>
              <RN.View style={{ flex: 1 }}>
                <RN.Image source={home_icon} style={style.notificationIcon} />
              </RN.View>
            </RN.TouchableOpacity>
            <RN.View style={{ flex: 0 }}>
              <RN.TouchableOpacity
                onPress={() => navigation.navigate(CalendarNav)}>
                <AntDesign name="calendar" color="#FFFFFF" size={22} />
              </RN.TouchableOpacity>
            </RN.View>
          </RN.View>
          <RN.View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 10,
            }}>
            <RN.View
              style={{
                flexDirection: 'row',
              }}>
              <RN.View style={{ paddingRight: 5 }}>
                <RN.Text style={style.namaste}>Namaste</RN.Text>
                <RN.Text style={style.navbarCalendar}>{date}</RN.Text>
              </RN.View>
              <RN.Text style={style.navbarName} numberOfLines={1}>
                {`${
                  userDetails && userDetails.length > 10
                    ? userDetails.substring(0, 10) + '... '
                    : userDetails + ' '
                }`}
              </RN.Text>
              <RN.Image
                source={require('../../assets/images/home/namaste.png')}
                style={style.namasteIcon}
                resizeMode="contain"
              />
            </RN.View>
            <RN.TouchableOpacity
              onPress={() =>
                navigation.navigate(ComingSoonNav, {
                  title: 'Delegate',
                  content: delegate_data,
                  icon: delegate_cs,
                })
              }>
              <RN.Image
                source={require('../../assets/images/home/switchaccount.png')}
                style={style.location}
                resizeMode="contain"
              />
            </RN.TouchableOpacity>
          </RN.View>
        </RN.View>
      </RN.View>
      <RN.ScrollView showsVerticalScrollIndicator={false}>
        <RN.View>
          {applianceList.length > 0 ? (
            <RN.View>
              <RN.View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 20,
                }}>
                <RN.View>
                  <RN.Text style={style.title}>{'My Appliances'}</RN.Text>
                </RN.View>
                <RN.View>
                  <RN.TouchableOpacity
                    onPress={() => navigation.navigate(AddAssetNav)}
                    style={style.addBtn}>
                    <RN.Text style={style.addNewBtn}>{'Add new + '}</RN.Text>
                  </RN.TouchableOpacity>
                </RN.View>
                <RN.View
                  style={{
                    flex: 0.88,
                    alignItems: 'flex-end',
                  }}>
                  <RN.TouchableOpacity
                    onPress={() => navigation.navigate('MyAssets')}>
                    <RN.Text style={style.viewallText}>
                      view all ({totalcountAppliance && totalcountAppliance})
                    </RN.Text>
                  </RN.TouchableOpacity>
                </RN.View>
              </RN.View>

              <RN.FlatList
                contentContainerStyle={{ paddingHorizontal: 20}}
                horizontal={true}
                data={applianceList}
                renderItem={renderItem}
                keyExtractor={(item, index) => {
                  return item.id;
                }}
                showsHorizontalScrollIndicator={false}
                initialNumToRender={5}
              />
            </RN.View>
          ) : (
            <RN.View>
              <RN.Text style={style.title}>{'My Assets'}</RN.Text>

              <RN.TouchableOpacity
                onPress={() => navigation.navigate(AddAssetNav)}>
                <RN.View style={style.card}>
                  <RN.ImageBackground
                    source={require('../../assets/images/emptyStates/emptybg.png')}
                    style={style.cardBackgroundImage}
                    imageStyle={{ borderRadius: 20 }}>
                    <AntDesign
                      name="pluscircle"
                      color={colorLightBlue}
                      size={30}
                      style={style.plusCircleIcon}
                    />
                    <RN.Text style={style.cardTitle}>{'Add Assets'}</RN.Text>
                    <RN.Text style={style.cardText}>
                      {'Manage your assests like an expert'}
                    </RN.Text>
                  </RN.ImageBackground>
                </RN.View>
              </RN.TouchableOpacity>
            </RN.View>
          )}
          <RN.View>
            {documentList.length > 0 ? (
              <RN.View>
                <RN.View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <RN.View>
                    <RN.Text style={style.title}>{'My Documents'}</RN.Text>
                  </RN.View>
                  <RN.View>
                    <RN.TouchableOpacity
                      onPress={() => navigateToAddDocument()}
                      style={style.addBtn}>
                      <RN.Text style={style.addNewBtn}>{'Add new + '}</RN.Text>
                    </RN.TouchableOpacity>
                  </RN.View>
                  <RN.View
                    style={{
                      flex: 0.88,
                      alignItems: 'flex-end',
                    }}>
                    <RN.TouchableOpacity
                      onPress={() => navigation.navigate('Documents')}>
                      <RN.Text style={style.viewallText}>
                        view all ({totalcountdocuments && totalcountdocuments})
                      </RN.Text>
                    </RN.TouchableOpacity>
                  </RN.View>
                </RN.View>
                  <RN.FlatList
                    horizontal={true}
                    contentContainerStyle={{ paddingHorizontal: 20}}
                    data={documentList}
                    renderItem={renderdocumentsItem}
                    showsHorizontalScrollIndicator={false}
                    initialNumToRender={4}
                  />
              </RN.View>
            ) : (
              <RN.View>
                <RN.Text style={style.title}>{'My Documents'}</RN.Text>

                <RN.TouchableOpacity onPress={() => navigateToAddDocument()}>
                  <RN.View style={style.card}>
                    <RN.ImageBackground
                      source={require('../../assets/images/emptyStates/emptybg.png')}
                      style={style.cardBackgroundImage}
                      imageStyle={{ borderRadius: 20 }}>
                      <AntDesign
                        name="pluscircle"
                        color={colorLightBlue}
                        size={30}
                        style={style.plusCircleIcon}
                      />
                      <RN.Text style={style.cardTitle}>
                        {'Add Document'}
                      </RN.Text>
                      <RN.Text style={style.cardText}>
                        {'Be on Top of all renewals of documents'}
                      </RN.Text>
                      <RN.Text style={style.cardText}>{'and payments'}</RN.Text>
                    </RN.ImageBackground>
                  </RN.View>
                </RN.TouchableOpacity>
              </RN.View>
            )}
            <RN.TouchableOpacity
              style={style.inviteCard}
              onPress={() => navigation.navigate(invitefriendsNav)}>
              <RN.View style={style.inviteCardRow}>
                <RN.View style={{ flex: 0.4 }}>
                  <RN.Image
                    source={require('../../assets/images/home/inviteimg.png')}
                    style={style.inviteCardImage}
                    resizeMode="contain"
                  />
                </RN.View>
                <RN.View style={{ flex: 0.6, flexDirection: 'column' }}>
                  <RN.Text style={style.inviteCardTitle}>
                    {'Invite your friends to Azzetta'}
                  </RN.Text>
                  <RN.Text style={style.inviteCardText}>
                    {'Invite contacts to download and use Azzetta App.'}
                  </RN.Text>
                  <RN.TouchableOpacity
                    style={style.inviteCardButton}
                    onPress={() => navigation.navigate(invitefriendsNav)}>
                    <RN.Text style={style.inviteCardButtonText}>
                      {'Invite Now'}
                    </RN.Text>
                  </RN.TouchableOpacity>
                </RN.View>
              </RN.View>
            </RN.TouchableOpacity>
          </RN.View>
        </RN.View>
        <RN.View>
          <RN.ImageBackground
            source={require('@assets/images/home/replace.png')}
            style={style.doYouKnowCardBackgroundRed}>
            <RN.View style={style.doYouKnowCardRow}>
              <RN.View style={{ flex: 1.7 }}>
                <RN.Text style={style.doYouKnowCardTitle}>
                  Looking to replace or upgrade any appliance?
                </RN.Text>
                <RN.Text style={style.doYouKnowcardText}>
                  Exchange your old appliance with new one!
                </RN.Text>
                <RN.TouchableOpacity
                  style={style.doYouKnowCardButtonRed}
                  onPress={() => {
                    navigation.navigate(ComingSoonNav, {
                      title: 'Looking to replace or upgrade any appliance',
                      icon: my_reminder,
                      content: [
                        'Looking to replace or upgrade any appliance? Exchange your old appliance with new one!',
                      ],
                    });
                  }}>
                  <RN.Text style={style.doYouKnowCardButtonTitleRed}>
                    {'Choose Now'}
                  </RN.Text>
                </RN.TouchableOpacity>
              </RN.View>
              <RN.View style={{ flex: 1 }}></RN.View>
            </RN.View>
          </RN.ImageBackground>
        </RN.View>
        <RN.View>
          <RN.Text style={style.doYouKnow}>{'Do you know?'}</RN.Text>
          <RN.View
            style={{
              flex: 1,
              flexDirection: 'row',
              marginBottom: RN.Platform.OS === 'ios' ? 40 : 20,
            }}>
            <RN.View style={{ flex: 1 }}>
              <Carousel
                data={CarouselData}
                ref={isCarousel}
                renderItem={carouselCard}
                sliderWidth={SLIDER_WIDTH}
                sliderHeight={SLIDER_HEIGHT}
                itemWidth={ITEM_WIDTH}
                itemHeight={ITEM_HEIGHT}
                useScrollView={true}
                layoutCardOffset={9}
                inactiveSlideShift={0}
                onSnapToItem={(index) => setIndex(index)}
              />
            </RN.View>
            <RN.View
              style={{
                flex: 1,
                marginTop: RN.Dimensions.get('screen').height * 0.15,
                alignSelf: 'center',
              }}>
              <Pagination
                dotsLength={CarouselData.length}
                activeDotIndex={index}
                carouselRef={isCarousel}
                dotStyle={{
                  width: 15,
                  height: 4,
                  borderRadius: 2,
                  marginHorizontal: -10,
                  backgroundColor: colorWhite,
                }}
                inactiveDotOpacity={0.5}
                inactiveDotScale={0.4}
                tappableDots={true}
              />
            </RN.View>
          </RN.View>
        </RN.View>
      </RN.ScrollView>
    </RN.View>
  );
};

export default Dashboard;
