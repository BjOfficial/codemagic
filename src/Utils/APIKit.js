import axios from "axios";
import { config } from "./config";
import Errors from "./Errors";
import firebase from "@react-native-firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";
let handleerrors = (err) => {
  let error_response = err.response || {},
    error_data = error_response.data ? error_response.data : null;
  //if u want to add some toast here for errors you can add it here......
  return {
    err_msg: Errors(
      error_data ? error_data.statusCode : "",
      error_data ? error_data.message : ""
    ),
    status: 0,
    err_code: error_data ? error_data.statusCode : "",
  };
};
var axiosapiinstance = function () {};
axiosapiinstance.prototype.init = function (token) {
  //AsyncStorage.setItem("loginToken",token);
  let APIKit = axios.create({
    baseURL: config.baseURL,
    timeout: 10000,
  });

  APIKit.interceptors.request.use(function (config) {
    if (token) {
      config.headers.Authorization = `Token ${token}`;
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
      if (error.response && error.response.status == 401) {
        let gettoken = await RefreshToken(APIKit);
        return { status: 401, token: gettoken };
      } else {
        return handleerrors(error);
      }
    }
  );
  return APIKit;
};
// Set Cutomize Response
export const RefreshToken = (apikit_instance) => {
  let user = firebase.auth().currentUser;
  return new Promise((resolve, reject) => {
    // resolve(undefined)
    user.getIdToken(true).then(async (idToken) => {
      AsyncStorage.setItem("loginToken", idToken);
      resolve(idToken);
    });
  });
};

export const deleteauthorization = () => {
  delete APIKit.defaults.headers.common["Authorization"];
};

export default axiosapiinstance;
