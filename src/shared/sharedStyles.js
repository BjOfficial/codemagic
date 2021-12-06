import { shadowColor } from '@constants/Colors';
import { Platform } from 'react-native';
import { StyleSheet } from 'react-native';

const sharedStyles = StyleSheet.create({
  noShadow: {
    elevation: 0,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 0,
  },
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: shadowColor,
        shadowOffset: {
          width: 2,
          height: 3,
        },
        shadowOpacity: 1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});

export default sharedStyles;
