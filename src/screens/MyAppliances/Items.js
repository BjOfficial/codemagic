import React from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';

export default function Items({ item }) {
  return (
    <View
      style={[
        styles.container,
        {
          height: Dimensions.get('screen').height / 6,
          width: Dimensions.get('window').width * 0.9,
        },
      ]}>
      <Image
        source={item.img}
        style={[
          styles.image,
          {
            height: Dimensions.get('screen').height / 1.6,
            width: Dimensions.get('window').width * 1,
            resizeMode: 'contain',
            borderRadius: 60,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // flex: 0.5,
    justifyContent: 'center',
  },
});
