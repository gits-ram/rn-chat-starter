// @flow

import React, { Component } from "react";
import { AppRegistry, StyleSheet, Text, View } from "react-native";
import { Button } from "native-base";
import { inject, observer } from "mobx-react/native";
import Constants from "../../global/constants";

@inject("appStore")
@observer
export default class Drawer extends Component {
  render() {
    const { appStore } = this.props;

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>DRAWER</Text>
        <Button
          style={{
            marginLeft: 5,
            width: "70%",
            height: 40,
            backgroundColor: Constants.Colors.primaryAccent,
          }}
          onPress={() => {
            console.log("Drawer Home Pressed");

            this.props.navigator.toggleDrawer({
              side: "left",
              animated: true,
              to: "closed",
            });
            this.props.navigator.switchToTab({
              tabIndex: 0,
            });
          }}>
          <Text style={{ color: "#FFF" }}> Dashboard </Text>
        </Button>

        <Button
          style={{
            marginLeft: 5,
            marginTop: 20,
            width: "70%",
            height: 40,
            backgroundColor: Constants.Colors.primaryAccent,
          }}
          onPress={() => {
            console.log("Drawer Components Pressed");

            this.props.navigator.toggleDrawer({
              side: "left",
              animated: true,
              to: "closed",
            });
            this.props.navigator.switchToTab({
              tabIndex: 1,
            });
          }}>
          <Text style={{ color: "#FFF" }}> Components </Text>
        </Button>

        <Button
          style={{
            marginLeft: 5,
            marginTop: 20,
            width: "70%",
            height: 40,
            backgroundColor: Constants.Colors.primaryAccent,
          }}
          onPress={() => {
            console.log("Drawer Chat Pressed");

            this.props.navigator.toggleDrawer({
              side: "left",
              animated: true,
              to: "closed",
            });
            this.props.navigator.switchToTab({
              tabIndex: 2,
            });
          }}>
          <Text style={{ color: "#FFF" }}> Chat Page </Text>
        </Button>

        <Button
          style={{
            marginLeft: 5,
            marginTop: 20,
            width: "70%",
            height: 40,
            backgroundColor: Constants.Colors.primaryAccent,
          }}
          onPress={() => {
            console.log("Drawer Logout Pressed");

            this.props.appStore.setLoggedIn(false);
            Constants.Global.openLoginAsLaunch();
          }}>
          <Text style={{ color: "#FFF" }}> Logout </Text>
        </Button>

        {/* <Button
          title={`Push new screen in Tab 1`}
          onPress={() => {
            // this is made for iOS based on this issue -> https://github.com/wix/react-native-navigation/issues/1143
            appStore.rootNavigator.push({
              screen: "afls.dummyscreen",
              title: "Pushed Screen from Drawer"
            });
            // for Android you can use this.props.navigator.push({ ... })
          }}
        /> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  instructions: {
    textAlign: "center",
    color: "#333333",
    marginBottom: 5,
  },
});
