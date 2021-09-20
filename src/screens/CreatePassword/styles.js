import { StyleSheet, Platform } from 'react-native';
import { colorWhite ,colorAsh,colorplaceholder} from '@constants/Colors';
import { font10, font12, font14, font20, font25 } from '@constants/Fonts';
const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colorWhite,
        padding:20,
        paddingTop:Platform.OS=='ios'?50:20
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
        paddingVertical:10,
        lineHeight:24
    },
    eyeIcon:{
        width:18,
        height:18
    },
    
})
export default styles;