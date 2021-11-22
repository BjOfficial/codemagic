import {
	colorWhite,
	colorTabs,
	colorLightBlue,
	colorplaceholder,
	colorDropText,
	colorBrown,
	colorBlack,
	colorSuccess
} from '@constants/Colors';
import { font12, font13, font14 } from '@constants/Fonts';
import { StyleSheet, Dimensions } from 'react-native';
let width = Dimensions.get('window').width;
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colorWhite,
		// padding: 10,
	},
	productImg: {
		width: width - 60,
		height: 200,
		resizeMode: 'center',
		backgroundColor: 'transparent',
	},
	productSection: {
		flexDirection: 'row',
		justifyContent: 'center',
		paddingTop: 20,
	},
	tabSection: {
		backgroundColor: colorTabs,
		padding: 6,
		paddingHorizontal: 20,
		flexDirection: 'row',
		alignItems: 'center',
	},
	btnText: {
		textAlign: 'center',
		fontSize: font12,
		fontFamily: 'Rubik-Regular',
		color: colorBlack,
	},
	activeBtn: {
		// backgroundColor:colorLightBlue,
		// padding:15,
		// borderRadius:8
	},
	inactiveBtn: {
		backgroundColor: 'transparent',
		padding: 15,
		borderRadius: 8,
		fontFamily: 'Rubik-Regular',
	},
	activeText: {
		color: colorWhite,
		fontSize: font13,
		textAlign: 'center',
		fontFamily: 'Rubik-Regular',
	},
	contentDisplay: {
		flexDirection: 'row',
		alignItems: 'center',
		// borderWidth:1,
		borderBottomWidth: 0.2,
		// padding:15
		paddingVertical: 17,
		borderColor: colorDropText,
	},
	productImage: {
		width: 120,
		height: 120,
		resizeMode: 'contain',
		backgroundColor: 'transparent',
	    marginRight:5,
		overflow:'hidden',
		borderRadius: 8,
	},
	tabcontentContainer: {
		padding: 15,
	},
	detailsLabel: {
		color: colorplaceholder,
		paddingLeft: 18,
		fontSize: font13,
		fontFamily: 'Rubik-Regular',
	},
	labelstyle: {
		fontSize: font13,
		fontFamily: 'Rubik-Medium',
		color: colorDropText,
		paddingVertical: 10,
	},
	tabContainer: {
		shadowColor: colorplaceholder,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.4,
		shadowRadius: 7,
		elevation: 20,
		paddingVertical: 18,
		backgroundColor: colorWhite,
		position: 'relative',
	},
	detailsvalue: {
		fontSize: font13,
		fontFamily: 'Rubik-Medium',
		textAlign: 'right',
		color: colorDropText,
	},
	reminderBtnn: {
		backgroundColor: colorLightBlue,
		flexDirection: 'row',
		alignItems: 'center',
		borderRadius: 30,
		padding: 12,
		justifyContent: 'center',
	},
	reminderIcon: {
		width: 20,
		height: 20,
	},
	reminderText: {
		color: colorWhite,
		fontSize: font13,
		fontFamily: 'Rubik-Medium',
		marginLeft: 10,
	},
	reminderBtnView: {
		width: '60%',
		marginLeft: '20%',
		marginVertical: 30,
		paddingBottom: 70,
	},
	bottomFixed: {
		backgroundColor: colorWhite,
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		padding: 20,
		paddingVertical: 30,
		shadowColor: colorplaceholder,
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.4,
		shadowRadius: 7,
		elevation: 24,
	},
	serviceContent: {
		paddingVertical: 15,
		flexDirection: 'row',
	},
	serviceLabel: {
		color: colorplaceholder,
	},
	uploadedImg: {
		width: 45,
		height: 45,
		resizeMode: "center",
		borderRadius: 13,
		// position: "relative",
		
	},
	uploadedImgService: {
		width: 40,
		height: 40,
		borderRadius: 8,
	},
	labelDisplay: {
		flexDirection: 'column',
		justifyContent: 'center',
	},
	labelDisplayService: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
	},
	addtionalLabel: {
		textAlign: 'right',
		color: colorLightBlue,
		fontSize: font12,
		fontFamily: 'Rubik-Medium',
		// marginTop:3
	},
	warningView: {
		backgroundColor: colorBrown,
		borderRadius: 8,
		flexDirection: 'row',
		alignItems: 'center',
		padding: 10,
		justifyContent: 'center',
	},
	warningImg: {
		width: 20,
		height: 15,
	},
	viewalertBtn: {
		backgroundColor: colorWhite,
		borderRadius: 30,
		padding: 5,
		paddingHorizontal: 10,
	},
	viewalertlabel: {
		fontSize: font12,
		color: colorBrown,
		fontFamily: 'Rubik-Regular',
	},
	warrantytext: {
		color: colorWhite,
		fontFamily: 'Rubik-Regular',
		fontSize: font13,
	},
	uploadedView: {
		padding: 10,
		paddingHorizontal: 20,
		
	},
	uploadedLable: {
		fontSize: font14,
		fontFamily: 'Rubik-Medium',
		color: colorBlack,
		marginBottom: 20,
	},
	uploadedLayer: {
		flexDirection: 'row',
		paddingVertical: 12,
	},
	uploadedImgview: {
		width: 150,
		marginRight: 10,
		borderRadius: 15,
	},
	starIcon: {
		width: 20,
		height: 20,
		marginLeft: 5,
	},
	servicecontentDisplay: {
		flexDirection: 'row',
		alignItems: 'center',
	},
	remarkStyle: {
		color: colorLightBlue,
		fontSize: font12,
		fontFamily: 'Rubik-Medium',
	},
	remarkIcon: {
		width: 7,
		height: 10,
		marginLeft: 5,
	},
	dateDisplay: {
		color: colorLightBlue,
		fontFamily: 'Rubik-Regular',
		fontSize: font12,
		marginTop: 10,
		marginLeft: 10,
	},
	remarkDesc: {
		fontSize: font12,
		color: colorplaceholder,
		lineHeight: 21,
		fontFamily: 'Rubik-Medium',
		paddingVertical: 10,
	},
	overlay: {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: '#000000',
		opacity: 0.7, borderRadius:13,
		justifyContent:'center',
		alignItems:'center'
	  },
	  overlayNon : {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		backgroundColor: '#000000',
		opacity: 0.15, borderRadius:13
	  },
	  overTop : {
		  position:'relative',
		  marginLeft:5,
		  marginRight:5, 
		  borderRadius:20
	  },
	  overlayBottom : {
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
		// backgroundColor: '#000000',
		opacity: 0.06, borderRadius:20,
		paddingLeft:10
	  },
	  applianceOptImg:{
		  width:15,
		  height:15
	  },
	  listOption:{
		  marginBottom:20,
		  flexDirection :'row',
		  
	  },
	  optnTxt : {
		  color:'#000000',
		fontFamily: 'Rubik-Regular',
		marginLeft:15,
		fontSize:13
	  },
	  moveHeader:{
		  color:'#000000',
		  fontFamily: 'Rubik-Medium',

	  },
	  inputStyle: {
		alignSelf: 'center',
		height: Dimensions.get('screen').height * 0.055,
		borderWidth: 0.5,
		borderRadius: 30, 
		paddingLeft: 20,  
	},
	label: {
		fontFamily: 'Rubik-Medium',
		fontSize: font13,
		margin: 15,
		color: colorBlack,
		marginLeft:0
	},
	yellowBox : {
		backgroundColor:'#FFF9F0',
		borderRadius:15,
		flexDirection:'row',
		justifyContent:'space-between',
		padding:20,
		marginBottom:20
	},
	locaTxt:{
      color:'#393939',
	  fontFamily: 'Rubik-Regular',
	  fontSize:13

	},
	moveTxt : {
     color:'#1D7BC3',
	 fontFamily: 'Rubik-Medium',
	 marginTop:8,
	 fontSize:13
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
	glitterView: {
		justifyContent: 'center',
		alignItems: 'center', 
	},
    succesAdded :{
        fontFamily: "Rubik-Medium",
        color:'#393939',
        fontSize:16,
        marginTop:20,
		marginBottom:10
    },
    asstes :{
       color:'#393939',
       fontFamily: "Rubik-Regular",
       fontSize:14,
       marginTop:8,
	   alignSelf:'center'
    },
	restores:{
		color:'#747474',
		fontFamily: "Rubik-Regular",
		fontSize:12,
		marginTop:8

	},
	btnDefault : {
		width:'45%', borderWidth:1,paddingTop:3,paddingBottom:3, borderColor:'#707070', borderRadius:25
	},
	archiveTxt : {
		color:'#000000',
        fontFamily: "Rubik-Medium",
		marginTop:15

	}
});
export default styles;
