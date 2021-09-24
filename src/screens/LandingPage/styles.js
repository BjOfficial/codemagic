import { StyleSheet, Platform } from 'react-native';
import { colorWhite } from '@constants/Colors';
import { font12, font14, font25 } from '@constants/Fonts';
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    landing_seperate: {
        flex: 1,
        flexDirection:'column',
        justifyContent:'space-between'
    },
    loginButton: {
        // flex: 0.56,
        paddingTop: Platform.OS == 'ios' ? 60 : 30,
        padding: 20
    },
    welcomeView: {
        // flex: 0.44,
        backgroundColor: 'rgba(19, 31, 47, 0.7)',
        borderTopRightRadius: 100
    },
    welcomeBox: {
        marginVertical: 12,
        padding: 10
    },
    welcomeText: {
        color: colorWhite,
        fontSize: font25,
        fontFamily: 'Rubik-Medium'
    },
    welcomePara: {
        color: colorWhite,
        fontFamily: 'Rubik-Regular',
        lineHeight: 22,
        fontSize: font12,
        marginVertical: 12,
        paddingBottom: 8
    },
    inviteText: {
        color: colorWhite,
        textAlign: 'center',
        fontFamily: 'Rubik-Regular',
        fontSize: font14,
        marginVertical: Platform.OS=='ios'?15:12,
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: colorWhite
        
    }
})
export default styles;