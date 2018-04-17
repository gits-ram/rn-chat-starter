// @flow
import * as React from "react";
import { observer, inject } from "mobx-react/native";
import { StyleSheet, Text, Image, TouchableOpacity, TouchableHighlight, View } from "react-native";
import { SwipeListView } from "../../components/swipelist";
import { Spinner, Button, Item, Input, Icon } from "native-base";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import Constants from "../../global/constants";
import LightBox from "../../components/lightbox";

export interface Props {
  navigator: any;
}
export interface State {}

let peopleStore: object;

@connectActionSheet
@inject("peopleStore")
@observer
export default class SwipeListContainer extends React.Component<Props, State> {
  componentDidMount() {
    peopleStore = this.props.peopleStore;

    peopleStore.resetList();
    peopleStore.fetchPeopleList(1);
  }

  _handleRefresh = () => {
    peopleStore.resetList();
    peopleStore.fetchPeopleList();
  };

  _handleLoadMore = () => {
    console.log("LOADING MORE>>>>");
    peopleStore.setPage(peopleStore.page + 1);
    peopleStore.fetchPeopleList();
  };

  _openDialogBox = () => {
    LightBox.showWithOptions(
      this.props.navigator,
      "Dialog Box",
      "Choose to perform from any actions below..",
      this.insertOptions(),
    );
  };

  _openActionSheet = (rowMap, itemKey) => {
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
          this._deleteItem(rowMap, itemKey);
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

  _deleteItem(rowMap, rowKey) {
    this.closeRow(rowMap, rowKey);
    peopleStore.removeItem(rowKey);
  }

  closeRow(rowMap, rowKey) {
    if (rowMap[rowKey]) {
      rowMap[rowKey].closeRow();
    }
  }

  //Auto Close
  onRowDidOpen = (rowKey, rowMap) => {
    console.log("This row opened", rowKey);
    setTimeout(() => {
      this.closeRow(rowMap, rowKey);
    }, 2000);
  };

  render() {
    const { peopleStore } = this.props;
    const list = peopleStore.peopleList.toJS();
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        {peopleStore.fetchingApi ? (
          <Spinner color="#356CB1" />
        ) : (
          <SwipeListView
            useFlatList
            data={list}
            renderItem={(data, rowMap) => (
              <TouchableHighlight
                onLongPress={() => this._openActionSheet(rowMap, data.item.key)}
                onPress={() => this._openDialogBox()}>
                <View style={styles.rowFront}>
                  <View style={{ flex: 3 }}>
                    <Image style={styles.image} source={{ uri: data.item.image }} />
                  </View>
                  <View style={{ flex: 7 }}>
                    <Text style={styles.name}>{data.item.name}</Text>
                    <Text style={styles.email}>{data.item.email}</Text>
                  </View>
                </View>
              </TouchableHighlight>

              // <TouchableHighlight style={styles.rowFront} underlayColor={"#AAA"}>
              //   <View>
              //     <Text>I am {data.item.name} in a SwipeListView</Text>
              //   </View>
              // </TouchableHighlight>
            )}
            renderHiddenItem={(data, rowMap) => (
              <View style={styles.rowBack}>
                <TouchableOpacity
                  style={[styles.backLeftBtnLeft]}
                  onPress={() => {
                    this.closeRow(rowMap, data.item.key);

                    this.props.navigator.showInAppNotification({
                      screen: Constants.Screens.NOTIFICATION.screen,
                      passProps: { text: "Marked Done!", color: "green" },
                      autoDismissTimerSec: 2,
                    });
                  }}>
                  <Text style={styles.backTextWhite}>Done</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.backRightBtn, styles.backRightBtnLeft]}
                  onPress={_ => this.closeRow(rowMap, data.item.key)}>
                  <Text style={styles.backTextWhite}>Close</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.backRightBtn, styles.backRightBtnRight]}
                  onPress={_ => this._deleteItem(rowMap, data.item.key)}>
                  <Text style={styles.backTextWhite}>Delete</Text>
                </TouchableOpacity>
              </View>
            )}
            leftOpenValue={75}
            rightOpenValue={-150}
            onRowDidOpen={this.onRowDidOpen}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backTextWhite: {
    color: "#FFF",
  },
  rowFront: {
    flexDirection: "row",
    paddingHorizontal: 15,
    alignItems: "center",
    backgroundColor: Constants.Colors.white,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
    height: 70,
    padding: 3,
  },
  image: {
    width: 80,
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
  rowBack: {
    height: 70,
    alignItems: "center",
    backgroundColor: "#DDD",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: 15,
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
  },
  backLeftBtnLeft: {
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    left: 0,
    top: 0,
    bottom: 0,
    width: 75,
    backgroundColor: "green",
  },
  backRightBtnLeft: {
    backgroundColor: "blue",
    right: 75,
  },
  backRightBtnRight: {
    backgroundColor: "red",
    right: 0,
  },
});
