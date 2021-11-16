import { StyleSheet, Platform } from 'react-native';
import {
	colorWhite,
	colorAsh,
	colorSuccess,
	colorBlack,
} from '@constants/Colors';
import { font12, font20, font16 } from '@constants/Fonts';
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colorWhite,
		padding: 20,
		paddingTop: Platform.OS == 'ios' ? 50 : 20,
	},
	headerText: {
		fontSize: font20,
		fontFamily: 'Rubik-Medium',
		marginVertical: 25,
		color: colorBlack,
	},
	eyeIcon: {
		width: 20,
		height: 20,
	},
	acceptenceText: {
		fontSize: font12,
		lineHeight: 22,
		fontFamily: 'Rubik-Regular',
		color: colorAsh,
	},
	hyperlinkText: {
		fontSize: font12,
		lineHeight: 22,
		fontFamily: 'Rubik-Regular',
		color: "blue",
	},
	checkboxSize: {
		width: 25,
		height: 25,
	},
	errMsg: {
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
	header: {
		fontFamily: 'Rubik-Medium',
		fontSize: font16,
		color: colorBlack,
		textAlign: 'center',
		paddingBottom: 10,
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
        // alignSelf: "center",
        // height: Dimensions.get("screen").height * 0.07,
        // borderWidth: 0.5,
        // borderRadius: 27,
        // marginLeft: Dimensions.get("screen").width * 0.03,
        // paddingLeft: 20,
      },
      edit:{
        width:17,
        height:17,
      },
      locationDetailsTxt : {
        fontFamily: "Rubik-Medium",
        color:'#1D7BC3'
     },
});
export default styles;
