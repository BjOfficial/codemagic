import React from 'react';
import { View, StyleSheet, Animated, useWindowDimensions } from 'react-native';
import { colorLightBlue } from '@constants/Colors';

export default function Paginator({ data, scrollX }) {
  const { width } = useWindowDimensions();
  return (
    <View style={{ flexDirection: 'row' }}>
      {data.map((_, i) => {
        const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
        const dotWidth = scrollX.interpolate({
          inputRange,
          outputRange: [5, 5, 5],
          extrapolate: 'clamp',
        });
        const opacity = scrollX.interpolate({
          inputRange,
          outputRange: [0.1, 0.5, 0.1],
          extrapolate: 'clamp',
        });
        return (
          <Animated.View
            style={[styles.dot, { width: dotWidth, opacity }]}
            key={i.toString()}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  dot: {
    marginTop: 10,
    height: 6,
    borderRadius: 5,
    backgroundColor: colorLightBlue,
    marginHorizontal: 4,
    // alignSelf:"center"
  },
});
