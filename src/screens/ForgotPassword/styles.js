import { StyleSheet, Platform } from 'react-native';
import {
  colorWhite,
  colorplaceholder,
  colorSuccess,
  colorBlack,
} from '@constants/Colors';
import { font14, font20 } from '@constants/Fonts';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorWhite,
    padding: 20,
    paddingTop: Platform.OS == 'ios' ? 50 : 20,
  },
  headerText: {
    fontSize: font20,
    fontFamily: 'Rubik-Medium',
    paddingTop: 25,
    color: colorBlack,
  },
  Invitepara: {
    fontSize: font14,
    fontFamily: 'Rubik-Regular',
    color: colorplaceholder,
    marginBottom: 20,
    paddingVertical: 10,
    lineHeight: 24,
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
});
export default styles;
