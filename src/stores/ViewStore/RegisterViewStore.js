import { observable, action } from "mobx";
import * as Api from "../../services/api/AuthApi";
import Axios from "axios";
import * as Utils from "../../utils/Util";

var CancelToken = null;
var source = null;

export default class RegisterViewStore {
  @observable firstName = "";
  @observable lastName = "";
  @observable email = "";
  @observable password = "";
  @observable isValid = false;
  @observable firstError = "";
  @observable lastError = "";
  @observable emailError = "";
  @observable passwordError = "";
  @observable fetchingApi = false;

  @action
  firstNameOnChange(name) {
    this.firstName = name;
    this.validateFirstName();
  }

  @action
  lastNameOnChange(name) {
    this.lastName = name;
    this.validateLastName();
  }

  @action
  validateFirstName() {
    const alpha = /[^a-zA-Z ]/i.test(this.firstName) ? "Only alphabet characters" : undefined;
    this.firstError = this.firstName.length > 2 ? alpha : "Enter 2 or more characters";
  }

  @action
  validateLastName() {
    const alpha = /[^a-zA-Z ]/i.test(this.lastName) ? "Only alphabet characters" : undefined;
    this.lastError = this.lastName.length > 2 ? alpha : "Enter 2 or more characters";
  }

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
    if (
      this.firstError === undefined &&
      this.lastError === undefined &&
      this.emailError === undefined &&
      this.passwordError === undefined
    ) {
      this.isValid = true;
    }
  }

  @action
  clearStore() {
    this.firstName = "";
    this.lastName = "";
    this.email = "";
    this.password = "";
    this.firstError = "";
    this.lastError = "";
    this.emailError = "";
    this.passwordError = "";
  }

  @action
  requestApiAndRedirect(successCb, failureCb) {
    //Observable tripped to true, to show loader
    this.fetchingApi = true;

    //Create a new Cancel Token and pass it to Axios request
    CancelToken = Axios.CancelToken;
    source = CancelToken.source();

    //JWT Node Server Register
    Api.registerUser(
      { first: this.firstName, last: this.lastName, email: this.email, password: this.password },
      source,
    )
      .then(Utils.sleeper(500)) //TODO: Remove (To mimic network delay)
      .then(response => {
        this.fetchingApi = false;
        if (response.status === 200) {
          console.warn("Register Response" + JSON.stringify(response.data));
          if (response.data.success) {
            successCb();
          } else {
            failureCb();
          }
        }
      })
      .catch(error => {
        this.fetchingApi = false;
        if (Axios.isCancel(error)) {
          console.log("Register Request cancelled");
        } else {
          console.log("Register Error - " + error);
        }
      });
  }
}
