import React, { Component } from "react";
import { Container, Header, Content, Form, Item, Input, Label, Icon, Button } from "native-base";
import { Text } from "react-native";
import * as Api from "../../services/api/AuthApi";
import Axios from "axios";
import { observer, inject } from "mobx-react/native";
import Constants from "../../global/constants";

export interface Props {
  navigator: any;
}
export interface State {}
var CancelToken = null;
var source = null;

@inject("registerViewStore")
@observer
export default class Register extends Component<Props, State> {
  constructor(props) {
    super(props);
  }

  registerUser() {
    this.props.registerViewStore.requestApiAndRedirect(
      () => {
        // console.warn("Registered Successfully");
        let text = "SignUp Successfull. You may now login..";
        this.props.navigator.showInAppNotification({
          screen: Constants.Screens.NOTIFICATION.screen,
          passProps: { text },
          autoDismissTimerSec: 2,
        });

        setTimeout(() => {
          this.props.navigator.pop();
        }, 1000);
      },
      () => {
        console.warn("Registration Failed");
      },
    );
  }

  render() {
    const store = this.props.registerViewStore;
    return (
      <Container>
        <Content>
          <Form>
            <Item
              error={store.firstError ? true : false}
              success={store.firstName.length > 0 ? (!store.firstError ? true : false) : false}
              floatingLabel>
              <Label>First Name</Label>

              <Input
                ref={c => (this.fnInput = c)}
                value={store.firstName}
                onBlur={() => store.validateFirstName()}
                onChangeText={e => store.firstNameOnChange(e)}
              />
              {store.firstName.length > 0 ? (
                store.firstError ? (
                  <Icon name="close-circle" />
                ) : (
                  <Icon name="checkmark-circle" />
                )
              ) : null}
            </Item>
            <Item
              error={store.lastError ? true : false}
              success={store.lastName.length > 0 ? (!store.lastError ? true : false) : false}
              floatingLabel>
              <Label>Last Name</Label>

              <Input
                ref={c => (this.lnInput = c)}
                value={store.lastName}
                onBlur={() => store.validateLastName()}
                onChangeText={e => store.lastNameOnChange(e)}
              />

              {store.lastName.length > 0 ? (
                store.lastError ? (
                  <Icon name="close-circle" />
                ) : (
                  <Icon name="checkmark-circle" />
                )
              ) : null}
            </Item>
            <Item
              error={store.emailError ? true : false}
              success={store.email.length > 0 ? (!store.emailError ? true : false) : false}
              floatingLabel>
              <Label>Email</Label>

              <Input
                ref={c => (this.emailInput = c)}
                value={store.email}
                onBlur={() => store.validateEmail()}
                onChangeText={e => store.emailOnChange(e)}
              />
              {store.email.length > 0 ? (
                store.emailError ? (
                  <Icon name="close-circle" />
                ) : (
                  <Icon name="checkmark-circle" />
                )
              ) : null}
            </Item>
            <Item
              error={store.passwordError ? true : false}
              success={store.password.length > 0 ? (!store.passwordError ? true : false) : false}
              floatingLabel>
              <Label>Password</Label>

              <Input
                ref={c => (this.pwdinput = c)}
                value={store.password}
                onBlur={() => store.validatePassword()}
                onChangeText={e => store.passwordOnChange(e)}
                secureTextEntry={true}
              />

              {store.password.length > 0 ? (
                store.passwordError ? (
                  <Icon name="close-circle" />
                ) : (
                  <Icon name="checkmark-circle" />
                )
              ) : null}
            </Item>
          </Form>

          <Button
            block
            style={{ marginTop: 40, width: "75%", alignSelf: "center" }}
            onPress={() => {
              store.validateForm();
              if (store.isValid) {
                this.registerUser();
              }
            }}>
            <Text style={{ fontWeight: "bold", fontSize: 18, color: "white" }}>Sign Up!</Text>
          </Button>
        </Content>
      </Container>
    );
  }
}
