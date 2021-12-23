import React, { useRef, useState, useEffect } from 'react';
import * as RN from 'react-native';
import style from './style';
import FloatingInput from '@components/FloatingInput';
import { Formik } from 'formik';
import ModalDropdownComp from '@components/ModalDropdownComp';
import {
  arrow_down,
  add_img,
  suggestion,
  close_round,
  glitter,
  white_arrow
} from '@constants/Images';
import { font14 } from '@constants/Fonts';
import {
  colorLightBlue,
  colorDropText,
  colorAsh,
  colorWhite,
  colorGray,
  colorBlack,
} from '@constants/Colors';
import StatusBar from '@components/StatusBar';
import ThemedButton from '@components/ThemedButton';
import ModalComp from '@components/ModalComp';
import moment from 'moment';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'react-native-image-picker';
import * as RNFS from 'react-native-fs';
import { useNavigation } from '@react-navigation/native';
import { DatePicker } from './DatePicker';
import * as yup from 'yup';
import { ButtonHighLight } from '@components/debounce';
import { requestMultiple, PERMISSIONS } from 'react-native-permissions';
import {
  cameraAndStorage,
  storageCheck,
  cameraCheck,
} from '@services/AppPermissions';
import StarRating from '@components/StarRating';
import DocumentPicker from 'react-native-document-picker';
import PdfThumbnail from 'react-native-pdf-thumbnail';
const EditDocument = (props) => {
  const [maximumDate, setMaximumDate] = useState(new Date());
  const appState = useRef(RN.AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [documentData, setDocumentData] = useState([]);
  const [locationData, setLocationData] = useState([]);
  const [addIntermediary, setAddIntermediary] = useState([]);
  const document_id = props?.route?.params?.document_id;
  const view = props?.route?.params?.data;
  const dropdownDocumentref = useRef(null);
  const dropdownAddIntermediaryref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const dropdownOriginalDocumentref = useRef(null);
  const [intermediaryId,setIntermediaryId] = useState(null)
  const [show, setShow] = useState(false);
  const [response, setResponse] = useState();
  const [cameraVisible, setCameraVisible] = useState(false);
  const [editDocument, setEditDocument] = useState(false);
  const [originalDocument, setOriginalDocument] = useState(null);
  const [intermediary, setIntermediary] = useState(null);
  const [document, setDocument] = useState();
  const [resourcePath, setResourcePath] = useState([]);
  const [initial, setInitial] = useState(0);
  const navigation = useNavigation();
  const formikRef = useRef();
  const [isLoading, setLoading] = useState(false);
  const localTime = new Date().getTime();
  const platfromOs = `${RNFS.DocumentDirectoryPath}/.azzetta/asset/`;
  const destinationPath = platfromOs + localTime + '.jpg';
  const destinationPathPdf = platfromOs + localTime + '.pdf';
  const [pdfThumbnailViewImage, setPdfThumbnailViewImage] = useState(false);
  const [pdfThumbnailImagePath, setPdfThumbnailImagePath] = useState();
  const onSelectDocument = (data, setFieldValue) => {
    setFieldValue('document', documentData[data]);
    setDocument(documentData[data]);
  };
  const onSelectOriginalDocument = (data, setFieldValue) => {
    setFieldValue('originalDocument', locationData[data]);
    setOriginalDocument(locationData[data]);
  };

  const onSelectAddIntermediary = (data, setFieldValue) => {
    setFieldValue('intermediary', addIntermediary[data]);
    setIntermediary(addIntermediary[data]);
  };
  const editDocumentSubmit = (values) => {
    editDocuments(values);
  };
  const receiveRatingValue = (value, setFieldValue) => {
    setFieldValue('rating', value);
  };
  const listDocumentLocation = async () => {
    const getToken = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(getToken);
    let awaitlocationresp = await ApiInstance.get(
      constants.listDocumentLocation
    );
    if (awaitlocationresp.status == 1) {
      setLocationData(awaitlocationresp.data.data);
    } else {
      console.log('not listed document type');
    }
  };

  const nextButtonHadler = () =>{
 
    if(view?.reminder?.date==undefined){
      navigation.navigate('DocumentRemainder',{
      document_ids: view._id,
      reminder_data: 'documentReminder'
      });
    }
    else{
    navigation.navigate('DocumentRemainder', 
    { 
     
      document_ids: view._id,
      reminder_data: 'editDocumentReminder',
      comments: view.reminder.comments,
      title: view.reminder.title._id,
      date: view.reminder.date,
      otherTitle: view.reminder.title.other_value
    });
  }
  }

  const listDocumentIntermediary = async () => {
    const getToken = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(getToken);
    let awaitresp = await ApiInstance.get(constants.listDocumentIntermediary);
    if (awaitresp.status == 1) {
      setAddIntermediary(awaitresp.data.data);
      if (view.intermediary._id) {
        setIntermediaryId(
          awaitresp.data.data.find((appliance) => appliance._id == view.intermediary._id)
        );
      }
    } else {
      console.log('not listed document type');
    }
  };

  const listDocumentType = async () => {
    const getToken = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(getToken);
    let awaitresp = await ApiInstance.get(constants.listDocumentType);
    if (awaitresp.status == 1) {
      setDocumentData(awaitresp.data.data);
      // if(editDocument.document_type._id){
      //   setDocument(
      //     awaitresp.data.data.find((appliance) => appliance._id == editDocument.document_type._id)
      //   );
      // }
    } else {
      console.log('not listed document type');
    }
  };

  const removePhoto = (url) => {
    let result = resourcePath.filter((item, index) => item != url);
    setResourcePath(result);
  };

  const editDocuments = async (values) => {
    setLoading(true);
    const getToken = await AsyncStorage.getItem('loginToken');
    const payload = {
      document_id: document_id,
      document_type: {
        id: document?._id==undefined?view?.document_type?._id:document._id,
        other_value: values.otherDocumentType,
      },
      document_number: values.documentNumber,
      issue_date: values.issue_date == '' ? 'null' : moment(new Date(values.issue_date)).format('YYYY-MM-DD'),
      expire_date: values.expire_date == '' ? 'null' : moment(new Date(values.expire_date)).format('YYYY-MM-DD'),
      image: resourcePath,
      document_location: {
        id: originalDocument?._id== undefined?view?.document_location?._id: originalDocument._id,
        other_value: values.otherDocumentLocation,
      },
      intermediary: {
        id: values?.intermediary?._id ? values.intermediary._id : view?.intermediary?._id,
        other_value: values.otherIntermediary
      },
      intermediary_name: values.intermediaryName,
      intermediary_number: values.intermediaryNumber,
      intermediary_rating: values.rating,
      intermediary_comment: values.Comments
    };
    if(payload.issue_date=='null'){
      delete payload.issue_date;
    }
    if(payload.expire_date=='null'){
      delete payload.expire_date;
    }
    if(payload.intermediary_number == ''){
      delete payload.intermediary_number;
    }
    if(payload.intermediary.id == undefined){
      delete payload.intermediary;
    }
    
    console.log('---------------------------------->>>>>',payload)
    try {
      let ApiInstance = await new APIKit().init(getToken);
      let awaitresp = await ApiInstance.post(constants.updateDocument, payload);
      if (awaitresp.status == 1) {
        if (formikRef.current) {
          formikRef.current.resetForm();
        }
        nextButtonHadler();
        setLoading(false);
      } else {
        RN.Alert.alert(awaitresp.err_msg);
        setLoading(false);
      }
    } catch (error) {
      RN.Alert.alert(error);
    }
  };


  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log('------------vieww------------->',view);
      if (formikRef.current) {
        formikRef.current.resetForm();
        setResourcePath([]);
        setInitial(0);
      }
    });
    listDocumentIntermediary();
    listDocumentType();
    listDocumentLocation();
    return unsubscribe;
  }, []);
  const openModal = () => {
    return (
      <ModalComp visible={visible}>
        <RN.View>
          <RN.View style={style.closeView}>
            <RN.TouchableOpacity onPress={() => closeModal()}>
              <RN.Image source={close_round} style={style.close_icon} />
            </RN.TouchableOpacity>
          </RN.View>
          <RN.View style={style.sugesstionView}>
            <RN.Image style={style.sugesstion} source={suggestion} />
          </RN.View>
          <RN.View style={style.paraOutline}>
          <RN.Text style={style.para}>
            We suggest that you keep all the documents in DigiLocker (from
            government of India with 100MB free storage for each citizen) so
            that the documents do not add to the size of Azzetta App. We only
            need a few data points for you to set reminders. Help us to keep
            Azzetta light by keeping all photos or documents in DigiLocker or
            your Google Drive.
          </RN.Text>
          </RN.View>
        </RN.View>
      </ModalComp>
    );
  };
  const openSucessModal = () => {
    return (
      <ModalComp visible={modalVisible}>
        <RN.View>
          <RN.View style={style.closeView}>
            <RN.TouchableOpacity
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('bottomTab');
              }}>
              <RN.Image source={close_round} style={style.close_icon} />
            </RN.TouchableOpacity>
          </RN.View>
          <RN.View style={style.glitterView}>
            <RN.Image style={style.glitterStar} source={glitter} />
          </RN.View>
          <RN.Text style={style.successPara}>
            Your document added successfully!
          </RN.Text>
          <RN.View style={style.box}>
            <RN.Text style={style.successHeader}>
              Would you like to add a reminder?
            </RN.Text>
            <ThemedButton
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('DocumentRemainder', {
                  document_ids: response,
                  navigation_props: 'navigateToDashboard',
                  reminder_data: 'documentReminder',
                });
              }}
              title="Yes"
              mode={'outline'}
              color={colorLightBlue}
              buttonStyle={{
                width: RN.Dimensions.get('screen').width * 0.5,
                alignSelf: 'center',
              }}></ThemedButton>
            <RN.Text
              onPress={() => {
                setModalVisible(false);
                navigation.navigate('bottomTab');
              }}
              style={style.skip}>
              Skip for now
            </RN.Text>
          </RN.View>
        </RN.View>
      </ModalComp>
    );
  };

  const fetchPermission = async () => {
    cameraAndStorage();
    const cameraStatus = await AsyncStorage.getItem('cameraStatus');
    const galleryStatus = await AsyncStorage.getItem('galleryStatus');
    if (cameraStatus === 'granted' && galleryStatus === 'granted') {
      setCameraVisible(true);
    }
  };
  
  const selectOptions = () => {
    return (
      <ModalComp visible={cameraVisible}>
        <RN.View>
          <RN.View style={style.closeView}>
            <RN.TouchableOpacity onPress={() => closeOptionsModal()}>
              <RN.Image source={close_round} style={style.close_icon} />
            </RN.TouchableOpacity>
          </RN.View>
          <RN.Text style={style.successPara}>Select Options</RN.Text>
          <RN.View style={style.optionsBox}>
            <ButtonHighLight onPress={() => selectImage()}>
              <RN.Text style={style.successHeader}>Select Image</RN.Text>
            </ButtonHighLight>
            <ButtonHighLight onPress={() => selectPdf()}>
              <RN.Text style={style.successHeader}>Select PDF</RN.Text>
            </ButtonHighLight>
            <ButtonHighLight
              onPress={() => {
                selectCamera();
              }}>
              <RN.Text style={style.successHeader}>Open Camera</RN.Text>
            </ButtonHighLight>
          </RN.View>
        </RN.View>
      </ModalComp>
    );
  };
  const pdfThumbnailView = async (filePath) => {
    setPdfThumbnailViewImage(true);
    const pdfThumbnailPath = await PdfThumbnail.generate(filePath, 0);
    setPdfThumbnailImagePath(pdfThumbnailPath);
}

  const selectImage = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose file from Custom Option',
        },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchImageLibrary(options, (res) => {
      console.log('Response = ', res);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        moveAttachment(source.assets[0].uri, destinationPath);
      }
    });
  };

  const selectPdf = async () => {
    const results = await DocumentPicker.pick({
      type: [DocumentPicker.types.pdf],
    });
    for (const res of results) {
      let source = res;
      try{
      const pdfThumbnailPath = await PdfThumbnail.generate(source.uri, 0);
      moveAttachment(source.uri, destinationPathPdf,pdfThumbnailPath);
      }catch(e){
        console.log('error opening pdf',e);
      }
    }
  };

  const selectCamera = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.launchCamera(options, (res) => {
      console.log('Response = ', res);

      if (res.didCancel) {
        console.log('User cancelled image picker');
      } else if (res.error) {
        console.log('ImagePicker Error: ', res.error);
      } else if (res.customButton) {
        console.log('User tapped custom button: ', res.customButton);
        alert(res.customButton);
      } else {
        let source = res;
        moveAttachment(source.assets[0].uri, destinationPath);
      }
    });
  };
  const moveAttachment = async (filePath, newFilepath,pdfPath=null) => {
    // storagePermission();
    var path = platfromOs;
    var decodedURL = RN.Platform.select({
      android: filePath,
      ios: decodeURIComponent(filePath),
    });
    return new Promise((resolve, reject) => {
      RNFS.mkdir(path)
        .then(() => {
          RNFS.moveFile(decodedURL, newFilepath)
            .then((res) => {
              console.log('FILE MOVED', decodedURL, newFilepath);
              setResourcePath([...resourcePath,  { path: newFilepath,imagePath:pdfPath?pdfPath.uri:null }]);
              resolve(true);
              closeOptionsModal();
            })
            .catch((error) => {
              console.log('moveFile error', error);
              reject(error);
            });
        })
        .catch((err) => {
          console.log('mkdir error', err);
          // reject(err);
        });
    });
  };
  const closeOptionsModal = () => {
    setCameraVisible(false);
  };

  const closeModal = () => {
    setVisible(false);
    fetchPermission();
  };
  const signupValidationSchema = yup.object().shape({

      // intermediary: yup.lazy((value) => {
      //   switch (typeof value) {
      //   case 'object':
      //     return yup.object().required('Add Intermediary is Required');
      //   case 'string':
      //     return yup.string().required('Add Intermediary is Required');
      //   default:
      //     return yup.string().required('Add Intermediary is Required');
      //   }
      // }),
   otherDocumentType: yup
      .string().when('document', {
        is: (val) => (val?.name === 'Others' || val === 'Others' ),
        then: yup.string().required('Document Type is Required'),
    }), 
    otherDocumentLocation: yup
    .string().when('originalDocument', {
      is: (val) => (val?.name === 'Others' || val === 'Others' ),
      then: yup.string().required('Document location is Required'),
  }), 
  otherIntermediary: yup
  .string().when('intermediary', {
    is: (val) => (val?.name === 'Others' || val === 'Others' ),
    then: yup.string().required('Add Intermediary is Required'),
    }), 
    // intermediaryNumber : yup
    // .number()
    // .typeError('must be a number'),
    // intermediaryName : yup
    // .string()
    // .required('Intermediary Name is Required'),
    issue_date: yup.string().nullable(),
    expire_date: yup.string().nullable(),
  });

  return (
    <RN.View style={{ flex:1, backgroundColor: colorWhite }}>
      {selectOptions()}
      {openModal()}
      {openSucessModal()}
      <RN.SafeAreaView style={{ backgroundColor: colorLightBlue }} />
      <StatusBar/>
      <RN.View style={style.navbar}>
        <RN.View style={style.navbarRow}>
          <RN.TouchableOpacity
            onPress={() => {
              props.navigation.goBack();
            }}>
            <RN.View>
              <RN.Image source={white_arrow} style={style.notificationIcon} />
            </RN.View>
          </RN.TouchableOpacity>
          <RN.View>
            <RN.Text style={style.navbarName}>Edit Document</RN.Text>
          </RN.View>
        </RN.View>
      </RN.View>
      <RN.KeyboardAvoidingView style={{flex:1}}
        behavior={RN.Platform.OS === 'ios' ? 'padding' : ''}>
        <RN.ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <RN.View>
          <Formik
            validationSchema={signupValidationSchema}
            innerRef={formikRef}
            initialValues={{
              document: view?.document_type?.name,
              otherDocumentType: view?.document_type?.other_value == null ? '': view?.document_type?.other_value,
              documentNumber: view?.document_number,
              originalDocument: view?.document_location?.name,
              otherDocumentLocation: view?.document_location?.other_value == null ? '': view?.document_location?.other_value,
              issue_date: view?.issue_date == undefined ? '': view?.issue_date,
              expire_date: view?.expire_date == undefined ? '': view?.expire_date,
              intermediaryName: view?.intermediary_name == undefined ? '': view?.intermediary_name,
              intermediaryNumber: view?.intermediary_number == null ? '': view?.intermediary_number.toString(),
              Comments: view?.intermediary_comment == null ? '': view?.intermediary_comment,
              otherIntermediary:view?.intermediary?.other_value == null ? '': view?.intermediary?.other_value,
              intermediary: view?.intermediary?.name == null ? '': view?.intermediary?.name
            }}
            onSubmit={(values,actions) => editDocumentSubmit(values)}>
            {({ handleSubmit, values, setFieldValue, errors, touched }) => (
              <RN.View>
                <RN.Text style={style.label}>
                  {'Document type'}
                  <RN.Text style={{ color: 'red', justifyContent: 'center' }}>
                    *
                  </RN.Text>
                </RN.Text>

                <ModalDropdownComp
                  onSelect={(data) => onSelectDocument(data, setFieldValue)}
                  ref={dropdownDocumentref}
                  options={documentData}
                  isFullWidth
                  renderRow={(props) => (
                    <RN.Text
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        fontSize: font14,
                        color: colorDropText,
                        fontFamily: 'Rubik-Regular',
                      }}>
                      {props.name}
                    </RN.Text>
                  )}
                  dropdownStyle={{
                    elevation: 8,
                    borderRadius: 8,
                  }}
                  renderSeparator={(obj) => null}>
                  <FloatingInput
                    placeholder="Select"
                    editable_text={false}
                    type="dropdown"
                    value={document?.name==undefined?values.document:document?.name}
                    // error={
                    //   values.document && errors.document ? ' ' : errors.document
                    // }
                    errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                    inputstyle={style.inputStyle}
                    containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    dropdowncallback={() => dropdownDocumentref.current.show()}
                    rightIcon={
                      <RN.Image
                        source={arrow_down}
                        style={{
                          width: 12,
                          position: 'absolute',
                          height: 8.3,
                          right: RN.Dimensions.get('screen').width * 0.11,
                          top: 23,
                        }}
                      />
                    }
                  />
                </ModalDropdownComp>
                {document && document.name === 'Others' || (values.document === 'Others') ? (
                  <RN.View style={{paddingTop:10}}>
                  <FloatingInput
                    placeholder="Document type"
                    value={values.otherDocumentType}
                    onChangeText={(data) =>
                      setFieldValue('otherDocumentType', data)
                    }
                    error={touched.otherDocumentType && errors.otherDocumentType}
                    errorStyle={{ marginLeft: 20}}
                    autoCapitalize={'none'}
                    inputstyle={style.inputStyle}
                    containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                  />
                  </RN.View>
                ) : null}
                <RN.Text style={style.label}>{'Document number'}</RN.Text>
                <FloatingInput
                  placeholder="ex: SJ93RNFKD0"
                  value={values.documentNumber}
                  onChangeText={(data) => setFieldValue('documentNumber', data)}
                  error={errors.documentNumber}
                  errorStyle={{ marginLeft: 20, backgroundColor: 'green' }}
                  autoCapitalize={'none'}
                  inputstyle={style.inputStyle}
                  containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                />
                <RN.View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>
                      {'Date of Issue'}
                    </RN.Text>
                    <DatePicker
                      fieldValue="issue_date"
                      errors={errors.issue_date}
                      values={values.issue_date}
                      setFieldValue={setFieldValue}
                      maxDate={maximumDate}
                      field_key="issue_date"
                    />
                  </RN.View>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>
                      {'Date of Expiry'}
                    </RN.Text>
                    <DatePicker
                      fieldValue="expire_date"
                      errors={errors.expire_date}
                      values={values.expire_date}
                      setFieldValue={setFieldValue}
                      field_key="expire_date"
                      maxDate={
                        values.issue_date == ''
                          ? maximumDate
                          : new Date(values.issue_date)
                      }
                      disabled={values.issue_date == '' ? true : false}
                    />
                  </RN.View>
                </RN.View>
                <RN.Text style={style.label}>{'Upload Document'}</RN.Text>
                <RN.ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}>
                  <RN.View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}>
                    {resourcePath.map((image, index) => {
                        return (
                          <>
                              <RN.View style={{ flex: 1 }} key={index}>
                              <RN.View style={{
                                    borderWidth: 1,
                                    borderColor: colorAsh,
                                    height: RN.Dimensions.get('screen').height / 6,
                                    width: RN.Dimensions.get('screen').width / 4,
                                    marginLeft: 20,
                                    marginRight: 10,
                                    borderRadius: 20,
                                    padding: 5,
                                    padding:1}}>
                                <RN.Image
                                  source={{ uri: image.imagePath?image.imagePath:'file:///' + image.path }}
                                style={{
                                    height:"100%",
                                    width:"100%",
                                    resizeMode:'cover',
                                    borderRadius: 20,
                                  }}
                                   onError={(e) => console.log(e)}
                                />
                                </RN.View>
                                <RN.View
                                  style={{
                                    position: 'absolute',
                                    top: 0,
                                    right: 0,
                                  }}>
                                  <RN.TouchableOpacity
                                    onPress={() => {
                                      RNFS.unlink('file:///' + image.path)
                                        .then(() => {
                                          removePhoto(image);
                                        })
                                        .catch((err) => {
                                          console.log(err.message);
                                        });
                                    }}>
                                    <RN.Image
                                      source={require('../../assets/images/add_asset/close.png')}
                                      style={{ height: 20, width: 20 }}
                                    />
                                  </RN.TouchableOpacity>
                                </RN.View>
                              </RN.View>
                          </>
                        );
                      })}
                    <RN.View style={{ flex: 1 }}>
                      <RN.TouchableOpacity
                        onPress={() => {
                          if (initial == 0) {
                            setInitial(initial + 1);
                            setVisible(true);
                          } else {
                            closeModal();
                          }
                        }}>
                        <RN.View
                          style={{
                            borderStyle: 'dashed',
                            borderWidth: 1,
                            borderColor: colorAsh,
                            height: RN.Dimensions.get('screen').height / 6,
                            width: RN.Dimensions.get('screen').width / 4,
                            marginLeft: 20,
                            marginRight: 20,
                            backgroundColor: colorWhite,
                            borderRadius: 20,
                            justifyContent: 'center',
                          }}>
                          <RN.Image
                            source={add_img}
                            style={{
                              height: 30,
                              width: 30,
                              alignSelf: 'center',
                            }}
                          />
                        </RN.View>
                      </RN.TouchableOpacity>
                    </RN.View>
                  </RN.View>
                </RN.ScrollView>
                <RN.Text
                  style={{
                    fontFamily: 'Rubik-Regular',
                    fontSize: 13,
                    color: colorGray,
                    padding: 10,
                  }}>
                  {
                    '(All documents should be uploaded either as a PDF file or as a JPG or PNG image files. Each document should not be larger than 4MB.)'
                  }
                </RN.Text>
                <RN.Text style={style.label}>
                  {'Original document location'}
                  <RN.Text style={{ color: 'red', justifyContent: 'center' }}>
                    *
                  </RN.Text>
                </RN.Text>
                <ModalDropdownComp
                  onSelect={(data) =>
                    onSelectOriginalDocument(data, setFieldValue)
                  }
                  ref={dropdownOriginalDocumentref}
                  options={locationData}
                  isFullWidth
                  renderRow={(props) => (
                    <RN.Text
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        fontSize: font14,
                        color: colorDropText,
                        fontFamily: 'Rubik-Regular',
                      }}>
                      {props.name}
                    </RN.Text>
                  )}
                  dropdownStyle={{
                    elevation: 8,
                    borderRadius: 8,
                    marginTop: -16,
                    width: RN.Dimensions.get('screen').width * 0.9,
                    marginLeft: RN.Dimensions.get('screen').width * 0.05,
                    height: RN.Dimensions.get('screen').height * 0.15,
                  }}
                  renderSeparator={(obj) => null}>
                  <FloatingInput
                    placeholder="select"
                    editable_text={false}
                    type="dropdown"
                    value={values?.originalDocument?.name==undefined ? values?.originalDocument:values?.originalDocument?.name}
                    error={
                      values.originalDocument && errors.originalDocument
                        ? ' '
                        : errors.originalDocument
                    }
                    errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                    inputstyle={style.inputStyle}
                    containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    dropdowncallback={() =>
                      dropdownOriginalDocumentref.current.show()
                    }
                    rightIcon={
                      <RN.Image
                        source={arrow_down}
                        style={{
                          width: 12,
                          position: 'absolute',
                          height: 8.3,
                          right: RN.Dimensions.get('screen').width * 0.11,
                          top: 23,
                        }}
                      />
                    }
                  />
                </ModalDropdownComp>
                {originalDocument && originalDocument.name === 'Others' || (values.originalDocument === 'Others') ? (
                  <RN.View style={{paddingTop:10}}>
                  <FloatingInput
                    placeholder="Other Location"
                    value={values.otherDocumentLocation}
                    onChangeText={(data) =>
                      setFieldValue('otherDocumentLocation', data)
                    }
                    errorStyle={{paddingLeft:20}}
                    error={touched.otherDocumentLocation && errors.otherDocumentLocation}
                    autoCapitalize={'none'}
                    inputstyle={style.inputStyle}
                    containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                  />
                  </RN.View>
                ) : null}
                <RN.Text style={style.label}>
                  {'Add Intermediary'}
                  {/* <RN.Text style={{ color: 'red', justifyContent: 'center' }}>
                    *
                  </RN.Text> */}
                </RN.Text>
                <ModalDropdownComp
                  onSelect={(data) =>
                    onSelectAddIntermediary(data, setFieldValue)
                  }
                  ref={dropdownAddIntermediaryref}
                  options={addIntermediary}
                  isFullWidth
                  renderRow={(props) => (
                    <RN.Text
                      style={{
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        fontSize: font14,
                        color: colorDropText,
                        fontFamily: 'Rubik-Regular',
                      }}>
                      {props.name}
                    </RN.Text>
                  )}
                  dropdownStyle={{
                    elevation: 8,
                    borderRadius: 8,
                    marginTop: -16,
                    width: RN.Dimensions.get('screen').width * 0.9,
                    marginLeft: RN.Dimensions.get('screen').width * 0.05,
                    height: RN.Dimensions.get('screen').height * 0.15,
                  }}
                  renderSeparator={(obj) => null}>
                  <FloatingInput
                    placeholder="select"
                    editable_text={false}
                    type="dropdown"
                    value={ values.intermediary.name === undefined ? values.intermediary : values.intermediary.name }
                    error={ errors.intermediary}
                    errorStyle={{ marginLeft: 20}}
                    inputstyle={style.inputStyle}
                    containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    dropdowncallback={() =>
                      dropdownAddIntermediaryref.current.show()
                    }
                    rightIcon={
                      <RN.Image
                        source={arrow_down}
                        style={{
                          width: 12,
                          position: 'absolute',
                          height: 8.3,
                          right: RN.Dimensions.get('screen').width * 0.11,
                          top: 23,
                        }}
                      />
                    }
                  />
                </ModalDropdownComp>
                {(intermediary && intermediary.name === 'Others') || (values.intermediary === 'Others')? (
                      <RN.View style={{paddingTop:10}}>
                  <FloatingInput
                    placeholder="Other Intermediary"
                    value={values.otherIntermediary}
                    onChangeText={(data) =>
                      setFieldValue('otherIntermediary', data)
                    }
                    error={touched.otherIntermediary && errors.otherIntermediary}
                    errorStyle={{ marginLeft: 20}}
                    autoCapitalize={'none'}
                    inputstyle={style.inputStyle}
                    containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                  />
                  </RN.View>
                ) : null}
                <RN.View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>
                      {'Intermediary name'}
                      {/* <RN.Text
                        style={{ color: 'red', justifyContent: 'center' }}>
                        *
                      </RN.Text> */}
                    </RN.Text>
                    <FloatingInput
                      placeholder="Intermediary name"
                      value={values.intermediaryName}
                      onChangeText={(data) => setFieldValue('intermediaryName', data)}
                      error={errors.intermediaryName}
                      errorStyle={{ marginLeft: 20}}
                      autoCapitalize={'none'}
                      inputstyle={style.inputStyle}
                      containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    />
                  </RN.View>
                  <RN.View style={{ flex: 1 }}>
                    <RN.Text style={style.label}>
                      {'Contact Number'}
                      {/* <RN.Text
                        style={{ color: 'red', justifyContent: 'center' }}>
                        *
                      </RN.Text> */}
                    </RN.Text>
                    <FloatingInput
                      placeholder="638300XXXX"
                      value={values.intermediaryNumber}
                      onChangeText={(data) => setFieldValue('intermediaryNumber', data)}
                      error={errors.intermediaryNumber}
                      errorStyle={{ marginLeft: 20 }}
                      autoCapitalize={'none'}
                      inputstyle={style.inputStyle}
                      containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
                    />
                  </RN.View>
                </RN.View>
                <RN.Text style={style.label}>{'Share your experience with the Intermediary?'}</RN.Text>
                <StarRating
                  sendRatingsValue={(starvalue) =>
                    receiveRatingValue(starvalue, setFieldValue)
                  } />
                <RN.TextInput
                  placeholder="Comments"
                  value={values.Comments}
                  onChangeText={(data) =>
                    setFieldValue('Comments', data)
                  }
                  style={[
                    style.customTextinput,
                    { marginLeft: 15, marginRight: 15 },
                  ]}
                />
                <RN.View
                  style={{ marginVertical: 20, paddingTop: 40, padding: 20 }}>
                  {isLoading == true ? (
                    <RN.ActivityIndicator
                      animating={isLoading}
                      size="large"
                      color={colorLightBlue}
                    />
                  ) : (
                    <ThemedButton
                      title="Next"
                      mode={'outline'}
                      onPress={handleSubmit}
                      color={colorLightBlue}>
                    </ThemedButton>
                  )}
                </RN.View>
              </RN.View>
            )}
          </Formik>
        </RN.View>
      </RN.ScrollView>
      </RN.KeyboardAvoidingView>
    </RN.View>
  );
};

export default EditDocument;


