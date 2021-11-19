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
import { arrow_down, white_arrow, locationGreen
	 } from "@constants/Images";
import { font12, font14 } from "@constants/Fonts";  
import { useNavigation } from "@react-navigation/native"; 
import styles from './styles';
import { EditProfileNav,forgotpasswordNav } from "@navigation/NavigationConstant";
import APIKit from '@utils/APIKit';
import { constants } from '@utils/config'; 
import AsyncStorage from "@react-native-async-storage/async-storage";

const MyProfile = () => {
  const navigation = useNavigation();


	  const [passwordStatus, setPasswordStatus] = useState(true); 
    const [loading, setloading] = useState(false);
	  const [citydropdown, setCityDropdown] = useState(null);
    const dropdownref = useRef(null);
    const [profileDetails, setProfileDetails] = useState();
    const [locationList, setLocationList] = useState([]);

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

   
  const getProfileDetails = async() => { 
    let uid = await AsyncStorage.getItem('loginToken');
       let ApiInstance = await new APIKit().init(uid);
         let awaitresp = await ApiInstance.get(constants.viewProfileDetails);
          if (awaitresp.status == 1) {
              setProfileDetails(awaitresp.data.data);
             
           
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
               setErrorMsg('');
             
           } else {
             setErrorMsg(awaitresp.err_msg);
           }
          
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
                  My Profile
                </Text>
                </View>
                <TouchableOpacity onPress={()=>navigation.navigate(EditProfileNav)} style={{backgroundColor:'#145485', color:'#fff', width:'22%', alignItems:'center', paddingTop:6, paddingBottom:6, borderRadius:25}}>
                    <Text style={{ color:'#fff'}}>Edit</Text>
                </TouchableOpacity> 
              </View>
               
            </View>
          </View>
         </View>
         <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom:100}}>
         <View style={styles.uploadedView}>
         
						<View>
							<FloatingInput
								placeholder_text="Name"
								value={profileDetails?.name}
								 maxLength={30}
                 editable_text={false}
							/>
							<FloatingInput
								placeholder_text="Phone Number"
                value={profileDetails?.phone_number}
								 prefix="+91"
                 focus={true}
								editable_text={false}
							/>
							<FloatingInput
								placeholder_text="Email"
                value={profileDetails?.email}
								keyboard_type="email-address"
								editable_text={false}
							/>
							<FloatingInput
								placeholder_text="Password"
                value={profileDetails?.name}
								editable_text={false}
								secureTextEntry={passwordStatus == true ? true : false}
								rightIcon={
									<TouchableOpacity
                  onPress={()=>navigation.navigate(forgotpasswordNav)}>
										<Text style={{color:'#1D7BC3', fontFamily: 'Rubik-Regular', fontSize:12}}>Change</Text>
									</TouchableOpacity>
								}
							/>
							 
							<View
								style={{
									flexDirection: 'row',
									alignItems: 'center',
								}}>
								<View style={{ flex: 0.5 }}>
									<FloatingInput
										placeholder_text="Pin Code"
										maxLength={6}
										value={profileDetails?.pincode}
										
								editable_text={false}
									/>
								</View>

								<View style={{ flex: 0.5 }}>
									<ModalDropdownComp
										 editable_text={false}
                     disabled
										>
										<FloatingInput
											placeholder_text="City"
                      value={profileDetails?.city}
										 editable_text={false}
											containerStyle={{ marginBottom: 0 }}
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

                         <View style={{flexDirection:'row', justifyContent:'space-between', flexShrink:2, flexWrap:'wrap'}}>
                         {locationList && locationList.map((item, index) => {
                           return(
                            <View style={styles.locationDetailsCard}>
                     <View style={styles.locationDetailsHeader}>
                         <Image source={locationGreen} style={styles.location}/>
                         <Text style={styles.locationDetailsTxt}>My Location {index+1}</Text>
                          
                     </View>
                     <View style={styles.locationBody}>
                       <View>
                         <Text style={styles.locationDetails}>{item.name}</Text>  
                       </View>
                       <View style={{marginTop:10}}>
                         <Text style={styles.pincode}>{item.pincode}</Text>
                       </View>
                     </View>
                     </View>
                      )
                         })}

                     </View>


							 
                            </View>
						 
						</View>
					 
  </ScrollView>
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
  skip: {
    fontFamily: "Rubik-Regular",
    fontSize: font12,
    color: colorDropText,
    textAlign: "center",
    marginTop: Dimensions.get("screen").height * 0.25,
    textDecorationLine: "underline",
    paddingVertical: 15,
  },
  othersInputStyle: {
    alignSelf: "center",
    width: Dimensions.get("screen").height / 4.5,
    borderBottomWidth: 0.5,
    marginLeft: Dimensions.get("screen").width * 0.04,
    paddingLeft: 10,
    marginTop: -10,
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
export default MyProfile;
