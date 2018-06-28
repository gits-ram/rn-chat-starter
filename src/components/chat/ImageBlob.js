import React, { Component } from "react";
import { Image, View, Dimensions, TouchableHighlight } from "react-native";
import { Text, Card, CardItem, Thumbnail, Body, Left, Spinner } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View as AnimView } from "react-native-animatable";
import Constants from "../../global/constants";

var width = Dimensions.get("window").width;
const messages = ["hello", "this is supposed to be a bit of a long line.", "bye"];

export interface Props {
  title: String;
  text: String;
  image: String;
}

export interface State {
  imageLoading: Boolean;
}

export default class ImageBlob extends React.PureComponent {
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
        this._viewRef.fadeIn(500);
      } else if (this.props.animate === 2) {
        this._viewRef.fadeInDown(600);
      }
    }
  }

  //UNUSED
  onLayout = e => {
    // console.log("OnLayout:" + e.nativeEvent.layout.height);
  };
  measure() {
    const { clientWidth, clientHeight } = this.containerNode;
    // console.log("CLIENT HT;" + clientHeight);
  }

  saveRef = ref => (this.containerNode = ref);

  _renderTitleOnTop() {
    return (
      <CardItem style={{ marginLeft: -5, height: 45 }}>
        <Left>
          <Thumbnail
            small
            source={{
              uri:
                "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/1200px-AirAsia_New_Logo.svg.png",
            }}
          />
          <Body style={{ marginLeft: 2 }}>
            <Text> {this.props.title} </Text>
          </Body>
        </Left>
      </CardItem>
    );
  }

  _renderIconOnLeft(showIcon) {
    return (
      <View>
        {showIcon === true ? (
          <Icon name={"plane-shield"} color={Constants.Colors.chatPrimaryAccent} size={42} />
        ) : null}
      </View>
    );
  }

  _renderImageCardWithComments(imgUrl) {
    return (
      <Card style={styles.cardContainer} onLayout={this.onLayout}>
        {/* Render Title on Top of Card */}
        {/* {this._renderTitleOnTop()} */}

        <CardItem style={styles.cardItemContainer}>
          <Body style={styles.bodyContainer}>
            <TouchableHighlight
              onPress={() => {
                this.props.chatAction(imgUrl, "phone/imgPreview");
              }}>
              <Image
                source={{ uri: imgUrl }}
                style={{ width: 220, height: 160, flex: 0 }}
                onLoad={e => this.setState({ imageLoading: false })}
              />
            </TouchableHighlight>
            {this.state.imageLoading === true ? (
              <Spinner color={Constants.Colors.chatPrimaryAccent} style={styles.spinner} />
            ) : null}
          </Body>
        </CardItem>
        <View style={styles.commentTextView}>
          <Text style={{ color: Constants.Colors.botChatText }}>{this.props.text}</Text>
        </View>
      </Card>
    );
  }

  _renderImageOnly(imgUrl) {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            this.props.chatAction(imgUrl, "phone/imgPreview");
          }}>
          <Image
            source={{ uri: imgUrl }}
            style={{
              height: 160,
              width: 200,
              flex: 0,
              borderRadius: 5,
            }}
            onLoad={e => this.setState({ imageLoading: false })}
          />
        </TouchableHighlight>
        {this.state.imageLoading === true ? (
          <Spinner
            color="#356CB1"
            style={{
              flex: 0,
              marginTop: -120,
              height: 120,
              width: 150,
              alignSelf: "center",
            }}
          />
        ) : null}
      </View>
    );
  }

  render() {
    var imgUrl = this.props.image;

    return (
      <AnimView
        useNativeDriver={true}
        ref={ref => {
          this._viewRef = ref;
        }}
        style={styles.mainContainer}
        onLayout={this.onLayout}>
        {/* Render UserLogo To Left of Card */}
        <View style={styles.aiIconView}>{this._renderIconOnLeft(this.props.showIcon)}</View>

        <View style={styles.aiImageView}>
          {(this.props.text && this.props.text.length) > 0
            ? this._renderImageCardWithComments(imgUrl)
            : this._renderImageOnly(imgUrl)}
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
    marginBottom: 10,
  },
  aiIconView: {
    flex: 0.15,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  aiImageView: {
    flex: 0.7, //0.8 if the box should stetch to far right end of screen
    alignSelf: "flex-start",
    alignItems: "flex-start",
    marginLeft: -3,
  },
  cardContainer: {
    flex: 0,
    width: "100%", //85% before when no outer view with flex:0.85 was there
    backgroundColor: "#FFF", //"#FFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardItemContainer: {
    flex: 0,
    width: "95%",
    paddingVertical: 4,
    paddingHorizontal: 2,
    // marginTop: 5,
    backgroundColor: "#FFF", //"#F5F5F5",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  bodyContainer: {
    flex: 0,
    // flexWrap: "wrap",
    width: "100%",
    marginLeft: 0,
    marginRight: 0,
    padding: 0,
    backgroundColor: "#FFF", //"#F5F5F5",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  commentTextView: {
    width: "100%",
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    backgroundColor: Constants.Colors.botChatBlob,
    alignItems: "center",
  },
  spinner: {
    flex: 0,
    marginTop: -120,
    height: 120,
    width: 150,
    alignSelf: "center",
  },
};

////CHAT TEXT BLOB WRAP TEXT SAMPLE/////
// <View
//   style={{
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     padding: 5,
//     width: "100%",
//     transform: [{ scaleY: -1 }],
//     alignItems: "flex-end",
//     justifyContent: "flex-start",
//     backgroundColor: "#fff"
//   }}
// >
//   {messages.map((message, index) => (
//     <View key={index} style={{ flexDirection: "row", marginTop: 10 }}>
//       <View
//         style={{
//           flex: 0,
//           marginLeft: 5,
//           marginRight: 5,
//           backgroundColor: "#CCC",
//           borderRadius: 10,
//           padding: 5
//         }}
//       >
//         <Text style={{ fontSize: 15 }}>{message}</Text>
//       </View>
//       <Image
//         source={{
//           uri:
//             "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/AirAsia_New_Logo.svg/1200px-AirAsia_New_Logo.svg.png"
//         }}
//         style={{ width: 35, height: 35 }}
//       />
//     </View>
//   ))}
// </View>
