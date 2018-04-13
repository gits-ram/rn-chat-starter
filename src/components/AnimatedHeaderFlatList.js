import React from "react";
import { View, FlatList, Text, StyleSheet, Animated } from "react-native";

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 19, 20, 21, 22, 23, 24, 25, 26];

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default class AnimatedHeaderFlatList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    //HIDE NAV BAR
    this.props.navigator.toggleNavBar({
      to: "hidden", // required, 'hidden' = hide tab bar, 'shown' = show tab bar
      animated: false, // does the toggle have transition animation or does it happen immediately (optional)
    });
  }

  state = {
    animatedValue: new Animated.Value(0),
  };

  _renderItem = ({ item }) => {
    return (
      <View style={styles.nonsenseItem}>
        <Text style={styles.itemText}>{item}</Text>
      </View>
    );
  };

  render() {
    let translateY = this.state.animatedValue.interpolate({
      inputRange: [0, 180],
      outputRange: [0, -180],
      extrapolate: "clamp",
    });

    return (
      <View style={styles.container}>
        <AnimatedFlatList
          contentContainerStyle={{ marginTop: 200 }}
          scrollEventThrottle={16} // <-- Use 1 here to make sure no events are ever missed
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: this.state.animatedValue } } }],
            { useNativeDriver: true }, // <-- Add this
          )}
          data={data}
          renderItem={this._renderItem}
          keyExtractor={(item, i) => i}
        />
        <Animated.View style={[styles.headerWrapper, { transform: [{ translateY }] }]} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "lightblue",
  },
  nonsenseItem: {
    backgroundColor: "red",
    margin: 8,
  },
  itemText: {
    backgroundColor: "blue",
    fontSize: 20,
    padding: 20,
  },
  headerWrapper: {
    position: "absolute",
    backgroundColor: "red",
    height: 200,
    left: 0,
    right: 0,
  },
});
