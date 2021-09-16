import { StyleSheet, Platform } from 'react-native';
import { colorWhite ,colorAsh} from '@constants/Colors';
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
        marginVertical:25
    },
    eyeIcon:{
        width:20,
        height:20
    },
    acceptenceText:{
        fontSize:font12,
        lineHeight:22,
        fontFamily:'Rubik-Regular',
        color:colorAsh
    },
    checkboxSize:{
        width:25,
        height:25
    }
})
export default styles;