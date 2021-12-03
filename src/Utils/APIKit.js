import axios from 'axios';
import { config } from './config';
import Errors from './Errors';
import NetInfo from '@react-native-community/netinfo';
import Toast from 'react-native-simple-toast';
let handleerrors = (err) => {
	let error_response = err.response || {},
		error_data = error_response.data ? error_response.data : null;
	//if u want to add some toast here for errors you can add it here......
	return {
		err_msg: Errors(
			error_data ? error_data.statusCode : '',
			error_data ? error_data.message : ''
		),
		status: 0,
		err_code: error_data ? error_data.statusCode : '',
		...error_data,
	};
};
var axiosapiinstance = function () {};

axiosapiinstance.prototype.init = async function (token) {
	let APIKit = axios.create({
		baseURL: config.baseURL,
		timeout: 10000,
	});
	APIKit.interceptors.request.use(function (config) {
		
		if (token) {
			config.headers.Authorization = `Token ${token}`;
		}
		if((config.url).includes("app/syncContacts")){
			config.timeout=35000;
		}
		return config;
	});
	APIKit.interceptors.response.use(
		function (response) {
			// Any status code that lie within the range of 2xx cause this function to trigger
			// Do something with response data
			return { status: 1, data: response.data };
		},
		async (error) => {
			let network_connection = await NetInfo.fetch();
			if (network_connection.isConnected == true) {
				if (error.response && error.response.status == 401) {
					RefreshToken(APIKit);
					return { status: 401 };
				} else {
					return handleerrors(error);
				}
			} else {
				Toast.show('Check your internet connection.', Toast.LONG);
			}
		}
	);
	return APIKit;
};
// Set Cutomize Response
export const RefreshToken = (token) => {
	console.log('token', token);
};

export default axiosapiinstance;
