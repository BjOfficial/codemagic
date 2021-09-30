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
  listAllInvites: config.baseURL + "app/listAllInvites",
  checkEmailNumberExist: config.baseURL + "app/checkEmailNumberExist",
  postContacts: config.baseURL + "app/postContacts",
  listContacts: config.baseURL + "app/listContacts",
  inviteContact: config.baseURL + "app/inviteContact",
  checkMobileExist: config.baseURL + "app/checkMobileExist",
  appMobileRegister: config.baseURL + "app/appMobileRegister",
  appRegister: config.baseURL + "app/appRegister",
};
