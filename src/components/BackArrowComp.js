import React from 'react';
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { back_icon } from '@constants/Images';
import {
  requestInviteNav,
  landingPageNav,
} from '@navigation/NavigationConstant';
const BackArrowComp = (props) => {
  const back_props = props?.navigation_direction;
  const navigation = useNavigation();
  const goBackFunction = () => {
    if (back_props == 'create_account') {
      navigation.navigate(requestInviteNav, {
        params: 'Already_Invite',
      });
    } else if (back_props == 'login') {
      navigation.navigate(landingPageNav);
    } else {
      navigation.goBack();
    }
  };
  return (
    <View>
					
      <TouchableOpacity onPress={() => goBackFunction()} style={{width: 20}}>
        <ImageBackground
          source={back_icon}
          style={styles.arrowImg}
          resizeMethod="resize"
          imageStyle={{
            resizeMode: 'contain',
          }}
        />
      </TouchableOpacity>
    </View>
  );
};
export default BackArrowComp;
const styles = StyleSheet.create({
  arrowImg: {
    width: 20,
    height: 20,
  },
});
