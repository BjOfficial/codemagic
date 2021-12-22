import React, { useState, useEffect } from 'react';
import * as RN from 'react-native';
import { white_arrow, appliance_alert, blue_bell, doc_alert, all_alert } from '@constants/Images';
import { Calendar } from 'react-native-calendars';
import { colorLightBlue, colorWhite } from '@constants/Colors';
import { useNavigation} from '@react-navigation/native';
import _ from 'lodash';
import AntDesign from 'react-native-vector-icons/AntDesign';
import style from './styles';
import moment from 'moment';
import { OtherReminderNav } from '@navigation/NavigationConstant';
import StatusBar from '@components/StatusBar';
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config';
import AsyncStorage from '@react-native-async-storage/async-storage';
const index = (props) => {
  const [allReminders, setAllReminders] = useState([]);
  const [monthReminders,setMonthReminders]= useState([]);
  const navigation = useNavigation();
  const vacation = { key: 'vacation', color: 'red', selectedDotColor: 'blue' };
  const massage = { key: 'massage', color: 'blue', selectedDotColor: 'blue' };
  const workout = { key: 'workout', color: 'green' };
  const [selecterdDate, setSelectedDate] = useState(new Date().toISOString());
  const [markedDate, setMarkedDate] = useState({});
  const customMarkedDate = {
    ...markedDate,
    selecterdDate,
    '2021-11-25': { dots: [vacation, massage, workout] },
    '2021-11-26': { dots: [massage, workout] },
  };
  
  useEffect(() => {
    navigation.addListener('focus', () => {
      start();
      month();
    });
  }, []);

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

  const start = () => {
    setAllReminders([]);
    getAllReminders(
      moment(new Date(selecterdDate)).format('YYYY/MM/DD'),
      moment(new Date(selecterdDate)).format('YYYY/MM/DD')
    );
  };

  const month = ()=> {
    setMonthReminders([]);
    var newdate = new Date(selecterdDate);
    var firstDay = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
    var lastDay = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);
    getMonthReminders(
      moment(new Date(firstDay)).format('YYYY/MM/DD'),
      moment(new Date(lastDay)).format('YYYY/MM/DD')
    );
  };

  const monthCustomixer = (apiResponse) => {
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
    setMonthReminders(test);
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
    setAllReminders(order);
  };

  const notifyMessage = (msg) => {
    if (RN.Platform.OS === 'android') {
      RN.ToastAndroid.show(msg, RN.ToastAndroid.SHORT);
    } else {
      RN.Alert.alert(msg);
    }
  };

  const getMonthReminders = async(from,to) => {
    const asset_location_id = await AsyncStorage.getItem('locationData_ID');
    console.log(from,to);
    let payload = {
      from_date: from,
      to_date: to,
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
        monthCustomixer(awaitresp.data);
      } else {
        notifyMessage(JSON.stringify(awaitresp));
      }
    } catch (error) {
      console.warn(error);
    }
  };
   
  const getAllReminders = async (from, to) => {
    const asset_location_id = await AsyncStorage.getItem('locationData_ID');
    let payload = {
      from_date: from,
      to_date: to,
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
        customixer(awaitresp.data);
      } else {
        notifyMessage(JSON.stringify(awaitresp));
      }
    } catch (error) {
      console.warn(error);
    }
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
  

  const getSelectedDayEvents = (date) => {
    let markedDates = {};
    markedDates[date] = {
      selected: true,
      color: '#00B0BF',
      textColor: '#FFFFFF',
    };
    let serviceDate = moment(date);
    serviceDate = serviceDate.format('DD/MM/YYYY');
    setSelectedDate(serviceDate);
    setAllReminders([]);
    getAllReminders(
      moment(new Date(date)).format('YYYY/MM/DD'),
      moment(new Date(date)).format('YYYY/MM/DD')
    );
    setMarkedDate(markedDates);
  };

  const getSelectedMonthEvents = (date) => {
    console.log(date);
    setAllReminders([]);
    var newdate = new Date(date);
    var firstDay = new Date(newdate.getFullYear(), newdate.getMonth(), 1);
    var lastDay = new Date(newdate.getFullYear(), newdate.getMonth() + 1, 0);
    getMonthReminders(
      moment(new Date(firstDay)).format('YYYY/MM/DD'),
      moment(new Date(lastDay)).format('YYYY/MM/DD')
    );
  };

  const weekStyle = {
    dayTextAtIndex0: {
      color: 'black',
    },
    dayTextAtIndex1: {
      color: 'black',
    },
    dayTextAtIndex2: {
      color: 'black',
    },
    dayTextAtIndex3: {
      color: 'black',
    },
    dayTextAtIndex4: {
      color: 'black',
    },
    dayTextAtIndex5: {
      color: 'black',
    },
    dayTextAtIndex6: {
      color: 'black',
    },
  };

  // const calendarTop = (date) => {
  //   return (
  //     <RN.View
  //       style={{ backgroundColor: "red", flex: 1, flexDirection: "row" }}>
  //       <RN.Text>data</RN.Text>
  //     </RN.View>
  //   );
  // };

  const todaysAlerts = (item, index) => {
    return (
      <RN.TouchableOpacity onPress={() => {
        navigateTo(
          item.item._id,
          item.item.reminderType,
          item.item.reminder.title._id,
          item.item.reminder.comments,
          item.item.reminder.date,
          item.item.reminder.title.other_value
        );
      }} style={{ paddingBottom: 15 }}
      key={index}>
        <RN.View
          style={{
            paddingHorizontal: 15,
            paddingVertical: 15,
            flex: 1,
            flexDirection: 'row',
            borderRadius: 20,
            backgroundColor: '#F3FAF8',
            alignItems: 'center',
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
              source={imageCheck(item.item.reminderType)}
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
              {item.item?.reminder?.title?.name == 'Others'
                ? item.item?.reminder?.title?.other_value
                : item.item?.reminder?.title?.name}
            </RN.Text>
            <RN.Text
              style={{
                color: '#393939',
                fontFamily: 'Rubik-Regular',
                fontSize: 12,
                lineHeight: 15,
              }}>
              {item.item.reminder.comments}
            </RN.Text>
          </RN.View>
        </RN.View>
      </RN.TouchableOpacity>
    );
  };
  return (
    <RN.View style={{ flex: 1, backgroundColor: colorWhite }}>
      <RN.SafeAreaView style={{backgroundColor: colorLightBlue }} />
      <StatusBar />
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
            <RN.Text style={style.navbarName}>{'Calender'}</RN.Text>
          </RN.View>
        </RN.View>
      </RN.View>
      <RN.ScrollView
        style={{ margin: 15 }}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}>
        <RN.View
          style={{
            padding: 5,
            marginBottom: 30,
            borderRadius: 20,
            borderColor: '#CBCBCB',
            borderWidth: 1,
          }}>
          <Calendar
            theme={{ 'stylesheet.calendar.header': weekStyle }}
            markingType={'multi-dot'}
            // hideArrows={true}
            // renderHeader={(date) => calendarTop(date)}
            onDayPress={(day) => {
              getSelectedDayEvents(day.dateString);
            }}
            onMonthChange={(month) => getSelectedMonthEvents(month.dateString)}
            markedDates={customMarkedDate}
          />
        </RN.View>
        <RN.View
          style={{
            paddingTop: 20,
            paddingBottom: 10,
          }}>
          <RN.View style={{ paddingVertical: 10 }}>
            <RN.Text style={{ fontFamily: 'Rubik-Medium', color: '#393939' }}>
              {allReminders.length>0 ? 'Alerts': ''}
            </RN.Text>
          </RN.View>
          {allReminders.length>0&&
          <RN.FlatList
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            data={allReminders}
            renderItem={todaysAlerts}
            nestedScrollEnabled={true}
            keyExtractor={(item, index) => index.toString()}
          />
          }
        </RN.View>
        <RN.View style={{ paddingBottom: 20 }}>
          <RN.View style={style.center}>
            <RN.TouchableOpacity
              style={{
                flexDirection: 'row',
                paddingHorizontal: 25,
                paddingVertical: 10,
                borderWidth: 1,
                borderRadius: 20,
                borderColor: '#1D7BC3',
              }}
              onPress={() => props.navigation.navigate(OtherReminderNav)}>
              <RN.View style={{ height: 20, width: 20 }}>
                <RN.Image
                  style={{
                    flex: 1,
                    width: '100%',
                    height: '100%',
                    resizeMode: 'contain',
                  }}
                  source={blue_bell}
                />
              </RN.View>
              <RN.Text style={{ paddingLeft: 10, color: '#1D7BC3' }}>
                Add new Reminder
              </RN.Text>
            </RN.TouchableOpacity>
          </RN.View>
        </RN.View>
        <RN.View
          style={{
            paddingVertical: 20,
            borderTopColor: '#F5F5F5',
            borderTopWidth: 1,
          }}>
          <RN.View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <RN.Text style={{ color: '#000000' }}>You have </RN.Text>
            <RN.Text
              style={{ color: '#F3A13B', textDecorationLine: 'underline' }}>
              {`${monthReminders.length} alerts`}
            </RN.Text>
            <RN.Text style={{ color: '#000000' }}> for this month</RN.Text>
          </RN.View>
          <RN.Text
            style={{
              textAlign: 'center',
              paddingVertical: 10,
              color: '#747474',
            }}>
            (1 renewal, 1 warranty end date, 7 payments due dates,1 service
            reminders, 1 appliance anniversary, 4 personal reminders)
          </RN.Text>
          <RN.View style={style.center}>
            <RN.TouchableOpacity
              onPress={() => {
                props.navigation.navigate('Remainders');
              }}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: '#393939',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <RN.Text style={{ color: '#393939' }}>View all</RN.Text>
              <RN.Text style={{ paddingHorizontal: 2 }}>{''}</RN.Text>
              <AntDesign name="right" size={15} color="#393939" />
            </RN.TouchableOpacity>
          </RN.View>
        </RN.View>
      </RN.ScrollView>
    </RN.View>
  );
};

export default index;
