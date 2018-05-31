import React, { Component } from "react";
import { Button, Container, Content, Toast } from "native-base";
import { View, Text, StyleSheet } from "react-native";
import * as Api from "../../services/api/AuthApi";
import Axios from "axios";
import { observer, inject } from "mobx-react/native";
import Constants from "../../global/constants";

export interface Props {
  navigator: any;
}
export interface State {
  users: [];
}
var CancelToken = null;
var source = null;

@inject("appStore")
@observer
export default class JwtTestPage extends Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };
  }

  showToast = (title = "Error", text = "This is a notification!") => {
    this.props.navigator.showInAppNotification({
      screen: Constants.Screens.NOTIFICATION.screen,
      passProps: { title, text },
      autoDismissTimerSec: 2,
    });
  };

  getAllUsers() {
    CancelToken = Axios.CancelToken;
    source = CancelToken.source();

    Api.getAllUsers(this.props.appStore.authToken, source)
      .then(users => {
        //Populate users in UI
        this.setState({ users: users.data.message });
      })
      .catch(err => {
        if (Axios.isCancel(err)) {
          console.warn("GetAllUsers cancelled");
        } else {
          if (err.response.status === 403) {
            this.showToast("Auth Token Expired. Refreshing..");

            setTimeout(() => {
              Api.refreshToken(this.props.appStore.refreshToken, source)
                .then(response => {
                  this.props.appStore.authToken = response.data.authToken;
                  this.getAllUsers();
                })
                .catch(err2 => {
                  if (Axios.isCancel(err2)) {
                    console.log("GetAllUsers cancelled 2");
                  } else {
                    if (err2.response.status === 403) {
                      this.showToast("Refresh Token Expired. Redirecting to Login Page..");
                      setTimeout(() => {
                        this.props.navigator.dismissModal();
                        this.props.appStore.setLoggedIn(false);
                        Constants.Global.openLoginAsLaunch();
                      }, 2000);
                    }
                  }
                });
            }, 2000);
          } else {
            console.warn("GetAllUser Error :" + err);
          }
        }
      });
  }

  renderUserList() {
    let userCards = [];

    var ind = 0;
    for (ind; ind < this.state.users.length; ind++) {
      let first = this.state.users[ind].first;
      let last = this.state.users[ind].last;
      let email = this.state.users[ind].email;

      userCards.push(<UserCard key={email} first={first} last={last} email={email} />);
    }

    return userCards;
  }

  render() {
    return (
      <Container style={{ flex: 1, backgroundColor: "white" }}>
        <Button
          style={{
            width: 200,
            height: 45,
            marginTop: 5,
            paddingBottom: 10,
            alignSelf: "center",
            justifyContent: "center",
          }}
          onPress={() => {
            this.getAllUsers();
          }}>
          <Text
            style={{
              fontSize: 21,
              color: "white",
            }}>
            Get All Reg Users
          </Text>
        </Button>

        <Content>
          <View style={{ flex: 1 }}>
            {this.state.users && this.state.users.length > 0 ? (
              <View>{this.renderUserList()}</View>
            ) : (
              <Text style={{ marginTop: 10, fontSize: 18, color: "grey", alignSelf: "center" }}>
                No Users to show
              </Text>
            )}
          </View>
        </Content>
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  card: {
    justifyContent: "center",
    alignItems: "flex-start",
    alignSelf: "center",
    backgroundColor: "#e5e5e5",
    height: 100,
    width: "90%",
    borderRadius: 15,
    flexDirection: "column",
    marginTop: 10,
  },
  heading: {
    marginLeft: 15,
    fontSize: 18,
    fontWeight: "bold",
    color: "black",
  },
  value: {
    fontSize: 18,
    color: "black",
  },
});

//Stateless Component
const UserCard = ({ first, last, email }) => (
  <View style={styles.card}>
    <View style={{ flexDirection: "row", paddingVertical: 3 }}>
      <Text style={styles.heading}>First Name : </Text>
      <Text style={styles.value}>{first}</Text>
    </View>
    <View style={{ flexDirection: "row", paddingVertical: 3 }}>
      <Text style={styles.heading}>Last Name : </Text>
      <Text style={styles.value}>{last}</Text>
    </View>
    <View style={{ flexDirection: "row", paddingVertical: 3 }}>
      <Text style={styles.heading}>Email : </Text>
      <Text style={styles.value}>{email}</Text>
    </View>
  </View>
);
