import { constants } from '@utils/config';
import React, { useState, useEffect } from 'react';
import * as RN from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIKit from '@utils/APIKit';
import BackArrowComp from '@components/BackArrowComp';
import {
  colorAsh,
  colorBlack,
  colorBrown,
  colorDropText,
  colorGreen,
  colorLightBlue,
  colorplaceholder,
  colorWhite,
} from '@constants/Colors';
import {
  addreminder_white,
  noDocument,
  edit_appliance,
  archive,
  alert_icon,
  calendar_check,
  documentDefaultImages,
} from '@constants/Images';

import EvilIcons from 'react-native-vector-icons/EvilIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import { font13, font12 } from '@constants/Fonts';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import BottomSheetComp from '@components/BottomSheetComp';
import ModalComp from '@components/ModalComp';
import ThemedButton from '@components/ThemedButton';
import RadioForm from 'react-native-simple-radio-button';
import { dashboardNav, EditDocumentNav } from '@navigation/NavigationConstant';

const DocumentView = (props) => {
  let reminder_data = [
    'You can set up fully customizable reminders for dates (1 week / 1 month or any period in advance of the end date) for end of warranty, AMC, Extended Warranty, Maintenance Service due dates for all your appliances and gadgets so that you can raise issues within the due dates. ',

    'Similarly, you can set up renewal dates for your Passport, Driving License, etc., and payment due dates of your EMI or ECS mandate, etc. Further, these alerts will get populated in your native calendar in your cell phone.',

    '\u{2B24}   You can set your own customizable and mul',
    '\u{2B24}   Important dates for end of warranty, AMC, Extended Warranty, Regular Service ',
    '\u{2B24}   Renewal related - Passport, Driving License for self and family, etc.,',
    '\u{2B24}  Payment due dates - EMI, Loan, ECS, Home mortgage, Insurance premium  etc',
    '\u{2B24}   Any important dates in your life',
  ];
  let edit = [
    '● There are several attributes included for each asset that will be enabled in the beta version ',
    '● The rating of the brand, retailers, service technicians and comments are to help your network in their own purchase decisions',
    '● Also you will earn Azzeti coins when the Brands and Retailers get your ratings and comments that will help them to serve you better ',
    '● Do add as many documents, appliances, gadgets and others as you can to test the Alpha version ',
    '● You will be able to edit and add these additional details in Beta version in the next 3 weeks',
  ];
  const IsFocused = useIsFocused();
  const navigation = useNavigation();
  const [view, setView] = useState(null);
  const documentId = props?.route?.params?.document_id;
  const [imageVisible, setImageVisible] = useState(false);
  const [documentOptionVisibel, setDocumentOptionVisible] = useState(false);
  const [archiveVisible, setArchiveVisible] = useState(false);
  const [moveArchiveVisible, setMoveArchiveVisible] = useState(false);
  const [radio, setRadio] = useState(0);
  const [errorMsg, setErrorMsg] = useState();
  const [successMsg, setSuccessMsg] = useState();
  const [radioProps] = useState([
    { label: "Damaged", value: 0 },
    { label: "Expired", value: 1 },
    { label: "Others", value: 2 },
  ]);
  
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      viewDocument();
      setErrorMsg('');
      setSuccessMsg('');
    });
    viewDocument();
    return unsubscribe;
  }, [IsFocused]);

  const reminderTitle = (e) =>{
    if(e?.title?.name == 'Others'){

      return e?.title?.other_value;
    }
    else{

      return e?.title?.name;
    }
  };
  const viewDocument = async () => {
    const getToken = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(getToken);
    console.log('documentId', documentId);

    let awaitlocationresp = await ApiInstance.get(
      constants.viewDocument + '?document_id=' + documentId._id
    );
    if (awaitlocationresp.status == 1) {
      setView(awaitlocationresp.data.data);
    } else {
      console.log('not listed location type');
    }
  };

  const submitDocumentLocation = async () => {
    const document_archivee =
      radio == 0
        ? "Damaged"
        : radio == 1
        ? "Expired"
        : radio == 2
        ? "Others"
        : "";
    let uid = await AsyncStorage.getItem("loginToken");
    const payload = {
      document_id: documentId._id,
      document_archive: document_archivee,
    };
    console.log('payload', payload);
    let ApiInstance = await new APIKit().init(uid);
    let awaitresp = await ApiInstance.post(constants.archiveDocument, payload);
    if (awaitresp.status == 1) {
      setSuccessMsg(awaitresp.data.message);
      setTimeout(() => {
        setMoveArchiveVisible(false);
        navigation.navigate(dashboardNav);
      }, 2000);
    } else {
      setErrorMsg(awaitresp.err_msg);
    }
  };

  const navigatePage = () => {
    setDocumentOptionVisible(false);
    navigation.navigate(EditDocumentNav,{document_id: documentId._id, data:view});
  };

  const onImageLoadingError = () => {
    setImageVisible(true);
  };
  try {
    let assetName = view && view.document_type.name.replace(/ /g, '').toLowerCase();
    let brandName = 'Others';
    var defImg;
    documentDefaultImages.forEach((assetType) => {
      defImg = assetType[assetName][brandName].url;
    });
  } catch (e) {
    defImg = noDocument;
  }
  return (
    <RN.View
      style={{
        flex: 1,
        backgroundColor: colorWhite,
        height: RN.Dimensions.get('screen').height,
      }}>
      <RN.StatusBar barStyle="dark-content" />
      <RN.View
        style={{
          flexDirection: 'row',
          marginTop: 15,
          marginLeft: 3,
          marginBottom: 10,
          paddingTop: RN.Platform.OS === 'ios' ? 30 : 0,
        }}>
        <RN.View style={{paddingHorizontal:20}}>
          <BackArrowComp/>
        </RN.View>
        <RN.View style={{ flex: 9 }}>
          <RN.Text
            style={{
              fontFamily: 'Rubik-Bold',
              fontSize: 15,
              color: colorBlack,
            }}>
            {documentId !== null &&
						documentId.document_type &&
						documentId.document_type.is_other_value == true
              ? documentId.document_type.other_value
              : documentId.document_type.name}
          </RN.Text>
        </RN.View>
        <RN.View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('DocumentRemainder', {
                from:'documentView',
                document_ids: view._id,
                reminder_data: 'editDocumentReminder',
                comments: view.reminder.comments,
                title: view.reminder.title._id,
                date: view.reminder.date,
                otherTitle: view.reminder.title.other_value
              });
            }}>
            {view && !view.reminder ? null : (
              <EvilIcons name="bell" color={colorBlack} size={25} />
            )}
          </TouchableOpacity>
        </RN.View>
        <RN.View style={{ flex: 1 }}>
          <TouchableOpacity
            onPress={() => setDocumentOptionVisible(true)}>
            <RN.Text>
              <MaterialCommunityIcons
                name="dots-vertical"
                color={colorBlack}
                size={20}
              />
            </RN.Text>
          </TouchableOpacity>
        </RN.View>
      </RN.View>
      <RN.ScrollView showsVerticalScrollIndicator={false}>
        <RN.View
          style={{
            flex: 1,
            elevation: 4,
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            width: RN.Dimensions.get('screen').width * 0.95,
            alignSelf: 'center',
            borderRadius: 20,
            marginTop: 20,
            backgroundColor: colorWhite,
          }}>
          <RN.View
            style={{
              borderWidth: 1,
              borderColor: '#e7f5ff',
              backgroundColor: '#e7f5ff',
              width: RN.Dimensions.get('screen').width * 0.8,
              alignSelf: 'center',
              borderRadius: 20,
              height: 50,
              marginTop: 20,
            }}>
            <RN.Text
              style={{
                color: colorLightBlue,
                alignSelf: 'center',
                marginTop: 15,
                fontFamily: 'Rubik-Regular',
                fontSize: 17,
              }}>
              {'Document Details:'}
            </RN.Text>
          </RN.View>

          <RN.View style={{ marginTop: 20 }}>
            <RN.View style={{ flexDirection: 'row' }}>
              <RN.View style={{ flex: 1 }}>
                <RN.Image
                  source={require('../../assets/images/asset_detail_and_edit/serialnumber.png')}
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
                      color: '#747474',
                      fontFamily: 'Rubik-Regular',
                      fontSize: 13,
                      marginTop: 20,
                    }}>
                    {'Document Number'}
                  </RN.Text>
                </RN.View>
                <RN.View>
                  <RN.Text
                    style={{
                      fontFamily: 'Rubik-Regular',
                      fontSize: 14,
                      marginTop: 10,
                      color: colorDropText,
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
                width: RN.Dimensions.get('screen').width * 0.8,
                alignSelf: 'center',
                marginTop: 20,
              }}
            />
            <RN.View style={{ flexDirection: 'row', marginTop: 10 }}>
              <RN.View style={{ flex: 1 }}>
                <RN.Image
                  source={calendar_check}
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
                      color: '#747474',
                      fontFamily: 'Rubik-Regular',
                      fontSize: 14,
                      marginTop: 20,
                    }}>
                    {'Date Of Issue'}
                  </RN.Text>
                </RN.View>
                <RN.View>
                  <RN.Text
                    style={{
                      fontFamily: 'Rubik-Regular',
                      fontSize: 14,
                      marginTop: 10,
                      color: colorDropText,
                    }}>
                    {view &&
										view.issue_date &&
										moment(new Date(view.issue_date)).format('DD/MM/YYYY')}
                  </RN.Text>
                </RN.View>
              </RN.View>
            </RN.View>
            <RN.View
              style={{
                borderBottomColor: colorAsh,
                borderBottomWidth: 0.5,
                width: RN.Dimensions.get('screen').width * 0.8,
                alignSelf: 'center',
                marginTop: 20,
              }}
            />
            <RN.View style={{ flexDirection: 'row' }}>
              <RN.View style={{ flex: 1 }}>
                <RN.Image
                  source={require('../../assets/images/asset_detail_and_edit/warrantyending.png')}
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
                      color: '#747474',
                      fontFamily: 'Rubik-Regular',
                      fontSize: 14,
                      marginTop: 20,
                    }}>
                    {'Date Of Expiry'}
                  </RN.Text>
                </RN.View>
                <RN.View>
                  <RN.Text
                    style={{
                      fontFamily: 'Rubik-Regular',
                      fontSize: 14,
                      marginTop: 10,
                      color: colorDropText,
                    }}>
                    {view &&
										view.expire_date &&
										moment(new Date(view.expire_date)).format('DD/MM/YYYY')}
                  </RN.Text>
                </RN.View>
              </RN.View>
            </RN.View>
            <RN.View
              style={{
                borderBottomColor: colorAsh,
                borderBottomWidth: 0.5,
                width: RN.Dimensions.get('screen').width * 0.8,
                alignSelf: 'center',
                marginTop: 20,
              }}
            />
            <RN.View style={{ flexDirection: 'row' }}>
              <RN.View style={{ flex: 1 }}>
                <RN.Image
                  source={require('../../assets/images/asset_detail_and_edit/reminderdate.png')}
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
                      color: '#747474',
                      fontFamily: 'Rubik-Regular',
                      fontSize: 14,
                      marginTop: 20,
                    }}>
                    {'Reminder Date'}
                  </RN.Text>
                </RN.View>
                <RN.View>
                  <RN.Text
                    style={{
                      fontFamily: 'Rubik-Regular',
                      fontSize: 14,
                      marginTop: 10,
                      color: colorDropText,
                      marginBottom: 20,
                    }}>
                    {view &&
										view.reminder &&
										moment(new Date(view.reminder.date)).format('DD/MM/YYYY')}
                  </RN.Text>
                </RN.View>
              </RN.View>
            </RN.View>

            {view && view.image.length > 0 ? (
              view.image.map((image, index) => {
                return (
                  <RN.View style={{height:150, width:200 , alignSelf: 'center', marginBottom:10}} key={index}>
                    <RN.Image
                      source={
                        imageVisible
                          ? defImg
                          : { uri: 'file:///' + image.path }
                      }
                      onError={() => onImageLoadingError()}
                      style={{
                        height:'100%',
                        width:'100%',
                        resizeMode:'contain',
                      }}
                    />
                  </RN.View>
                );
              })
            ) : (
              <RN.View style={{height:150, width:200 , alignSelf: 'center', marginBottom:10}}>
                <RN.Image
                  source={defImg}
                    style={{
                      height:'100%',
                      width:'100%',
                      resizeMode:'contain',
                    }}
                />
              </RN.View>
            )}
          </RN.View>
        </RN.View>

        <RN.View style={styles.reminderBtnView}>
          {view && !view.reminder ? (
            <RN.TouchableOpacity
              onPress={() => {
                navigation.navigate('DocumentRemainder', {
                  from:'documentView',
                  document_ids: view._id,
                  reminder_data: 'documentReminder',
                });
              }}
              style={styles.reminderBtnn}>
              <RN.Image
                source={addreminder_white}
                style={styles.reminderIcon}
              />
              <RN.Text style={styles.reminderText}>Add Reminder</RN.Text>
            </RN.TouchableOpacity>
          ) : null}
        </RN.View>
      </RN.ScrollView>
      {view && !view.reminder ? null : (
        <RN.View style={styles.bottomFixed}>
          <RN.View style={styles.warningView}>
            <RN.ImageBackground
              source={alert_icon}
              resizeMode="contain"
              style={styles.warningImg}
            />
            <RN.View style={{flex:1, paddingHorizontal:5}}>
              <RN.Text style={styles.warrantytext}>
                {reminderTitle(view?.reminder)} {' - '}
                {view &&
								view.reminder &&
								moment(new Date(view.reminder.date)).format('DD/MM/YYYY')}
              </RN.Text>
            </RN.View>
              <RN.TouchableOpacity style={styles.viewalertBtn} onPress={() => {
                navigation.navigate('DocumentRemainder', {
                  from:'documentView',
                  document_ids: view._id,
                  reminder_data: 'editDocumentReminder',
                  comments: view.reminder.comments,
                  title: view.reminder.title._id,
                  date: view.reminder.date,
                  otherTitle: view.reminder.title.other_value
                });
              }
              }>
                <RN.Text style={styles.viewalertlabel}>View alert</RN.Text>
              </RN.TouchableOpacity>
            </RN.View>
        </RN.View>
      )}
      <BottomSheetComp
        sheetVisible={documentOptionVisibel}
        closePopup={() => setDocumentOptionVisible(false)}>
        <RN.View style={styles.uploadedView}>
          <RN.TouchableOpacity    
            style={styles.listOption}
            onPress={() => navigatePage()}>
            <RN.Image source={edit_appliance} style={styles.applianceOptImg} />
            <RN.Text style={styles.optnTxt}>Edit</RN.Text>
          </RN.TouchableOpacity>
          <RN.TouchableOpacity
            style={styles.listOption}
            onPress={() => {
              setArchiveVisible(true);
              setDocumentOptionVisible(false);
            }}
            >
            <RN.Image
              source={archive}
              style={[styles.applianceOptImg, { width: 14, height: 12 }]}
            />
            <RN.Text style={styles.optnTxt}>Archive</RN.Text>
          </RN.TouchableOpacity>
        </RN.View>
      </BottomSheetComp>

      <ModalComp visible={archiveVisible}>
        <RN.View style={{ marginBottom: 25 }}>
          <RN.View style={styles.glitterView}>
            <RN.Text style={styles.succesAdded}>Move to Archive</RN.Text>
            <RN.Text style={styles.assts}>
              Do you want to move this document to archive?
            </RN.Text>
            <RN.Text style={styles.restores}>
              (You can restore this from archive history later)
            </RN.Text>
          </RN.View>

          <RN.View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginTop: 25,
            }}>
            <ThemedButton
              title="No, Cancel"
              onPress={() => setArchiveVisible(false)}
              color={"#FFFFFF"}
              style={styles.btnDefault}
              btnStyle={{ letterSpacing: 0, color: "#747474" }}
              fontRegular={true}></ThemedButton>
            <ThemedButton
              title="Yes, Archive"
              onPress={() => {
                setMoveArchiveVisible(true);
                setArchiveVisible(false);

              }}
              color={colorLightBlue}
              btnStyle={{ letterSpacing: 0 }}
              style={{
                width: "45%",
                borderRadius: 25,
                justifyContent: "center",
              }}></ThemedButton>
          </RN.View>
        </RN.View>
      </ModalComp>

      <BottomSheetComp
        sheetVisible={moveArchiveVisible}
        closePopup={() => setMoveArchiveVisible(false)}>
        <RN.View style={styles.uploadedView}>
          <RN.View>
            <RN.Text style={styles.archiveTxt}>
              Say why you're moving this to archive?
            </RN.Text>
          </RN.View>
          <RN.View>
            <RN.Text
              style={{
                color: "#393939",
                fontFamily: "Rubik-Medium",
                marginVertical: 20,
              }}>
              Choose reason
            </RN.Text>
            <RadioForm
              radio_props={radioProps}
              initial={0}
              value={radio}
              buttonSize={15}
              buttonColor={colorLightBlue}
              buttonInnerColor={colorWhite}
              formHorizontal={true}
              labelHorizontal={true}
              buttonOuterColor={colorLightBlue}
              labelStyle={{ fontFamily: "Rubik-Regular" }}
              radioStyle={{ paddingRight: 20 }}
              style={{ marginTop: 15, justifyContent: "space-between" }}
              onPress={(value) => {
                setRadio(value);
              }}
            />
          </RN.View>
            <RN.Text style={styles.errorMsg}>{errorMsg}</RN.Text>
            <RN.Text style={styles.successMsg}>{successMsg}</RN.Text>
          <RN.View style={{ width: "95%", marginTop: 40 }}>
            <ThemedButton
              title="Move to Archive"
              onPress={() => submitDocumentLocation()}
              color={colorLightBlue}
              btnStyle={{ letterSpacing: 0 }}></ThemedButton>
          </RN.View>
        </RN.View>
      </BottomSheetComp>
    </RN.View>
    
  );
};

export default DocumentView;
const styles = RN.StyleSheet.create({
  reminderBtnn: {
    backgroundColor: colorLightBlue,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    padding: 12,
    justifyContent: 'center',
  },
  reminderIcon: {
    width: 20,
    height: 20,
  },
  reminderText: {
    color: colorWhite,
    fontSize: 13,
    fontFamily: 'Rubik-Medium',
    marginLeft: 10,
  },
  reminderBtnView: {
    width: '60%',
    marginLeft: '20%',
    marginVertical: 30,
    paddingBottom: 80,
    bottom: 10,
  },
  bottomFixed: {

    backgroundColor: colorWhite,
    position: 'absolute',
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  warningImg: {
    width: 20,
    height: 15,
  },
  warrantytext: {
    color: colorWhite,
    fontFamily: 'Rubik-Regular',
    fontSize: font13,
  },
  viewalertBtn: {
    backgroundColor: colorWhite,
    borderRadius: 30,
    padding: 5,
    paddingHorizontal: 10,
    alignItems:'center',
    justifyContent:'center'
  },
  viewalertlabel: {
    fontSize: font12,
    color: colorBrown,
    fontFamily: 'Rubik-Regular',
  },
  uploadedView: {
    padding: 20,
		
  },
  listOption:{
    marginBottom:20,
    flexDirection :'row',
    
  },
  optnTxt : {
  color:'#000000',
  fontFamily: 'Rubik-Regular',
  marginLeft:15,
  fontSize:13
  },
  applianceOptImg:{
    width:15,
    height:15
  },
  glitterView: {
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf:'center' 
  },
  succesAdded :{
    fontFamily: 'Rubik-Medium',
    color:'#393939',
    fontSize:16,
    marginTop:20,
    marginBottom:10
  },
  assts :{
    fontFamily: 'Rubik-Medium',
    color:'#393939',
    fontSize:16,
    marginTop:20,
    marginBottom:10,
    marginLeft: 20
  },
  restores:{
    color:'#747474',
    fontFamily: 'Rubik-Regular',
    fontSize:12,
    marginTop:8

  },
  successMsg:{
    color:colorGreen,
    fontFamily: 'Rubik-Medium',
    fontSize:14,
    alignSelf: 'center',
  },
  btnDefault : {
    width:'45%', borderWidth:1,paddingTop:3,paddingBottom:3, borderColor:'#707070', borderRadius:25
  },
});
