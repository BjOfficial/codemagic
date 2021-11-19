import { StyleSheet, Platform } from 'react-native';
import {
	colorWhite,
	 colorSuccess, 
} from '@constants/Colors'; 
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colorWhite,
		padding: 20,
		paddingTop: Platform.OS == 'ios' ? 50 : 20,
	},
    uploadedView: {
		padding: 10,
		paddingHorizontal: 20,
        marginTop:20
		
	},
    locationDetailsCard:{
        marginTop:30,
        width:'46%'
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
    location:{
        width:13,
        height:16,
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
        fontFamily: "Rubik-Regular",
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
      },
      edit:{
        width:17,
        height:17,
      },
      locationDetailsTxt : {
        fontFamily: "Rubik-Medium",
        color:'#1D7BC3'
     },
     eyeIcon: {
		width: 20,
		height: 20,
	},
    locationDetails:{
        color:'#393939',fontFamily: "Rubik-Medium",
    },
    addAnotherLocation : {
        color:'#393939',
        fontFamily: "Rubik-Regular",
        alignItems:'center',
        textDecorationLine: 'underline',
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
});
export default styles;
