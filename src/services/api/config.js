/* services/api/config.js
 * Declare all API configurations and URLs here
 *
 */

//PRODUCTION URLs
// module.exports = {
//     url: 'mongodb://superAdmin:superadmin@localhost:27017/admin'
// }

//QA URLs
module.exports = {
  domainUrl: "http://10.0.2.2:11880",

  registerUrl: "/api/auth/signup",
  loginUrl: "/api/auth/login",
  refreshTokenUrl: "/api/auth/refreshToken",
  getAllUsersUrl: "/api/auth/getAllUsers",

  randomPplUrl: "https://randomuser.me/api/",
  swapiUrl: "https://swapi.co/api/people/?",
  chatApiUrl: "/dummy",
};
