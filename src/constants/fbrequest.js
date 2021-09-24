import FBSDK, {
  LoginManager,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from "react-native-fbsdk";

import React, { Component } from "react";
import { View, Text, Button } from "react-native";

const responsecallback = (error: ?Object, result: ?Object, callback, token) => {
  callback(error, { result: result, token: token });
};
const gettingCurrenttoken = (callback) => {
  AccessToken.getCurrentAccessToken().then((data) => {
    // console.log(data);
    if (data) {
      const infoRequest = new GraphRequest(
        "/me?fields=first_name,last_name,picture,email",
        null,
        (error, result) =>
          responsecallback(error, result, callback, data.accessToken)
      );
      // Start the graph request.
      new GraphRequestManager().addRequest(infoRequest).start();
      // console.log(data.accessToken.toString())
    }
  });
};
const loginfacebook = (callback) => {
  var self = this;
  LoginManager.logInWithPermissions(["public_profile", "email"]).then(
    function (result) {
      if (result.isCancelled) {
        alert("Login was cancelled");
      } else {
        gettingCurrenttoken(callback);
      }
    },
    function (error) {
      alert("Login failed with error: " + error);
    }
  );
};
const FBLogout = (accessToken, callback) => {
  if (!accessToken) {
    callback("Already Logged out", null);
    return;
  }
  let logout = new GraphRequest(
    "me/permissions/",
    {
      accessToken: accessToken,
      httpMethod: "DELETE",
    },
    (error, result) => {
      if (error) {
        console.log("Error fetching data: " + error.toString());
      } else {
        callback(null, "Loggedout Successfully");
        // this.setState({accessToken:null})
        LoginManager.logOut();
      }
    }
  );
  new GraphRequestManager().addRequest(logout).start();
};
const facebookapi = {
  login: (callback) => {
    loginfacebook(callback);
  },
  logout: (callback) => {
    AccessToken.getCurrentAccessToken().then((data) => {
      FBLogout(data ? data.accessToken : null, callback);
    });
  },
  checkloginStatus: (callback) => {
    AccessToken.getCurrentAccessToken().then((data) => {
      if (data) {
        callback("loggedIn");
      } else {
        callback("notloggedin");
      }
    });
  },
};

export default facebookapi;
