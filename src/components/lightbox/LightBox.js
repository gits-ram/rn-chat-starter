import React from "react";
import { StyleSheet, View, Text, Dimensions, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

class Lightbox extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View
          style={{
            alignItems: "center",
            flexDirection: "row",
            width: "100%",
            height: "20%",
            justifyContent: "space-between",
          }}>
          <Text style={styles.title}>{this.props.title}</Text>
          <TouchableOpacity onPress={() => this.props.onClose()}>
            <Icon name={"window-close"} color={"#b22d18"} size={35} />
          </TouchableOpacity>
        </View>

        <Text style={styles.content}>{this.props.content}</Text>
        {this.props.options}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 0,
    width: Dimensions.get("window").width * 0.7,
    // height: Dimensions.get("window").height * 0.3,
    backgroundColor: "#ffffff",
    borderRadius: 5,
    padding: 10,
    // alignItems: "center",
    // justifyContent: "center",
  },
  title: {
    fontSize: 17,
    fontWeight: "700",
  },
  content: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
});

export default Lightbox;
