import React, { useRef, useState, useEffect } from 'react';
import * as RN from 'react-native';
import { white_arrow, arrow_down } from '@constants/Images';
import { colorDropText, colorLightBlue, colorWhite } from '@constants/Colors';
import style from './styles';
import FloatingInput from '@components/FloatingInput';
import { Formik } from 'formik';
import { DateOfRemainder } from '@screens/DocumentRemainder/DateOfRemainder';
import ModalDropdownComp from '@components/ModalDropdownComp';
import { font14 } from '@constants/Fonts';
import * as yup from 'yup';
import APIKit from '@utils/APIKit';
import ThemedButton from '@components/ThemedButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constants } from '@utils/config';
import StatusBar from '@components/StatusBar';
const index = (props) => {
  const [titleData, setTitle] = useState([]);

  const [applianceRemainder, setApplianceRemainder] = useState([]);

  const dropdownTitleref = useRef(null);

  useEffect(() => {
    listGeneralReminder();
  }, []);
  const notifyMessage = (msg) => {
    if (RN.Platform.OS === 'android') {
      RN.ToastAndroid.show(msg, RN.ToastAndroid.SHORT);
    } else {
      RN.AlertIOS.alert(msg);
    }
  };
  const listGeneralReminder = async () => {
    const getToken = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(getToken);
    let awaitresp = await ApiInstance.get(constants.listGeneralReminder);
    if (awaitresp.status == 1) {
      setApplianceRemainder(awaitresp.data.data);
    } else {
      console.log('not listed other remainder');
    }
  };
  const addUserReminder = async (values) => {
    let payload = {
      reminder: {
        date: values.issue_date,
        title: {
          id: values.title._id,
          other_value: values.otherTitle,
        },
        comments: values.comments,
      },
    };
    const getToken = await AsyncStorage.getItem('loginToken');
    let ApiInstance = await new APIKit().init(getToken);
    let awaitresp = await ApiInstance.post(constants.addUserReminder, payload);
    if (awaitresp.status == 1) {
      props.navigation.navigate('Dashboard');
    } else {
      notifyMessage(JSON.stringify(awaitresp));
    }
  };
  const onSelectPromisedService = (data, setFieldValue) => {
    setFieldValue('title', applianceRemainder[data]);
    setTitle(applianceRemainder[data]);
  };
  const ValidationSchema = yup.object().shape({
    issue_date: yup.string().required('Date is Required'),
    title: yup.object().required('Title is Required'),
    otherTitle: yup
    .string().when('title', {
      is: (val) => val?.name === "Others",
      then: yup.string().required('Title is Required'),
  }),
    comments: yup.string().required('Comment is Required'),
  });

  return (
    <RN.View style={{ flex: 1, backgroundColor: colorWhite }}>
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
            <RN.Text style={style.navbarName}>{'Add Reminder'}</RN.Text>
          </RN.View>
        </RN.View>
      </RN.View>
      <RN.KeyboardAvoidingView style={{flex:1}}
        behavior={RN.Platform.OS === 'ios' ? 'padding' : ''}>
        <RN.ScrollView showsVerticalScrollIndicator={false} bounces={false}>
      <Formik
        initialValues={{
          issue_date: '',
          title: '',
          otherTitle: '',
          comments: '',
        }}
        validationSchema={ValidationSchema}
        onSubmit={(values) => addUserReminder(values)}>
        {({ handleSubmit, values, setFieldValue, errors, handleBlur }) => (
          <RN.View>
            <RN.View>
              <RN.Text style={style.label}>Set date </RN.Text>
              <DateOfRemainder
                errors={errors}
                values={values}
                setFieldValue={setFieldValue}
                handleBlur={handleBlur}
              />
            </RN.View>
            <RN.View>
              <RN.Text style={style.label}>{'Add Title'}</RN.Text>
              <ModalDropdownComp
                onSelect={(data) =>
                  onSelectPromisedService(data, setFieldValue)
                }
                ref={dropdownTitleref}
                options={applianceRemainder}
                isFullWidth
                renderRow={(prop) => (
                  <RN.Text
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 15,
                      fontSize: font14,
                      color: colorDropText,
                      fontFamily: 'Rubik-Regular',
                    }}>
                    {prop.name}
                  </RN.Text>
                )}
                dropdownStyle={{ elevation: 8, borderRadius: 8,
                marginLeft: RN.Dimensions.get('screen').width * 0.03,
                marginRight: RN.Dimensions.get('screen').width * 0.03}}
                renderSeparator={(obj) => null}>
                <FloatingInput
                  selection={{ start: 0, end: 0 }}
                  placeholder="Select"
                  editable_text={false}
                  type="dropdown"
                  value={values.title && titleData && titleData.name}
                  error={errors.title}
                  errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                  inputstyle={style.inputStyle}
                  containerStyle={{
                    borderBottomWidth: 0,
                    marginBottom: 0,
                  }}
                  dropdowncallback={() => dropdownTitleref.current.show()}
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
              {titleData && titleData.name === 'Others' ? (
                <FloatingInput
                  placeholder="Enter Title"
                  value={values.otherTitle}
                  onChangeText={(data) => setFieldValue('otherTitle', data)}
                  error={errors.otherTitle}
                  errorStyle={{ marginLeft: 20, marginBottom: 10 }}
                  inputstyle={style.othersInputStyle}
                  containerStyle={{
                    borderBottomWidth: 0,
                    marginBottom: 0,
                  }}
                />
              ) : null}
            </RN.View>
            <RN.Text style={style.label}>{'Comments'}</RN.Text>
            <FloatingInput
              placeholder="Comments"
              value={values.comments}
              onChangeText={(data) => setFieldValue('comments', data)}
              error={errors.comments}
              errorStyle={{ marginLeft: 20, marginBottom: 10 }}
              inputstyle={style.inputStyle}
              containerStyle={{ borderBottomWidth: 0, marginBottom: 0 }}
            />
            <RN.View style={{ marginVertical: 20, padding: 20 }}>
              <ThemedButton
                title="Add Reminder"
                onPress={handleSubmit}
                color={colorLightBlue}></ThemedButton>
            </RN.View>
          </RN.View>
        )}
      </Formik>
      </RN.ScrollView>
      </RN.KeyboardAvoidingView>
    </RN.View>
  );
};

export default index;
