import StatusBar from '@components/StatusBar';
import { colorWhite } from '@constants/Colors';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import * as RN from 'react-native';
import {
  settingsfaq,
  settingsPrivacy,
  settingsTerms,
  delegate_cs,
} from '@constants/Images';
import style from './styles';
import {
  ComingSoonNav,
  PrivacyPolicyNav,
  TermsConditionsNav,
} from '@navigation/NavigationConstant';
import HomeHeader from '@components/HomeHeader';
const Remainders = () => {
  const navigation = useNavigation();
  return (
    <RN.View style={{ flex: 1, backgroundColor: colorWhite }}>
      <StatusBar />
      <HomeHeader title="Settings" />
      <RN.View style={{ flex: 1, padding: 20, backgroundColor: '#FFFFFF' }}>
        <RN.TouchableOpacity
          onPress={() =>
            navigation.navigate(ComingSoonNav, {
              title: 'FAQ',
              icon: delegate_cs,
            })
          }
          style={{
            flexDirection: 'row',
            marginBottom: 15,
            alignItems: 'center',
          }}>
          <RN.View style={{ height: 25, width: 25 }}>
            <RN.Image
              source={settingsfaq}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
              }}
            />
          </RN.View>
          <RN.View style={{ paddingHorizontal: 10 }}>
            <RN.Text style={style.options}>FAQ</RN.Text>
          </RN.View>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          onPress={() => navigation.navigate(PrivacyPolicyNav)}
          style={{
            flexDirection: 'row',
            marginBottom: 15,
            alignItems: 'center',
          }}>
          <RN.View style={{ height: 25, width: 25 }}>
            <RN.Image
              source={settingsPrivacy}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
              }}
            />
          </RN.View>
          <RN.View style={{ paddingHorizontal: 10 }}>
            <RN.Text style={style.options}>Privacy Policy</RN.Text>
          </RN.View>
        </RN.TouchableOpacity>
        <RN.TouchableOpacity
          onPress={() => navigation.navigate(TermsConditionsNav)}
          style={{
            flexDirection: 'row',
            marginBottom: 15,
            alignItems: 'center',
          }}>
          <RN.View style={{ height: 25, width: 25 }}>
            <RN.Image
              source={settingsTerms}
              style={{
                flex: 1,
                width: '100%',
                height: '100%',
                resizeMode: 'contain',
              }}
            />
          </RN.View>
          <RN.View style={{ paddingHorizontal: 10 }}>
            <RN.Text style={style.options}>Terms & Conditions</RN.Text>
          </RN.View>
        </RN.TouchableOpacity>
        <RN.View
          style={{
            flex: 1,
            flexDirection: 'column-reverse',
          }}>
          <RN.View style={{ paddingVertical: 30 }}>
            <RN.View
              style={{
                backgroundColor: '#F6FCFF',
                padding: 20,
                borderRadius: 30,
              }}>
              <RN.Text style={style.version}>App version 1.0</RN.Text>
            </RN.View>
          </RN.View>
        </RN.View>
      </RN.View>
    </RN.View>
  );
};

export default Remainders;
