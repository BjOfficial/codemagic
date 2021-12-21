import React, { useEffect, useState, useRef } from "react";
import {
  colorDropText,
  colorLightBlue,
  colorWhite,
  colorBlack,
} from "@constants/Colors";
import {
	View, 
	Text,
	TouchableOpacity,
	Image,
	ScrollView, Dimensions, StyleSheet
} from 'react-native'; 
import ModalDropdownComp from "@components/ModalDropdownComp";
import FloatingInput from "@components/FloatingInput";
import { arrow_down, white_arrow, locationGreen,eye_close,
	eye_open, edit
	 } from "@constants/Images";
import { font12, font14 } from "@constants/Fonts";  
import { useNavigation } from "@react-navigation/native"; 
import styles from './styles';
import * as yup from 'yup';
import { Formik } from 'formik';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { constants } from "@utils/config";
import APIKit from '@utils/APIKit';
import { onChange } from "react-native-reanimated";
import ThemedButton from "@components/ThemedButton";
import Loader from '@components/Loader';
import { AddLocationNav, MyProfileNav, forgotpasswordNav } from "@navigation/NavigationConstant";

const EditProfile = () => {
  const navigation = useNavigation();
	const [passwordStatus, setPasswordStatus] = useState(true); 
    const [loading, setloading] = useState(false);
	const [citydropdown, setCityDropdown] = useState(null);
    const dropdownref = useRef(null);
	const [profileDetails, setProfileDetails] = useState();
	const [locationList, setLocationList] = useState([]);
	const [successMsg, setSuccessMsg] = useState();
	const [showloading, setShowLoading] = useState(true);
	const formikRef = useRef(); 

	const [errorMsg, setErrorMsg] = useState('');

	React.useEffect(() => {
		const unsubscribe = navigation.addListener('focus', () => {
			getProfileDetails();
	        getLocationList();
		});
	 
		return unsubscribe;
	  }, [navigation]);

	useEffect(()=>{
	  getProfileDetails();
	  getLocationList();
	}, []);
	
  const navigationBack = () => {
    navigation.goBack();
     
  };

  const phoneNumber = RegExp(/^[0-9]{10}$/);
    
  const signupValidationSchema = yup.object().shape({
      name: yup.string().required('Name is required'),
      email: yup
          .string()
          .email('Please enter valid email')
          .required('Email Address is Required'),
      phonenumber: yup
          .string()
          .required('Phone number is required')
          .matches(phoneNumber, 'Invalid Phone Number'),
       
		  pincode: yup
		  .string()
		  .required('Pincode is required')
		  .test('len', 'Enter valid pincode', (val) => val && val.length >= 5),
    //   pincode: yup
    //       .string()
    //       .required('Pincode is required')
    //       .test('len', 'Enter valid pincode', (val) => val && val.length >= 5)
    //       .test('test', 'Enter valid pincode', () => !pincodeError),
      city: yup.object().nullable().required('City is required'),
  });

  

 
const getProfileDetails = async() => { 
	setShowLoading(true);
  let uid = await AsyncStorage.getItem('loginToken');
	 let ApiInstance = await new APIKit().init(uid);
	   let awaitresp = await ApiInstance.get(constants.viewProfileDetails);
		if (awaitresp.status == 1) {
			
			const profileDataRes = awaitresp.data.data;
			if(formikRef.current){
				formikRef.current.setFieldValue('name', profileDataRes.name);
				formikRef.current.setFieldValue('phonenumber', profileDataRes.phone_number);
				formikRef.current.setFieldValue('email', profileDataRes.email);
				formikRef.current.setFieldValue('pincode', profileDataRes.pincode);
				formikRef.current.setFieldValue('city.label', profileDataRes.city);
  
		   }
		   getCityDropdowns(profileDataRes?.pincode);
		   setTimeout(() => {
			setShowLoading(false); 
		  }, 1500);

		 } else {
		 console.log(awaitresp.err_msg);
	   }
	  
   };

   const getLocationList = async() => { 
	let uid = await AsyncStorage.getItem('loginToken');
			let ApiInstance = await new APIKit().init(uid);
		 let awaitresp = await ApiInstance.get(constants.listAddLocation);
		  if (awaitresp.status == 1) {
			  setLocationList(awaitresp.data.data); 
			  
		   
		 } else {
			console.log(awaitresp.err_msg);
		 }
		
	 };

	 const getCityDropdown = async (
		value,
		setFieldValue,
		field,
		setFieldError,
		touched,
		setTouched
	) => { 
     setTouched({ ...touched, [field]: true });
		setFieldValue(field, value.toString());
     	if (value.length >= 5) {
			setloading(true);
			 let ApiInstance = await new APIKit().init(); 
			let awaitresp = await ApiInstance.get(
				`https://api.postalpincode.in/pincode/${value}`
			);
			 setloading(false);
			if (awaitresp.status == 1) {
				if (awaitresp.data.length > 0) {
					let responseData = awaitresp.data[0].PostOffice?.map((obj) => {
						return { label: obj.Name, value: obj.Name };
					});
					setCityDropdown(responseData);
           		}
			} else {
				Alert.alert(awaitresp.err_msg);
			}
			 
		}
	};

     
	 const getCityDropdowns = async (value) => { 
		let ApiInstance = await new APIKit().init();
			let awaitresp = await ApiInstance.get(
			   `https://api.postalpincode.in/pincode/${value}`
		   );
			setloading(false);
		   if (awaitresp.status == 1) {
			   if (awaitresp.data.length > 0) {
				   let responseData = awaitresp.data[0].PostOffice?.map((obj) => {
					   return { label: obj.Name+", "+obj.Division, value: obj.Name+", "+obj.Division };
				   });
				   setCityDropdown(responseData); 
			   }
		   } else {
			   Alert.alert(awaitresp.err_msg);
		   }
			
   };


   
   const EditProfileSubmit = async(values) => { 
	let uid = await AsyncStorage.getItem('loginToken');
	
		   let payload = { name: values.name, email: values.email, phone_number:values.phonenumber, city : values.city.label, pincode:values.pincode };
		   let ApiInstance = await new APIKit().init(uid);
		   let awaitresp = await ApiInstance.post(constants.updateProfileDetails, payload);
			if (awaitresp.status == 1) {
				setErrorMsg(''); 
				setSuccessMsg(awaitresp.data.message);
	setTimeout(() => { 
		setSuccessMsg('');
	  navigation.navigate(MyProfileNav);
   }, 3000)
		
		   } else {
			   setErrorMsg(awaitresp.err_msg);
		   }
		
};

	 const changeFieldValue = (setFieldValue, key, value, touched, setTouched) => {
		setTouched({ ...touched, [key]: true });
		setFieldValue(key, value);
	};

	const onSelectCity = (data, setFieldValue) => {
		setFieldValue('city', citydropdown[data]);
	   };

  return (
    <View
      style={{
        backgroundColor: colorWhite,
        height: Dimensions.get("screen").height,
      }}>
      
        <View style={style.containerHeader}>
          <View style={style.box}>
            <View
              style={{ flexDirection: "row", justifyContent: "flex-start" }}>
              <View style={{ flex: 1, flexDirection:'row', justifyContent:'space-between'}}>
                  <View>
                <TouchableOpacity onPress={() => navigationBack()}>
                  <Image source={white_arrow} style={style.arrow_icon} />
                </TouchableOpacity>
                 <Text style={style.headerText}>
                  Edit Profile
                </Text>
                </View>
                <TouchableOpacity onPress={()=>navigation.navigate(MyProfileNav)} style={{backgroundColor:'#FFFFFF', width:'22%', alignItems:'center', paddingTop:6, paddingBottom:6, borderRadius:25}}>
                    <Text style={{ color:'#D54B4B'}}>Cancel</Text>
                </TouchableOpacity> 
              </View>
               
            </View>
          </View>
         </View>
		 {showloading&&
		 <Loader/>
		 }
		 {/* {!showloading&& */}
             <Formik innerRef={p => (formikRef.current = p)}
					validationSchema={signupValidationSchema}
					initialValues={{
						name: '',
						phonenumber: '',
						email: '', 
						pincode: '',
						city: null,
					}}
					onSubmit={(values) => EditProfileSubmit(values)}>
					{({
						handleSubmit,
						values,
						touched,
						setFieldValue,
						setFieldError,
						setTouched,
						errors,
						handleChange
					}) => (
						<>
						{!showloading&&
						 <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom:180}}>
                     <View style={styles.uploadedView}>
        
						<View>
							<FloatingInput
								placeholder_text="Name"
								value={values.name}
								onChangeText={(data) =>
									changeFieldValue(
										setFieldValue,
										'name',
										data,
										touched,
										setTouched
									)
								}
								error={touched.name && errors.name}
								maxLength={30}
							/>
							<FloatingInput
								placeholder_text="Phone Number"
								value={values.phonenumber}
								onChangeText={(data) =>
									changeFieldValue(
										setFieldValue,
										'phonenumber',
										data,
										touched,
										setTouched
									)
								}
								error={touched.phonenumber && errors.phonenumber}
								focus={true}
								prefix="+91"
								editProfilePrefix={true}
								editable_text={false}
								inputstyle={{opacity:0.4}}
							/>
							<FloatingInput
								placeholder_text="Email"
								value={values.email}
								keyboard_type="email-address"
								onChangeText={(data) =>
									changeFieldValue(
										setFieldValue,
										'email',
										data.replace(/\s/g, ''),
										touched,
										setTouched
									)
								}
								error={touched.email && errors.email}
							/>
							{/* <FloatingInput
								placeholder_text="Password"
								value={values.password}
								onChangeText={(data) =>
									changeFieldValue(
										setFieldValue,
										'password',
										data,
										touched,
										setTouched
									)
								}
								error={touched.password && errors.password}
								secureTextEntry={passwordStatus == true ? true : false}
								rightIcon={
									<TouchableOpacity
										onPress={() => setPasswordStatus(passwordStatus)}>
										<Image
											source={passwordStatus == true ? eye_close : eye_open}
											style={styles.eyeIcon}
										/>
									</TouchableOpacity>
								}
							/> */}
							 
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
								}}>
								<View style={{ flex: 0.5 }}>
									<FloatingInput
										placeholder_text="Pin Code"
										maxLength={6}
										value={values.pincode}
										keyboard_type={
											Platform.OS === 'ios' ? 'number-pad' : 'numeric'
										}
										onChange={(e)=>{setFieldValue('location',e)}}
										onChangeText={(data) =>
											getCityDropdown(
												data,
												setFieldValue,
												'pincode',
												setFieldError,
												touched,
												setTouched
											)
										}
										error={(touched.pincode && errors.pincode)}
									/>
								</View>

								<View style={{ flex: 0.5 }}>
									<ModalDropdownComp
										textStyle={{ color: 'red' }}
										loading={loading}
										renderNoRecords={() => (
											<Text style={{ textAlign: 'center' }}>
                                              No Records Found....
											</Text>
										)}
										dropdownTextStyle={{ color: 'green' }}
										onSelect={(data) => onSelectCity(data, setFieldValue)}
										ref={dropdownref}
										options={citydropdown ? citydropdown : []}
										isFullWidth
										renderRow={(props) => (
											<Text
												style={{
													paddingVertical: 8,
													paddingHorizontal: 15,
													fontSize: font14,
													color: colorDropText,
													fontFamily: 'Rubik-Regular',
												}}>
												{props.label}
											</Text>
										)}
										dropdownStyle={{ elevation: 8, borderRadius: 8 }}
										renderSeparator={(obj) => null}>
										<FloatingInput
											placeholder_text="City"
											value={values.city ? values.city.label:''}
											type="dropdown"
											editable_text={false}
											containerStyle={{ marginBottom: 0 }}
											dropdowncallback={() => dropdownref.current.show()}
											rightIcon={
												<Image
													source={arrow_down}
													style={{ width: 12, height: 8.3 }}
												/>
											}
										/>
									</ModalDropdownComp>
								</View>
								
							</View>
							<View style={{ flex: 1 }}>
								<TouchableOpacity
                  onPress={()=>navigation.navigate(forgotpasswordNav)}>
										<Text style={{color:'#1D7BC3', textDecorationLine: 'underline', fontFamily: 'Rubik-Regular', fontSize:12}}>Reset Password</Text>
									</TouchableOpacity>
							</View>

							<View style={styles.wholeLocation}> 
					       {locationList && locationList.map((item, index)=>{
							   return(
							<View style={[styles.locationCard, {marginTop:20, marginBottom:20}]}>
								<View style={styles.locationHeader}>
									<Image source={locationGreen} style={styles.location}/>
									<Text style={styles.locationTxt}>My Location {index+1}</Text>
									<TouchableOpacity onPress={()=>navigation.navigate('EditLocation', {asset_location_id : item._id, screenName : 'editProfile'})} style={{position:'absolute', right:10, top:10}}><Image source={edit} style={[styles.edit]}/>
                         </TouchableOpacity>
								</View>
								<View style={styles.locationBody}>
									<FloatingInput 
									placeholder_text="Location Name"
									value={item.name}
									onChange={(e)=>{setFieldValue('location',e)}}
									editable_text={false}
									/>

									<FloatingInput
									placeholder_text="Pin Code"
									maxLength={6}
									editable_text={false}
									value={item.pincode}
									keyboard_type={
											Platform.OS === 'ios' ? 'number-pad' : 'numeric'
										}
										onChange={(e)=>{setFieldValue('pincode',e)}} />

								</View>
								
						
							</View> 
							)
						})} 
				     </View>
                          

							
							 
                            </View>
							
						
						
                          
							</View>
						
						</ScrollView>
}
							

						<View style={{position:'absolute', bottom:70, flex:1, width:'100%', backgroundColor:'#fff', paddingTop:0}}>
						 
						{successMsg ?  <View style={{marginBottom:5}}><Text style={styles.successMsg}>{successMsg}</Text></View>
         
						: <View style={{marginBottom:5, marginTop:5}}><Text style={styles.errorMsg}>{errorMsg}</Text></View>}
        
						<View style={[styles.uploadedView, {marginTop:0, paddingTop:0}]}>	
                 <TouchableOpacity onPress={()=>navigation.navigate(AddLocationNav)} style={{alignItems:'center', marginBottom:30}}> 
                   <Text style={styles.addAnotherLocation}>+ Add another location</Text>
                 </TouchableOpacity>

                            <View>
                            
                                <ThemedButton
                                  title="Save & Proceed"
                                  onPress={handleSubmit}
                                  color={colorLightBlue}
                                  btnStyle={{letterSpacing:0}}
                                  ></ThemedButton>
                              
                            </View>

                   </View>

								 </View>           
														</>
					 )}
                     </Formik>
{/* } */}



					 {/* <View style={{width:'100%',position:'absolute', backgroundColor:'#FFFFFF',  bottom:80}}>
					   <View style={[styles.uploadedView, {marginTop:0}]}>					
							<ThemedButton
							title="Save & Proceed"
							// onPress={handleSubmit}
							color={colorLightBlue}
							btnStyle={{letterSpacing:0}}
							></ThemedButton>
							
					     </View>
					 </View> */}

                 
			
    </View>
  ); 
};

const style = StyleSheet.create({
  label: {
    fontFamily: "Rubik-Regular",
    fontSize: 12,
    color: colorBlack,
    margin: 15,
  },
  inputStyle: {
    alignSelf: "center",
    height: Dimensions.get("screen").height * 0.07,
    borderWidth: 0.5,
    borderRadius: 30,
    marginLeft: Dimensions.get("screen").width * 0.03,
    paddingLeft: 20,
  },
  containerHeader: {
    backgroundColor: colorLightBlue,
    borderBottomLeftRadius: 33,
    borderBottomRightRadius: 33,
    padding: Platform.OS == "ios" ? 40 : 30,
    paddingLeft: 15,
    paddingTop: Platform.OS == "ios" ? 50 : 30,
  },
  arrow_icon: {
    width: 18,
    height: 16,
  },
  box: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerText: {
    fontSize: 17,
    fontFamily: "Rubik-Medium",
    color: colorWhite,
    marginLeft: 30,
    marginTop: -17,
  },
  headerEdit: {
    fontSize: font12,
    fontFamily: "Rubik-Regular",
    color: colorWhite,
    marginLeft: 10,
    marginRight: 10,
  },
  headerEditCancel: {
    fontSize: font12,
    fontFamily: "Rubik-Regular",
    color: '#FF0000',
    marginLeft: 10,
    marginRight: 10,
  },
});
export default EditProfile;
