import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import PropTypes from "prop-types";
import styles from "./Detail.style";

export default class Detail extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    even: PropTypes.bool,
  };

  render() {
    const { data: { title, subtitle, body }, even } = this.props;

    const uppercaseTitle = title ? (
      <Text style={[styles.title, even ? styles.titleEven : {}]} numberOfLines={2}>
        {title.toUpperCase()}
      </Text>
    ) : (
      false
    );

    return (
      <View>
        <View style={[styles.textContainer, even ? styles.textContainerEven : {}]}>
          {uppercaseTitle}
          <Text style={[styles.subtitle, even ? styles.subtitleEven : {}]} numberOfLines={2}>
            {subtitle}
          </Text>
          <Text style={[styles.body, even ? styles.bodyEven : {}]}>{body}</Text>
        </View>
      </View>
    );
  }
}
