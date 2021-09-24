import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View, ImageBackground,ScrollView,Image, TouchableOpacity,TextInput,Platform } from 'react-native';
import {colorDropText, colorplaceholder, colorsearchbar} from '@constants/Colors';
import {search_icon} from '@constants/Images';
const SearchInput =(props)=>{
    const[input,setInput]=useState('');
    return(
        <View style={styles.container}>
        <TextInput
        onChangeText={props.onChangeText}
        value={props.value}
        placeholder={props.placeholder}
        placeholderTextColor="#747474"
      />
      <TouchableOpacity onPress={() => props.onPress()}>
        <Image source={search_icon} style={styles.searchicon} />
      </TouchableOpacity>
    </View>
  );
};
export default SearchInput;
const styles = StyleSheet.create({
  container: {
    backgroundColor: colorsearchbar,
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
});
