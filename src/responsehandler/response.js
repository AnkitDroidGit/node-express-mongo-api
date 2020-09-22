exports.sendresponse = (mes, pay) => {
  var responseBody = {
    message: mes,
    payload: pay,
  };
  return responseBody;
};

exports.sendloginresponse = (mes, usr, acc, ref) => {
  var payload = {
    user: usr,
    accessToken: acc,
  };
  var responseBody = {
    message: mes,
    payload: payload,
  };
  return responseBody;
};
