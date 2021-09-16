import React,{useState,useEffect,useRef} from 'react';
import { StyleSheet, Text, View, ImageBackground,ScrollView, TouchableOpacity,Image, TouchableHighlight } from 'react-native';
import BackArrowComp from '@components/BackArrowComp';
import styles from './styles';
import FloatingInput from '@components/FloatingInput';
import ThemedButton from '@components/ThemedButton';
import {colorLightBlue,colorDropText} from '@constants/Colors';
import ModalDropdown from 'react-native-modal-dropdown';
import {eye_close,eye_open,check_in_active,check_active,arrow_down} from '@constants/Images';
import { font12,font14 } from '@constants/Fonts';
const CreateAccount = () =>{
    const city_dropdown=[{value:1,label:'Option 1'}, {value:2,label:'option 2'}, {value:3,label:'option 3'}, {value:4,label:'option 4'}, {value:5,label:'option 5'}]
const [inputval,setInput]=useState('');
const [city,setCity]=useState(null);
const [checkboxActive,setCheckboxActive]=useState(false);
const [passwordStatus,setPasswordStatus]=useState(false);
const [passwordConfirmStatus,setPasswordConfirmStatus]=useState(false);
const dropdownref=useRef(null);
const handleChange =(data)=>{
console.log("changed data",data);
setInput(data);
}
const onSelectCity=(data)=>{
// alert(data)
setCity(city_dropdown[data])
}
    return(
        <View style={styles.container}>
            <ScrollView>
            <BackArrowComp />
            <Text style={styles.headerText}>Good To Have You Here!</Text>
            <FloatingInput
                      placeholder_text="Name"
                      value={inputval}
                      onChangeText={handleChange}
                    />
                    <FloatingInput
                      placeholder_text="Phone Number"
                      value={inputval}
                      onChangeText={handleChange}
                    />
                     <FloatingInput
                      placeholder_text="Email"
                      addtionalPlaceholder="(optional)"
                      value={inputval}
                      onChangeText={handleChange}
                    />
                    <FloatingInput
                      placeholder_text="Password"
                      value={inputval}
                      onChangeText={handleChange}
                      secureTextEntry={passwordStatus==true?true:false}
                      rightIcon={<TouchableOpacity onPress={()=>setPasswordStatus(!passwordStatus)}><Image source={passwordStatus==true?eye_close:eye_open} style={styles.eyeIcon}/></TouchableOpacity>}
                    />
                    <FloatingInput
                      placeholder_text="Confirm Password"
                      secureTextEntry={true}
                      value={inputval}
                      onChangeText={handleChange}
                      secureTextEntry={passwordConfirmStatus==true?true:false}
                      rightIcon={<TouchableOpacity onPress={()=>setPasswordConfirmStatus(!passwordConfirmStatus)}><Image source={passwordConfirmStatus==true?eye_close:eye_open} style={styles.eyeIcon}/></TouchableOpacity>}
                    />
                     <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={{flex:0.5}}>
                        <FloatingInput
                      placeholder_text="Pin Code"
                      value={inputval}
                      containerStyle={{marginBottom:0}}
                    />
                        </View>
                        <View style={{flex:0.5}}>
                        {/* <FloatingInput
                      placeholder_text="Pin code"
                      value={inputval}
                      onChangeText={handleChange}
                      inputstyle={{marginBottom:0}}
                    /> */}
                        {/* <FloatingInput
                      placeholder_text="City"
                      value={inputval}
                      type="dropdown"
                      rightIcon
                      onChangeText={handleChange}
                    /> */}
                    <ModalDropdown onSelect={(data)=>onSelectCity(data)} loading={true} renderButtonText={()=><Text>asfdasf</Text>} ref={dropdownref} options={city_dropdown} isFullWidth renderRow={(props)=><Text style={{paddingVertical:8,paddingHorizontal:15,fontSize:font14,color:colorDropText,fontFamily:'Rubik-Regular'}}>{props.label}</Text>} dropdownStyle={{elevation:8,borderRadius:8}} renderSeparator={(obj)=>null}>
                    <FloatingInput
                      placeholder_text="City"
                      editable_text={false}
                      value={city&&city.label}
                      type="dropdown"
                      containerStyle={{marginBottom:0}}
                      dropdowncallback={()=>dropdownref.current.show()}
                      rightIcon={<Image source={arrow_down} style={{width:12,height:8.3}} />}
                    
                    
                    /></ModalDropdown>
                        </View>
                       
                    </View> 
                 <TouchableOpacity  onPress={()=>setCheckboxActive(!checkboxActive)} style={{flexDirection:'row',alignItems:'center',paddingTop:30}}>
                            <View style={{flex:0.1}}><Image source={checkboxActive==true?check_active:check_in_active} style={styles.checkboxSize}/></View>
                            <View style={{flex:0.9,paddingLeft:5}}><Text style={styles.acceptenceText}>By registering you agree to MyHomeAsset's Terms & Conditions and Privacy Policy.</Text></View>
                        </TouchableOpacity> 
                        <View style={{marginVertical:20,paddingTop:30}}><ThemedButton title="Create Account" color={colorLightBlue}></ThemedButton></View>
                        </ScrollView>
        </View>
    )
}
export default CreateAccount;