// @flow
import * as React from "react";
import { Item, Input, Icon, Form, Toast } from "native-base";
import { observer, inject } from "mobx-react/native";
import * as Api from "../../services/api/Api";
import * as Utils from "../../utils/Util";
import SplashScreen from "react-native-smart-splash-screen";

import Login from "../../screens/Login";

import { Navigation } from "react-native-navigation";
import Constants from "../../global/constants";

export interface Props {
  navigator: any;
  loginForm: any;
}
export interface State {}

@inject("loginViewStore", "appStore")
@observer
export default class LoginContainer extends React.Component<Props, State> {
  emailInput: any;
  pwdinput: any;

  componentWillMount() {
    this.props.navigator.toggleNavBar({
      to: "hidden", // required, 'hidden' = hide navigation bar, 'shown' = show navigation bar
      animated: false, // does the toggle have transition animation or does it happen immediately (optional). By default animated: true
    });
    //Check Network state and update that to AppStore.isConnected
    Utils.checkNetworkstate(this.props.appStore, () => {
      this.connectivityCallback();
    });
  }

  connectivityCallback() {
    this.showToastError("Check your internet connectivity..", "bottom");
  }

  componentDidMount() {
    //Native Splash Screen Lib code
    SplashScreen.close({
      animationType: SplashScreen.animationType.scale, //(or) scale
      duration: 0,
      delay: 0,
    });
  }

  register() {
    this.props.navigator.push({
      screen: Constants.Screens.REGISTER.screen,
      title: Constants.Screens.REGISTER.title,
    });
  }

  login() {
    this.props.loginViewStore.validateForm();
    if (this.props.loginViewStore.isValid) {
      //CALL Login API
      this.props.loginViewStore.requestApiAndRedirect(
        tokens => {
          this.loginSuccess(tokens);
        },
        () => {
          this.props.appStore.setLoggedIn(false);
          this.showToastError("User not found. Go Register!", "top");
        },
      );
    } else {
      this.showToastError("Enter a Valid Email & password!", "top");
    }
  }

  loginSuccess(tokens) {
    this.props.loginViewStore.clearStore();
    this.props.appStore.setLoggedIn(true);

    //JWT Auth Tokens
    this.props.appStore.authToken = tokens[0];
    this.props.appStore.refreshToken = tokens[1];

    //Open The Main Tabs Screen
    Constants.Global.openTabsAsMain();
  }

  showToastError(errorText: string, pos) {
    Toast.show({
      text: errorText,
      duration: 2000,
      position: pos,
      textStyle: { textAlign: "center" },
    });
  }

  componentWillUnmount() {
    //To cancel Pending Login API request
    this.props.loginViewStore.cancelRequest();
  }

  render() {
    const store = this.props.loginViewStore;
    const appStore = this.props.appStore;
    const Fields = (
      <Form>
        <Item error={store.emailError ? true : false}>
          <Icon active name="person" style={{ color: "#333333" }} />
          <Input
            placeholder="Email"
            keyboardType="email-address"
            ref={c => (this.emailInput = c)}
            value={store.email}
            onBlur={() => store.validateEmail()}
            onChangeText={e => store.emailOnChange(e)}
            style={{ color: "#707070" }}
          />
        </Item>
        <Item error={store.passwordError ? true : false}>
          <Icon active name="unlock" />
          <Input
            placeholder="Password"
            ref={c => (this.pwdinput = c)}
            value={store.password}
            onBlur={() => store.validatePassword()}
            onChangeText={e => store.passwordOnChange(e)}
            secureTextEntry={true}
            style={{ color: "#707070" }}
          />
        </Item>
      </Form>
      //{ form.fetchingApi === true ? <LoadingIndicator : null> }
    );
    return (
      <Login
        navigator={this.props.navigator}
        loginForm={Fields}
        showLoader={store.fetchingApi}
        onLogin={() => this.login()}
        onRegister={() => this.register()}
      />
    );
  }
}
