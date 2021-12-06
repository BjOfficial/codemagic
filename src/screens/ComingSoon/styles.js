import { StyleSheet, Platform, StatusBar } from 'react-native';
import { colorDropText, colorplaceholder } from '@constants/Colors';
import { font16, font13 } from '@constants/Fonts';
const STATUSBAR_HEIGHT = StatusBar.currentHeight;
const APPBAR_HEIGHT = Platform.OS === 'ios' ? 44 : 56;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: colorWhite,
    // backgroundColor: colorLightBlue,
    paddingHorizontal: 20,
    paddingTop: Platform.OS == 'ios' ? 50 : 20,
  },
  centerImage: {
    width: 280,
    height: 260,
  },
  imageLayer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  title: {
    color: colorDropText,
    fontFamily: 'Rubik-Medium',
    fontSize: font16,
    lineHeight: 25,
  },
  content: {
    color: colorplaceholder,
    fontSize: font13,
    fontFamily: 'Rubik-Regular',
    lineHeight: 20,
    paddingVertical: 10,
  },
  statusBar: {
    height: STATUSBAR_HEIGHT,
  },
});
export default styles;
