// @flow
import * as React from "react";
import { Image, View, Dimensions } from "react-native";
import Constants from "../../global/constants";

export interface Props {}
export interface State {}

export default class SplashContainer extends React.Component<Props, State> {
  componentDidMount() {
    setTimeout(() => {
      Constants.Global.openChatAsDedicatedApp();
    }, 200);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}>
        <Image
          style={{
            flex: 1,
            width: Dimensions.get("window").width,
            height: Dimensions.get("window").height,
            resizeMode: "cover",
          }}
          source={require("../../../assets/img/splash2.jpg")}
        />
      </View>
    );
  }
}
