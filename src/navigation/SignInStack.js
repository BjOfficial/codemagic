import React,{useEffect, useState} from 'react';
import {NavigationContainer,useRoute,useNavigation} from '@react-navigation/native';
import {Text,View, Image} from "react-native";
import {createStackNavigator} from '@react-navigation/stack';
import {
 buyplanNav,basicInfoNav,nutritionNav,profilemanagementNav,personalDetailsNav,MyplanNav,
 PrivacyPolicyNav,TermsofuseNav,gdprNav,ccpaNav,MarketingNav,AccessDataNav,DatasharingNav,
 DeleteDataNav,HelpsupportNav,contactNav,profmanagmentlistNav,AuthNav,homepageNav,
 blogdetailsNav,nutritionfinalformNav,skinfinalformNav,loadinganimationNav,
 movementfinalformNav,EditPreferencesSkinNav,workoutDetailsNav,editPreferencesMovementNav,DietTypeNav,EditPreferencesNutritionNav,MealDetailsNav,EditPreferencesMealplanNav
} from '@navigation/NavigationConstant';
import BuyPlan from '@screens/BuyPlan';
import BasicInfo from '@screens/BasicInfo';
import Nutrition from '@screens/Nutrition';
import NutritionFinalForm from '@screens/Nutrition/NutritionFinalForm';
import SkinFinalForm from '@screens/Skincare/SkinFinalForm';
import MovementFinalForm from '@screens/Movement/MovementFinalForm';
import ProfileManagement from '@screens/ProfileManagement';
import PersonalDetails from '@screens/PersonalDetails';
import MyPlan from '@screens/MyPlan'; 
import PrivacyPolicy from '@screens/PrivacyPolicy';
import TermsOfUse from '@screens/TermsOfUse';
import GDPR from '@screens/GDPR';
import CCPA from '@screens/CCPA';
import MarketingEmailSubscribe from '@screens/CCPA/MarketingEmailSubscribe';
import AccessData from '@screens/CCPA/AccessData';
import DeleteData from '@screens/CCPA/DeleteData';
import DataSharing from '@screens/CCPA/DataSharing';
import HelpSupport from '@screens/HelpSupport';
import ContactUs from '@screens/ContactUs';
import Movement from '@screens/Movement/WorkOut';
import Auth from '@screens/Auth';
import ProfileManagementList from '@screens/ProfileManagementList';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

import APIKit from '@utils/APIKit';
import {constants} from '@utils/config';
import Homepage from '@screens/Homepage';
import BlogsDetails from '@screens/HomeBlogs/BlogsDetails';
import NetInfo from "@react-native-community/netinfo";
import No_internet from '../assets/Images/No_internet.png';
import LoadingAnimation from '@components/LoadingAnimation';
import EditPreferencesSkin from '@screens/Skincare/EditPreferencesSkin';
import WorkoutDetails from '@screens/Movement/WorkoutDetails';
import EditPreferencesMovement from '@screens/Movement/EditPreferencesMovement';

import EditPreferencesNutrition from '@screens/Nutrition/EditPreferencesNutrition';
import MealDetails from '@screens/MealPlan/Mealdetails';
import EditPreferencesMealplan from '@screens/MealPlan/EditPreferencesMealplan';
import DietType from "@screens/Nutrition/DietType";
import AsyncStorage from '@react-native-async-storage/async-storage';
const Stack = createStackNavigator();

const SignInStack = (props) => {
  // const navigation = useNavigation();
  // React.useEffect(()=>{
    
  //     const unsubscribe = navigation.addListener('focus', () => {
  //       const route = useRoute();
  //     console.log("routename",route.name);
  //     console.log("route name");
  //       // do something
  //     });
    
  //     return unsubscribe;
  //   }, []);
  
  return (
    <NavigationContainer>
      <Stack.Navigator
      screenListeners={{
        state: (e) => {
          // Do something with the state
          
          let current_route=e.data.state.routes;
          console.log('state changed', current_route[0].name);
          AsyncStorage.setItem("currentRoute",current_route[0].name);
        },
      }}
        initialRouteName={buyplanNav}
        screenOptions={{headerShown: false}}>
       
        <Stack.Screen name={buyplanNav} component={BuyPlan} />
        <Stack.Screen name={basicInfoNav} component={BasicInfo} />
        <Stack.Screen name={nutritionNav} component={Nutrition} />
        <Stack.Screen name={profilemanagementNav} component={ProfileManagement} />
        <Stack.Screen name={personalDetailsNav} component={PersonalDetails} />
        <Stack.Screen name={MyplanNav} component={MyPlan} />
        <Stack.Screen name={PrivacyPolicyNav} component={PrivacyPolicy} />
        <Stack.Screen name={TermsofuseNav} component={TermsOfUse} />
        <Stack.Screen name={gdprNav} component={GDPR} />
        <Stack.Screen name={ccpaNav} component={CCPA} />
        <Stack.Screen name={MarketingNav} component={MarketingEmailSubscribe} />
        <Stack.Screen name={AccessDataNav} component={AccessData} />
        <Stack.Screen name={DatasharingNav} component={DataSharing} />
        <Stack.Screen name={DeleteDataNav} component={DeleteData} />
        <Stack.Screen name={HelpsupportNav} component={HelpSupport} />
        <Stack.Screen name={contactNav} component={ContactUs} />
        <Stack.Screen name={profmanagmentlistNav} component={ProfileManagementList} />
        <Stack.Screen name={homepageNav} component={Homepage} options={{ headerShown: false }}/>
        <Stack.Screen name={blogdetailsNav} component={BlogsDetails} />
        <Stack.Screen name={nutritionfinalformNav} component={NutritionFinalForm} />
        <Stack.Screen name={skinfinalformNav} component={SkinFinalForm} />
        <Stack.Screen name={loadinganimationNav} component={LoadingAnimation} />
        <Stack.Screen name={movementfinalformNav} component={MovementFinalForm} />
        <Stack.Screen name={EditPreferencesSkinNav} component={EditPreferencesSkin} />
        <Stack.Screen name={workoutDetailsNav} component={WorkoutDetails} />
        <Stack.Screen name={editPreferencesMovementNav} component={EditPreferencesMovement} />
        <Stack.Screen name={EditPreferencesNutritionNav} component={EditPreferencesNutrition} />
        <Stack.Screen name={MealDetailsNav} component={MealDetails} />
        <Stack.Screen name={EditPreferencesMealplanNav} component={EditPreferencesMealplan} />
        <Stack.Screen name={DietTypeNav} component={DietType} />
        

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default SignInStack;
