import React, { useEffect, useState, useContext } from 'react';
import * as RN from 'react-native';
import styles from './style';
import {
	my_appliances,
	document_menu,
	my_remainders,
	my_reminder,
} from '@constants/Images';
import { useNavigation, useIsFocused } from '@react-navigation/native';
import {
	AddAssetNav,
	AddDocumentNav,
	OtherReminderNav,
} from '@navigation/NavigationConstant';
import BottomSheetComp from '@components/BottomSheetComp';
import { colorBlack } from '@constants/Colors';
import {AuthContext} from '@navigation/AppNavigation';
const Add = () => {
	// const [modalVisible, setModalVisible] = useState(true);
	const navigation = useNavigation();
	const focused = useIsFocused();
	const {setAddVisible,addVisible} = useContext(AuthContext);
	// if(focused){
	//   setModalVisible(true);
	// }
	const [menu] = useState([
		{
			name: 'Add New Appliances',
			icon: my_appliances,
			height: 20,
			width: 17,
			route: AddAssetNav,
		},
		{
			name: 'Add New Documents',
			icon: document_menu,
			height: 20,
			width: 16,
			route: AddDocumentNav,
		},
		{
			name: 'Add Reminder',
			icon: my_remainders,
			height: 20,
			width: 17,
			route: OtherReminderNav,
			title: 'Add Reminders',
			image: my_reminder,
			content: [
				'You can set up fully customizable reminders for dates (1 week / 1 month or any period in advance of the end date) for end of warranty, AMC, Extended Warranty, Maintenance Service due dates for all your appliances and gadgets so that you can raise issues within the due dates. ',

				'Similarly, you can set up renewal dates for your Passport, Driving License, etc., and payment due dates of your EMI or ECS mandate, etc. Further, these alerts will get populated in your native calendar in your cell phone.',

				'\u{2B24}   You can set your own customizable and mul',
				'\u{2B24}   Important dates for end of warranty, AMC, Extended Warranty, Regular Service ',
				'\u{2B24}   Renewal related - Passport, Driving License for self and family, etc.,',
				'\u{2B24}  Payment due dates - EMI, Loan, ECS, Home mortgage, Insurance premium  etc',
				'\u{2B24}   Any important dates in your life',
			],
		},
	]);

	const goBack = () => {
		// setModalVisible(false);
		// navigation.goBack();
	};
	const navigatePage =(menu)=>{
		setAddVisible(false);
		setTimeout(()=>{
			navigation.navigate(menu.route, {
				title: menu.title,
				icon: menu.image,
				content: menu.content,
			})
		},500);
		
	}
	useEffect(() => {
		if (focused) {
			// setModalVisible(true);
		} else {
			setAddVisible(false);
			// setModalVisible(false);
		}
	}, [focused]);
	return (
		
			
			<BottomSheetComp
				panelStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
				sheetVisible={addVisible}
				closePopup={() => setAddVisible(false)}>
				{/* <RN.View style={styles.centeredView}> */}
				<RN.View style={styles.modalView}>
					{menu.map((menu, index) => {
						return (
							<RN.TouchableOpacity
								key={index}
								onPress={() =>
									navigatePage(menu)
								}>
								<RN.View
									style={{
										flexDirection: 'row',
										padding:10
									}}>
									<RN.View style={{ flex: 1 }}>
										<RN.Image
											source={menu.icon}
											style={{
												height: menu.height,
												width: menu.width,
											}}
										/>
									</RN.View>
									<RN.View style={{ flex: 7 }}>
										<RN.Text
											style={{
												fontFamily: 'Rubik-Regular',
												fontSize: 15,
												color: colorBlack,
											}}>
											{menu.name}
										</RN.Text>
									</RN.View>
								</RN.View>
							</RN.TouchableOpacity>
						);
					})}
				</RN.View>
				{/* </RN.View> */}
			</BottomSheetComp>
	);
};

export default Add;
