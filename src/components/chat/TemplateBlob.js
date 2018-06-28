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
import MatIcon from "react-native-vector-icons/MaterialIcons";
import Carousel, { Pagination, ParallaxImage } from "react-native-snap-carousel";
import { View as AnimView } from "react-native-animatable";
import Constants from "../../global/constants";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

const IS_IOS = Platform.OS === "ios";
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

/* STYLE PARAMETERS */
const colorizedBlob = true;
const headerHeight = 55;
const borderRadius = 8;
const borderLeftRadius = 5;
const borderRightRadius = 15;
const boldFontSize = 14;
const regularFontSize = 13;
const airportCodeFont = 35;
const optionsFontSize = 16;
const optionsBoldVal = "400";

function wp(percentage) {
  const value = percentage * viewportWidth / 100;
  return Math.round(value);
}

export interface Props {
  slidesList: Object[];
  chatAction: Function;
  animate: number;
  showPagination: Boolean;

  //--Each Slide's Parameters--//
  // type: String; //Template Type - Availability, Booking, Status/boarding etc.,
  // headerTitle: String; //Ex: Booking Number
  // headerValue: String; //Ex: A593919
  // cargoRoutes: []; //Route Details like, flight num, type(nonstop), arrival/departure time, route
  // cargoDetails: []; //Cargo Name, weight, etc.,
  // pricing: Object;
  // options: [];
}

export interface State {
  currentSlide: number;
  _carouselRef: React.Component<Carousel>;
}

export default class TemplatelBlob extends React.Component<Props, State> {
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
        this._viewRef.fadeInDown(500);
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
    const { options, chatAction, showIcon } = this.props;

    return (
      <AnimView
        useNativeDriver={true}
        ref={ref => {
          this._viewRef = ref;
        }}
        style={{
          flexDirection: this.props.slidesList.length > 1 ? "column" : "row",
          flex: 1,
          paddingBottom: 5,
        }}>
        {this.props.slidesList.length < 2 ? (
          <View style={styles.aiIconView}>
            {showIcon === true ? (
              <Icon name={"plane-shield"} color={Constants.Colors.chatPrimaryAccent} size={42} />
            ) : null}
          </View>
        ) : null}
        <View style={{ flex: 1, marginLeft: this.props.slidesList.length > 1 ? 0 : -40 }}>
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
        </View>
      </AnimView>
    );
  }
}

const Slide = ({ item, index, parallaxProps, chatAction }) => {
  return (
    <View activeOpacity={1} style={styles.slideInnerContainer}>
      <View style={styles.shadow} />

      {/* Template Header Section */}
      {item.headerTitle || item.headerValue ? (
        <View
          style={{
            flex: 0,
            flexDirection: "row",
            height: headerHeight,
            backgroundColor: Constants.Colors.botChatBlob,
            borderTopLeftRadius: borderLeftRadius,
            borderTopRightRadius: borderRightRadius,
          }}>
          <Icon
            name={"plane-shield"}
            color="white"
            size={30}
            style={{ marginLeft: 10, alignSelf: "center" }}
          />

          <View
            style={{
              flexDirection: "column",
              flex: 1,
              alignItems: "flex-end",
              marginRight: 10,
              justifyContent: "center",
            }}>
            <Text style={{ color: "white", fontSize: regularFontSize }}> {item.headerTitle} </Text>
            <Text
              style={{
                marginRight: 5,
                fontWeight: "bold",
                color: "white",
                fontSize: boldFontSize,
              }}>
              {item.headerValue}
            </Text>
          </View>
        </View>
      ) : null}

      {item.headerTitle || item.headerValue ? <View>{divider}</View> : null}

      {/* Template Booking Number Info Section - Can be shown when header type is 'Status'*/}
      {item.templateType === "template-status" ? (
        <View
          style={{
            flex: 1,
            height: 55,
            marginLeft: 10,
            flexDirection: "column",
            justifyContent: "center",
          }}>
          <Text style={{ color: "white", fontSize: regularFontSize }}> Booking Number </Text>
          <Text
            style={{ fontWeight: "bold", marginLeft: 5, color: "white", fontSize: boldFontSize }}>
            {item.bookingNumber}
          </Text>
        </View>
      ) : null}

      {item.templateType === "template-status" ? <View>{divider}</View> : null}

      {/* Template Cargo Info Section */}
      {item.cargoDetails && item.cargoDetails.length > 0 ? (
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            paddingVertical: 10,
          }}>
          {item.templateType === "template-availability" ? (
            <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between" }}>
              <Text style={{ color: "white", marginLeft: 15, fontSize: regularFontSize }}>
                Availability
              </Text>
              <Text style={{ color: "white", marginRight: 15, fontSize: regularFontSize }}>
                Status
              </Text>
            </View>
          ) : (
            <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between" }}>
              <Text style={{ color: "white", marginLeft: 15, fontSize: regularFontSize }}>
                Cargo
              </Text>
              <Text style={{ color: "white", marginRight: 15, fontSize: regularFontSize }}>
                Weight
              </Text>
            </View>
          )}
          {generateCargoDetails(item.cargoDetails)}
        </View>
      ) : null}

      {item.cargoDetails && item.cargoDetails.length > 0 ? <View>{divider}</View> : null}

      {/* Template Flight Route Info Section */}
      {item.cargoRoutes && item.cargoRoutes.length > 0 ? (
        <View
          style={{
            flex: 1,
            paddingTop: 10,
            flexDirection: "column",
            justifyContent: "center",
          }}>
          {generateCargoRoutes(item.templateType, item.cargoRoutes)}
        </View>
      ) : null}

      {/* Image to Display - If needed  */}
      {/* <View style={[styles.imageContainer]}> */}
      {/* {image(item.illustration, parallaxProps, true)} */}
      {/* <View style={[styles.radiusMask]} /> */}
      {/* </View> */}
      {/* <View style={[styles.textContainer]}> */}
      {/* {uppercaseTitle} */}
      {/* <Text style={[styles.subtitle]} numberOfLines={2}> */}
      {/* {item.subtitle} */}
      {/* </Text> */}
      {/* </View> */}

      {/* Template Pricing Info Buttons Section */}
      {item.cargoPricing ? (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingTop: 5,
            paddingBottom: 10,
          }}>
          <Text style={{ color: "white", marginLeft: 10, fontSize: regularFontSize }}>
            Total Price:
          </Text>
          <Text
            style={{ color: "white", marginRight: 10, fontWeight: "bold", fontSize: boldFontSize }}>
            {item.cargoPricing.total}
          </Text>
        </View>
      ) : null}

      {/* Template Options Buttons Section */}
      {item.options && item.options.length > 0 ? slideOptions(item, chatAction) : null}
    </View>
  );
};

const generateCargoDetails = data => {
  let renderVal = [];

  if (data instanceof Array) {
    var ind = 0;
    for (ind; ind < data.length; ind++) {
      let param = data[ind].param;
      let value = data[ind].value;
      renderVal.push(
        <View key={ind} style={{ flexDirection: "row", flex: 1, justifyContent: "space-between" }}>
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              marginLeft: 15,
              fontSize: boldFontSize,
              paddingVertical: 2,
            }}>
            {param}
          </Text>
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              marginRight: 15,
              fontSize: boldFontSize,
              paddingVertical: 2,
            }}>
            {value}
          </Text>
        </View>,
      );
    }

    return renderVal;
  }
};

const divider = (
  <View
    style={{
      height: 0.5,
      alignSelf: "center",
      width: "90%",
      backgroundColor: colorizedBlob ? "#d1d1d1" : "#d1d1d1",
    }}
  />
);

const generateCargoRoutes = (templateType, data) => {
  let renderVal = [];

  if (data instanceof Array) {
    var ind = 0;
    for (ind; ind < data.length; ind++) {
      let flight = data[ind].flight;
      let type = data[ind].type;
      let departure = data[ind].departure.split("(")[0];
      let departureStn = data[ind].departure.split("(")[1].substring(0, 3);
      let arrival = data[ind].arrival.split("(")[0];
      let arrivalStn = data[ind].arrival.split("(")[1].substring(0, 3);
      let departs = data[ind].departs;
      let arrives = data[ind].arrives;

      if (templateType === "template-availability" || templateType === "template-booking") {
        renderVal.push(
          <View key={ind} style={{ flexDirection: "column", flex: 0 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ marginLeft: 10, color: "white", fontSize: regularFontSize }}>
                Flight
                <Text
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    marginLeft: 10,
                    fontSize: boldFontSize,
                  }}>
                  {} {flight}
                </Text>
              </Text>
              <Text
                style={{
                  fontWeight: "bold",
                  color: "white",
                  marginRight: 10,
                  fontSize: boldFontSize,
                }}>
                {type}
              </Text>
            </View>
            <Text
              style={{
                fontWeight: "bold",
                color: "white",
                marginLeft: 10,
                fontSize: boldFontSize,
                paddingVertical: 2,
              }}>
              {departs}
            </Text>

            <View style={{ paddingBottom: 5 }} />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ marginLeft: 10, color: "white" }}> {departure} </Text>
              <Text style={{ marginRight: 10, color: "white" }}> {arrival} </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ marginLeft: 10, fontSize: airportCodeFont, color: "white" }}>
                {departureStn}
              </Text>
              <MatIcon name={"flight-takeoff"} color="white" size={52} style={{ marginTop: -10 }} />
              <Text style={{ marginRight: 10, fontSize: airportCodeFont, color: "white" }}>
                {arrivalStn}
              </Text>
            </View>

            <View style={{ paddingBottom: 5 }} />
            {divider}
            <View style={{ paddingTop: 5 }} />
          </View>,
        );
      } else {
        //templateType=template-status
        renderVal.push(
          <View key={ind} style={{ flexDirection: "column", flex: 0 }}>
            <View style={{ flexDirection: "row", flex: 1 }}>
              <View
                key={ind}
                style={{
                  marginLeft: 10,
                  flexDirection: "column",
                  flex: 0.33,
                }}>
                <Text style={{ color: "white", fontSize: regularFontSize }}> Flight </Text>
                <Text
                  style={{
                    marginRight: 10,
                    color: "white",
                    fontWeight: "bold",
                    fontSize: boldFontSize - 1,
                  }}>
                  {flight}
                </Text>
              </View>
              <View
                key={ind}
                style={{
                  flexDirection: "column",
                  flex: 0.33,
                  alignItems: "center",
                }}>
                <Text style={{ color: "white", fontSize: regularFontSize }}> Departs </Text>
                <Text style={{ color: "white", fontWeight: "bold", fontSize: boldFontSize - 1 }}>
                  {departs}
                </Text>
              </View>
              <View
                key={ind}
                style={{
                  flexDirection: "column",
                  flex: 0.33,
                  alignItems: "flex-end",
                  marginRight: 10,
                }}>
                <Text style={{ color: "white", fontSize: regularFontSize }}> Arrives </Text>
                <Text style={{ fontWeight: "bold", fontSize: boldFontSize - 1, color: "white" }}>
                  {arrives}
                </Text>
              </View>
            </View>

            <View style={{ paddingBottom: 5 }} />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ marginLeft: 10, color: "white" }}> {departure} </Text>
              <Text style={{ marginRight: 10, color: "white" }}> {arrival} </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ marginLeft: 10, fontSize: airportCodeFont, color: "white" }}>
                {departureStn}
              </Text>
              <MatIcon name={"flight-takeoff"} color="white" size={52} style={{ marginTop: -10 }} />
              <Text style={{ marginRight: 10, fontSize: airportCodeFont, color: "white" }}>
                {arrivalStn}
              </Text>
            </View>

            <View style={{ paddingBottom: 5 }} />
            {divider}
            <View style={{ paddingTop: 5 }} />
          </View>,
        );
      }
    }

    return renderVal;
  }
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

const slideOptions = (item, chatAction) => {
  return <View style={styles.optionsView}>{generateOptions(item, chatAction)}</View>;
};

const generateOptions = (item, chatAction) => {
  let uiOptions = [];

  var ind = 0;
  for (ind; ind < item.options.length; ind++) {
    let title = item.options[ind].title.toUpperCase();
    let action = item.options[ind].action;
    uiOptions.push(
      <View key={ind} style={{ flex: 0, marginTop: 10, marginBottom: 10 }}>
        <TouchableOpacity
          onPress={() => {
            if (action === "phone/bookingdetails") {
              chatAction(item, action);
            } else {
              chatAction(title, action);
            }
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

const styles = StyleSheet.create({
  aiIconView: {
    flex: 0.15,
    alignSelf: "flex-end",
    alignItems: "center",
    marginBottom: 5,
  },
  slider: {
    // marginTop: 5,
    overflow: "visible", // for custom animations
    marginBottom: 5,
  },
  sliderContentContainer: {
    paddingTop: 5, // for custom animation
  },
  slideInnerContainer: {
    backgroundColor: colorizedBlob ? Constants.Colors.botChatBlob : "white",
    borderTopLeftRadius: borderLeftRadius,
    borderTopRightRadius: borderRightRadius,
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
    width: itemWidth,
    //flex: 1 - if all slides height should be equal (note: this adjusts items heights accordingly)
    //flex: 0 - if slides should be of varied heights based on buttons/content inside
    flex: 1,
    // paddingHorizontal: itemHorizontalMargin,
    // paddingBottom: 7, // needed for shadow
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
    borderRadius: borderRadius,
  },
  imageContainer: {
    flex: 1,
    height: 150,
    marginBottom: IS_IOS ? 0 : -1, // Prevent a random Android rendering issue
    backgroundColor: "white",
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
  },
  image: {
    ...StyleSheet.absoluteFillObject,
    resizeMode: "cover",
    borderRadius: IS_IOS ? borderRadius : 0,
    borderTopLeftRadius: borderRadius,
    borderTopRightRadius: borderRadius,
  },
  // image's border radius is buggy on iOS; let's hack it!
  radiusMask: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: borderRadius,
    backgroundColor: "white",
  },
  textContainer: {
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 16,
    backgroundColor: "white",
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
    borderBottomLeftRadius: borderRadius,
    borderBottomRightRadius: borderRadius,
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
