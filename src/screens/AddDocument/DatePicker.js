import React, { useState } from 'react';
import * as RN from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import FloatingInput from '@components/FloatingInput';
import style from './style';
import { calendar } from '@constants/Images';

export const DatePicker = (props) => {
	const { values, setFieldValue, handleBlur, errors, fieldValue, maxDate, disabled} =
    props;
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
	const showDatePicker = () => {
		setDatePickerVisibility(true);
	};

	const hideDatePicker = () => {
		setDatePickerVisibility(false);
	};

	const handleConfirm = (date) => {
		setFieldValue(fieldValue, moment(date).format('YYYY-MM-DD'));
		hideDatePicker();
	};

	return (
		<RN.TouchableHighlight
            disabled={disabled}
			underlayColor={'none'}
			onPress={() => showDatePicker()}>
			<RN.View pointerEvents="none">
				<FloatingInput
					error={values && errors ? ' ' : errors}
					errorStyle={{ marginLeft: 20, marginBottom: 10 }}
					placeholder={'dd/mm/yyyy'}
					value={
						values == '' ? '' : moment(new Date(values)).format('DD/MM/YYYY')
					}
					onBlur={handleBlur('Date_Of_Purchase')}
					inputstyle={style.inputStyles}
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
				{fieldValue == 'issue_date' ? (
					<DateTimePickerModal
						isVisible={isDatePickerVisible}
						mode="date"
						onConfirm={handleConfirm}
						onCancel={hideDatePicker}
						maximumDate={maxDate}
					/>
				) : (
					<DateTimePickerModal
						isVisible={isDatePickerVisible}
						mode="date"
						onConfirm={handleConfirm}
						onCancel={hideDatePicker}
						minimumDate={maxDate}
					/>
				)}
			</RN.View>
		</RN.TouchableHighlight>
	);
};
