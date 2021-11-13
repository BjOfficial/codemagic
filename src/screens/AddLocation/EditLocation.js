import React, {useRef, useState,useEffect} from 'react';
import { Text, View, ScrollView, Image, TouchableOpacity } from 'react-native';
import BackArrowComp from '@components/BackArrowComp';
import styles from './styles'; 
import FloatingInput from '@components/FloatingInput'; 
import {
  colorLightBlue,
  colorDropText,  
} from '@constants/Colors';
import { font14 } from '@constants/Fonts';
import { arrow_down,info,primarylocation, close_round,glitter } from '@constants/Images';
import { Formik } from 'formik';
import ModalDropdownComp from '@components/ModalDropdownComp';
import * as yup from 'yup';
import APIKit from '@utils/APIKit';
import ThemedButton from '@components/ThemedButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constants } from '@utils/config'; 
import ModalComp from '@components/ModalComp';
import { useNavigation } from '@react-navigation/core'; 
import { AddLocationNav } from "@navigation/NavigationConstant";

const EditLocation = (props) => {
        const asset_location_id = props?.route?.params?.asset_location_id;
		 console.log("asset_location_id", asset_location_id);
  const navigation = useNavigation();

  const formikRef = useRef(); 
  const [loading, setloading] = useState(false);

	const [citydropdown, setCityDropdown] = useState(null);
  const dropdownref = useRef(null);
	 
	const [errorMsg, setErrorMsg] = useState('');
	const [successMsg, setSuccessMsg] = useState('');
  const [locationList, setLocationList] = useState([]);  
  const [modalVisible, setModalVisible] = useState(false); 

  console.log(locationList);
  useEffect(()=>{
    getLocationDetails();
  },[]);

  const signupValidationSchema = yup.object().shape({
		location: yup.string().required('Location is required'),
		  pincode: yup
			.string()
			.required('Pincode is required')
			.test('len', 'Enter valid pincode', (val) => val && val.length >= 5),
		  city: yup.object().nullable().required('City is required'),
	});
 

  const onSelectCity = (data, setFieldValue) => {
     setFieldValue('city', citydropdown[data]);
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
			console.log('reached 5');
			let ApiInstance = await new APIKit().init();
			// setFieldValue('city', '');
			let awaitresp = await ApiInstance.get(
				`https://api.postalpincode.in/pincode/${value}`
			);
			console.log('awaitresp city', awaitresp);
			setloading(false);
			if (awaitresp.status == 1) {
				if (awaitresp.data.length > 0) {
					let responseData = awaitresp.data[0].PostOffice?.map((obj) => {
						return { label: obj.Name, value: obj.Name };
					});
					setCityDropdown(responseData);
          console.log("responseData", responseData)
				}
			} else {
				Alert.alert(awaitresp.err_msg);
			}
			console.log('city response', awaitresp.data[0]);
		}
	};


	const getCityDropdowns = async (
		value,
		 
	) => { 
    //  setTouched({ ...touched, [field]: true });
	// 	setFieldValue(field, value.toString());
     	let ApiInstance = await new APIKit().init();
			// setFieldValue('city', '');
			let awaitresp = await ApiInstance.get(
				`https://api.postalpincode.in/pincode/${value}`
			);
			console.log('awaitresp city', awaitresp);
			setloading(false);
			if (awaitresp.status == 1) {
				if (awaitresp.data.length > 0) {
					let responseData = awaitresp.data[0].PostOffice?.map((obj) => {
						return { label: obj.Name, value: obj.Name };
					});
					setCityDropdown(responseData);
          console.log("responseData", responseData)
				}
			} else {
				Alert.alert(awaitresp.err_msg);
			}
			console.log('city response', awaitresp.data[0]);
		
	};
   

  const locationUpdateSubmit = async(values, { resetForm }) => { 
		 		let uid = await AsyncStorage.getItem('loginToken');
			 
					let payload = {asset_location_id:asset_location_id, name: values.location, city : values.city.label, pincode:values.pincode };
           let ApiInstance = await new APIKit().init(uid);
					let awaitresp = await ApiInstance.post(constants.editLocation, payload);
					console.log('location api respnse', awaitresp, payload);
					if (awaitresp.status == 1) {
						console.log('location response', awaitresp.data);
             setSuccessMsg("Location updated Successfully");
						 setErrorMsg('');
              setTimeout(() => {
				setSuccessMsg('');
               navigation.navigate(AddLocationNav);
            }, 3000) 
					} else {
						setErrorMsg(awaitresp.err_msg);
						setSuccessMsg('');
					}
				 
      };

      const getLocationDetails = async() => {  
		let uid = await AsyncStorage.getItem('loginToken');
                let ApiInstance = await new APIKit().init(uid);
				// let payload = { 'asset_location_id': asset_location_id};
				// console.log('edit payload', payload)
              let awaitresp = await ApiInstance.get(constants.ViewAddLocation + '?asset_location_id=' + asset_location_id);
              console.log('edit location respnse', awaitresp);
              if (awaitresp.status == 1) {
                console.log('edit location response', awaitresp.data.data);
				const editResData = awaitresp.data.data;
				if(formikRef.current){
					  formikRef.current.setFieldValue('location', editResData.name);
					  formikRef.current.setFieldValue('pincode', editResData.pincode);
					  formikRef.current.setFieldValue('city.label', editResData.city);

					  getCityDropdowns(
						editResData?.pincode,
						 
					)
				 }
                 setErrorMsg(''); 
              } else {
                setErrorMsg(awaitresp.err_msg);
              }
             
          };

            
	return (
    
		<View style={styles.container}>
			<BackArrowComp />
      <Formik
                     innerRef={p => (formikRef.current = p)}
                     validationSchema={signupValidationSchema}
            initialValues={{
              location: '',
              pincode: '',
              city: null,
               
            }} 
            onSubmit={(values, action) => locationUpdateSubmit(values, action)}>
            {({
              handleSubmit,
              values,
              setFieldValue,
              handleChange,
              errors,
						  touched,
            	setFieldError,
						  setTouched, 
            }) => (
      
             <View style={styles.wholeLocation}> 
              <ScrollView style={{marginBottom:70}}>
                 <Text style={styles.addLocationTxt}>Edit Location</Text>
                
                   <>
                <View style={styles.locationCard}>
                    <View style={styles.locationHeader}>
                         <Image source={primarylocation} style={styles.location}/>
                         <Text style={styles.locationTxt}>My Location</Text>
                     </View>
                     <View style={styles.locationBody}>
                     <FloatingInput 
                     placeholder_text="Assets Location"
                value={values.location}
                 onChange={(e)=>{setFieldValue('location',e)}}
                 onChangeText={handleChange('location')}
								 error={touched.location && errors.location}
                                // inputstyle={styles.inputStyle}
							/>

<FloatingInput
                     placeholder_text="Pin Code"
										maxLength={6}
										value={values.pincode}
										keyboard_type={
											Platform.OS === 'ios' ? 'number-pad' : 'numeric'
										}
                    onChange={(e)=>{setFieldValue('pincode',e)}}
                    // onChangeText={(data)=>{handleChange('pincode'); getCityDropdown(
                    //   data, setFieldValue,
                    //   'pincode',
                    // )}}
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
										error={touched.pincode && errors.pincode}
									/>


                <View>
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
											error={touched.city && errors.city}
											type="dropdown"
											containerStyle={{ marginBottom: 0 }}
											dropdowncallback={() => dropdownref.current.show()}
											rightIcon={
												<Image
													source={arrow_down}
													style={{ width: 12, height: 8.3 }}
												/> 
											}
                      leftIcon={<Image
                        source={values.city ? info : ''}
                        style={{ width: 12, height: 12, top:values.city ? -4: 10, marginLeft:40, position:'absolute' }}
                      />}
										/>
									</ModalDropdownComp>
								</View>
                                 
                  
             </View>
           
        <View style={{flex:1, marginTop:20}}>
        <Text style={styles.errorMsg}>{errorMsg}</Text>
        </View>
		<View style={{flex:1, marginTop:20}}>
        <Text style={styles.successMsg}>{successMsg}</Text>
        </View>
   </View>
                 </>
                 </ScrollView>
                 
                  <View>
                            
                                <ThemedButton
                                  title="Update & Proceed"
                                  onPress={handleSubmit}
                                  color={colorLightBlue}
                                  btnStyle={{letterSpacing:0}}
                                  ></ThemedButton>
                              
                            </View>

                   {/* </View> */}
             </View>
            
            
              )}
              </Formik>



               

       

		</View>
    
	);
};
export default EditLocation;
