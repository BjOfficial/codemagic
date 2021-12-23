import React, { useState } from 'react';
import * as RN from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import FloatingInput from '@components/FloatingInput';
import { calendar } from '@constants/Images';
import styles from './styles';
export const DateOfOtherReminder = (props) => {
  const { values, setFieldValue, handleBlur, errors, touched } = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setFieldValue('issue_date', moment(date).format('YYYY-MM-DD'));
    hideDatePicker();
  };

  return (
    <RN.TouchableHighlight
      underlayColor={'none'}
      disabled={props.disabled}
      onPress={() => showDatePicker()}>
      <RN.View pointerEvents="none">
        <FloatingInput
          error={touched.issue_date && errors.issue_date}
          errorStyle={{ marginHorizontal: 20}}
          placeholder={'dd/mm/yyyy'}
          value={
            values.issue_date == ''
              ? ''
              : moment(new Date(values.issue_date)).format('DD/MM/YYYY')
          }
          onBlur={handleBlur('Date_Of_Purchase')}
          inputstyle={styles.inputStyles}
          onPressCalendar={() => showDatePicker()}
          type="calendar"
          selectTextOnFocus={false}
          show_keyboard={false}
          editable_text={false}
          leftIcon={
            <RN.Image
              source={calendar}
              style={{
                width: 35,
                height: 35,
                top: -22,
                marginTop: RN.Dimensions.get('screen').height * 0.04,
                left: RN.Dimensions.get('screen').width * 0.06,
                position: 'absolute',
              }}
            />
          }
          containerStyle={{
            borderBottomWidth: 0,
            marginBottom: 0,
          }}
        />
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirm}
          minimumDate={new Date()}
          onCancel={hideDatePicker}
        />
      </RN.View>
    </RN.TouchableHighlight>
  );
};
