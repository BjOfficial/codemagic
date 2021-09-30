const Errors = (err_code = "", message) => {
  switch (err_code) {
    case 404:
      return "Not Found";
    case 400:
      return message ? message : "Bad Request";
    case 500:
      return "Internal Server Error";
    case 401:
      return "Your Token Expired";
    default:
      return "Unable to reach server";
  }
};
export default Errors;
