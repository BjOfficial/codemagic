import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View, ImageBackground,ScrollView,Image, TouchableOpacity,TextInput,Platform } from 'react-native';
import {colorDropText, colorLightBlue, colorplaceholder, colorsearchbar, colorWhite} from '@constants/Colors';
import {search_icon} from '@constants/Images';
const SearchInput =(props)=>{
    console.log("search input",props);
    const[focused,setFocused]=useState(false);
    return(
        <View style={[styles.container,{borderColor:focused?colorLightBlue:'transparent',borderWidth:1,backgroundColor:focused?colorWhite:colorsearchbar}]}>
        {props.disableInput?<Text style={styles.placeholder_text}>{props.placeholder}</Text>:<TextInput ref={props.inputRef}
        onChangeText={(data)=>props.onChangeText(data)}

        value={props.value}
        placeholder={props.placeholder}
        placeholderTextColor="#747474"
        editable={props.editable_text}
        onFocus={()=>setFocused(true)}
        onBlur={()=>setFocused(false)}
      />}
      <TouchableOpacity onPress={() => props&&props.onPress()}>
        <Image source={props.icon} style={styles.searchicon} />
      </TouchableOpacity>
    </View>
  );
};
export default SearchInput;
const styles = StyleSheet.create({
  container: {
    padding: Platform.OS == "ios" ? 14 : 8,
    borderRadius: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 12,
    
  },
  searchicon: {
    width: 16,
    height: 16,
  },
  placeholder_text:{
    color:colorplaceholder
  }
});
