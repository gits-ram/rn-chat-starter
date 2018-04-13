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
  domainUrl: "http://10.0.2.2:3000",
  loginUrl: "/api/signin",
  registerUrl: "/api/signup",
  randomPplUrl: "https://randomuser.me/api/",
  swapiUrl: "https://swapi.co/api/people/?",
  chatApiUrl: "/dummy",
};
