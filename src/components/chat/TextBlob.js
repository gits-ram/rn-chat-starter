import React from "react";
import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LoaderIndicator from "./LoadingIndicator";

const ANIMATION_DURATION = 300;
const ROW_HEIGHT = 100;

export interface Props {
  title: String;
  text: String;
  isUser: Boolean;
  options: Object[];
}

export interface State {}

class TextBlob extends React.PureComponent<Props, State> {
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

  onRemove = () => {
    const { onRemove } = this.props;
    if (onRemove) {
      Animated.timing(this._animated, {
        toValue: 0,
        duration: ANIMATION_DURATION,
      }).start(() => onRemove());
    }
  };

  _renderUserChat(rowStyles, title, text) {
    return (
      <Animated.View style={rowStyles}>
        <View style={styles.userTextView}>
          <Text style={styles.userText}>{text}</Text>
        </View>
        {/* <View style={styles.userIconView}>
          <Icon name={"account"} color={"#333333"} size={42} />
        </View> */}
      </Animated.View>
    );
  }

  onLayout = e => {
    console.log("ONLAY HEIT:" + e.nativeEvent.layout.height);
  };

  _renderAIChat(rowStyles, title, text) {
    const { options, chatAction, showIcon } = this.props;

    return (
      <Animated.View style={rowStyles}>
        <View style={styles.aiIconView}>
          {showIcon === true ? <Icon name={"robot"} color={"#000"} size={42} /> : null}
        </View>
        {text === "loading.." ? (
          <LoaderIndicator />
        ) : (
          <View
            style={options && options.length > 0 ? styles.aiTextViewWithOpt : styles.aiTextView}>
            <Text style={options && options.length > 0 ? styles.aiTextWithOpt : styles.aiText}>
              {text}
            </Text>

            {/* <View
              style={{ alignSelf: "center", width: "80%", height: 1, backgroundColor: "grey" }}
            /> */}
            {this.props.options && this.props.options.length > 0
              ? this._renderOptions(options, chatAction)
              : null}
          </View>
        )}
      </Animated.View>
    );
  }

  _generateOptions(options, chatAction) {
    let uiOptions = [];

    var ind = 0;
    for (ind; ind < options.length; ind++) {
      let title = options[ind].title;
      let action = options[ind].action;
      uiOptions.push(
        <View key={ind} style={{ flexDirection: "column", width: "100%" }}>
          <TouchableOpacity
            style={{
              width: "90%",
              alignSelf: "center",
              alignItems: "center",
              backgroundColor: "white",
              padding: 10,
              paddingLeft: 30,
              paddingRight: 30,
            }}
            onPress={() => {
              chatAction(title, action);
            }}>
            <View>
              <Text style={{ fontWeight: "bold", color: "#0078d7", fontSize: 16 }}>{title}</Text>
            </View>
          </TouchableOpacity>

          {/* //Button Separator// */}
          {options.length > 1 && ind < options.length - 1 ? (
            <View
              style={{ alignSelf: "center", height: 1, width: "80%", backgroundColor: "grey" }}
            />
          ) : null}
        </View>,
      );
    }

    return uiOptions;
  }

  _renderOptions(options, chatAction) {
    return <View style={styles.optionsView}>{this._generateOptions(options, chatAction)}</View>;
  }

  render() {
    const { title, text, isUser } = this.props;

    const userRowStyles = [
      styles.userAnimRow,
      // {
      //   height: this._animated.interpolate({
      //     inputRange: [0, 1],
      //     outputRange: [0, ROW_HEIGHT],
      //     extrapolate: "clamp",
      //   }),
      // },
      { opacity: this._animated },
      {
        transform: [
          {
            rotate: this._animated.interpolate({
              inputRange: [0, 1],
              outputRange: ["180deg", "0deg"],
              extrapolate: "clamp",
            }),
          },
          { scale: this._animated },
        ],
      },
    ];

    const aiRowStyles = [
      styles.aiAnimRow,
      { opacity: this._animated },
      {
        transform: [
          // { scale: this._animated },
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
      <View onLayout={this.onLayout}>
        {isUser
          ? this._renderUserChat(userRowStyles, title, text)
          : this._renderAIChat(aiRowStyles, title, text)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userAnimRow: {
    flexDirection: "row",
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  userIconView: {
    flex: 0.2,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  userTextView: {
    flex: 0.8,
    alignSelf: "flex-start",
    alignItems: "flex-end",
    // marginLeft: 40,
  },
  userText: {
    backgroundColor: "#fff",
    color: "#707070",
    borderRadius: 18,
    padding: 10,
    fontSize: 16,
    marginRight: 10, //-5,
    borderColor: "#707070",
    borderWidth: 2,
  },
  title: {
    fontSize: 13,
  },
  aiAnimRow: {
    flexDirection: "row",
    flex: 1,
    alignSelf: "flex-start",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  aiIconView: {
    flex: 0.2,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  aiTextView: {
    flex: 0.8,
    alignSelf: "flex-end",
    alignItems: "flex-start",
    marginRight: 40,
    borderRadius: 8,
  },
  aiTextViewWithOpt: {
    flex: 0.8,
    alignSelf: "flex-end",
    alignItems: "flex-start",
    marginRight: 40,
    backgroundColor: "#fff", //"#dbdbdb",
    borderRadius: 8,
    marginBottom: 10,
  },
  aiTextWithOpt: {
    backgroundColor: "#fff", //"#dbdbdb",
    padding: 10,
    fontSize: 16,
    color: "#707070",
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  aiText: {
    backgroundColor: "#fff", //"#dbdbdb",
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    color: "#707070",
  },
  optionsView: {
    flexDirection: "column",
    flex: 0,
    width: "100%",
    backgroundColor: "white",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignSelf: "flex-start",
    alignItems: "center",
  },
});

export default TextBlob;
