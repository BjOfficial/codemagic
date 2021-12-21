import React, { useState, useEffect, useContext, useRef } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
  SafeAreaView,
	ScrollView,
	StatusBar,
} from 'react-native';
import styles from './styles';
import OTPTextView from 'react-native-otp-textinput';
import BackArrowComp from '@components/BackArrowComp';
import ThemedButton from '@components/ThemedButton';
import { colorLightBlue, colorWhite,colorBlack } from '@constants/Colors';
import ModalComp from '@components/ModalComp';
import { glitter,user_icon } from '@constants/Images';
import { useNavigation } from '@react-navigation/native';
import { createAccountNav } from '@navigation/NavigationConstant';
import auth from '@react-native-firebase/auth';
import Toast from 'react-native-simple-toast';
import { AuthContext } from '@navigation/AppNavigation';
import { constants } from '@utils/config';
import APIKit from '@utils/APIKit';
import Loader from '@components/Loader';
import BottomSheetComp from '@components/BottomSheetComp';
import moment from 'moment';
const Verification = (props) => {
	
	
  const navigation = useNavigation();
  const [timer, setTimer] = useState(60);
  const [otpvalue, setOtpvalue] = useState('');
  const [listVisible, setListVisible] = useState(false);
	const [inviteList, setInviteList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [credentails, setCredentials] = useState(null);
  const verification_id = props?.route?.params.verificationCode;
  const [loading, setLoading] = useState(false);
  const [verification_code, setVerificationCode] = useState(verification_id);
  const mobileNumber = props?.route?.params.mobileNumber;
  const {networkStatus} =useContext(AuthContext);
  const timerRef=useRef();
  useEffect(()=>{

    timerRef.current={
      timer:null,
      start:function(){
        const self=this;
        this.timer = setInterval(() => {
          setTimer((lastTimerCount) => {
            if (lastTimerCount <= 1) {
              self.stop();
              // clearInterval(timerRef.current.)?;
            }
            return lastTimerCount - 1;
          });
        }, 1000);
      },
      stop:function(){
        clearInterval(this.timer);
      }
    };
  },[]);
  useEffect(()=>{
    if(networkStatus==true&&timerRef.current){
      timerRef.current.start();
    }else{
      Toast.show('Check your internet connection.', Toast.LONG);
      timerRef.current.stop();
    }
  },[networkStatus]);
  const SetTime = () => {
    // if(networkStatus==true){
    timerRef.current.start();
    // }else{
    // alert("network not connected..")
    // }
    // let interval = setInterval(() => {
    // 	setTimer((lastTimerCount) => {
				
    // 		if (lastTimerCount <= 1) {
    // 			clearInterval(interval);
    // 		}
    // 		return lastTimerCount - 1;
    // 	});
    // }, 1000); //each count lasts for a second
    // //cleanup the interval on complete
    // return () => clearInterval(interval);
  };

  const resendotp = async () => {
    if (timer == 0) {
			
      try {
        const confirmation = await auth().signInWithPhoneNumber(
          `+91 ${mobileNumber}`
        );
        console.log('resend confirmation', confirmation);
        setVerificationCode(confirmation._verificationId);
        setTimer(60);
        setTimeout(() => {
          SetTime();
        });
      } catch (error) {
        console.log('error', error);
        if (error.code === 'auth/network-request-failed') {
          Toast.show('Check your internet connection.', Toast.LONG);
        }
        if (error.code === 'auth/invalid-verification-code') {
          Toast.show('Invalid OTP', Toast.LONG);
        }
        if (error.code === 'auth/session-expired') {
          Toast.show('Verfication code expired', Toast.LONG);
        }
      }

			
    }
  };
  useEffect(() => {
    // SetTime();
  }, []);

  const verifyOTP = async () => {
    if (otpvalue.length < 6) {
      Alert.alert('Please fill the otp field');
    } else {
      console.log('verification code', verification_id);
      setLoading(true);
      try {
        let credentials = await auth.PhoneAuthProvider.credential(
          verification_code,
          otpvalue
        );
        console.log('credentials', credentials);
        let success = await auth().signInWithCredential(credentials);
        if (success) {
          setCredentials(credentials);
        }
        console.log('success', success);
        if (success) {
          setLoading(false);
          modalVisible();
        }
      } catch (error) {
        console.log('err', error);
        if (error.code === 'auth/network-request-failed') {
          setLoading(false);
          Toast.show('Check your internet connection.', Toast.LONG);
        }
        if (error.code === 'auth/invalid-verification-code') {
          setLoading(false);
          Toast.show('Invalid OTP', Toast.LONG);
        }
        if (error.code === 'auth/session-expired') {
          setLoading(false);
          Toast.show('Verfication code expired', Toast.LONG);
        }
        setLoading(false);
      }
    }
  };
  
  const InviteList = async () => {
		let ApiInstance = await new APIKit().init();
		let awaitresp = await ApiInstance.get(
			constants.listAllInvites + '?phone_number=' + mobileNumber
		);
		if (awaitresp.status === 1) {
			setInviteList(awaitresp.data.data);
		} else {
			Alert.alert(awaitresp.err_msg);
		}
	};
  const selectedList =(data,index)=>{
		let inviteList1=[...inviteList];
		inviteList1&&inviteList1.length>0&&inviteList1.map((obj)=>obj.checked=false);
		inviteList1[index].checked=true;
		setInviteList(inviteList1);
		setTimeout(() => {
			setVisible(false);
			navigation.navigate(createAccountNav, {
				mobileNumber: mobileNumber,
				credentails: credentails,
				inviteData:data._id
			});
			setListVisible(false);
		}, 1500);
	}
  const modalVisible = () => {
    setVisible(true);
    // setTimeout(() => {
    //   setVisible(false);
    //   navigation.navigate(createAccountNav, {
    //     mobileNumber: mobileNumber,
    //     credentails: credentails,
    //   });
    // }, 2000);
    setTimeout(() => {
			setVisible(false);
			InviteList();
				setListVisible(true);

		}, 2000);
  };
  return (
    <View style={styles.container}>
			<SafeAreaView style={{ backgroundColor: colorWhite }} />
			<StatusBar backgroundColor={colorWhite} barStyle="dark-content" />
			<View style={{ padding: 20 }}>
        <BackArrowComp />
        <Text style={styles.headerText}>OTP Sent!</Text>
        <ScrollView keyboardShouldPersistTaps="handled" bounces={false}>
        <Text style={styles.Invitepara}>
					We have sent OTP to your phone number{' '}
          <Text style={styles.mobilenoStyle}>{mobileNumber}</Text>
        </Text>

        <View style={styles.otpview}>
          <OTPTextView
            // ref={(e) => (this.input1 = e)}
            // autoFocusOnLoad={false}
            containerStyle={styles.textInputContainer}
            tintColor="#ccc"
            textInputStyle={styles.textinputStyles}
            handleTextChange={(data) => setOtpvalue(data)}
            inputCount={6}
            keyboard_type={Platform.OS === 'ios' ? 'number-pad' : 'numeric'}
          />
        </View>
        <Text style={styles.timerdisplay}>00:{timer === 0 ? '00' : timer}</Text>

        {timer == 0 ? (
          <TouchableOpacity onPress={() => (timer == 0 ? resendotp() : null)}>
            <Text style={[styles.resendotp, { opacity: timer == 0 ? 1 : 0.5 }]}>
							Resend again?
            </Text>
          </TouchableOpacity>
        ) : (
          <Text style={[styles.resendotp, { opacity: timer == 0 ? 1 : 0.5 }]}>
						Resend again?
          </Text>
        )}
        <View style={{ marginVertical: 20, paddingTop: 30 }}>
          {loading ? (
            <Loader/>
          // <ActivityIndicator color={colorLightBlue} size="large" />
          ) : (
            <ThemedButton
              title="Verify"
              onPress={() => verifyOTP()}
              color={colorLightBlue}></ThemedButton>
          )}
        </View>
        <ModalComp visible={visible}>
          <View>
            <View style={styles.glitterView}>
              <Image style={styles.glitterStar} source={glitter} />
            </View>
            <Text style={styles.header}>OTP verified successfully</Text>
          </View>
        </ModalComp>
        <BottomSheetComp
					// panelStyle={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
					sheetVisible={listVisible}
					// closePopup={() => setListVisible(false)}
					>
					{/* <RN.View style={styles.centeredView}> */}
					<View style={{ paddingVertical: 20, paddingHorizontal: 20 }}>
						<Text style={styles.headerView}>
							You have been invited my multiple users. Who's network would you
							like to join?
						</Text>
						<ScrollView contentContainerStyle={styles.mainWrapper}>
							{inviteList &&
								inviteList.length > 0 &&
								inviteList.map((item,index) => {
									return (
										<TouchableOpacity style={[styles.mainView,{borderColor:item.checked==true?colorLightBlue:'#ccc'}]} onPress={()=>selectedList(item,index)}>
												<View>
												<Image
														source={user_icon}
														style={{ width: 40, height: 40 }}
													/>
												</View>
												<View style={styles.contentSide}>
													<Text style={styles.textStyle} >{item.referrer_name}</Text>
													{/* <Text style={styles.textStyle} >kjfdjfklslflslf kjkfjksjf</Text> */}
													<Text style={styles.dateStyle}>{moment(new Date(item.updated_at)).format(
													'DD/MM/YYYY'
											  )}</Text>
												</View>
											</TouchableOpacity>


									);
								})}
						</ScrollView>
						{inviteList&&inviteList.length==0&&
						<Text style={{textAlign:'center',fontSize:14,color:colorBlack}}>No Lists Found</Text>
						}
					</View>

					{/* </RN.View> */}
				</BottomSheetComp>
        </ScrollView>
			</View>
		</View>
  );
};
export default Verification;
