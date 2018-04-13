// @flow
import * as React from "react";
import { StyleSheet, View, Button, Text } from "react-native";
import Constants from "../../global/constants";

export interface Props {}
export interface State {}

let chatStore: Object;

export default class ChatContainer extends React.Component<Props, State> {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Chat Dummy Landing Page</Text>

        <Button
          title={"Open Chat Page"}
          onPress={() => {
            this.props.navigator.push({
              screen: Constants.Screens.CHAT.screen,
              title: "Type To Chat",
            });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  welcome: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
});
