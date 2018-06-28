import React from "react";
import {
  Image,
  Text,
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import MatIcon from "react-native-vector-icons/MaterialIcons";
import { View as AnimView } from "react-native-animatable";
import Constants from "../../global/constants";

const { width: viewportWidth, height: viewportHeight } = Dimensions.get("window");

const colorizedBg = false;
const headerHeight = 55;
const boldFontSize = 14;
const regularFontSize = 14;
const airportCodeFont = 35;
const subHeadingColor = colorizedBg ? "white" : "grey";
const textValueColor = colorizedBg ? "white" : "black";

function wp(percentage) {
  const value = percentage * viewportWidth / 100;
  return Math.round(value);
}
function hp(percentage) {
  const value = percentage * viewportHeight / 100;
  return Math.round(value);
}

export interface props {
  slideData: object;
}
export interface State {}
export default class TemplateFullView extends React.Component<Props, State> {
  componentDidMount() {
    if (this._viewRef) {
      this._viewRef.fadeInUp(500);
    }
  }
  render() {
    const { slideData } = this.props;

    return (
      <AnimView
        useNativeDriver={true}
        ref={ref => {
          this._viewRef = ref;
        }}
        style={{
          flexDirection: "column",
          width: wp(100),
          height: "100%",
          backgroundColor: colorizedBg
            ? Constants.Colors.botChatBlob
            : Constants.Colors.backgroundColor,
        }}>
        {/* Template Header Section */}
        {slideData.headerTitle || slideData.headerValue ? (
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              height: headerHeight,
              backgroundColor: Constants.Colors.botChatBlob,
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
              <Text style={{ color: "white" }}>{slideData.headerTitle}</Text>
              <Text
                style={{
                  marginRight: 5,
                  fontWeight: "bold",
                  color: "white",
                  fontSize: boldFontSize,
                }}>
                {slideData.headerValue}
              </Text>
            </View>
          </View>
        ) : null}

        <ScrollView style={{ width: "100%", height: "100%" }}>
          {/* Flight Route Info Section */}
          <View
            style={{
              flex: 1,
              width: "100%",
              marginTop: 20,
              backgroundColor: colorizedBg ? Constants.Colors.botChatBlob : "white",
            }}>
            {slideData.cargoRoutes && slideData.cargoRoutes.length > 0 ? (
              <View
                style={{
                  flex: 1,
                  paddingTop: 10,
                  flexDirection: "column",
                  justifyContent: "center",
                }}>
                {generateCargoRoutes(slideData.templateType, slideData.cargoRoutes)}
              </View>
            ) : null}
          </View>

          {/* Cargo Details Section */}
          <View
            style={{
              flex: 1,
              width: "100%",
              marginTop: 20,
              backgroundColor: colorizedBg ? Constants.Colors.botChatBlob : "white",
            }}>
            {slideData.cargoDetails && slideData.cargoDetails.length > 0 ? (
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  paddingVertical: 10,
                }}>
                <View style={{ flexDirection: "row", flex: 1, justifyContent: "space-between" }}>
                  <Text style={{ color: subHeadingColor, marginLeft: 15 }}>Cargo</Text>
                  <Text style={{ color: subHeadingColor, marginRight: 15 }}>Weight</Text>
                </View>

                {generateCargoDetails(slideData.cargoDetails)}
              </View>
            ) : null}
          </View>

          {/* Pricing Info Buttons Section */}
          <View
            style={{
              flex: 1,
              width: "100%",
              marginTop: 20,
              backgroundColor: colorizedBg ? Constants.Colors.botChatBlob : "white",
            }}>
            {slideData.cargoPricing ? (
              <View style={{ flexDirection: "column" }}>
                <Text
                  style={{
                    color: subHeadingColor,
                    marginTop: 10,
                    marginLeft: 10,
                    fontSize: regularFontSize + 1,
                  }}>
                  Receipt
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: 5,
                    paddingBottom: 5,
                  }}>
                  <Text
                    style={{ color: textValueColor, marginLeft: 10, fontSize: regularFontSize }}>
                    Shipping Price :
                  </Text>
                  <Text
                    style={{
                      color: textValueColor,
                      marginRight: 10,
                      fontSize: boldFontSize,
                    }}>
                    {slideData.cargoPricing.shipping}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingBottom: 5,
                  }}>
                  <Text
                    style={{ color: textValueColor, marginLeft: 10, fontSize: regularFontSize }}>
                    Taxes :
                  </Text>
                  <Text
                    style={{
                      color: textValueColor,
                      marginRight: 10,
                      fontSize: boldFontSize,
                    }}>
                    {slideData.cargoPricing.tax}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingBottom: 5,
                  }}>
                  <Text
                    style={{ color: textValueColor, marginLeft: 10, fontSize: regularFontSize }}>
                    Discount :
                  </Text>
                  <Text
                    style={{
                      color: textValueColor,
                      marginRight: 10,
                      fontSize: boldFontSize,
                    }}>
                    {slideData.cargoPricing.discount}
                  </Text>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingTop: 5,
                    paddingBottom: 10,
                  }}>
                  <Text
                    style={{
                      color: textValueColor,
                      marginLeft: 10,
                      fontWeight: "bold",
                      fontSize: regularFontSize,
                    }}>
                    Total Price:
                  </Text>
                  <Text
                    style={{
                      color: textValueColor,
                      marginRight: 10,
                      fontWeight: "bold",
                      fontSize: boldFontSize,
                    }}>
                    {slideData.cargoPricing.total}
                  </Text>
                </View>
              </View>
            ) : null}
          </View>
        </ScrollView>
      </AnimView>
    );
  }
}

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
              color: textValueColor,
              marginLeft: 15,
              fontSize: boldFontSize,
              paddingVertical: 2,
            }}>
            {param}
          </Text>
          <Text
            style={{
              color: textValueColor,
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
      backgroundColor: "#d1d1d1",
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

      if (templateType === "template-status") {
        renderVal.push(
          <View key={ind} style={{ flexDirection: "column", flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ marginLeft: 10, color: subHeadingColor }}> {departure} </Text>
              <Text style={{ marginRight: 10, color: subHeadingColor }}> {arrival} </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: airportCodeFont,
                  color: colorizedBg ? "white" : Constants.Colors.botChatBlob,
                }}>
                {departureStn}
              </Text>
              <MatIcon
                name={"flight-takeoff"}
                color={colorizedBg ? "white" : Constants.Colors.botChatBlob}
                size={52}
                style={{ marginTop: -10 }}
              />
              <Text
                style={{
                  marginRight: 10,
                  fontSize: airportCodeFont,
                  color: colorizedBg ? "white" : Constants.Colors.botChatBlob,
                }}>
                {arrivalStn}
              </Text>
            </View>

            <View style={{ paddingBottom: 10 }} />
            {divider}
            <View style={{ paddingTop: 10 }} />

            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ marginLeft: 10, color: subHeadingColor, fontSize: regularFontSize }}>
                Flight
                <Text
                  style={{
                    fontWeight: colorizedBg ? "bold" : "100",
                    color: textValueColor,
                    marginLeft: 10,
                    fontSize: boldFontSize,
                  }}>
                  {} {flight}
                </Text>
              </Text>
              <Text
                style={{
                  fontWeight: colorizedBg ? "bold" : "100",
                  color: textValueColor,
                  marginRight: 10,
                  fontSize: boldFontSize,
                }}>
                {type}
              </Text>
            </View>
            <Text
              style={{
                fontWeight: colorizedBg ? "bold" : "100",
                color: textValueColor,
                marginLeft: 10,
                fontSize: boldFontSize,
                paddingVertical: 2,
              }}>
              {departs}
            </Text>

            <View style={{ paddingBottom: 15 }} />
          </View>,
        );
      } else {
        //templateType=template-status
        renderVal.push(
          <View key={ind} style={{ flexDirection: "column", flex: 1 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text style={{ marginLeft: 10, color: subHeadingColor }}> {departure} </Text>
              <Text style={{ marginRight: 10, color: subHeadingColor }}> {arrival} </Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
              <Text
                style={{
                  marginLeft: 10,
                  fontSize: airportCodeFont,
                  color: colorizedBg ? "white" : Constants.Colors.botChatBlob,
                }}>
                {departureStn}
              </Text>
              <MatIcon
                name={"flight-takeoff"}
                color={colorizedBg ? "white" : Constants.Colors.botChatBlob}
                size={52}
                style={{ marginTop: -10 }}
              />
              <Text
                style={{
                  marginRight: 10,
                  fontSize: airportCodeFont,
                  color: colorizedBg ? "white" : Constants.Colors.botChatBlob,
                }}>
                {arrivalStn}
              </Text>
            </View>

            <View style={{ paddingBottom: 10 }} />
            {divider}
            <View style={{ paddingTop: 10 }} />

            <View style={{ flexDirection: "row", flex: 1 }}>
              <View
                key={ind}
                style={{
                  marginLeft: 10,
                  flexDirection: "column",
                  flex: 0.33,
                }}>
                <Text style={{ color: subHeadingColor, fontSize: regularFontSize }}> Flight </Text>
                <Text
                  style={{
                    marginRight: 10,
                    color: textValueColor,
                    fontWeight: colorizedBg ? "bold" : "100",
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
                <Text style={{ color: subHeadingColor, fontSize: regularFontSize }}> Departs </Text>
                <Text
                  style={{
                    color: textValueColor,
                    fontWeight: colorizedBg ? "bold" : "100",
                    fontSize: boldFontSize - 1,
                    textAlign: "center",
                    alignSelf: "center",
                  }}>
                  {departs}
                </Text>
              </View>
              <View
                key={ind}
                style={{
                  flexDirection: "column",
                  flex: 0.33,
                  marginRight: 5,
                  alignItems: "flex-end",
                }}>
                <Text style={{ color: subHeadingColor, fontSize: regularFontSize }}> Arrives </Text>
                <Text
                  style={{
                    color: textValueColor,
                    fontWeight: colorizedBg ? "bold" : "100",
                    fontSize: boldFontSize - 1,
                    textAlign: "right",
                  }}>
                  {arrives}
                </Text>
              </View>
            </View>

            <View style={{ paddingBottom: 15 }} />
          </View>,
        );
      }
    }

    return renderVal;
  }
};
