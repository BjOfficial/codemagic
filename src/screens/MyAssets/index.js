import StatusBar from '@components/StatusBar';
import ThemedButton from '@components/ThemedButton';
import {
	colorAsh,
	colorBlack,
	colorLightBlue,
	colorWhite,
} from '@constants/Colors';
import {
	useNavigation,
	DrawerActions,
} from '@react-navigation/native';  
import Loader from '@components/Loader';
import React, { useEffect, useState } from 'react';
import * as RN from 'react-native';
import APIKit from '@utils/APIKit';
import FilterButtons from '@components/FilterButtons';
import style from './styles';
import { AddAssetNav, MyAppliancesNav } from '@navigation/NavigationConstant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constants } from '@utils/config';
import moment from 'moment';
import { defaultImage, no_image_icon } from '@constants/Images';

const MyAssets = () => {
	const navigation = useNavigation();
	const [pagenumber, setPageNumber] = useState(1);
	const [pageLimit, setPageLimit] = useState(10);
	const [errorMsg, setErrorMsg] = useState('');
	const [loading, setLoading] = useState(false);
	const [filterStateOption, setFilterStateOption] = useState([]);
	const [category_id, setCategoryid] = useState('');
	const [totalrecords, settotalrecords] = useState(0);
	const [updatedCount, setupdatedCount] = useState(0);
	const [fullLoder, setFullLoder] = useState(true);
	const navigateToAddAsset = () => {
		navigation.navigate(AddAssetNav);
	};
	const [applianceList, setApplianceList] = useState([]);
	useEffect(() => {
		navigation.addListener('focus', () => {
			listAppliance(pagenumber, '');
			listappliancecategory();
			setApplianceList([]);
			setFullLoder(true);
		});
	},[]);
  
	const listAppliance = async (data, cate_id, filter) => {
		const getToken = await AsyncStorage.getItem('loginToken');
		let ApiInstance = await new APIKit().init(getToken);
		let awaitlocationresp = await ApiInstance.get(
			constants.listAppliance +
        '?page_no=' +
        data +
        '&page_limit=' +
        pageLimit +
        '&category_id=' +
        cate_id
		);

		if (awaitlocationresp.status == 1) {
			awaitlocationresp.data.data.forEach((list) => {
				try {
					let assetName = list.type.name.replace(/ /g, '');
					let brandName = 'Others';
					var defImg;
					defaultImage.forEach((assetType) => {
						defImg = assetType[assetName][brandName].url;
					});
				} catch (e) {
					defImg = no_image_icon;
				}
				if (list.image.length > 0) {
					list.fileData = true;
					list.setImage = 'file://' + list.image[0].path;
				} else {
					list.fileData = false;
					list.defaultImage = defImg;
				}
				list.defaultImage = defImg;
			});
			setApplianceList(awaitlocationresp.data.data);
			if (awaitlocationresp.data.data.length > 0) {
				setPageNumber(data);
			}
			if (filter) {
				if (awaitlocationresp && awaitlocationresp.data.data.length == 0) {
					setErrorMsg('No data available');
				}
			}
			setLoading(false);
			let clonedDocumentList = data == 1 ? [] : [...applianceList];
			setApplianceList(clonedDocumentList.concat(awaitlocationresp.data.data));
			settotalrecords(
				clonedDocumentList.concat(awaitlocationresp.data.data).length
			);
			setupdatedCount(awaitlocationresp.data.total_count);
			setFullLoder(false);
		} else {
			console.log('not listed location type');
			setFullLoder(false);
		}
	};
	const listappliancecategory = async () => {
		const getToken = await AsyncStorage.getItem('loginToken');
		let ApiInstance = await new APIKit().init(getToken);

		let awaitlocationresp = await ApiInstance.get(
			constants.listApplianceCategory
		);
		if (awaitlocationresp.status == 1) {
			let alloption = [
				{
					isSelected: true,
					name: 'All',
				},
			];
			let concatdata = [...alloption, ...awaitlocationresp.data.data];
			setFilterStateOption(concatdata);
		} else {
			console.log('not listed location type');
		}
	};
	const DrawerScreen = () => {
		return navigation.dispatch(DrawerActions.toggleDrawer());
	};
	const LoadMoreRandomData = () => {
		listAppliance(pagenumber + 1, category_id);
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
	const FiltersApply = async (data, index) => {
		setFullLoder(true);
		setApplianceList([]);
		setErrorMsg('');
		setCategoryid(data._id);
		let filterStateOption1 = [...filterStateOption];
		filterStateOption1.map((obj, index_item) => {
			let obj2 = obj;
			if (index_item != index) {
				obj2.isSelected = false;
			} 
			return obj2;
		});
		filterStateOption1[index].isSelected = true;
		setPageNumber(1);
		if (data.name == 'All') {
			setCategoryid('');
			listAppliance(1, '');
		} else {
			listAppliance(1, data._id, 'filter');
		}
		setFilterStateOption(filterStateOption1);
	};

	const onImageLoadingError = (event, index) => {
		event.preventDefault();
		let applianceListTemp = applianceList;
		applianceListTemp[index].fileData = false;
		setApplianceList([...applianceListTemp]);
	};

	const renderApplianceBrandTitle = (item) => {
		let typeCheck =
      item.brand.name && item.brand.is_other_value
      	? item.brand.other_value
      	: item.brand.name;
		typeCheck = typeCheck == undefined?  ' ' : typeCheck;
		if (typeCheck.length > 19) {
			return typeCheck.substring(0, 19) + '...';
		} else {
			return typeCheck;
		}
	};

	const renderApplianceTitle = (item) => {
		let typeCheck =
      item?.type?.name && item.type.is_other_value
      	? item.type.other_value
      	: item.type.name;
		  typeCheck = typeCheck == undefined?  ' ' : typeCheck;
		if (typeCheck.length > 19) {
			return typeCheck.substring(0, 19) + '...';
		} else {
			return typeCheck;
		}
	};

	const renderItem = ({ item, index }) => {
		return (
			<RN.View
				key={index}
				style={{
					margin: 5,
					marginTop: 10,
					elevation: 5,
					shadowColor: '#000',
					shadowOffset: {
						width: 0,
						height: 5,
					},
					shadowOpacity: 0.34,
					shadowRadius: 6.27,
				}}>
				<RN.TouchableOpacity
					style={{
						width: RN.Dimensions.get('window').width * 0.46,
						backgroundColor: colorWhite,
						elevation: 5,
						borderRadius: 10,
					}}
					onPress={() =>
						navigation.navigate(MyAppliancesNav, {
							applianceList: item,
							currentIndex: index,
						})
					}>
					<RN.View
						style={{
							height: 120,
							width: 120,
							flex: 1,
							alignSelf: 'center',
							paddingVertical: 20,
						}}>
						<RN.Image
							source={{
								uri: item.fileData
									? item.setImage
									: RN.Image.resolveAssetSource(item.defaultImage).uri,
							}}
							style={{
								height: '100%',
								width: '100%',
								borderTopRightRadius: 10,
								borderTopLeftRadius: 10,
								resizeMode: 'contain',
								marginTop: 10,
							}}
							onError={(e) => onImageLoadingError(e, index)}
						/>
					</RN.View>
					<RN.Text
						style={{
							fontFamily: 'Rubik-Medium',
							paddingLeft: 10,
							marginTop: 20,
							color: colorBlack,
						}}>
						{renderApplianceTitle(item)}
					</RN.Text>
					<RN.Text
						style={{
							fontFamily: 'Rubik-Regular',
							paddingLeft: 10,
							marginTop: 5,
							color: colorAsh,
							fontSize: 12,
							marginBottom: 5,
						}}>
						{renderApplianceBrandTitle(item)}
					</RN.Text>
					<RN.View
						style={{
							borderBottomColor: colorAsh,
							borderBottomWidth: 0.5,
						}}
					/>
					<RN.View style={{ flexDirection: 'row' }}>
						<RN.View style={{ flex: 1 }}>
							<RN.Image
								source={require('../../assets/images/home/expirycalender.png')}
								style={{
									height: 17,
									width: 15,
									marginTop: 10,
									marginBottom: 10,
									marginLeft: 10,
								}}
							/>
						</RN.View>
						<RN.View style={{ flex: 4 }}>
							<RN.Text
								style={{
									color: '#8a520d',
									fontFamily: 'Rubik-Regular',
									marginTop: 10,
									marginBottom: 10,
								}}>
								{moment(new Date(item.purchase_date)).format('DD/MM/YYYY')}
							</RN.Text>
						</RN.View>
					</RN.View>
				</RN.TouchableOpacity>
			</RN.View>
		);
	};

	return (
		<RN.View style={{ backgroundColor: colorWhite, flex: 1, marginBottom: 50 }}>
			<RN.SafeAreaView style={{ backgroundColor: colorLightBlue }} />
			{fullLoder&& <Loader/>}
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
						<RN.Text style={style.navbarName}>{'My Assets '}</RN.Text>
					</RN.View>
				</RN.View>
			</RN.View>
			{/* {applianceList&&applianceList.length>0&& */}
			{(category_id != '' ||
        (category_id == '' && applianceList && applianceList.length > 0)) && (
				<RN.View style={[style.FilterButtongrp, { height: null }]}>
					<RN.ScrollView
						horizontal
						showsHorizontalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: 10 }}>
						{filterStateOption &&
              filterStateOption.map((obj, index) => {
              	return (
              		<FilterButtons
              			buttonClick={() => FiltersApply(obj, index)}
              			// buttonClick={() => clickFilter(obj, index)}
              			buttonTitle={obj.name}
              			key={index}
              			buttonLeftSize={10}
              			buttonRightSize={10}
              			isSelected={obj.isSelected}
              		/>
              	);
              })}
					</RN.ScrollView>
				</RN.View>
			)}
			<RN.View>
				<RN.Text style={{ textAlign: 'center' }}>{errorMsg}</RN.Text>
			</RN.View>
			{/* } */}
			<RN.ScrollView
				contentContainerStyle={{ flexGrow: 1 }}
				onScroll={({ nativeEvent }) => {
					if (isCloseToBottom(nativeEvent)) {
						console.log('reached bottom');
						// enableSomeButton();
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
				{totalrecords > 0 ? (
					<RN.FlatList
						style={{ marginBottom: 20, marginLeft: 5, marginTop: 0 }}
						data={applianceList}
						renderItem={renderItem}
						numColumns={2}
					/>
				) : (
					<RN.View
						style={[
							style.center,
							{
								flex: 1,
								marginBottom: 50,
								justifyContent: 'center',
								alignItems: 'center',
							},
						]}>
						<RN.Image
							source={require('../../assets/images/emptyStates/addasset.png')}
							style={style.image}
						/>
						<RN.Text style={style.text}>
							{'Manage your Assets like an Expert'}
						</RN.Text>
						<RN.TouchableOpacity onPress={() => navigateToAddAsset()}>
							<ThemedButton
								title="+ Add Asset"
								mode="outline"
								color={colorLightBlue}
								buttonStyle={{ marginTop: 20 }}
								btnStyle={{ fontFamily: 'Rubik-Medium' }}></ThemedButton>
						</RN.TouchableOpacity>
					</RN.View>
				)}
			</RN.ScrollView>
			{loading && <RN.ActivityIndicator size="large" color={colorLightBlue} />}
		</RN.View>
	);
};

export default MyAssets;