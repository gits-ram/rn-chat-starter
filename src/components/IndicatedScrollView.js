import React, { Component } from "react";
import {
  Animated,
  View,
  StyleSheet,
  Image,
  Dimensions,
  ScrollView,
  TouchableWithoutFeedback,
  TouchableOpacity,
  PanResponder,
  Text,
} from "react-native";

//Variables used only for renderSample()
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
// ];

const BAR_SPACE = 5;
let xScrollCoordinates = [0];
let yScrollCoordinates = [0];

export interface Props {
  renderItem: Function;
  itemsHeight: int[]; //If Orientation-Vertical
  itemsWidth: int[]; //If Orientation-Horizontal
  orientation: String; //"vertical/horizontal"
  indicatorType: String; //"bar, dot, line"
}

export interface State {
  activeIndex: 0;
}

export default class IndicatedScrollView extends Component<Props, State> {
  numItems = 0;
  barSize = 20;
  dotSize = 10;
  animScrollVal = new Animated.Value(0);
  itemSize = 0;

  panResponder = {};

  constructor(props) {
    super(props);

    //Ignore Header Items For Scroll Indicator
    for (let i = 0; i < this.props.itemsHeight.length; i++) {
      if (this.props.itemsHeight[i] !== 30) {
        this.numItems++;
      }
    }
    this.barSize =
      this.props.indicatorType === "bar"
        ? 10
        : (Dimensions.get("window").height - 150) / this.numItems;
  }

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderMove: this.handlePanResponderMove,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd,
      onMoveShouldSetPanResponder: this.handleOnMoveShouldSetPanResponder,
    });
  }

  // Should we become active when the user presses down on the square?
  handleStartShouldSetPanResponder = () => {
    return true;
  };

  handleOnMoveShouldSetPanResponder = (evt, gestureState) => {
    //return true if user is swiping, return false if it's a single click
    return !(gestureState.dx === 0 && gestureState.dy === 0);
  };

  // We were granted responder status! Let's update the UI
  handlePanResponderGrant = evt => {};

  // Every time the touch/mouse moves
  handlePanResponderMove = (e, gestureState) => {
    let activeInd = gestureState.dy / this.barSize;
    let scrollInd = this.state.activeIndex + Math.floor(activeInd);
    if (scrollInd < 0) {
      scrollInd = 0;
    }
    this._scrollRef.scrollTo({
      y: scrollInd * this.itemSize,
      x: 0,
      animated: true,
    });
    // console.log(" - scrollInd:" + (this.state.activeIndex + Math.floor(activeInd)));
  };

  // When the touch/mouse is lifted
  handlePanResponderEnd = (e, gestureState) => {};

  find_dimensions(layout, view) {
    const { x, y, width, height } = layout;

    if (view === "main") {
      this.calculateScrollCoordinates(height);
      this.forceUpdate();
    } else if (view === "text") {
      if (this._barLineRef) {
        this._barLineRef.measure((fx, fy, width, height, px, py) => {
          console.log("Component width is: " + width);
          console.log("Component height is: " + height);
          console.log("X offset to frame: " + fx);
          console.log("Y offset to frame: " + fy);
          console.log("X offset to page: " + px);
          console.log("Y offset to page: " + py);
        });
      }
    }
  }

  calculateScrollCoordinates(ht) {
    if (this.props.orientation === "vertical") {
      let totalHeight = 0;
      for (let i = 0; i < this.props.itemsHeight.length; i++) {
        totalHeight += this.props.itemsHeight[i];
      }

      this.itemSize = totalHeight / this.numItems;
    } else {
      let totalWidth = 0;
      for (let i = 0; i < this.props.itemsWidth.length; i++) {
        totalWidth += this.props.itemsWidth[i];
      }

      this.itemSize = totalWidth / this.numItems;
    }

    //   for (let i = 0; i < this.props.itemsHeight.length; i++) {
    //     if (i === 0) {
    //       yScrollCoordinates[i] = 0;
    //     } else if (i === this.props.itemsHeight.length - 1) {
    //       yScrollCoordinates[i] = yScrollCoordinates[i - 1] + this.props.itemsHeight[i - 1];
    //       yScrollCoordinates[i + 1] = yScrollCoordinates[i] + this.props.itemsHeight[i - 1];
    //     } else {
    //       yScrollCoordinates[i] = yScrollCoordinates[i - 1] + this.props.itemsHeight[i - 1];
    //     }
    //   }
    // } else {
    //   for (let i = 0; i < this.props.itemsWidth.length; i++) {
    //     if (i === 0) {
    //       xScrollCoordinates[i] = 0;
    //     } else if (i === this.props.itemsWidth.length - 1) {
    //       xScrollCoordinates[i] = xScrollCoordinates[i - 1] + this.props.itemsWidth[i - 1];
    //       xScrollCoordinates[i + 1] = xScrollCoordinates[i] + this.props.itemsWidth[i - 1];
    //     } else {
    //       xScrollCoordinates[i] = xScrollCoordinates[i - 1] + this.props.itemsWidth[i - 1];
    //     }
    //   }
  }

  render() {
    let orient = this.props.orientation;
    let type = this.props.indicatorType;
    let indicatorArray = [];
    // let itemCoords = orient === "vertical" ? yScrollCoordinates : xScrollCoordinates;

    //Stop 1 index before, as last itemCoords is a dummy required for inputRange setting
    for (let i = 0; i < this.numItems; i++) {
      ////////BAR INDICATOR//////////
      if (this.props.indicatorType === "dot" && this.itemSize !== 0) {
        ///////DOT INDICATOR///////
        const position = Animated.divide(this.animScrollVal, 265);

        let opacity = position.interpolate({
          // each dot will need to have an opacity of 1 when position is equal to their index (i)
          inputRange: [i - 1, i, i + 1],
          // when position is not i, the opacity of the dot will animate to 0.3
          outputRange: [0.3, 1, 0.3],
          extrapolate: "clamp", // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
        });

        const dotIndicator = (
          <TouchableOpacity
            onPress={() => {
              orient === "vertical"
                ? this._scrollRef.scrollTo({
                    y: i * this.itemSize,
                    x: 0,
                    animated: true,
                  })
                : this._scrollRef.scrollTo({
                    y: 0,
                    x: i * this.itemSize,
                    animated: true,
                  });
            }}>
            <Animated.View
              key={i}
              style={
                (styles.bar,
                {
                  opacity,
                  height: this.dotSize,
                  width: this.dotSize,
                  backgroundColor: "#FF0000",
                  margin: 8,
                  borderRadius: 5,
                })
              }
            />
          </TouchableOpacity>
        );

        indicatorArray.push(dotIndicator);
      } else {
        const scrollBarVal = this.animScrollVal.interpolate({
          //Set Input Range as differnce between two itemCoords
          inputRange: [this.itemSize * (i - 1), this.itemSize * (i + 1)],
          //Set Output Range to move the actual barSize
          outputRange: [-this.barSize, this.barSize],
          //To disallow moving more than the define barsize
          extrapolate: "clamp",
        });

        const barIndicator = (
          <View
            key={`bar${i}`}
            {...this.panResponder.panHandlers}
            // onLayout={event => {
            //   this.find_dimensions(event.nativeEvent.layout, "bar");
            // }}
            ref={ref => {
              this._barLineRef = ref;
            }}>
            <TouchableWithoutFeedback
              onPressIn={() => {
                this.setState({ activeIndex: i });
                orient === "vertical"
                  ? this._scrollRef.scrollTo({
                      y: i * this.itemSize,
                      x: 0,
                      animated: true,
                    })
                  : this._scrollRef.scrollTo({
                      y: 0,
                      x: i * this.itemSize,
                      animated: true,
                    });
              }}>
              <View
                // key={`bar${i}`}
                style={[
                  styles.track,
                  {
                    width: orient === "horizontal" ? this.barSize : 5,
                    height: orient === "vertical" ? this.barSize : 5,
                    marginTop: i === 0 ? 0 : type === "bar" ? BAR_SPACE : 0,
                    backgroundColor: i > 7 ? "grey" : i > 3 ? "green" : "blue",
                  },
                ]}>
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      backgroundColor: type === "line" ? "transparent" : "red",
                      width: orient === "horizontal" ? this.barSize : 5,
                      height: orient === "vertical" ? this.barSize : 5,
                      transform: [{ translateY: scrollBarVal }],
                    },
                  ]}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        );

        indicatorArray.push(barIndicator);
      }
    }

    return (
      <View style={styles.container}>
        <View
          style={styles.scrollContainer}
          onLayout={event => {
            this.find_dimensions(event.nativeEvent.layout, "main");
          }}>
          <ScrollView
            horizontal={this.props.orientation === "horizontal" ? true : false}
            ref={ref => {
              this._scrollRef = ref;
            }}
            showsVerticalScrollIndicator={false}
            scrollEventThrottle={10}
            pagingEnabled
            onScroll={Animated.event([
              { nativeEvent: { contentOffset: { y: this.animScrollVal } } },
            ])}>
            {this.props.renderItem()}
          </ScrollView>
        </View>
        <View
          style={
            (styles.barContainer,
            { flexDirection: this.props.orientation === "vertical" ? "column" : "row" })
          }>
          {indicatorArray}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "row",
  },
  scrollContainer: {
    flex: 0.95,
    paddingLeft: 10,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  barContainer: {
    flex: 0.05,
    zIndex: 2,
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  track: {
    backgroundColor: "#fff",
    overflow: "hidden",
    width: 5,
  },
  bar: {
    backgroundColor: "transparent", //red
    width: 5,
    position: "absolute",
    left: 0,
    top: 0,
  },
});

// _renderCard(num, wid, ht) {
//   return (
//     <Card style={{ width: wid, height: ht, paddingTop: 10, paddingBottom: 10 }}>
//       <CardItem style={{ height: 50, padding: 2 }}>
//         <Left>
//           <Thumbnail
//             source={{
//               uri:
//                 "https://d1nhio0ox7pgb.cloudfront.net/_img/o_collection_png/green_dark_grey/256x256/plain/planet.png",
//             }}
//           />
//           <Body>
//             <Text>Planet Number #{num} </Text>
//             <Text note>April 25, 2018</Text>
//           </Body>
//         </Left>
//       </CardItem>
//       <CardItem>
//         <Image
//           source={{
//             uri: "http://stilearning.com/vision/1.1/assets/globals/img/dummy/img-10.jpg",
//           }}
//           style={{ height: 160, width: wid - 35 }}
//         />
//       </CardItem>
//     </Card>
//   );
// }
// renderSample() {
//   let imageArray = [];
//   let indicatorArray = [];

//   images.forEach((image, i) => {
//     // const thisImage = (
//     //   <Image
//     //     key={`image${i}`}
//     //     source={{ uri: image }}
//     //     style={{ width: deviceWidth, height: deviceHeight }}
//     //   />
//     // );
//     const thisImage = this._renderCard(i, 310, deviceHeight);
//     imageArray.push(thisImage);
//     if (i === 5) {
//       const header2 = (
//         <View style={{ backgroundColor: "grey", width: "100%", height: 20 }}>
//           <Text style={{ color: "black", fontSize: 14 }}> Completed - Green </Text>
//         </View>
//       );
//       imageArray.push(header2);
//     }

//     ////////BAR INDICATOR//////////
//     const scrollBarVal = this.animScrollVal.interpolate({
//       // /1.1 because we are not scrolling full screen size objects, so this value may need tweaks
//       inputRange: [deviceHeight / 1.1 * (i - 1), deviceHeight / 1.1 * (i + 1)],
//       outputRange: [-this.itemHeight, this.itemHeight],
//       extrapolate: "clamp",
//     });

//     ///////DOT INDICATOR///////
//     const position = Animated.divide(this.animScrollVal, deviceHeight / 1.06); //1.06 because we are not scrolling full screen size objects, so this value may need tweaks
//     let opacity = position.interpolate({
//       inputRange: [i - 1, i, i + 1], // each dot will need to have an opacity of 1 when position is equal to their index (i)
//       outputRange: [0.3, 1, 0.3], // when position is not i, the opacity of the dot will animate to 0.3
//       extrapolate: "clamp", // this will prevent the opacity of the dots from going outside of the outputRange (i.e. opacity will not be less than 0.3)
//     });

//     const dotIndicator = (
//       <TouchableOpacity
//         onPress={() => {
//           this._scrollRef.scrollTo({
//             y: i * (deviceHeight / 1.06),
//             x: 0,
//             animated: true,
//           });
//         }}>
//         <Animated.View
//           key={i}
//           style={
//             (styles.bar,
//             {
//               opacity,
//               height: 10,
//               width: 10,
//               backgroundColor: "#FF0000",
//               margin: 8,
//               borderRadius: 5,
//             })
//           }
//         />
//       </TouchableOpacity>
//     );

//     const barIndicator = (
//       <TouchableWithoutFeedback
//         onPressIn={() => {
//           this._scrollRef.scrollTo({
//             y: i * (deviceHeight / 1.1),
//             x: 0,
//             animated: true,
//           });
//         }}>
//         <View
//           key={`bar${i}`}
//           style={[
//             styles.track,
//             {
//               height: this.itemHeight,
//               marginTop: i === 0 ? 0 : 0, // BAR_SPACE,  barspace removed!
//               backgroundColor: i > 5 ? "green" : "blue",
//             },
//           ]}>
//           <Animated.View
//             style={[
//               styles.bar,
//               {
//                 height: this.itemHeight,
//                 transform: [{ translateY: scrollBarVal }],
//               },
//             ]}
//           />
//         </View>
//       </TouchableWithoutFeedback>
//     );

//     indicatorArray.push(barIndicator);
//   });

//   return (
//     <View style={styles.container}>
//       <View style={styles.scrollContainer}>
//         <ScrollView
//           style={{ backgroundColor: "#f5f5f5" }}
//           ref={ref => {
//             this._scrollRef = ref;
//           }}
//           showsVerticalScrollIndicator={false}
//           scrollEventThrottle={10}
//           pagingEnabled
//           onScroll={Animated.event([
//             { nativeEvent: { contentOffset: { y: this.animScrollVal } } },
//           ])}>
//           <View style={{ backgroundColor: "grey", width: "100%", height: 20 }}>
//             <Text style={{ color: "black", fontSize: 14 }}> In Progress - Blue </Text>
//           </View>
//           {this._renderItem()}
//           {/* {imageArray} */}
//         </ScrollView>
//       </View>
//       <View style={styles.barContainer}>{indicatorArray}</View>
//     </View>
//   );
// }
