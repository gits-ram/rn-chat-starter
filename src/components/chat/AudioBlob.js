import React, { Component } from "react";
import { Image, View, Dimensions, TouchableOpacity } from "react-native";
import { Text, Card, CardItem, Body } from "native-base";
import { View as AnimView } from "react-native-animatable";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Constants from "../../global/constants";

var width = Dimensions.get("window").width;

export interface Props {
  id: int;
  audioPath: String;
  isUser: Boolean;
  isPlaying: Boolean;
  playSound: Function;
  stopSound: Function;
}

export interface State {}

export default class AudioBlob extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    //Animate AudioBlob Entrance
    if (this._viewRef) {
      if (this.props.animate === 1) {
        this._viewRef.fadeInUp(150);
      }
    }
  }

  saveRef = ref => (this.containerNode = ref);

  _renderIconOnLeft(showIcon) {
    return (
      <View style={{ paddingRight: 5, alignSelf: "flex-end" }}>
        {showIcon === true ? <Icon name={"robot"} color={"#333333"} size={42} /> : null}
      </View>
    );
  }

  render() {
    return (
      <AnimView
        useNativeDriver={true}
        ref={ref => {
          this._viewRef = ref;
        }}
        style={styles.mainContainer}>
        {/* Render AILogo To Left of Card */}
        {this.props.isUser ? this._renderIconOnLeft(this.props.showIcon) : null}

        <Card style={styles.cardContainer}>
          <CardItem style={styles.cardItemContainer}>
            {/* <Body style={styles.bodyContainer}> */}
            {!this.props.isPlaying ? (
              <TouchableOpacity
                onPress={() => {
                  this.props.playSound(this.props.id, this.props.audioPath);
                }}>
                <Icon name={"play-circle"} color={Constants.Colors.primaryAccent} size={45} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => {
                  this.props.stopSound();
                }}>
                <Icon name={"stop-circle"} color={Constants.Colors.primaryAccent} size={45} />
              </TouchableOpacity>
            )}
            {/* </Body> */}
          </CardItem>
        </Card>
      </AnimView>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    width: "40%",
    height: 70,
    paddingRight: 5,
    // transform: [{ scaleY: -1 }],
    alignSelf: "flex-end",
    alignItems: "flex-start",
    marginBottom: 10,
    borderRadius: 15,
  },
  cardContainer: {
    flex: 0,
    width: "90%",
    backgroundColor: "#FFF",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  cardItemContainer: {
    flex: 0,
    width: "95%",
    height: "80%",
    marginTop: 4,
    marginBottom: 4,
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  bodyContainer: {
    flex: 0,
    // flexWrap: "wrap",
    width: "100%",
    backgroundColor: "#F5F5F5",
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
};
