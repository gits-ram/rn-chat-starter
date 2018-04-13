import React from "react";
import { Button, Input, Item, Icon } from "native-base";
import LightBox from "../components/lightbox";
import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from "react-native";
import Constants from "../global/constants";
import { connectActionSheet } from "@expo/react-native-action-sheet";

const ANIMATION_DURATION = 250;
const ROW_HEIGHT = 70;

@connectActionSheet
class ListRow extends React.PureComponent {
  constructor(props) {
    super(props);

    this._animated = new Animated.Value(0);
  }

  componentDidMount() {
    Animated.timing(this._animated, {
      toValue: 1,
      duration: ANIMATION_DURATION,
    }).start();
  }

  _openActionSheet = () => {
    let options = ["Delete", "Save", "Cancel"];
    let destructiveButtonIndex = 0;
    let cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      buttonIndex => {
        if (buttonIndex === 0) {
          this.onRemove();
        }
      },
    );
  };

  insertOptions() {
    return (
      <View style={{ width: "100%" }}>
        <Item>
          <Icon active name="person" style={{ color: "#333333" }} />
          <Input
            placeholder="User Comments"
            keyboardType="email-address"
            ref={c => (this.userCmt = c)}
            value={null}
            style={{ color: "#707070", width: "70%" }}
          />
        </Item>

        <Button
          style={{
            alignItems: "center",
            justifyContent: "center",
            alignSelf: "center",
            marginTop: 10,
            width: "100%",
            height: 35,
            backgroundColor: Constants.Colors.primaryAccent,
          }}
          onPress={() => {
            LightBox.dismissLightBox(this.props.navigator);
          }}>
          <View style={{ alignItems: "flex-start", justifyContent: "flex-start" }}>
            <Text style={{ color: "#FFF" }}>Mark Complete</Text>
          </View>
        </Button>
      </View>
    );
  }

  _openDialogBox = () => {
    LightBox.showWithOptions(
      this.props.navigator,
      "Dialog Box",
      "Choose to perform from any actions below..",
      this.insertOptions(),
    );
  };

  onRemove = () => {
    // const { onRemove } = this.props;
    // if (onRemove) {
    Animated.timing(this._animated, {
      toValue: 0,
      duration: ANIMATION_DURATION,
    }).start(() => this.props.deleteItem(this.props.key));
    // }
  };

  render() {
    const { id, name, picture, email } = this.props;

    const rowStyles = [
      styles.row,
      {
        height: this._animated.interpolate({
          inputRange: [0, 1],
          outputRange: [0, ROW_HEIGHT],
          extrapolate: "clamp",
        }),
      },
      { opacity: this._animated },
      {
        transform: [
          { scale: this._animated },
          {
            rotate: this._animated.interpolate({
              inputRange: [0, 1],
              outputRange: ["35deg", "0deg"],
              extrapolate: "clamp",
            }),
          },
        ],
      },
    ];

    return (
      <TouchableOpacity
        onLongPress={() => this._openActionSheet()}
        onPress={() => this._openDialogBox()}>
        <Animated.View style={rowStyles}>
          <Image style={styles.image} source={{ uri: picture }} />
          <View>
            <Text style={styles.name}>{name}</Text>
            <Text style={styles.email}>{email}</Text>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    height: ROW_HEIGHT,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: "500",
    color: "#333333",
  },
  email: {
    fontSize: 14,
    color: "#707070",
  },
});

export default ListRow;
