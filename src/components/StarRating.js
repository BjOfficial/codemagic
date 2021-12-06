import React, { useState, useRef } from 'react';
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Animated,
} from 'react-native';
import {
  emptystar,
  star1,
  star2,
  star3,
  star4,
  star5,
} from '@constants/Images';
import { colorDropText } from '@constants/Colors';

let starImages = [star1, star2, star3, star4, star5];
let starText = ['Awful', 'Disappointed', 'Average', 'Happy', 'Awesome'];
const StarRating = (props) => {
  let arrayList = [1, 2, 3, 4, 5];
  const [rateindex, setRateIndex] = useState(0);
  const translation = useRef(new Animated.Value(0)).current;

  const saveIndex = (index) => {
    translation.setValue(0);
    setRateIndex(index + 1);
    Animated.timing(translation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    props.sendRatingsValue(index+1);
  };
  let starStyle = {
    position: 'absolute',
    left: translation.interpolate({
      inputRange: [0, 1],
      outputRange: [-152, 152],
    }),
    opacity: translation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    zIndex: -1,
  };
  let starStyle1 = {
    position: 'absolute',
    left: translation.interpolate({
      inputRange: [0, 1],
      outputRange: [-152, 152 - 38],
    }),
    opacity: translation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, 1],
    }),
    zIndex: -1,
  };
  return (
    <View style={styles.container}>
      <View style={styles.partition}>
        {arrayList &&
					arrayList.map((obj, index) => {
					  let checkcurrentImage = index + 1 <= rateindex ? true : false,
					    currentImage = checkcurrentImage ? starImages[index] : emptystar;
							
					  return (
					    <TouchableOpacity onPress={() => saveIndex(index)}>
					      <ImageBackground
					        source={currentImage}
					        style={[styles.imageStyle]}
					        resizeMode="contain"
					      />
					    </TouchableOpacity>
					  );
					})}
        {rateindex < 4 && (
          <Animated.View // Special animatable View
            style={starStyle1}>
            <ImageBackground
              source={emptystar}
              resizeMode="contain"
              style={styles.imageStyle}
            />
          </Animated.View>
        )}
        {rateindex < 5 && (
          <Animated.View // Special animatable View
            style={starStyle}>
            <ImageBackground
              source={emptystar}
              resizeMode="contain"
              style={styles.imageStyle}
            />
          </Animated.View>
        )}
      </View>
      <View style={{ flex: 0.28 }}>
        <Text style={styles.ratetext}>{starText[rateindex - 1]}</Text>
      </View>
    </View>
  );
};
export default StarRating;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageStyle: {
    width: 30,
    height: 30,
    marginRight: 8,
    marginBottom: 12,
  },
  partition: {
    flex: 0.72,
    flexDirection: 'row',
  },
  ratetext:{
    color:colorDropText,
    lineHeight: 22,
    fontFamily: 'Rubik-Regular',
    textAlign:'center'
  }
});
