import React from "react";
import { Animated, View } from "react-native";
import Spinner from "react-native-spinkit";
import Constants from "../../global/constants";

const ANIMATION_DURATION = 200;

export default class LoadingIndicator extends React.PureComponent {
  constructor(props) {
    super(props);

    this._animated = new Animated.Value(0);
    this.loaderStyle = ["ThreeBounce", "Wave"];
    this.currentStyle = Math.floor(Math.random() * 2);
  }

  componentDidMount() {
    /* Animation commented, to let global LayoutAnimation take over for flatlist changes */
    // Animated.timing(this._animated, {
    //   useNativeDriver: true,
    //   toValue: 1,
    //   duration: this.props.animate ? ANIMATION_DURATION : 0,
    // }).start();
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
      // <Animated.View style={loaderAnimStyle}>
      <View style={styles.mainContainer}>
        <Spinner
          isVisible={true}
          size={50}
          type={this.loaderStyle[this.currentStyle]}
          color={Constants.Colors.darkAccent}
        />
      </View>
      // </Animated.View>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 5,
    width: "20%",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
};
