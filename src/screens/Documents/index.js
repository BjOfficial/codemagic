import StatusBar from '@components/StatusBar';
import ThemedButton from '@components/ThemedButton';
import { colorLightBlue, colorWhite } from '@constants/Colors';
import {
	useNavigation,
	DrawerActions,
	useScrollToTop,
	useIsFocused
} from '@react-navigation/native';
import React, { useState, useEffect,useContext } from 'react';
import * as RN from 'react-native';
import { AuthContext } from '@navigation/AppNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIKit from '@utils/APIKit';
import {PouchDBContext} from '@utils/PouchDB';
import style from './styles';
import {
  AddDocumentNav,
  DocumentViewNav,
} from '@navigation/NavigationConstant';
import moment from 'moment';
import { constants } from '@utils/config';
import { documentDefaultImages, noDocument, alertclock, defImgeView } from '@constants/Images';
import Loader from '@components/Loader';
import PdfThumbnail from 'react-native-pdf-thumbnail';

const Documents = () => {
	const navigation = useNavigation();
	let {networkStatus } = useContext(AuthContext);
	const isFocused=useIsFocused();
  let {API} = useContext(PouchDBContext);
	const [documentList, setDocumentList] = useState([]);
	const [pagenumber, setPageNumber] = useState(1);
	const [pageLimit] = useState(18);
	const [loading, setLoading] = useState(false);
	const [totalrecords, settotalrecords] = useState(0);
	const [updatedCount, setupdatedCount] = useState(0);
	const ref = React.useRef(null);
	const [fullLoder, setFullLoder] = useState(true);
	const [pdfDocumentView, setPdfDocumentView] = useState(false);
	const [defImgeView, setDefImgeView] = useState();
	const [documentAlert, setDocumentAlert] = useState([]);
	const [documentDefaultImageView, setDocumentDefImgeView] = useState(false);
	useScrollToTop(ref);

	useEffect(() => {
		navigation.addListener('focus', () => {
			setFullLoder(true);
			// setDocumentList([]);
			setPageNumber(1);
			settotalrecords(0);
			setupdatedCount(0);
			listDocument(1);
			setDocumentAlert([]);
			getDocumentAlert();
		});
	}, []);
	useEffect(()=>{
		if(isFocused){
		listDocument(1);
		setDocumentAlert([]);
		getDocumentAlert();
		}
		// if(networkStatus==true){
		// 	setFullLoder(false);
		// }
		
	  },[networkStatus,isFocused]);
  const onDocumentImageLoadingError = (event, index) => {
    event.preventDefault();
    let documentListTemp = documentList;
    documentListTemp[index].fileDataDoc = false;
    setDocumentList([...documentListTemp]);
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
		} catch (e) {
			defImg = noDocument;
		}
		if (list.image.length > 0) {
			list.fileDataDoc = true;
			list.setImage = 'file://' + list.image[0].path;
		} else {
			list.fileDataDoc = false;
			list.defaultImage = defImg;
		}
		list.defaultImage = defImg;
	});
	return records;
  }

  const getDocumentAlert = async () => {
    const getToken = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(getToken);
    let getDocumentAlertresp = await ApiInstance.get(constants.listDocumentAlert);
    if (getDocumentAlertresp.status == 1) {
      setDocumentAlert(getDocumentAlertresp.data.data);
      try {
        let documentName = getDocumentAlertresp.data.data[0].document_type.name.replace(/ /g, '').toLowerCase();
        let categoryName = 'Others';
        documentDefaultImages.forEach((documentType) => {
          setDefImgeView(documentType[documentName][categoryName].url);
        });
      } catch (e) {
        setDefImgeView(noDocument);
      }
    } else {
      notifyMessage(JSON.stringify(getDocumentAlertresp));
    }
  };

	const listDocument = async (data) => {
		const getToken = await AsyncStorage.getItem('loginToken');
		let ApiInstance = await new APIKit().init(getToken);
		let awaitlocationresp = await ApiInstance.get(
			constants.listDocument + '?page_no=' + data + '&page_limit=' + pageLimit
		);
		if(awaitlocationresp==undefined){
			awaitlocationresp = {}
		  }
		if(awaitlocationresp.network_error){
			//   console.log
					API.get_document_collections((response)=>{
					  console.log("document response",response);
					  // setApplianceList(response.)
					  let newarray=[];
					  if(response&&response.rows&&Array.isArray(response.rows)){
						  
						  settotalrecords(response?.rows.length);
						  
						  response.rows.map((obj)=>{
							  newarray.push(obj.doc)
							})
							console.log("document response1",newarray);
						setDocumentList([...newarray].reverse());
					  }
					})
					setFullLoder(false);
					return;
				  }
		if (awaitlocationresp.status == 1) {
			setLoading(false);
			setFullLoder(false);
			let documentResults=documentResultHandling(awaitlocationresp.data.data);
			if(documentResults&&documentResults.length>0){
				let removeDouble_=JSON.stringify(documentResults).replace(/("__v":0,)/g,"");
				// API.getApplicatnDocs();
				console.log("documentResults",documentResults);
				// API.resetDocumentDB((err,success)=>{
				//   if(success){
				// 	// console.log("dbdestroyed",success);
				// 	// console.log("removedData",removeDouble_);
				// 	API.update_document_db(JSON.parse(removeDouble_));
				//   }else{
				// 	console.log("error123",err);
				//   }
				// })
				let clonedDocumentList = data == 1 ? [] : [...documentList];
			setDocumentList(clonedDocumentList.concat(awaitlocationresp.data.data));
			settotalrecords(
				clonedDocumentList.concat(awaitlocationresp.data.data).length
			);
			setupdatedCount(awaitlocationresp.data.total_count);
			  }
			
		} else {
			setFullLoder(false);
		}
	};
	const renderItem = ({ item, index }) => {
		
		return (
			<RN.TouchableOpacity
				onPress={() =>
					navigation.navigate(DocumentViewNav, { document_id: item })
				}>
				<RN.View
					style={{
						marginHorizontal: 10,
						marginVertical:15,
						elevation: 12,
						shadowColor: '#000',
						shadowOffset: {
							width: 0,
							height: 5,
						},
						shadowOpacity: 0.34,
						shadowRadius: 6.27,
						borderRadius: 10,
						backgroundColor: colorWhite,
						height: 90,
						weight: 90,
						
						// height: RN.Dimensions.get('screen').height / 8,
						// width: RN.Dimensions.get('screen').width / 4,
					}}>
					<RN.Image
						source={{
							uri: item.fileDataDoc
								? item.setImage
								: RN.Image.resolveAssetSource(item.defaultImage).uri,
						}}
						onError={(e) => onDocumentImageLoadingError(e, index)}
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
						width: RN.Dimensions.get('screen').width / 4,
						marginHorizontal: 15,
						// marginTop: 5,
					}}>
					<RN.Text
						style={{
							width: '100%',
							fontFamily: 'Rubik-Medium',
							textAlign: 'center',
							fontSize: 12,
							marginVertical: 5,
							marginTop: -6,
							color:'#393939' ,
						}}
						numberOfLines={2}>
						{item.document_type.name &&
						item.document_type.is_other_value
							? item.document_type.other_value
							: item.document_type.name}
					</RN.Text>
				</RN.View>
			</RN.TouchableOpacity>
		);
	};

  const navigateToAddDocument = () => {
    navigation.navigate(AddDocumentNav);
  };
  const DrawerScreen = () => {
    return navigation.dispatch(DrawerActions.toggleDrawer());
  };
  const LoadMoreRandomData = () => {
    setPageNumber(pagenumber + 1);
    listDocument(pagenumber + 1);
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
  return (
    <RN.View style={style.container}>
      <RN.SafeAreaView style={{ backgroundColor: colorLightBlue }} />
      {fullLoder && <Loader />}
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
            <RN.Text style={style.navbarName}>{'My Documents '}</RN.Text>
          </RN.View>
        </RN.View>
      </RN.View>
      <RN.ScrollView
	    showsVerticalScrollIndicator={false}
        ref={ref}
        onScroll={({ nativeEvent }) => {
          if (isCloseToBottom(nativeEvent)) {
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
			{documentAlert.length > 0 &&
                  <RN.TouchableOpacity onPress={() => { navigation.navigate('DocumentRemainder', {
                    from: 'myReminders',
                    document_ids: documentAlert[0]._id,
                    reminder_data: 'editDocumentReminder',
                    comments:  documentAlert[0].reminder.comments,
                    title: documentAlert[0].reminder.title._id,
                    date: documentAlert[0].reminder.date,
                    otherTitle: documentAlert[0].reminder.title.other_value,
                  });}} 
                  style={{ marginHorizontal: 10, marginBottom: 10, marginTop: 10,backgroundColor: '#EDF0F7', flexDirection: 'row', padding: 10, borderRadius: 10}}>
                    <RN.View style={{ height: 100, width: 100, borderRadius: 10, paddingRight: 10}}>
                      <RN.Image
                        source={
							documentAlert && documentAlert.image && !documentDefaultImageView ? {
							  uri: documentAlert[0].image[0]
							} :
							  defImgeView}
                        style={{ height: '100%', width: '100%', resizeMode: 'cover', borderRadius: 10 }} />
                    </RN.View>
                    <RN.View style={{flex:1, alignSelf: 'center'}}>
                      <RN.View style={{flexDirection:'row', justifyContent:'space-between', flex:1}}>
                        <RN.View style={{alignSelf:'center',flex:1,paddingRight:10}}>
                          <RN.Text style={{ color: '#393939', fontFamily: 'Rubik-Medium', fontSize: 12}}>{documentAlert[0]?.document_type.name == 'Others'? documentAlert[0]?.document_type.other_value : documentAlert[0]?.document_type.name}</RN.Text>
                        </RN.View>
                        <RN.View style={{ height: 30, width: 30 }}>
                          <RN.Image source={alertclock} style={{ height: '100%', width: '100%', resizeMode: 'cover'}} />
                        </RN.View>
                      </RN.View>
                      <RN.View style={{ backgroundColor: '#6BB3B3', paddingHorizontal: 10, borderRadius: 8, marginRight:15,flex:1, justifyContent:'center'}}>
                        <RN.Text style={{ color: '#FFFFFF', fontFamily: 'Rubik-Regular', fontSize: 12 }}>{documentAlert[0].reminder.title.name == 'Others'
                          ? documentAlert[0].reminder.title.other_value + ` on ${moment(new Date(documentAlert[0]?.reminder.date)).format('DD/MM/YYYY')}`
                          : documentAlert[0].reminder.title.name + ` on ${moment(new Date(documentAlert[0]?.reminder.date)).format('DD/MM/YYYY')}`}</RN.Text>
                      </RN.View>
                    </RN.View>
                  </RN.TouchableOpacity>
                }
        {totalrecords > 0 ? (
          <RN.FlatList
            data={documentList}
            renderItem={renderItem}
            numColumns={3}
            // onEndReached={LoadMoreRandomData}
          />
        ) : (
          <RN.View style={style.center}>
            <RN.ImageBackground
              source={require('../../assets/images/emptyStates/adddocument.png')}
              resizeMode="contain"
              style={style.image}
            />
            <RN.Text style={style.text}>
              {'Be on Top of all renwals of documents'}
            </RN.Text>
            <RN.Text style={style.text}>{'and payments'}</RN.Text>
            <RN.TouchableOpacity onPress={() => navigateToAddDocument()}>
              <ThemedButton
                title="+ Add Document"
                mode="outline"
                color={colorLightBlue}
                buttonStyle={{ marginTop: 20 }}
                btnStyle={{ fontFamily: 'Rubik-Medium' }}></ThemedButton>
            </RN.TouchableOpacity>
          </RN.View>
        )}
        {loading && (
          <RN.ActivityIndicator size="large" color={colorLightBlue} />
        )}
      </RN.ScrollView>
    </RN.View>
  );
};

export default Documents;
