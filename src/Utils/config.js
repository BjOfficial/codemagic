
// export default Config;
export const config = {
	baseURL: "http://188.166.228.50:3008/",
  };
  export const constants = {
	login: config.baseURL + "app/appLogin",
	requestInvite: config.baseURL + "app/requestInvite",
	requestInviteVerifyOtp: config.baseURL + "app/requestInviteVerifyOtp",
	resendOtp: config.baseURL + "app/resendOtp",
	checkInviteExist: config.baseURL + "app/checkInviteExist",
	registerVerifyOtp: config.baseURL + "app/registerVerifyOtp",
	
  }