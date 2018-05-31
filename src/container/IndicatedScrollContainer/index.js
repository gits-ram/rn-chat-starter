import React, { Component } from "react";
import { View, Image } from "react-native";
import { Left, Body, Thumbnail, Card, CardItem, Text } from "native-base";
import Constants from "../../global/constants";
import IndicatedScrollView from "../../components/IndicatedScrollView";

export default class IndicatedScrollContainer extends Component {
  state = {};
  itemsArray = [
    "Close To The Sun",
    "Mercury",
    "Venus",
    "Earth",
    "Mars",
    "Away From The Sun",
    "Jupiter",
    "Saturn",
    "Uranus",
    "Neptune",
    "Other Heavenly Bodies",
    "Sun",
    "Moon",
    "Comet",
    "Asteroids",
  ];
  itemsHtArray = [30, 250, 250, 250, 250, 30, 250, 250, 250, 250, 30, 250, 250, 250];

  _renderHeader = headerText => {
    return (
      <View
        style={{
          height: 30,
          width: "100%",
          backgroundColor: "#CED0CE",
        }}>
        <Text style={{ color: "black", fontSize: 15 }}> {headerText} </Text>
      </View>
    );
  };

  _renderCard(name, wid = 300, ht = 250) {
    return (
      <Card style={{ width: wid, height: ht }}>
        <CardItem style={{ height: "20%" }}>
          <Left>
            <Thumbnail
              source={{
                uri:
                  "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/256x256/plain/planet.png",
              }}
            />
            <Body>
              <Text>Planet {name} </Text>
              <Text note>Milkyway Galaxy</Text>
            </Body>
          </Left>
        </CardItem>
        <CardItem style={{ height: "80%", width: "90%" }}>
          <Image
            source={{
              uri: "http://stilearning.com/vision/1.1/assets/globals/img/dummy/img-10.jpg",
            }}
            style={{ height: "95%", width: "100%" }}
          />
        </CardItem>
      </Card>
    );
  }

  _renderScrollView() {
    let renderArray = [];

    this.itemsArray.forEach((item, i) => {
      let renderItem;

      if (this.itemsHtArray[i] === 30) {
        renderItem = this._renderHeader(item);
      } else {
        renderItem = this._renderCard(item);
      }

      renderArray.push(<View key={item}>{renderItem}</View>);
    });
    return <View style={{ flex: 1, width: "100%", height: "100%" }}>{renderArray}</View>;
  }

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Constants.Colors.greyBackground }}>
        <IndicatedScrollView
          renderItem={this._renderScrollView.bind(this)}
          itemsHeight={this.itemsHtArray}
          orientation="vertical"
          indicatorType="line"
        />
      </View>
    );
  }
}

// import React, { Component } from "react";
// import {
//   Animated,
//   View,
//   StyleSheet,
//   Image,
//   Dimensions,
//   Text,
//   ScrollView,
//   TouchableWithoutFeedback,
//   TouchableOpacity,
// } from "react-native";

// // Variables used only for renderSample()
// const deviceWidth = Dimensions.get("window").width;
// const deviceHeight = 260; //Dimensions.get("window").height;
// const FIXED_BAR_HEIGHT = 400;
// const array = [0, 280, 540, 800, 1060, 1340, 1620, 1880, 2140, 2400];
// const images = [
//   "https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png",
//   "https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg",
//   "https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg",
//   "https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png",
//   "https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg",
//   "https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg",
//   "https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png",
//   "https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg",
//   "https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg",
//   "https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png",
//   "https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg",
//   "https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg",
//   "https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png",
//   "https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg",
//   "https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg",
//   "https://s-media-cache-ak0.pinimg.com/originals/ee/51/39/ee5139157407967591081ee04723259a.png",
//   "https://s-media-cache-ak0.pinimg.com/originals/40/4f/83/404f83e93175630e77bc29b3fe727cbe.jpg",
//   "https://s-media-cache-ak0.pinimg.com/originals/8d/1a/da/8d1adab145a2d606c85e339873b9bb0e.jpg",
// ];
// const BAR_SPACE = 5;

// export default class IndicatedScrollContainer extends Component {
//   animScrollVal = new Animated.Value(0);
//   itemHeight = 20;

//   render() {
//     let imageArray = [];
//     let indicatorArray = [];

//     images.forEach((image, i) => {
//       const thisImage = (
//         <Image
//           key={`image${i}`}
//           source={{ uri: image }}
//           style={{ width: deviceWidth, height: deviceHeight }}
//         />
//       );
//       // const thisImage = this._renderCard(i, 310, deviceHeight);
//       imageArray.push(thisImage);

//       ////////BAR INDICATOR//////////
//       const scrollBarVal = this.animScrollVal.interpolate({
//         // /1.1 because we are not scrolling full screen size objects, so this value may need tweaks
//         inputRange: [deviceHeight / 1.03 * (i - 1), deviceHeight / 1.03 * (i + 1)],
//         outputRange: [-this.itemHeight, this.itemHeight],
//         extrapolate: "clamp",
//       });

//       ///////DOT INDICATOR///////
//       const position = Animated.divide(this.animScrollVal, deviceHeight / 1.06); //1.06 because we are not scrolling full screen size objects, so this value may need tweaks
//       let opacity = position.interpolate({
//         inputRange: [i - 1, i, i + 1], // each dot will need to have an opacity of 1 when position is equal to their index (i)
//         outputRange: [0.3, 1, 0.3], // when position is not i, the opacity of the dot will animate to 0.3
//         extrapolate: "clamp", // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
//       });

//       const dotIndicator = (
//         <TouchableOpacity
//           onPress={() => {
//             this._scrollRef.scrollTo({
//               y: i * (deviceHeight / 1.06),
//               x: 0,
//               animated: true,
//             });
//           }}>
//           <Animated.View
//             key={i}
//             style={
//               (styles.bar,
//               {
//                 opacity,
//                 height: 10,
//                 width: 10,
//                 backgroundColor: "#FF0000",
//                 margin: 8,
//                 borderRadius: 5,
//               })
//             }
//           />
//         </TouchableOpacity>
//       );

//       const barIndicator = (
//         <TouchableWithoutFeedback
//           onPressIn={() => {
//             this._scrollRef.scrollTo({
//               y: i * (deviceHeight / 1.03),
//               x: 0,
//               animated: true,
//             });
//           }}>
//           <View
//             key={`bar${i}`}
//             style={[
//               styles.track,
//               {
//                 height: this.itemHeight,
//                 marginTop: i === 0 ? 0 : BAR_SPACE, // BAR_SPACE,  barspace removed!
//                 backgroundColor: i > 5 ? "green" : "blue",
//               },
//             ]}>
//             <Animated.View
//               style={[
//                 styles.bar,
//                 {
//                   height: this.itemHeight,
//                   transform: [{ translateY: scrollBarVal }],
//                 },
//               ]}
//             />
//           </View>
//         </TouchableWithoutFeedback>
//       );

//       indicatorArray.push(barIndicator);
//     });

//     return (
//       <View style={styles.container}>
//         <View style={styles.scrollContainer}>
//           <ScrollView
//             style={{ backgroundColor: "#f5f5f5" }}
//             ref={ref => {
//               this._scrollRef = ref;
//             }}
//             showsVerticalScrollIndicator={false}
//             scrollEventThrottle={10}
//             pagingEnabled
//             onScroll={Animated.event([
//               { nativeEvent: { contentOffset: { y: this.animScrollVal } } },
//             ])}>
//             {imageArray}
//           </ScrollView>
//         </View>
//         <View style={styles.barContainer}>{indicatorArray}</View>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: "center",
//     justifyContent: "flex-start",
//     flexDirection: "row",
//   },
//   scrollContainer: {
//     flex: 0.95,
//     paddingLeft: 10,
//     alignItems: "flex-start",
//     justifyContent: "center",
//   },
//   barContainer: {
//     flex: 0.05,
//     zIndex: 2,
//     alignItems: "center",
//     alignSelf: "center",
//     justifyContent: "center",
//   },
//   track: {
//     backgroundColor: "#fff",
//     overflow: "hidden",
//     width: 5,
//   },
//   bar: {
//     backgroundColor: "red", //red
//     width: 5,
//     position: "absolute",
//     left: 0,
//     top: 0,
//   },
// });
