import React from 'react';
import { StyleSheet, Text, View,Image, ImageBackground,TouchableOpacity } from 'react-native';
import { useNavigation,useRoute } from "@react-navigation/native";
import { back_icon } from '@constants/Images';
const BackArrowComp = () =>{
    const navigation=useNavigation();
    return(
        <View>
           <TouchableOpacity onPress={() => navigation.goBack()}><ImageBackground source={back_icon} style={styles.arrowImg} resizeMethod="resize" imageStyle={{
          resizeMode: 'contain',
        }} /></TouchableOpacity>
        </View>
    )
}
export default BackArrowComp;
const styles = StyleSheet.create({
    arrowImg:{
        width:20,height:20
    }
})