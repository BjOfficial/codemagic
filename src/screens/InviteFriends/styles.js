import { StyleSheet, Platform, Dimensions } from 'react-native';
import { colorAsh, colorBlack, colorDarkBlue, colorDarkGreen, colorDropText, colorLightBlue, colorLightGreen, colorLightskyBlue, colorLightWhite, colorplaceholder, colorWhite } from "@constants/Colors";
import { font10, font12, font13, font14, font16, font18 } from '@constants/Fonts';


const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'column',
        backgroundColor:colorLightBlue
        // paddingTop:Platform.OS=='ios'?50:20
    },
    firstSection:{
        backgroundColor:'transparent',
        flex:0.4
    },
    secondSection:{
        backgroundColor:colorWhite,
        flex:0.6,
        borderTopRightRadius:15,
        borderTopLeftRadius:15,
        padding:15
    },
    invitepara:{
        fontSize:font13,
        color:colorWhite,
        fontFamily:'Rubik-Medium',
        lineHeight:24,
       
    },
    knowtext:{
        fontSize:font13,
        color:colorWhite,
        opacity:0.5,
        textDecorationLine:'underline',
        paddingVertical:10
    },
    inviteImg:{
        width:150,
        height:130
    },
    smallIcons:{
        width:45,
        height:45,
        // marginRight:30,
    },
    icongroup:{
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        paddingRight:20
    },
    sharediconText:{
        color:colorplaceholder,
        fontSize:font12,
        fontFamily:'Rubik-Regular',
        marginTop:5
    },
    bottomBorder:{
        borderBottomColor:colorplaceholder,
        borderBottomWidth:0.6,
        opacity:0.4,
        marginVertical:20
    },
    phoneTitle:{
        fontFamily:'Rubik-Medium',
        fontSize:font18,
        opacity:1,
        color:colorDropText
    }
})
export default styles;