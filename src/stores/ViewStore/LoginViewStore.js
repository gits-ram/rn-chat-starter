/* store/ViewStore/LoginViewStore.js
 * LoginView's mobX store
 * The store has all the observable state variables that will be observed by
 * the container (LoginContainer) to render the view accordingly and also it contains
 * logic to establish login Rest API calls
 */

import { observable, action } from "mobx";
import * as Api from "../../services/api/AuthApi";
import Axios from "axios";
import * as Utils from "../../utils/Util";

var CancelToken = null;
var source = null;

export default class LoginViewStore {
  @observable email = "bruce@bats.com";
  @observable password = "martha00";
  @observable isValid = true; //testing true
  @observable emailError = "";
  @observable passwordError = "";
  @observable fetchingApi = false;

  @action
  emailOnChange(id) {
    this.email = id;
    this.validateEmail();
  }

  @action
  validateEmail() {
    const emailPatter = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i;
    const required = this.email ? undefined : "Required";
    this.emailError = required
      ? required
      : emailPatter.test(this.email) ? undefined : "Invalid email address";
  }

  @action
  passwordOnChange(pwd) {
    this.password = pwd;
    this.validatePassword();
  }

  @action
  validatePassword() {
    const alphaNumeric = /[^a-zA-Z0-9 ]/i.test(this.password)
      ? "Only alphanumeric characters"
      : undefined;
    const maxLength = this.password.length > 15 ? "Must be 15 characters or less" : undefined;
    const minLength = this.password.length < 8 ? "Must be 8 characters or more" : undefined;
    const required = this.password ? undefined : "Required";
    this.passwordError = required
      ? required
      : alphaNumeric ? alphaNumeric : maxLength ? maxLength : minLength;
  }

  @action
  validateForm() {
    if (this.emailError === undefined && this.passwordError === undefined) {
      this.isValid = true;
    }
  }

  @action
  clearStore() {
    this.email = "";
    this.isValid = false;
    this.emailError = "";
    this.password = "";
    this.passwordError = "";
  }

  @action
  requestApiAndRedirect(successCb, failureCb) {
    //Observable tripped to true, to show loader
    this.fetchingApi = true;

    //Create a new Cancel Token and pass it to Axios request
    CancelToken = Axios.CancelToken;
    source = CancelToken.source();

    //TODO: Temporary code to direct login
    setTimeout(() => {
      this.fetchingApi = false;
      successCb();
    }, 200);

    //--- JWT Auth Login ---//
    // Api.loginUser({ email: this.email, password: this.password }, source)
    //   .then(Utils.sleeper(500)) //TODO: Remove (To mimic network delay)
    //   .then(response => {
    //     this.fetchingApi = false;
    //     if (response.status === 200) {
    //       console.log("Login Response" + JSON.stringify(response.data));
    //       if (response.data.success) {
    //         successCb([response.data.authToken, response.data.refreshToken]);
    //       } else {
    //         failureCb();
    //       }
    //     }
    //   })
    //   .catch(error => {
    //     this.fetchingApi = false;
    //     if (Axios.isCancel(error)) {
    //       console.log("Login Request cancelled");
    //     } else {
    //       console.log("Login Error " + error);
    //       failureCb(error);
    //     }
    //   });
  }

  @action
  cancelRequest() {
    source.cancel(); //Cancel Axios request
    this.fetchingApi = false;
  }
}
