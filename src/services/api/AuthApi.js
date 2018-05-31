/* services/api/AuthApi.js
 *Declare all the Auth REST API base calls here
 * Callbacks will be handled by the respective Store(mobX)
 *
 * The functions below are using the local JWT Node Server
 */

import config from "./config";
import Axios from "axios";

export function registerUser(params: any, source: any) {
  return Axios.post(
    config.domainUrl + config.registerUrl,
    {
      first: params.first,
      last: params.last,
      email: params.email,
      password: params.password,
    },
    {
      cancelToken: source.token,
    },
  );
}

export function loginUser(params: any, source: any) {
  return Axios.post(
    config.domainUrl + config.loginUrl,
    {
      email: params.email,
      password: params.password,
    },
    {
      cancelToken: source.token,
    },
  );
  // .then(response => {
  //   if (response.status == 200) {
  //     // console.log("Axios" + JSON.stringify(response.data));
  //   }
  // })
  // .catch(error => {
  //   if (Axios.isCancel(error)) {
  //     console.log("Login Request cancelled");
  //   } else {
  //     console.log("Login Error " + error);
  //   }
  // });
}

export function refreshToken(refToken: String, source: any) {
  return Axios.post(
    config.domainUrl + config.refreshTokenUrl,
    {
      refreshToken: refToken,
    },
    {
      cancelToken: source.token,
    },
  );
}

export function getAllUsers(authToken: String, source: any) {
  var instance = Axios.create();
  instance.interceptors.request.use(request => {
    console.log("Starting Request", request);
    return request;
  });

  return instance.post(
    config.domainUrl + config.getAllUsersUrl,
    {},
    {
      cancelToken: source.token,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        authorization: "Bearer " + authToken,
      },
    },
  );
}
