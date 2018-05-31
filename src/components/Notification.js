import React from "react";
import { StyleSheet, View, Text, Dimensions, Button } from "react-native";

class Notification extends React.Component {
  render() {
    return (
      <View
        style={
          (styles.container,
          this.props.color ? { backgroundColor: this.props.color } : { backgroundColor: "#35373a" })
        }>
        <Text style={styles.title}>{this.props.title ? this.props.title : "-=Notification=-"}</Text>
        <Text style={styles.content}>{this.props.text}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 55,
    backgroundColor: "#0773f7",
    padding: 2,
  },
  title: {
    fontSize: 15,
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
  },
  content: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 1,
    paddingBottom: 3,
    color: "white",
  },
});

export default Notification;
