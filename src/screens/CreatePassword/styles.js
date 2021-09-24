import { StyleSheet, Platform } from 'react-native';
import { colorWhite ,colorAsh,colorplaceholder,colorBlack} from '@constants/Colors';
import { font10, font12, font14, font20, font25,font16 } from '@constants/Fonts';
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
    header:{
        fontFamily:'Rubik-Medium',
        fontSize:font16,
        color:colorBlack,
        textAlign:'center',
        paddingBottom:10
      },
      glitterStar:{
        width:100,
        height:90
    },
    glitterView:{
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical:18
    },
    close_icon:{
        width:20,
        height:20,
        
      },
      closeView:{
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
      },
    
})
export default styles;
