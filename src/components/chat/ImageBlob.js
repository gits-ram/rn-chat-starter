import React, { Component } from "react";
import { Image, View, Dimensions, TouchableHighlight } from "react-native";
import { Text, Card, CardItem, Thumbnail, Body, Left, Spinner } from "native-base";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { View as AnimView } from "react-native-animatable";

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
      <View style={{ paddingRight: 5, alignSelf: "flex-end" }}>
        {showIcon === true ? <Icon name={"robot"} color={"#333333"} size={42} /> : null}
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
                this.props.chatAction(imgUrl, "imgPreview");
              }}>
              <Image
                source={{ uri: imgUrl }}
                style={{
                  width: 220,
                  height: 160,
                  flex: 0,
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
          </Body>
        </CardItem>
        <Text style={{ marginLeft: 5, color: "#707070" }}>{this.props.text}</Text>
      </Card>
    );
  }

  _renderImageOnly(imgUrl) {
    return (
      <View>
        <TouchableHighlight
          onPress={() => {
            this.props.chatAction(imgUrl, "imgPreview");
          }}>
          <Image
            source={{ uri: imgUrl }}
            style={{
              marginLeft: "10%",
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
        {this._renderIconOnLeft(this.props.showIcon)}

        {(this.props.text && this.props.text.length) > 0
          ? this._renderImageCardWithComments(imgUrl)
          : this._renderImageOnly(imgUrl)}
      </AnimView>
    );
  }
}

const styles = {
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 5,
    width: "85%",
    // transform: [{ scaleY: -1 }],
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  cardContainer: {
    flex: 0,
    width: "85%",
    backgroundColor: "#FFF",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  cardItemContainer: {
    flex: 0,
    width: "95%",
    paddingTop: 4,
    paddingBottom: 4,
    paddingLeft: 7,
    paddingRight: 7,
    marginTop: 5,
    backgroundColor: "#F5F5F5",
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
    backgroundColor: "#F5F5F5",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
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
