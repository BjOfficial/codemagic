import React, { useEffect, useState, createContext, Fragment } from 'react';
import { View, ActivityIndicator } from 'react-native';
import SignOutStack from '@navigation/SignOutStack';
import SignInStack from '@navigation/SignInStack';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
export const AuthContext = createContext(null);
const AppNavigation = () => {
	const [token, setToken] = useState(null);
	const [loading, setLoading] = useState('hide');
	const [connected, setconnected] = useState(false);
	const [user, setUser] = useState(null);
	const [addVisible, setAddVisible] = useState(false);

	const callout_loading = () => {
		setTimeout(() => {
			setLoading(null);
		}, 500);
	};
	const retriveData = async () => {
		setLoading('show');
		const getToken = await AsyncStorage.getItem('loginToken');
		setToken(getToken);
		callout_loading();
	};
	useEffect(()=>{
		const unsubscribe = NetInfo.addEventListener(state => {
			// console.log("Connection type", state.type);
			console.log("Is connected?", state.isConnected);
			setconnected(()=>{
				return state.isConnected;
		  });
		});
		//   unsubscribe();
	},[])
	
	useEffect(() =>{
		(async () => {
		retriveData();
		const getUser = await AsyncStorage.getItem('userDetails');
		setUser(getUser);
		})();
	}, []);
	const successCallback = ({ user, token }) => {
		setUser(user);
		setLoading('show');
		setToken(token);
		setTimeout(() => {
			setLoading(null);
		}, 500);
	};
	const logoutCallback = () => {
		setLoading('show');
		setToken(null);
		setUser(null);
		setTimeout(() => {
			setLoading(null);
		}, 500);
	};
	return (
		<Fragment>
			{loading == 'show' && (
				<View
					style={{
						flex: 1,
						alignItems: 'center',
						justifyContent: 'center',
					}}>
					<ActivityIndicator color="#49a58d" size="large" />
				</View>
			)}
			{!token && !loading && (
				<AuthContext.Provider  value={{ successCallback: successCallback,networkStatus:connected }} >
					<SignOutStack />
				</AuthContext.Provider>
			)}
			{token && !loading && (
				<AuthContext.Provider
					value={{
						token: token,
						userDetails: user,
						logout_Call: logoutCallback,
						networkStatus:connected,
						addVisible:addVisible,
						setAddVisible:setAddVisible
					}}>
					<SignInStack />
				</AuthContext.Provider>
			)}
		</Fragment>
	);
};
export default AppNavigation;
