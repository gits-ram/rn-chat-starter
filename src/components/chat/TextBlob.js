import React from "react";
import { View, Text, StyleSheet, Animated, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import LoaderIndicator from "./LoadingIndicator";
import { View as AnimView, Text as AnimText } from "react-native-animatable";
import Constants from "../../global/constants";
import { Button } from "native-base";

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
  }

  componentDidMount() {
    //Animate AI Text Input Entrance
    if (this._aiViewRef) {
      if (this.props.animate === 1) {
        this._aiViewRef.fadeInLeft(400);
      } else if (this.props.animate === 2) {
        this._aiViewRef.fadeInDown(300);
      }
    }

    //Animate User Text Input Entrance
    if (this._userViewRef) {
      if (this.props.animate === 1) {
        this._userViewRef.fadeInUp(150);
      } else if (this.props.animate === 2) {
        this._userViewRef.fadeInRight(150);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this._textViewRef && this.props.text !== nextProps.text) {
      this._textViewRef.fadeIn(400);
    }
  }

  _renderUserChat(rowStyles, title, text) {
    return (
      <AnimView
        useNativeDriver={true}
        ref={ref => {
          this._userViewRef = ref;
        }}
        style={rowStyles}>
        <View style={styles.userTextView}>
          <Text style={styles.userText}>{text}</Text>
        </View>
        <View style={styles.userIconView}>
          <Icon name={"account-circle"} color={Constants.Colors.chatPrimaryAccent} size={42} />
        </View>
      </AnimView>
    );
  }

  onLayout = e => {
    console.log("ONLAY HEIT:" + e.nativeEvent.layout.height);
  };

  _renderAIChat(rowStyles, title, text) {
    const { options, chatAction, showIcon } = this.props;

    return (
      <AnimView
        useNativeDriver={true}
        ref={ref => {
          this._aiViewRef = ref;
        }}
        style={rowStyles}>
        <View style={styles.aiIconView}>
          {showIcon === true ? (
            <Icon name={"plane-shield"} color={Constants.Colors.chatPrimaryAccent} size={42} />
          ) : null}
        </View>

        <AnimView
          style={options && options.length > 0 ? styles.aiTextViewWithOpt : styles.aiTextView}
          ref={ref => {
            this._textViewRef = ref;
          }}
          useNativeDriver={true}>
          {text === "loading.." ? (
            <LoaderIndicator />
          ) : this.props.options && this.props.options.length > 0 ? (
            this._renderTextAndOptions(text, options, chatAction)
          ) : (
            <Text style={styles.aiText}>{text}</Text>
          )}
        </AnimView>
      </AnimView>
    );
  }

  _generateOptions(options, chatAction) {
    let uiOptions = [];

    var ind = 0;
    for (ind; ind < options.length; ind++) {
      let title = options[ind].title;
      let action = options[ind].action;
      uiOptions.push(
        <View
          key={ind}
          style={{
            flexDirection: "column",
            width: "100%",
            paddingTop: ind === 0 ? 10 : undefined,
          }}>
          <TouchableOpacity
            style={
              title.toLowerCase() === "yes" || title.toLowerCase() === "no"
                ? styles.optionsTouchableWithBorder
                : styles.optionsTouchable
            }
            onPress={() => {
              chatAction(title, action);
            }}>
            <Text
              style={{
                fontWeight: "400",
                color: Constants.Colors.chatOptions,
                fontSize: Constants.Colors.optionsFontSize,
                paddingVertical: 5,
                // borderColor: Constants.Colors.chatOptions,
                // borderWidth: 1,
                // borderRadius: 15,
                // paddingHorizontal: 10,
                // paddingVertical: 5,
              }}>
              {title}
            </Text>
          </TouchableOpacity>
          {/* //Button Separator// */}
          {title.toLowerCase() !== "yes" &&
          title.toLowerCase() !== "no" &&
          options.length > 1 &&
          ind < options.length - 1 ? (
            <View
              style={{ alignSelf: "center", height: 1, width: "80%", backgroundColor: "grey" }}
            />
          ) : null}
          <View
            style={{ paddingTop: 5, paddingBottom: ind === options.length - 1 ? 5 : undefined }}
          />
        </View>,
      );
    }

    return uiOptions;
  }

  _renderTextAndOptions(text, options, chatAction) {
    return (
      <View style={styles.optionsView}>
        <View style={styles.aiOptTextView}>
          <Text style={[{ alignSelf: "flex-start" }, styles.aiText, { paddingRight: 10 }]}>
            {text}
          </Text>
        </View>
        {this._generateOptions(options, chatAction)}
      </View>
    );
  }

  render() {
    const { title, text, isUser } = this.props;

    return (
      <View onLayout={this.onLayout}>
        {isUser
          ? this._renderUserChat(styles.userAnimRow, title, text)
          : this._renderAIChat(styles.aiAnimRow, title, text)}
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
    flex: 0.15,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  userTextView: {
    flex: 0.7,
    alignSelf: "flex-end",
    alignItems: "flex-end",
    marginRight: -15,
    borderRadius: 8,
  },
  userText: {
    backgroundColor: "#fff",
    color: Constants.Colors.userChatText,
    borderRadius: 18,
    padding: 10,
    fontSize: 16,
    marginRight: 10, //-5,
    // borderWidth: 2,
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
    flex: 0.15,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  aiTextView: {
    flex: 0.7, //0.8 if the box should stetch to far right end of screen
    alignSelf: "flex-start",
    alignItems: "flex-start",
    borderRadius: 8,
  },
  aiTextViewWithOpt: {
    flex: 0.7, //0.8 if the box should stetch to far right end of screen
    alignSelf: "flex-end",
    alignItems: "flex-start",
    borderRadius: 8,
    // marginBottom: 10,
  },
  aiOptTextView: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    backgroundColor: Constants.Colors.botChatBlob,
    width: "100%",
  },
  aiText: {
    backgroundColor: Constants.Colors.botChatBlob, //"#dbdbdb",
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    color: Constants.Colors.botChatText, //#707070
  },
  optionsView: {
    flexDirection: "column",
    flex: 0,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  optionsTouchable: {
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
  },
  optionsTouchableWithBorder: {
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "white",
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Constants.Colors.chatOptions,
  },
});

export default TextBlob;
