import StatusBar from '@components/StatusBar';
import ThemedButton from '@components/ThemedButton';
import { colorLightBlue, colorWhite } from '@constants/Colors';
import { useNavigation, DrawerActions } from '@react-navigation/native';
import _ from 'lodash';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import * as RN from 'react-native';
import APIKit from '@utils/APIKit';
import {
  home_icon,
  appliance_alert,
  doc_alert,
  all_alert,
} from '@constants/Images';
import AntDesign from 'react-native-vector-icons/AntDesign';
import style from './styles';
import { OtherReminderNav, CalendarNav } from '@navigation/NavigationConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constants } from '@utils/config';
import Loader from '@components/Loader';
const Remainders = () => {
  const [loading, setLoading] = useState(false);
  const [allReminders, setAllReminders] = useState([]);
  const [_date, _setDate] = useState(new Date().toISOString());
  const [fullLoder, setFullLoder] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.addListener('focus', () => {
      setFullLoder(true);
      start();
    });
  }, []);

  const start = () => {
    setAllReminders([]);
    getAllReminders(
      new Date(_date).toISOString(),
      new Date(_date).addDays(20).toISOString()
    );
  };
  Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
  };
  const customixer = (apiResponse) => {
    const applianceReminder = apiResponse.applianceReminder.map(function (el) {
      var o = Object.assign({}, el);
      o.reminderType = 'appliance';
      return o;
    });
    const documentReminder = apiResponse.documentReminder.map(function (el) {
      var o = Object.assign({}, el);
      o.reminderType = 'document';
      return o;
    });
    const userReminder = apiResponse.userReminder.map(function (el) {
      var o = Object.assign({}, el);
      o.reminderType = 'general';
      return o;
    });
    const test = [...applianceReminder, ...documentReminder, ...userReminder];
    const order = _.sortBy(test, function (o) {
      return new moment(o.reminder.date);
    });
    setAllReminders(allReminders.concat(order));
  };
  const notifyMessage = (msg) => {
    if (RN.Platform.OS === 'android') {
      RN.ToastAndroid.show(msg, RN.ToastAndroid.SHORT);
    } else {
      RN.Alert.alert(msg);
    }
  };

  const getAllReminders = async (from, to) => {
    setLoading(true);
    const asset_location_id = await AsyncStorage.getItem('locationData_ID');
    let payload = {
      from_date: new moment(new Date(from)).format('YYYY/MM/DD'),
      to_date:  new moment(new Date(to)).format('YYYY/MM/DD'),
      asset_location_id
    };
    try {
      const getToken = await AsyncStorage.getItem('loginToken');
      let ApiInstance = await new APIKit().init(getToken);
      let awaitresp = await ApiInstance.post(
        constants.listReminderDetails,
        payload
      );
      if (awaitresp.status == 1) {
        _setDate(new Date(to).addDays(1).toISOString());
        customixer(awaitresp.data);
        setLoading(false);
        setFullLoder(false);
      } else {
        notifyMessage(JSON.stringify(awaitresp));
        setLoading(false);
        setFullLoder(false);
      }
    } catch (error) {
      console.warn(error);
      setFullLoder(false);
    }
  };

  const formateDate = (value) => {
    return new moment(value).format('MMM DD');
  };
  const imageCheck = (value) => {
    if (value == 'appliance') {
      return appliance_alert;
    } else if (value == 'document') {
      return doc_alert;
    } else if (value == 'general') {
      return all_alert;
    }
  };
  const navigateTo = (id, type, title, comment, reminderDate, otherTitle) => {
    const From = (typeCheck) => {
      if (typeCheck == 'appliance') {
        return 'editAssetReminder';
      } else if (typeCheck == 'document') {
        return 'editDocumentReminder';
      } else if (typeCheck == 'general') {
        return 'editOtherReminder';
      }
    };
    const To = From(type);
    navigation.navigate('DocumentRemainder', {
      from: 'myReminders',
      document_ids: id,
      reminder_data: To,
      comments: comment,
      title: title,
      date: reminderDate,
      otherTitle,
    });
  };
  const DrawerScreen = () => {
    return navigation.dispatch(DrawerActions.toggleDrawer());
  };
  const loader = () => {
    return (
      <RN.View>
        {loading && (
          <RN.ActivityIndicator size="large" color={colorLightBlue} />
        )}
      </RN.View>
    );
  };
  const renderItem = ({ item, index }) => {
    return (
      <RN.TouchableOpacity
        key={index}
        style={{ marginTop: 10, marginBottom: 10 }}
        onPress={() => {
          navigateTo(
            item._id,
            item.reminderType,
            item.reminder.title._id,
            item.reminder.comments,
            item.reminder.date,
            item.reminder.title.other_value
          );
        }}>
        <RN.View style={{ paddingHorizontal: 20 }}>
          <RN.View
            style={{
              backgroundColor: '#F6F6F6',
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              paddingTop: 5,
              paddingHorizontal: 10,
              alignSelf: 'flex-start',
            }}>
            <RN.Text
              adjustsFontSizeToFit
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: '#393939',
                fontFamily: 'Rubik-Medium',
              }}>
              {formateDate(item.reminder.date)}
            </RN.Text>
          </RN.View>
        </RN.View>
        <RN.View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 15,
            flex: 1,
            flexDirection: 'row',
            borderRadius: 20,
            backgroundColor: '#F6F6F6',
          }}>
          <RN.View
            style={{
              height: 40,
              width: 40,
            }}>
            <RN.Image
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
              }}
              source={imageCheck(item.reminderType)}
            />
          </RN.View>

          <RN.View style={{ flex: 1, paddingHorizontal: 10 }}>
            <RN.Text
              style={{
                color: '#393939',
                alignSelf: 'flex-start',
                fontFamily: 'Rubik-Medium',
                paddingBottom: 5,
                fontSize: 12,
              }}>
              {item.reminder.title.name == 'Others'
                ? item.reminder.title.other_value
                : item.reminder.title.name}
            </RN.Text>
            <RN.Text
              style={{
                color: '#393939',
                fontFamily: 'Rubik-Regular',
                fontSize: 12,
                lineHeight: 15,
              }}>
              {item.reminder.comments}
            </RN.Text>
          </RN.View>
          {/* <RN.TouchableOpacity
            style={{
              height: 40,
              width: 43,
              padding: 10,
              borderRadius: 50,
            }}>
            <RN.Image
              style={{
                flex: 1,
                width: "100%",
                height: "100%",
                resizeMode: "contain",
              }}
              source={options}
            />
          </RN.TouchableOpacity> */}
        </RN.View>
      </RN.TouchableOpacity>
    );
  };

  return (
    <RN.View style={{ flex: 1, marginBottom: 50, backgroundColor: colorWhite }}>
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
              <RN.Image source={home_icon} style={style.notificationIcon} />
            </RN.View>
          </RN.TouchableOpacity>
          <RN.View style={{ flex: 1 }}>
            <RN.Text style={style.navbarName}>{'My Reminders '}</RN.Text>
          </RN.View>
          <RN.View style={{ flex: 0 }}>
            <RN.TouchableOpacity
              onPress={() => navigation.navigate(CalendarNav)}>
              <AntDesign
                name="calendar"
                color="#FFFFFF"
                size={22}
                style={{ margin: 17 }}
              />
            </RN.TouchableOpacity>
          </RN.View>
        </RN.View>
      </RN.View>
      <RN.View style={{ flex: 1 }}>
        {allReminders.length > 0 ? (
          <RN.View
            style={{
              padding: 10,
              flex:1,
              backgroundColor: colorWhite,
            }}>
            <RN.FlatList
              showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              nestedScrollEnabled={true}
              data={allReminders}
              renderItem={renderItem}
              onMomentumScrollEnd={() =>
                getAllReminders(
                  new Date(_date).toISOString(),
                  new Date(_date).addDays(50).toISOString()
                )
              }
              onEndReachedThreshold={0.8}
              ListFooterComponent={loader}
              keyExtractor={(item, index) => index.toString()}
            />
          </RN.View>
        ) : (
          <RN.View style={style.center}>
            <RN.Image
              source={require('../../assets/images/emptyStates/addreminder.png')}
              style={style.image}
            />
            <RN.Text style={style.text}>{'Set Alerts for Reminders'}</RN.Text>
            <RN.TouchableOpacity
              onPress={() => navigation.navigate(OtherReminderNav)}>
              <ThemedButton
                title="+ Add Reminder"
                mode="outline"
                color={colorLightBlue}
                buttonStyle={{ marginTop: 20 }}
                btnStyle={{ fontFamily: 'Rubik-Medium' }}></ThemedButton>
            </RN.TouchableOpacity>
          </RN.View>
        )}
      </RN.View>
    </RN.View>
  );
};

export default Remainders;
