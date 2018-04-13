import React from "react";
import { Animated, Text } from "react-native";
import Spinner from "react-native-spinkit";

const ANIMATION_DURATION = 200;

export default class LoadingIndicator extends React.PureComponent {
  constructor(props) {
    super(props);

    this._animated = new Animated.Value(0);
    this.loaderStyle = ["ThreeBounce", "Wave"];
    this.currentStyle = Math.floor(Math.random() * 2);
  }

  componentDidMount() {
    Animated.timing(this._animated, {
      toValue: 1,
      duration: ANIMATION_DURATION,
    }).start();
  }

  render() {
    const loaderAnimStyle = [
      styles.mainContainer,
      { opacity: this._animated },
      {
        transform: [{ scale: this._animated }],
      },
    ];

    return (
      <Animated.View style={loaderAnimStyle}>
        <Spinner
          isVisible={true}
          size={50}
          type={this.loaderStyle[this.currentStyle]}
          color={"#333333"}
        />
      </Animated.View>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 15,
    width: "20%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
};
