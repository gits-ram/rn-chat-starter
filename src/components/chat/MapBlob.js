import React, { Component } from "react";
import { Text, Image, View, Dimensions, TouchableHighlight, TouchableOpacity } from "react-native";
import { Spinner } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View as AnimView } from "react-native-animatable";
import Constants from "../../global/constants";
import * as Util from "../../utils/Util";

var width = Dimensions.get("window").width;
var height = Dimensions.get("window").height;
const slideWidth = wp(85);

const colorizedBlob = true;
const headerHeight = 40;
const borderRadius = 8;
const borderLeftRadius = 5;
const borderRightRadius = 15;
const regularFontSize = 13;
const boldFontSize = 14;
const optionsFontSize = 16;
const optionsBoldVal = "400";

function wp(percentage) {
  const value = percentage * width / 100;
  return Math.round(value);
}
function hp(percentage) {
  const value = percentage * height / 100;
  return Math.round(value);
}

export interface Props {
  data: Object;
  chatAction: Function;
  showIcon: boolean;
  animate: boolean;
}

export interface State {
  imageLoading: Boolean;
}

export default class MapBlob extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      imageLoading: true,
    };
  }

  componentDidMount() {
    //Animate Imageblob Entrance
    if (this._viewRef) {
      if (this.props.animate === 1) {
        this._viewRef.fadeIn(700);
      } else if (this.props.animate === 2) {
        this._viewRef.fadeInLeft(700);
        // this._viewRef.fadeInDown(700);
      }
    }
  }

  saveRef = ref => (this.containerNode = ref);

  _renderIconOnLeft(showIcon) {
    return (
      <View>
        {showIcon === true ? (
          <Icon name={"plane-shield"} color={Constants.Colors.chatPrimaryAccent} size={42} />
        ) : null}
      </View>
    );
  }

  _renderHeader(data) {
    return (
      <View style={styles.header}>
        <Icon
          name={"plane-shield"}
          color="white"
          size={30}
          style={{ marginLeft: 10, alignSelf: "center" }}
        />

        <View style={styles.headerText}>
          <Text style={{ fontWeight: "bold", color: "white", fontSize: boldFontSize }}>
            {data.origin} to {data.destination}
          </Text>
        </View>
      </View>
    );
  }

  _iterRenderMapData = data => {
    let renderVal = [];

    if (data instanceof Object) {
      for (let key in data) {
        let param = Util.capitalizeFirstLetter(key);
        let value = data[key];
        renderVal.push(
          <View key={key} style={{ flexDirection: "row", flex: 1 }}>
            <View style={{ flex: 0.5, alignItems: "flex-start" }}>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={[{ flex: 1, marginLeft: 10 }, styles.mapDataText]}>
                {param}
              </Text>
            </View>
            <View style={{ flex: 0.5, alignItems: "flex-end" }}>
              <Text
                ellipsizeMode="tail"
                numberOfLines={1}
                style={[{ flex: 1, marginRight: 10 }, styles.mapDataText]}>
                {value}
              </Text>
            </View>
          </View>,
        );
      }

      return renderVal;
    }
  };

  _renderMapData(data, chatAction) {
    return (
      <View style={styles.aiTextView}>
        {/* Render all Map data such as distance, duration, traffic etc., */}
        {data.mapData && data.mapData !== undefined ? (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              paddingVertical: 10,
            }}>
            {this._iterRenderMapData(data.mapData)}
          </View>
        ) : null}

        {data.summary || data.summary ? <View>{this.divider}</View> : null}

        {data.summary ? (
          <Text style={[{ alignSelf: "flex-start" }, styles.aiText, { paddingRight: 10 }]}>
            {data.summary}
          </Text>
        ) : null}
      </View>
    );
  }

  divider = (
    <View
      style={{
        height: 0.5,
        alignSelf: "center",
        width: "90%",
        backgroundColor: colorizedBlob ? "#d1d1d1" : "#d1d1d1",
      }}
    />
  );

  slideOptions = (data, chatAction) => {
    return <View style={styles.optionsView}>{this._generateOptions(data, chatAction)}</View>;
  };

  _generateOptions = (item, chatAction) => {
    let uiOptions = [];

    var ind = 0;
    for (ind; ind < item.options.length; ind++) {
      let title = item.options[ind].title.toUpperCase();
      let action = item.options[ind].action;
      uiOptions.push(
        <View key={ind} style={{ flex: 0, marginTop: 10, marginBottom: 10 }}>
          <TouchableOpacity
            onPress={() => {
              chatAction(title, action);
            }}>
            <View>
              <Text
                style={{
                  color: Constants.Colors.chatOptions,
                  fontWeight: optionsBoldVal,
                  fontSize: optionsFontSize,
                  // borderColor: Constants.Colors.chatOptions,
                  // borderWidth: 1,
                  // borderRadius: 20,
                  // paddingHorizontal: 5,
                  // paddingVertical: 3,
                }}>
                {title}
              </Text>
            </View>
          </TouchableOpacity>
        </View>,
      );
    }

    return uiOptions;
  };

  _renderImageOnly(data) {
    return (
      <View style={{ flex: 1, flexDirection: "column", justifyContent: "center" }}>
        <TouchableHighlight
          onPress={() => {
            this.props.chatAction(data.imageUrl, "phone/mapView");
          }}>
          <Image
            source={{ uri: data.imageUrl }}
            style={[styles.mainImage]}
            onLoad={e => {
              this.setState({ imageLoading: false });
            }}
          />
        </TouchableHighlight>
        {this.state.imageLoading === true ? (
          <Spinner
            color={Constants.Colors.chatDarkAccent}
            style={{
              flex: 1,
              marginTop: -hp(20),
              alignSelf: "center",
              justifyContent: "center",
            }}
          />
        ) : null}
      </View>
    );
  }

  render() {
    var { data, chatAction } = this.props;

    return (
      <AnimView
        useNativeDriver={true}
        ref={ref => {
          this._viewRef = ref;
        }}
        style={styles.mainContainer}>
        {/* Render UserLogo To Left of Card */}
        <View style={styles.aiIconView}>{this._renderIconOnLeft(this.props.showIcon)}</View>

        <View style={[styles.innerContainer, { marginLeft: this.props.showIcon ? 0 : 0 }]}>
          {/* Render Header Route Info */}
          {/* {data.origin && data.destination ? this._renderHeader(data.mapData) : null} */}

          {/* Static Map Image */}
          <View style={styles.aiImageView}>
            {data.imageUrl ? this._renderImageOnly(data) : null}
          </View>

          {/* Summary, Distance & Traffic Data */}
          {data.summary ? this._renderMapData(data, chatAction) : null}

          {/* Template Options Buttons Section */}
          {data.options && data.options.length > 0 ? this.slideOptions(data, chatAction) : null}
        </View>
      </AnimView>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    // transform: [{ scaleY: -1 }],
    alignItems: "flex-start",
    justifyContent: "flex-start",
    marginBottom: 15,
  },
  innerContainer: {
    flex: 0.75, //0.8 if the box should stetch to far right end of screen
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  header: {
    flex: 1,
    flexDirection: "row",
    height: headerHeight,
    backgroundColor: Constants.Colors.botChatBlob,
    borderTopLeftRadius: borderLeftRadius,
    borderTopRightRadius: borderRightRadius,
  },
  headerText: {
    flexDirection: "column",
    flex: 1,
    alignItems: "flex-start",
    marginLeft: 10,
    justifyContent: "center",
  },
  aiIconView: {
    flex: 0.15,
    alignSelf: "flex-start",
    alignItems: "center",
  },
  aiImageView: {
    flex: 1,
    alignSelf: "flex-start",
    alignItems: "flex-start",
  },
  mainImage: {
    height: hp(30),
    width: wp(75),
    flex: 1,
    borderTopLeftRadius: borderLeftRadius,
    borderTopRightRadius: borderRightRadius,
  },

  aiTextView: {
    backgroundColor: Constants.Colors.botChatBlob,
    width: "100%",
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
  },
  aiText: {
    backgroundColor: Constants.Colors.botChatBlob, //"#dbdbdb",
    padding: 10,
    fontSize: 16,
    borderRadius: 8,
    color: Constants.Colors.botChatText, //#707070
  },
  optionsView: {
    flex: 0,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
    alignItems: "center",
    backgroundColor: "white",
  },
  mapDataText: {
    color: "white",
    fontWeight: "bold",
    fontSize: boldFontSize,
    paddingVertical: 2,
  },
};
