import { StyleSheet} from 'react-native';
import {
  colorWhite,
  colorAsh,
  colorSuccess,
  colorBlack,
} from '@constants/Colors';
import { font12, font20, font16 } from '@constants/Fonts';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorWhite,
  },
  headerText: {
    fontSize: font20,
    fontFamily: 'Rubik-Medium',
    marginVertical: 25,
    color: colorBlack,
    paddingHorizontal:20
  },
  eyeIcon: {
    width: 20,
    height: 20,
  },
  acceptenceText: {
    fontSize: font12,
    lineHeight: 22,
    fontFamily: 'Rubik-Regular',
    color: colorAsh,
  },
  hyperlinkText: {
    fontSize: font12,
    lineHeight: 22,
    fontFamily: 'Rubik-Regular',
    color: 'blue',
  },
  checkboxSize: {
    width: 25,
    height: 25,
  },
  errMsg: {
    fontSize: 12,
    color: 'red',
    fontFamily: 'Avenir-Roman',
    textAlign: 'center',
  },
  successMsg: {
    color: colorSuccess,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'Avenir-Roman',
  },
  close_icon: {
    width: 20,
    height: 20,
  },
  closeView: {
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  glitterStar: {
    width: 100,
    height: 90,
  },
  glitterView: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 18,
  },
  header: {
    fontFamily: 'Rubik-Medium',
    fontSize: font16,
    color: colorBlack,
    textAlign: 'center',
    paddingBottom: 10,
  },
});
export default styles;
