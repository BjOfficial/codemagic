import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal

} from 'react-native';
import { colorLightBlue} from '@constants/Colors';
const Loader = ()=>{
  return(
    <Modal
      animated
      animationType="fade"
      transparent={true}
      propagateSwipe={true}
      visible={true}>
      <View style={styles.overlay}>
        <ActivityIndicator color={colorLightBlue} size="large" />
      </View>
    </Modal>
		
  );
};
export default Loader;
const styles=StyleSheet.create({
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.7)',
    flex: 1,
    justifyContent: 'center',
  },
});