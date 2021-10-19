import React, { useState } from "react";
import * as RN from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import FloatingInput from "@components/FloatingInput";
import style from "./style";
import { calendar } from "@constants/Images";

export const DatePicker = (props) => {
  const { values, setFieldValue, handleBlur, errors } = props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [maximumDate, setMaximumDate] = useState(new Date());

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setFieldValue("Date_Of_Purchase", moment(date).format("YYYY-MM-DD"));
    hideDatePicker();
  };

  return (
    <RN.View>
      <FloatingInput
        error={errors.Date_Of_Purchase}
        errorStyle={{ marginLeft: 20, marginBottom: 10 }}
        placeholder={"dd/mm/yyyy"}
        value={
          values.Date_Of_Purchase == ""
            ? ""
            : moment(new Date(values.Date_Of_Purchase)).format("DD/MM/YYYY")
        }
        onBlur={handleBlur("Date_Of_Purchase")}
        inputstyle={style.inputStyles}
        onPressCalendar={() => showDatePicker()}
        type="calendar"
        selectTextOnFocus={false}
        show_keyboard={false}
        editable_text={false}
        // onPress={() => showDatePicker()}
        leftIcon={
          <RN.Image
            source={calendar}
            style={{
              width: 35,
              height: 35,
              top: -22,
              marginTop: RN.Dimensions.get("screen").height * 0.04,
              left: RN.Dimensions.get("screen").width * 0.06,
              position: "absolute",
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
        onCancel={hideDatePicker}
        maximumDate={maximumDate}
      />
    </RN.View>
  );
};
