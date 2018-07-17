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
import IonIcon from "react-native-vector-icons/Ionicons";
import Carousel, { Pagination, ParallaxImage } from "react-native-snap-carousel";
import { View as AnimView } from "react-native-animatable";
import Constants from "../../global/constants";
import RainIcon from "../../components/svganimations/RainIcon";
import ThunderIcon from "../../components/svganimations/ThunderIcon";
import WindCloudyIcon from "../../components/svganimations/WindCloudIcon";
import PartlyCloudyIcon from "../../components/svganimations/PartlyCloudyDayIcon";
import SnowIcon from "../../components/svganimations/SnowIcon";
import SunIcon from "../../components/svganimations/SunIcon";

import { createIconSetFromIcoMoon } from "react-native-vector-icons";
import icoMoonConfig from "../../components/icons/selection.json";
const IconMoon = createIconSetFromIcoMoon(icoMoonConfig);

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

const IS_IOS = Platform.OS === "ios";
const slideWidth = wp(75);
const itemHorizontalMargin = wp(2);
const sliderWidth = viewportWidth;
const itemWidth = slideWidth + itemHorizontalMargin * 2;

/* Dark Sky API Icon Names mapping to MaterialCommunityIcons */
// const clear_day = "weather-sunny";
// const clear_night = "weather-night";
// const rain = "weather-pouring";
// const snow = "weather-snowy";
// const sleet = "weather-hail";
// const wind = "weather-windy-variant";
// const fog = "weather-fog";
// const cloudy = "weather-cloudy";
// const partly_cloudy_day = "weather-partlycloudy";
// const partly_cloudy_night = "ios-cloudy-night-outline"; //Ionicon
// const thunderstorm = "weather-lightning-rainy";
// const hail = "weather-hail";
// const hurricane = "weather-hurricane";

/* DarkSky API icon name mapping with Climacons Icons */
// const clear_day = "Sun";
// const clear_night = "Moon";
// const rain = "Cloud-Rain";
// const snow = "Cloud-Snow-Alt";
// const sleet = "Cloud-Hail";
// const wind = "Cloud-Wind";
// const fog = "Cloud-Fog";
// const cloudy = "Cloud";
// const partly_cloudy_day = "Cloud-Sun";
// const partly_cloudy_night = "Cloud-Moon"; //Ionicon
// const thunderstorm = "Cloud-Lightning";
// const hail = "Cloud-Hail-Alt";
// const hurricane = "Tornado";

/* DarkSky API icon name mapping with SVG Anim Icons + Climacons(CL) + MaterialComm(MC) Icons */
const weatherIcons = {
  rain: RainIcon,
  snow: SnowIcon,
  "clear-day": SunIcon,
  "partly-cloudy-day": PartlyCloudyIcon,
  wind: WindCloudyIcon,
  thunderstorm: ThunderIcon,
  "clear-night": "MC_weather-night",
  sleet: "CL_Cloud-Hail",
  fog: "CL_Cloud-Fog",
  cloudy: "CL_Cloud",
  "partly-cloudy-night": "CL_Cloud-Moon",
  hail: "CL_Cloud-Hail-Alt",
  hurricane: "CL_Tornado",
};

//---///

/* Weather parameter icon mapping */
const humidIcon = "water-percent"; //MaterialComm
const cloudCoverIcon = "md-cloudy"; //Ionicon
const windIcon = "weather-windy"; //MaterialComm
const pressureIcon = "md-speedometer"; //Ionicon
const rainChanceIcon = "md-umbrella"; //Ionicon
const visibilityIcon = "md-eye"; //Ionicon

const degCel = "\u2103";
const degFah = "\u2109";
const degree = "\u00B0";

/* STYLE PARAMETERS */
const colorizedBlob = true;
const headerHeight = 55;
const headerFontSize = 15;
const borderRadius = 8;
const borderLeftRadius = 5;
const borderRightRadius = 15;
const regularFontSize = 13;
const boldFontSize = 14;
const tempFontColor = "orange";
const tempFontSize = 28;
const bodyFontColor = colorizedBlob ? "white" : "black";
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
}

export interface State {
  currentSlide: number;
  _carouselRef: React.Component<Carousel>;
}

export default class WeatherBlob extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      currentSlide: 0,
    };
  }

  componentDidMount() {
    if (this._viewRef) {
      if (this.props.animate === 1) {
        this._viewRef.fadeInLeft(700).then(() => {
          // if (this._animRef) {
          //   this._animRef.flash(500);
          // }
        });
      } else if (this.props.animate === 2) {
        this._viewRef.fadeInLeft(700);
        // this._viewRef.fadeInDown(700);
      }
    }
  }

  _renderSlide({ item, index }, parallaxProps) {
    return (
      <Slide
        ctx={this}
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

const Slide = ({ ctx, item, index, parallaxProps, chatAction }) => {
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
          <View
            style={{
              flexDirection: "column",
              flex: 1,
              alignItems: "flex-start",
              marginLeft: 10,
              justifyContent: "center",
            }}>
            <Text style={{ fontSize: headerFontSize, color: "white" }}>{item.headerTitle}</Text>
            <Text style={{ color: "white", fontWeight: "bold", fontSize: boldFontSize }}>
              {item.headerValue}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "column",
              flex: 1,
              alignItems: "flex-end",
              marginRight: 10,
              justifyContent: "center",
            }}>
            <Text style={{ color: "white", fontSize: regularFontSize }}> {item.destination} </Text>
            <Text
              style={{
                marginRight: 5,
                fontWeight: "bold",
                color: "white",
                fontSize: boldFontSize,
              }}>
              {item.airportCode}
            </Text>
          </View>
        </View>
      ) : null}

      {item.headerTitle || item.headerValue ? <View>{divider}</View> : null}

      <View style={{ flex: 1, flexDirection: "row", paddingTop: 5, paddingBottom: 10 }}>
        {/* Render Weather Icon */}
        <View
          style={{
            flex: 0.4,
            alignItems: "center",
            justifyContent: "center",
          }}>
          {drawWeatherIcon(ctx, weatherIcons[item.icon])}
        </View>

        {/* Render Temperature, Summary and other weather paramters */}
        <View
          style={{
            flex: 0.6,
            flexDirection: "column",
            justifyContent: "center",
            marginRight: 10,
          }}>
          {item.templateType === "current" ? (
            <Text style={{ color: tempFontColor, fontSize: tempFontSize, fontWeight: "bold" }}>
              {item.temperature}
              {degCel}
            </Text>
          ) : (
            <Text style={{ color: "#07ebf7", fontSize: tempFontSize, fontWeight: "bold" }}>
              {item.temperatureMin}
              {degCel}
              {"  "}
              <Text style={{ color: tempFontColor, fontSize: tempFontSize, fontWeight: "bold" }}>
                {item.temperatureMax}
                {degCel}
              </Text>
            </Text>
          )}

          <Text
            style={{
              color: bodyFontColor,
              fontSize: boldFontSize,
              fontWeight: "600",
              alignSelf: "flex-start",
              paddingBottom: 5,
            }}>
            {item.summary}
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <Icon name={humidIcon} size={20} color={bodyFontColor} />
              <Text style={{ color: bodyFontColor }}> {Math.floor(item.humidity * 100)}% </Text>
            </View>
            <Text style={{ color: bodyFontColor }}>
              Dew: {item.dewPoint}
              {degree}
            </Text>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <IonIcon name={cloudCoverIcon} size={20} color={bodyFontColor} />
              <Text style={{ color: bodyFontColor }}> {Math.floor(item.cloudCover * 100)}% </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <IonIcon name={pressureIcon} size={20} color={bodyFontColor} />
              <Text style={{ color: bodyFontColor }}> {Math.floor(item.pressure / 10)}kPa </Text>
            </View>
          </View>

          <View style={{ flexDirection: "row", justifyContent: "space-between", flex: 1 }}>
            <View style={{ flexDirection: "row" }}>
              <Icon name={windIcon} size={20} color={bodyFontColor} />
              <Text style={{ color: bodyFontColor }}> {item.windSpeed}kmh </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <IonIcon name={visibilityIcon} size={20} color={bodyFontColor} />
              <Text style={{ color: bodyFontColor }}> {item.visibility}kms </Text>
            </View>
          </View>
        </View>
      </View>

      {item.description ? <View>{divider}</View> : null}

      {/* Render Alert/Description if available */}
      {item.description ? (
        <Text
          style={{
            alignItems: "flex-start",
            color: bodyFontColor,
            fontSize: boldFontSize + 1,
            paddingHorizontal: 10,
            paddingVertical: 10,
            textAlign: "left",
          }}>
          {item.description}
        </Text>
      ) : null}

      {/* Template Options Buttons Section */}
      {item.options && item.options.length > 0 ? slideOptions(item, chatAction) : null}
    </View>
  );
};

const drawWeatherIcon = (ctx, Name) => {
  if (typeof Name === "string") {
    let typeName = Name.substring(0, 2);
    let IconName = Name.substring(3, Name.length);
    if (typeName === "CL") {
      return (
        <AnimView
          useNativeDriver={true}
          animation="pulse"
          easing="ease-out"
          duration={1500}
          iterationCount="infinite"
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <IconMoon style={{ marginLeft: -5 }} name={IconName} color={bodyFontColor} size={125} />
        </AnimView>
      );
    } else {
      return (
        <AnimView
          useNativeDriver={true}
          animation="pulse"
          easing="ease-out"
          duration={1500}
          iterationCount="infinite"
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <Icon name={IconName} color={bodyFontColor} size={65} />
        </AnimView>
      );
    }
  } else {
    return <Name colour={bodyFontColor} size={75} />;
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
    alignSelf: "flex-start",
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
    flex: 0,
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
