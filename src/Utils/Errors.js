const Errors = (err_code, message) => {
  switch (err_code) {
    case 404:
      return "Not Found";
      break;
    case 400:
      return message ? message : "Bad Request";
      break;
    case 500:
      return "Internal Server Error";
      break;
    case 401:
      return "Your Token Expired";
      break;
    default:
      return "Unable to reach server";
  }
};
export default Errors;
