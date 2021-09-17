import { StyleSheet, Platform } from 'react-native';
import { colorWhite ,colorplaceholder, colorDropText} from '@constants/Colors';
import { font10, font12, font14, font16, font18, font20, font25 } from '@constants/Fonts';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colorWhite,
        padding:20,
        paddingTop:Platform.OS=='ios'?50:20
    },
    textinputStyles:{
        fontSize: font18,
        fontFamily:'Rubik-Bold',
        borderBottomWidth:1,
    },
    headerText:{
        fontSize:font20,
        fontFamily:'Rubik-Medium',
        paddingTop:25
        // marginVertical:25
    },
    Invitepara:{
        fontSize: font14,
        fontFamily:'Rubik-Regular',
        color:colorplaceholder,
        marginBottom:20,
        paddingVertical:20,
        lineHeight:24
    },
    mobilenoStyle:{
        color:colorplaceholder,
        fontFamily:'Rubik-Medium'
    },
    otpview:{
        width:'80%',
        marginLeft:'10%'
    },
    resendotp:{
        textAlign:'center',
        fontFamily:'Rubik-Regular',
        fontSize: font14,
        color:colorDropText,
        marginVertical:30
    }

})
export default styles;