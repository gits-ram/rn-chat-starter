import React from "react";
import { Image, View, StyleSheet, Dimensions, Animated } from "react-native";

const ANIMATION_DURATION = 300;

export interface Props {
  imagePath: String;
}

export interface State {}

class SingleImagePreviewer extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this._animated = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this._animated, {
      toValue: 1,
      duration: ANIMATION_DURATION,
    }).start();
  }

  render() {
    const fadeScaleStyle = [
      styles.container,
      { opacity: this._animated },
      {
        transform: [{ scale: this._animated }],
      },
    ];

    return (
      <Animated.View style={fadeScaleStyle}>
        <Image source={{ uri: this.props.imagePath }} style={styles.previewSnap} />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  previewSnap: {
    justifyContent: "center",
    alignItems: "center",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
});

export default SingleImagePreviewer;
