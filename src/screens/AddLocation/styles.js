import { StyleSheet, Platform } from 'react-native';
import { colorWhite,colorSuccess, colorBlack } from '@constants/Colors'; 
import * as RN from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorWhite,
    // padding: 20,
    padding:20,
    paddingTop: Platform.OS == 'ios' ? 50 : 20,
  },
  addLocationTxt : {
    fontFamily: 'Rubik-Medium',
    color:'#000000',
    fontSize:20,
  },
  wholeLocation : {
    marginTop : 20,
    flex:1,
  },
  location:{
    width:15,
    height:18,
    marginRight : 7
  },
  locationHeader : {
    flexDirection:'row',
    backgroundColor :'#F8F8F8',
    padding : 15,
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    borderColor:'#CBCBCB',
    borderBottomColor:'transparent',
    borderWidth:1,
  },
  locationTxt : {
    color : '#393939',
    fontFamily: 'Rubik-Regular',
    fontSize:13
  },
  locationBody:{
    borderColor:'#CBCBCB',
    borderTopColor:'transparent',
    borderWidth:1, 
    borderBottomLeftRadius:15,
    borderBottomRightRadius:15,
    padding : 15,
        
  },
  inputStyle: {
    color: '#000',
    fontSize:14
    // alignSelf: "center",
    // height: Dimensions.get("screen").height * 0.07,
    // borderWidth: 0.5,
    // borderRadius: 27,
    // marginLeft: Dimensions.get("screen").width * 0.03,
    // paddingLeft: 20,
  },
  label: {
    fontFamily: 'Rubik-Regular',
    fontSize: 13,
    // margin: 15,
    color: '#1D7BC3',
  },
  locationCard : {
    marginTop:30
  },
  addAnotherLocation : {
    color:'#393939',
    fontFamily: 'Rubik-Regular',
    alignItems:'center',
    textDecorationLine: 'underline',
  },
  locationDetailsHeader : {
    backgroundColor:'#F2FAFF',
    flexDirection:'row',
    padding:10,
    borderTopLeftRadius:15,
    borderTopRightRadius:15,
    position:'relative',
    borderColor:'#CBCBCB',
    borderBottomColor:'transparent',
    borderWidth:1,  
  },
  locationDetailsTxt : {
    fontFamily: 'Rubik-Medium',
    color:'#1D7BC3'
  },
  locationDetails:{
    color:'#393939',fontFamily: 'Rubik-Medium',
  },
  pincode:{
    color:'#747474',
    fontFamily: 'Rubik-Regular',marginTop:10
  },
  locationDetailsCard:{
    marginTop:30
  },
  edit:{
    width:17,
    height:17,
  },
  errorMsg: {
    fontSize: 12,
    color: 'red',
    fontFamily: 'Avenir-Roman',
    textAlign: 'center',
  },
  successMsg: {
    color: colorSuccess,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Avenir-Roman',
  },
  close_icon: {
    width: 20,
    height: 20,
  },
  closeView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  glitterStar: {
    width: 100,
    height: 90,
  },
  glitterView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
  },
  succesAdded :{
    fontFamily: 'Rubik-Medium',
    color:'#000000',
    fontSize:16,
    marginTop:30
  },
  asstes :{
    color:'#747474',
    fontFamily: 'Rubik-Regular',
    fontSize:14,
    marginTop:8
  },
  modalView: {
    backgroundColor: 'white',
    padding: 5,
    height: RN.Dimensions.get('screen').height * 0.45,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  textStyleModel:{
    color:colorBlack,
    fontSize:13,
    lineHeight:22,
    fontFamily:'Rubik-Regular',
    marginVertical:7,
    paddingLeft:10
  },
  dotIcon:{
    width:5,height:5,backgroundColor:colorBlack,borderRadius:10,position:'absolute',top:15
  }
	 
});
export default styles;
