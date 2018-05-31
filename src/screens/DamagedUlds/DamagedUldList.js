import React, { Component } from "react";
import { StyleSheet, Image, View, TouchableHighlight, FlatList, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

export default class DamagedUldList extends Component {
  _keyExtractor = (item, index) => index.toString();

  _renderUldItem = ({ item, index }) => (
    <ListItem
      item={item}
      index={index}
      onPressItem={this._onPressItem}
      onPressDelete={this._onPressDelete}
    />
  );

  _onPressItem = item => {
    this.props.previewItem(item.path);
  };

  _onPressDelete = item => {
    this.props.deleteItem(item);
  };

  render() {
    // const { params } = this.props.navigation.state;

    return (
      <View>
        <FlatList
          data={this.props.listings}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderUldItem}
        />
      </View>
    );
  }
}

class ListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.item);
  };
  _onDelete = () => {
    this.props.onPressDelete(this.props.item);
  };

  render() {
    const item = this.props.item;

    return (
      <TouchableHighlight onPress={this._onPress} underlayColor="#dddddd">
        <View>
          <View style={styles.rowContainer}>
            <Image style={styles.thumb} source={{ uri: item.path }} />
            <View style={styles.textContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {item.id}
              </Text>
            </View>
            <TouchableHighlight onPress={this._onDelete} underlayColor="#C0C0C0">
              <Icon name={"delete-forever"} color={"#474747"} size={36} />
            </TouchableHighlight>
          </View>
          <View style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  thumb: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    paddingLeft: 5,
  },
  separator: {
    height: 1,
    backgroundColor: "#dddddd",
  },
  title: {
    fontSize: 20,
    color: "#656565",
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
  },
});
