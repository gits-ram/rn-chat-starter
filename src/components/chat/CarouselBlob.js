import React from "react";
import {
  Image,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import Carousel, { Pagination, ParallaxImage } from "react-native-snap-carousel";
import { View as AnimView } from "react-native-animatable";
import Constants from "../../global/constants";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

const IS_IOS = Platform.OS === "ios";
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;
const entryBorderRadius = 8;

function wp(percentage) {
  const value = percentage * viewportWidth / 100;
  return Math.round(value);
}

export interface Props {
  slidesList: Object[];
  chatAction: Function;
  animate: number;
  showPagination: Boolean;
}

export interface State {
  currentSlide: number;
  _carouselRef: React.Component<Carousel>;
}

export default class CarouselBlob extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
    };
  }

  componentDidMount() {
    if (this._viewRef) {
      if (this.props.animate === 1) {
        this._viewRef.fadeInLeft(700);
      } else if (this.props.animate === 2) {
        this._viewRef.fadeInLeft(700);
        // this._viewRef.fadeInDown(700);
      }
    }
  }

  _renderSlide({ item, index }, parallaxProps) {
    return (
      <Slide
        item={item}
        index={index}
        parallaxProps={parallaxProps}
        chatAction={this.props.chatAction}
      />
    );
  }

  render() {
    return (
      <AnimView
        useNativeDriver={true}
        ref={ref => {
          this._viewRef = ref;
        }}
        style={{ flex: 1 }}>
        <Carousel
          //Here, pushing the ref into state and then reading from state into the other child(pagination).
          // Note: without the !this.state.one this will cause an infinite loop.
          ref={c => !this.state._carouselRef && this.setState({ _carouselRef: c })}
          data={this.props.slidesList.toJS()}
          renderItem={this._renderSlide.bind(this)}
          sliderWidth={sliderWidth}
          itemWidth={itemWidth}
          hasParallaxImages={true}
          inactiveSlideScale={0.95}
          inactiveSlideOpacity={1}
          enableMomentum={true}
          // activeSlideAlignment={"start"} //left-aligned
          containerCustomStyle={styles.slider}
          contentContainerCustomStyle={styles.sliderContentContainer}
          activeAnimationType={"spring"}
          activeAnimationOptions={{
            friction: 4,
            tension: 40,
          }}
          onSnapToItem={index => this.setState({ currentSlide: index })}
        />
        {this.props.pagination ? (
          <Pagination
            dotsLength={this.props.slidesList.toJS().length}
            activeDotIndex={this.state.currentSlide}
            containerStyle={styles.paginationContainer}
            dotColor={"rgba(13, 109, 229, 0.95)"}
            dotStyle={styles.paginationDot}
            inactiveDotColor={Constants.Colors.black}
            inactiveDotOpacity={0.4}
            inactiveDotScale={0.6}
            carouselRef={this.state._carouselRef}
            tappableDots={!!this.state._carouselRef}
          />
        ) : null}
      </AnimView>
    );
  }
}

const Slide = ({ item, index, parallaxProps, chatAction }) => {
  const uppercaseTitle = item.title ? (
    <Text style={styles.title} numberOfLines={2}>
      {item.title.toUpperCase()}
    </Text>
  ) : (
    false
  );

  return (
    <View activeOpacity={1} style={styles.slideInnerContainer}>
      <View style={styles.shadow} />
      <View style={[styles.imageContainer]}>
        {image(item.illustration, parallaxProps, true)}
        {/* <View style={[styles.radiusMask]} /> */}
      </View>
      <View style={[styles.textContainer]}>
        {uppercaseTitle}
        <Text style={[styles.subtitle]} numberOfLines={2}>
          {item.subtitle}
        </Text>
      </View>
      {item.options && item.options.length > 0 ? slideOptions(item.options, chatAction) : null}
    </View>
  );
};

const image = (imageUrl, parallaxProps, parallax) => {
  return parallax ? (
    <ParallaxImage
      source={imageUrl} //{{ uri: illustration }}
      containerStyle={[styles.imageContainer]}
      style={styles.image}
      parallaxFactor={0.35}
      showSpinner={true}
      spinnerColor={"rgba(255, 255, 255, 0.4)"}
      {...parallaxProps}
    />
  ) : (
    <Image source={imageUrl} /*{{ uri: illustration }}*/ style={styles.image} />
  );
};

const slideOptions = (options, chatAction) => {
  return <View style={styles.optionsView}>{generateOptions(options, chatAction)}</View>;
};

const generateOptions = (options, chatAction) => {
  let uiOptions = [];

  var ind = 0;
  for (ind; ind < options.length; ind++) {
    let title = options[ind].title.toUpperCase();
    let action = options[ind].action;
    uiOptions.push(
      <View key={ind} style={{ flex: 0, marginTop: 8, marginBottom: 5 }}>
        <TouchableOpacity
          onPress={() => {
            chatAction(title, action);
          }}>
          <View>
            <Text style={{ fontWeight: "bold", color: Constants.Colors.chatOptions, fontSize: 16 }}>
              {title}
            </Text>
          </View>
        </TouchableOpacity>
      </View>,
    );
  }

  return uiOptions;
};

const styles = StyleSheet.create({
  slider: {
    // marginTop: 5,
    overflow: "visible", // for custom animations
    marginBottom: 5,
  },
  sliderContentContainer: {
    paddingTop: 5, // for custom animation
  },
  slideInnerContainer: {
    width: itemWidth,
    //flex: 1 - if all slides height should be equal (note: this adjusts items heights accordingly)
    //flex: 0 - if slides should be of varied heights based on buttons/content inside
    flex: 1,
    paddingHorizontal: itemHorizontalMargin,
    paddingBottom: 7, // needed for shadow
  },
  shadow: {
    //not working - needs fix
    position: "absolute",
    top: 0,
    left: itemHorizontalMargin,
    right: itemHorizontalMargin,
    bottom: 7,
    shadowColor: "black",
    shadowOpacity: 1.0,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 10,
    borderRadius: entryBorderRadius,
  },
  imageContainer: {
    flex: 1,
    height: 150,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    borderRadius: IS_IOS ? entryBorderRadius : 0,
    borderTopLeftRadius: entryBorderRadius,
    borderTopRightRadius: entryBorderRadius,
  },
  // image's border radius is buggy on iOS; let's hack it!
  radiusMask: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: entryBorderRadius,
    backgroundColor: "white",
  },
  textContainer: {
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderBottomLeftRadius: 0, //entryBorderRadius,
    borderBottomRightRadius: 0, //entryBorderRadius,
  },
  title: {
    color: Constants.Colors.chatDarkAccent,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  subtitle: {
    marginTop: 1,
    color: Constants.Colors.chatDarkAccent,
    fontSize: 14,
    fontStyle: "italic",
  },

  optionsView: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: "center",
    backgroundColor: "white",
  },

  /* Pagination Not Implemented Yet */
  paginationContainer: {
    paddingTop: 2,
    paddingVertical: 12,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    // marginHorizontal: 8,
  },
});

// export const FLIGHT_DATA = {
//   type: "carousel",
//   slides: [
//     {
//       id: 0,
//       title: "Boeing 737",
//       subtitle: "First flight	 April 9, 1967",
//       illustration: require("../../../assets/img/flight/Boe737.jpg"),
//       options: [
//         { id: 0, title: "Book Flight Seat", action: "flight/booking" },
//         { id: 1, title: "Ship Cargo Via Carrier", action: "flight/cargobooking" },
//       ],
//     },
//     {
//       id: 1,
//       title: "Boeing 747",
//       subtitle: "First flight  February 9, 1969",
//       illustration: require("../../../assets/img/flight/Boe747.jpg"),
//       options: [
//         { id: 0, title: "Book Flight", action: "flight/booking" },
//         { id: 1, title: "Ship Cargo", action: "flight/cargobooking" },
//       ],
//     },
//     {
//       id: 2,
//       title: "Boeing 757",
//       subtitle: "First flight	 February 19, 1982",
//       illustration: require("../../../assets/img/flight/Boe757.jpg"),
//       options: [
//         { id: 0, title: "Book Flight Seats", action: "flight/booking" },
//         { id: 1, title: "Ship Cargo Via Carrier", action: "flight/cargobooking" },
//       ],
//     },
//     {
//       id: 3,
//       title: "Boeing 767",
//       subtitle: "First flight	 September 26, 1984",
//       illustration: require("../../../assets/img/flight/Boe767.jpg"),
//       options: [
//         { id: 0, title: "Book Flight", action: "flight/booking" },
//         { id: 1, title: "Ship Cargo", action: "flight/cargobooking" },
//       ],
//     },
//     {
//       id: 4,
//       title: "Boeing 777",
//       subtitle: "First flight	 June 12, 1994",
//       illustration: require("../../../assets/img/flight/Boe777.jpg"),
//       options: [
//         { id: 0, title: "Book Seats", action: "flight/booking" },
//         { id: 1, title: "Ship Cargo", action: "flight/cargobooking" },
//       ],
//     },
//     {
//       id: 5,
//       title: "Boeing 787",
//       subtitle: "First flight	 December 15, 2009",
//       illustration: require("../../../assets/img/flight/Boe787.jpg"),
//       options: [
//         { id: 0, title: "Book Flight Seats", action: "flight/booking" },
//         { id: 1, title: "Ship Cargo Via Carrier", action: "flight/cargobooking" },
//       ],
//     },
//   ],
// };
