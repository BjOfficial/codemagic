import StatusBar from "@components/StatusBar";
import moment from "moment";
import React,{useContext} from "react";
import * as RN from "react-native";
import AntDesign from 'react-native-vector-icons/AntDesign';
import style from './style';
import { colorAsh, colorBlack, colorDarkBlue, colorDarkGreen, colorLightBlue, colorLightGreen, colorLightskyBlue, colorLightWhite, colorWhite } from "@constants/Colors";
import { useNavigation, useRoute } from "@react-navigation/native";
import { invitefriendsNav } from "@navigation/NavigationConstant";
import {logout} from '@constants/Images';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '@navigation/AppNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Dashboard = () => {
    const navigation=useNavigation();
    let {logout_Call} = useContext(AuthContext);
    const date = moment(new Date()).format("LL");
    const logoutCall =()=>{
        auth()
  .signOut()
  .then(() => {
AsyncStorage.removeItem("loginToken");
logout_Call();
  });
    }
    return (
        <RN.View style={style.container}>
            <StatusBar />
            <RN.ScrollView showsVerticalScrollIndicator={false}>
                <RN.View style={style.navbar}>
                    <RN.View style={style.navbarRow}>
                        <RN.View style={{ flex: 1 }}>
                            <RN.Image source={require('../../assets/images/home/menu.png')} style={style.notificationIcon} />
                        </RN.View>
                        <RN.View style={{ flex: 0 }}>
                            <RN.TouchableOpacity onPress={()=>logoutCall()}>
                                <RN.Image source={logout} style={{width:25,height:22,margin:10}}/>
                                {/* <AntDesign name="calendar" color={colorWhite} size={22} style={{ margin: 20 }} /> */}
                            </RN.TouchableOpacity>
                        </RN.View>
                    </RN.View>
                    <RN.Text style={style.navbarName}>
                        {'Namaste Krish '}
                        <RN.Image source={require('../../assets/images/home/namaste.png')} style={style.namasteIcon} />
                    </RN.Text>
                    <RN.Text style={style.navbarCalendar}>
                        {date}
                    </RN.Text>
                </RN.View>
                <RN.View>
                    <RN.Text style={style.title}>
                        {'My Assets'}
                    </RN.Text>
                    <RN.TouchableOpacity>
                        <RN.View
                            style={style.card}>
                            <RN.ImageBackground source={require('../../assets/images/emptyStates/emptybg.png')} style={style.cardBackgroundImage} imageStyle={{ borderRadius: 20 }} >
                                <AntDesign name="pluscircle" color={colorLightBlue} size={30} style={style.plusCircleIcon} />
                                <RN.Text style={style.cardTitle}>
                                    {'Add Assets'}
                                </RN.Text>
                                <RN.Text style={style.cardText}>
                                    {'Manage your assests like an expert'}
                                </RN.Text>
                            </RN.ImageBackground>
                        </RN.View>
                    </RN.TouchableOpacity>
                    <RN.View>
                        <RN.Text style={style.title}>
                            {'My Documents'}
                        </RN.Text>
                        <RN.TouchableOpacity>
                            <RN.View
                                style={style.card}>
                                <RN.ImageBackground source={require('../../assets/images/emptyStates/emptybg.png')} style={style.cardBackgroundImage} imageStyle={{ borderRadius: 20 }} >
                                    <AntDesign name="pluscircle" color={colorLightBlue} size={30} style={style.plusCircleIcon} />
                                    <RN.Text style={style.cardTitle}>
                                        {'Add Document'}
                                    </RN.Text>
                                    <RN.Text style={style.cardText}>
                                        {'Be on Top of all renwals of documents'}
                                    </RN.Text>
                                    <RN.Text style={style.cardText}>
                                        {'and payments'}
                                    </RN.Text>
                                </RN.ImageBackground>
                            </RN.View>
                        </RN.TouchableOpacity>
                        <RN.View
                            style={style.inviteCard}>
                            <RN.View style={style.inviteCardRow}>
                                <RN.View style={{ flex: 1 }}>
                                    <RN.Image source={require('../../assets/images/home/inviteimg1.png')} style={style.inviteCardImage} />
                                </RN.View>
                                <RN.View style={{ flex: 1 }}>
                                    <RN.Text style={style.inviteCardTitle}>
                                        {'Invite your friends to MyHomeAssets'}
                                    </RN.Text>
                                    <RN.Text style={style.inviteCardText}>
                                        {'Invite contacts to download and use MyHomeAssets'}
                                    </RN.Text>
                                    <RN.TouchableOpacity style={style.inviteCardButton} onPress={()=>navigation.navigate(invitefriendsNav)}>
                                        <RN.Text style={style.inviteCardButtonText}>{'Invite Now'}</RN.Text>
                                    </RN.TouchableOpacity>
                                </RN.View>
                            </RN.View>
                        </RN.View>
                    </RN.View>
                </RN.View>
                <RN.View>
                    <RN.Text style={style.title}>
                        {'Do you know?'}
                    </RN.Text>
                    <RN.View style={{ marginBottom: 20}}>
                        <RN.ScrollView
                            showsHorizontalScrollIndicator={false}
                            horizontal={true}>
                            <RN.View>
                                <RN.ImageBackground source={require('../../assets/images/home/trustedlocal.png')} style={style.doYouKnowCardBackground}>
                                    <RN.View style={style.doYouKnowCardRow} >
                                        <RN.View style={{flex:1}}>
                                            <RN.Text style={style.doYouKnowCardTitle}>
                                                {'Recommended trusted local repair shops'}
                                            </RN.Text>
                                           
                                            <RN.Text style={style.doYouKnowcardText}>
                                                {'to your network and local community for improving local economy'}
                                            </RN.Text>
                                            <RN.TouchableOpacity style={style.doYouKnowCardButton}>
                                                <RN.Text style={style.doYouKnowCardButtonTitle}>{'Explore Now'}</RN.Text>
                                            </RN.TouchableOpacity>
                                        </RN.View>
                                        <RN.View style={{flex:1}}>
                                            </RN.View>
                                    </RN.View>
                                </RN.ImageBackground>
                            </RN.View>
                            <RN.View>
                                <RN.ImageBackground source={require('../../assets/images/home/delegate.png')} style={style.doYouKnowCardBackground}>
                                    <RN.View style={style.doYouKnowCardRow} >
                                        <RN.View style={{flex:1}}>
                                            <RN.Text style={style.doYouKnowCardTitle}>
                                            {'Delegate access to your family'}
                                            </RN.Text>
                                           
                                            <RN.Text style={style.doYouKnowcardText}>
                                                {'to update any detail of appliance and help you to maintain your assets / documents.'}
                                            </RN.Text>
                                            <RN.TouchableOpacity style={style.doYouKnowCardButton}>
                                                <RN.Text style={style.doYouKnowCardButtonTitle}>{'Explore Now'}</RN.Text>
                                            </RN.TouchableOpacity>
                                        </RN.View>
                                        <RN.View style={{flex:1}}>
                                            </RN.View>
                                    </RN.View>
                                </RN.ImageBackground>
                            </RN.View>
                            <RN.View>
                                <RN.ImageBackground source={require('../../assets/images/home/donate.png')} style={style.doYouKnowCardBackground}>
                                    <RN.View style={style.doYouKnowCardRow} >
                                        <RN.View style={{flex:1}}>
                                            <RN.Text style={style.doYouKnowCardTitle}>
                                            {'Donate your old appliances'}
                                            </RN.Text>
                                           
                                            <RN.Text style={style.doYouKnowcardText}>
                                                {'to any Skill india certified traning centers nearby for imporving the learning outcome of trainess.'}
                                            </RN.Text>
                                            <RN.TouchableOpacity style={style.doYouKnowCardButton}>
                                                <RN.Text style={style.doYouKnowCardButtonTitle}>{'Explore Now'}</RN.Text>
                                            </RN.TouchableOpacity>
                                        </RN.View>
                                        <RN.View style={{flex:1}}>
                                            </RN.View>
                                    </RN.View>
                                </RN.ImageBackground>
                            </RN.View>
                            <RN.View>
                                <RN.ImageBackground source={require('../../assets/images/home/trustedreviews.png')} style={style.doYouKnowCardBackground}>
                                    <RN.View style={style.doYouKnowCardRow} >
                                        <RN.View style={{flex:1}}>
                                            <RN.Text style={style.doYouKnowCardTitle}>
                                            {'Get trusted reviews from your network'}
                                            </RN.Text>
                                           
                                            <RN.Text style={style.doYouKnowcardText}>
                                                {'about the brand / model of appliance and also the rating of the retailers in your area.'}
                                            </RN.Text>
                                            <RN.TouchableOpacity style={style.doYouKnowCardButton}>
                                                <RN.Text style={style.doYouKnowCardButtonTitle}>{'Explore Now'}</RN.Text>
                                            </RN.TouchableOpacity>
                                        </RN.View>
                                        <RN.View style={{flex:1}}>
                                            </RN.View>
                                    </RN.View>
                                </RN.ImageBackground>
                            </RN.View>
                            <RN.View>
                                <RN.ImageBackground source={require('../../assets/images/home/setalerts.png')} style={style.doYouKnowCardBackground}>
                                    <RN.View style={style.doYouKnowCardRow} >
                                        <RN.View style={{flex:1}}>
                                            <RN.Text style={style.doYouKnowCardTitle}>
                                            {'Set alerts for trusted devices'}
                                            </RN.Text>
                                           
                                            <RN.Text style={style.doYouKnowcardText}>
                                            {'for birthdays of family members, anniversaries and other important dates under others in My Documents'} 
                                            </RN.Text>
                                            <RN.TouchableOpacity style={style.doYouKnowCardButton}>
                                                <RN.Text style={style.doYouKnowCardButtonTitle}>{'Explore Now'}</RN.Text>
                                            </RN.TouchableOpacity>
                                        </RN.View>
                                        <RN.View style={{flex:1}}>
                                            </RN.View>
                                    </RN.View>
                                </RN.ImageBackground>
                            </RN.View>
                        </RN.ScrollView>
                    </RN.View>
                </RN.View>
            </RN.ScrollView>
        </RN.View>
    );
}

export default Dashboard;