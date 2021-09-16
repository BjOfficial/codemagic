
import { StyleSheet, Platform, Dimensions } from 'react-native';


const styles = StyleSheet.create({
    container :{
        flex: 1,
        justifyContent: 'center',
        alignSelf: 'center'
    },
    image: {
        width: Dimensions.get('screen').width * .4,
        height: Dimensions.get('screen').height * 0.202
    }
});


export default styles;