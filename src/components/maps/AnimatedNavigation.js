import React from "react";
import { StyleSheet, View, Dimensions } from "react-native";

import MapView, { Marker, ProviderPropType, Polyline } from "react-native-maps";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE = 37.7749;
const LONGITUDE = -122.4194;
// const LATITUDE_DELTA = 0.5;
// const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const SPACE = 0.01;
const LATITUDE2 = 52.3702;
const LONGITUDE2 = 4.8952;

const markerIDs = ["Marker1", "Marker2", "Marker3", "Marker4", "Marker5"];
const timeout = 3000;
let animationTimeout;

function getDelta(lat, lon, distance) {
  const oneDegreeOfLatitudeInMeters = 111.32 * 1000;

  const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
  const longitudeDelta = distance / (oneDegreeOfLatitudeInMeters * Math.cos(lat * (Math.PI / 180)));

  return latitudeDelta;
}

class FocusOnMarkers extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      LATITUDE_DELTA: 0.5,
      LONGITUDE_DELTA: 0.5 * ASPECT_RATIO,
      a: {
        latitude: LATITUDE,
        longitude: LONGITUDE,
      },
      b: {
        latitude: LATITUDE2,
        longitude: LONGITUDE2,
      },
      c: {
        latitude: LATITUDE2,
        longitude: LONGITUDE2 < 0 ? LONGITUDE2 + 20 : LONGITUDE2 - 20,
      },
      d: {
        latitude: LATITUDE2,
        longitude: LONGITUDE2 < 0 ? LONGITUDE2 - 20 : LONGITUDE2 + 20,
      },
    };
  }

  componentDidMount() {
    this.focus1();
    // animationTimeout = setTimeout(() => {
    //   this.focus1();
    // }, timeout);
  }

  componentWillUnmount() {
    if (animationTimeout) {
      clearTimeout(animationTimeout);
    }
  }

  focusMap(markers, animated) {
    console.log(`Markers received to populate map: ${markers}`);
    this.map.fitToSuppliedMarkers(markers, animated);
  }

  focus1() {
    animationTimeout = setTimeout(() => {
      this.map.animateToCoordinate(
        {
          latitude: LATITUDE2,
          longitude: LONGITUDE2,
        },
        1500,
      );

      this.focus2();
    }, timeout);
  }

  focus2() {
    animationTimeout = setTimeout(() => {
      this.focus3();
      this.setState({ LATITUDE_DELTA: 20, LONGITUDE_DELTA: 20 * ASPECT_RATIO });
    }, timeout);
  }

  focus3() {
    animationTimeout = setTimeout(() => {
      this.focusMap([markerIDs[2], markerIDs[3]], true);

      // this.focus4();
    }, timeout - 2000);
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={this.props.provider}
          ref={ref => {
            this.map = ref;
          }}
          style={styles.map}
          initialRegion={{
            latitude: LATITUDE,
            longitude: LONGITUDE,
            latitudeDelta: this.state.LATITUDE_DELTA,
            longitudeDelta: this.state.LONGITUDE_DELTA,
          }}>
          <Marker identifier="Marker1" coordinate={this.state.a} />
          <Marker identifier="Marker2" coordinate={this.state.b} />
          <Marker identifier="Marker3" opacity={0.0} coordinate={this.state.c} />
          <Marker identifier="Marker4" opacity={0.0} coordinate={this.state.d} />

          <Polyline
            coordinates={[this.state.a, { latitude: 40.7128, longitude: -74.006 }, this.state.b]}
            strokeColor="rgba(0,0,200,0.5)"
            strokeWidth={3}
            lineDashPattern={[5, 2, 3, 2]}
          />
        </MapView>
      </View>
    );
  }
}

FocusOnMarkers.propTypes = {
  provider: ProviderPropType,
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default FocusOnMarkers;
