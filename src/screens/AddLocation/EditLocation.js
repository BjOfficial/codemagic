import React, {useRef, useState,useEffect} from 'react';
import { Text, View, ImageBackground, ScrollView, Image, TouchableOpacity } from 'react-native';
import BackArrowComp from '@components/BackArrowComp';
import styles from './styles';
import { primarylocation } from '@constants/Images';
import FloatingInput from '@components/FloatingInput';
import ModalDropdown from 'react-native-modal-dropdown';
import {
  colorLightBlue,
  colorDropText,
  colorAsh,
  colorWhite,
} from '@constants/Colors';
import { font14 } from '@constants/Fonts';
import { arrow_down,info, add_img, edit, locationGreen, close_round,glitter, rupee } from '@constants/Images';
import { Formik } from 'formik';
import ModalDropdownComp from '@components/ModalDropdownComp';
import * as yup from 'yup';
import APIKit from '@utils/APIKit';
import ThemedButton from '@components/ThemedButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { constants } from '@utils/config'; 
import ModalComp from '@components/ModalComp';
import { useNavigation } from '@react-navigation/core';
import BottomSheetComp from '@components/BottomSheetComp';

const EditLocation = (props) => {
    
  const navigation = useNavigation();

  const formikRef = useRef(); 
  const [loading, setloading] = useState(false);

	const [citydropdown, setCityDropdown] = useState(null);
  const dropdownref = useRef(null);
	
	const [successMsg, setSuccessMsg] = useState('');
	const [errorMsg, setErrorMsg] = useState('');
  const [locationList, setLocationList] = useState([]);
  const [cardShow, setCardShow] = useState(false);
  const [disable, setDisable] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [bottomSheetVisible, setBottomSheetVisible] = useState(true);

  useEffect(()=>{
    getLocationList();
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
    console.log("dropdataa", citydropdown[data])
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
			setFieldValue('city', '');
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

  const changeFieldValue = (setFieldValue, key, value, touched, setTouched) => {
		setTouched({ ...touched, [key]: true });
		setFieldValue(key, value);
	};

  const locationSubmit = async(values, { resetForm }) => { 
		// setIsLoading(true);
	 
				let uid = await AsyncStorage.getItem('loginToken');
			 
					let payload = { name: values.location, city : values.city.label, pincode:values.pincode };
           let ApiInstance = await new APIKit().init(uid);
					let awaitresp = await ApiInstance.post(constants.addLocation, payload);
					console.log('location api respnse', awaitresp, payload);
					if (awaitresp.status == 1) {
						console.log('location response', awaitresp.data);
            resetForm(values);
            getLocationList();
            setCardShow(false);
            setDisable(true);
						 setErrorMsg('');
             setModalVisible(true);
             setTimeout(() => {
              setModalVisible(false);
               navigation.navigate('HomeStack');
            }, 3000)
						// setIsLoading(false);
					} else {
						setErrorMsg(awaitresp.err_msg);
					}
				 
      };

      const getLocationList = async() => { 
         let uid = await AsyncStorage.getItem('loginToken');
           console.log("uid", uid)
                let ApiInstance = await new APIKit().init(uid);
              let awaitresp = await ApiInstance.get(constants.listAddLocation);
              console.log('location list respnse', awaitresp);
              if (awaitresp.status == 1) {
                console.log('List location response', awaitresp.data.data);
                const respdata = awaitresp.data.data;
              //   response.map((item)=> { setFieldValue('location', item.name); setFieldValue('city', item.city.value);
              //   setFieldValue('pincode', item.pincode);
              // })
              
              let location=respdata.map((obj)=>obj.name);
              let city=respdata.map((obj)=>obj.city);
              let pincode=respdata.map((obj)=>obj.pincode); 

              // if(formikRef.current){
              //   formikRef.current.setFieldValue('location', location.toString());
              //   formikRef.current.setFieldValue('pincode', pincode.toString());
              //   formikRef.current.setFieldValue('city', city.toString());
              // }
               let location1 = location.toString();
              // if(pincode!=''){
              //    getCityDropdown(
              //     location1
                 
              //   )
              // }
                setLocationList(awaitresp.data.data);
                  setErrorMsg('');
                // setIsLoading(false);
              } else {
                setErrorMsg(awaitresp.err_msg);
              }
             
          };

          const showLocationCard = () =>{
             setCardShow(true); 
            //  if(formikRef.current){
            //   formikRef.current.setFieldValue('location', '');
            //   formikRef.current.setFieldValue('pincode', '');
            //   formikRef.current.setFieldValue('city', '');
            // }
          }
	
          const goBack = () => {
            setBottomSheetVisible(false);
            // navigation.goBack();
          };

  const dropdownServiceDataref = useRef(null);
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
            onSubmit={(values, action) => locationSubmit(values, action)}>
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
                         <Text style={styles.locationTxt}>My Location 1</Text>
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
                        style={{ width: 12, height: 12, top:values.city ? -4: 10, marginLeft:values.city ? 40:40, position:'absolute' }}
                      />}
										/>
									</ModalDropdownComp>
								</View>
                                 
                  
             </View>
           
        <View style={{flex:1, marginTop:20}}>
        <Text style={styles.errorMsg}>{errorMsg}</Text>
        </View>
   </View>
                 </>
                 </ScrollView>
                 {/* <View style={{position:'absolute', bottom:0, flex:1, width:'100%', backgroundColor:'#fff', paddingTop:10}}> */}
                 {/* <TouchableOpacity onPress={()=>showLocationCard()} disabled={disable} style={{alignItems:'center', marginBottom:30}}> 
                   <Text style={styles.addAnotherLocation}>+ Add another location</Text>
                 </TouchableOpacity> */}

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



              <ModalComp visible={modalVisible}>
				<View>
					<View style={styles.closeView}>
						<TouchableOpacity
							onPress={() => {
								setModalVisible(false); 
							}}>
							<Image source={close_round} style={styles.close_icon} />
						</TouchableOpacity>
					</View>
          <View style={styles.glitterView}>
						<Image style={styles.glitterStar} source={glitter} />

            <Text style={styles.succesAdded}>Location added successfully!</Text>
            <Text style={styles.asstes}>Taking you to assets dashboard in 3</Text>
					</View>

					 
				</View>
			</ModalComp>


       

		</View>
    
	);
};
export default EditLocation;
