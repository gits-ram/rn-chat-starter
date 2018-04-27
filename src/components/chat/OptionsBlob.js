import React from "react";
import { FlatList, View, StyleSheet, Animated } from "react-native";
import { Button, Text } from "native-base";

const ANIMATION_DURATION = 300;

export interface Props {
  title: String;
  text: String;
  isUser: Boolean;
  options: Object[];
}

export interface State {}

class OptionsBlob extends React.PureComponent<Props, State> {
  constructor(props) {
    super(props);

    this._animated = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this._animated, {
      toValue: 1,
      duration: this.props.animate ? ANIMATION_DURATION : 0,
    }).start();
  }

  _renderItem(item, chatAction) {
    return (
      <View style={{ paddingTop: 5, paddingBottom: 10, paddingLeft: 5, paddingRight: 5 }}>
        <Button
          rounded
          style={{ borderColor: "#333333", backgroundColor: "#fff" }}
          onPress={() => {
            chatAction(item.title, item.action);
          }}>
          <Text style={{ color: "#0078d7" }}> {item.title} </Text>
        </Button>
      </View>
    );
  }

  render() {
    const { optionsList, chatAction } = this.props;

    const aiRowStyles = [
      styles.aiAnimRow,
      { opacity: this._animated },
      {
        transform: [
          {
            translateX: this._animated.interpolate({
              inputRange: [0, 1],
              outputRange: [-350, 0],
              extrapolate: "clamp",
            }),
          },
        ],
      },
    ];

    return (
      <Animated.View style={aiRowStyles}>
        <FlatList
          ref={ref => {
            this.listRef = ref;
          }}
          horizontal={true}
          style={{ width: "100%" }}
          renderItem={({ item }) => this._renderItem(item, chatAction)}
          keyExtractor={item => "" + item.id}
          data={optionsList}
        />
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  aiAnimRow: {
    flexDirection: "row",
    flex: 1,
    alignSelf: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10,
  },
});

export default OptionsBlob;
