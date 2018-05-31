/* services/api/Api.js
 *Declare all the REST API base calls here
 * Callbacks will be handled by the respective Store(mobX)
 *
 */

import config from "./config";
import Axios from "axios";

export function getRandomPeople(params: any, source: any) {
  var instance = Axios.create();
  instance.interceptors.request.use(request => {
    console.log("Starting Request", request);
    return request;
  });

  return instance.get(
    config.randomPplUrl,
    {
      params: {
        seed: 1,
        page: params.page,
        results: 15,
      },
    },
    {
      cancelToken: source.token,
    },
  );
}

export function logOut(token) {
  //  axios.get('http://logout.com', {
  //      cancelToken: source.token
  //  }).then((response)=>{
  //  }).catch((error) => {
  //   if (axios.isCancel(error)) {
  //     console.log('get Request canceled');
  //   }
  // });
}

//Sample Using Fetch API
// export function loginUser(params: any) {
//   return fetch(config.domainUrl + config.loginUrl, {
//     method: "POST",
//     headers: {
//       Accept: "application/json",
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(params),
//   })
//     .then(response => response.json())
//     .then(responseData => {
//       JSON.stringify(responseData);
//     })
//     .catch(error => {
//       console.error(error);
//     });
// }
