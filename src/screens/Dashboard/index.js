import * as React from "react";
import { Container, Content, Text, Button } from "native-base";
import { View } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import styles from "./styles";
import Fab from "../../components/fab";
import LightBox from "../../components/lightbox";
import Constants from "../../global/constants";
import SwipeRow from "../../components/swipelist/SwipeRow";

export interface Props {
  navigator: any;
  appStore: AppStore;
}
export interface State {
  _showFab: boolean;
}

const fabActions = [
  {
    text: "Fab Button 1",
    name: "bt_one",
    icon: require("../../../assets/img/swap.png"),
    position: 1,
  },
  {
    text: "Fab Button 2",
    name: "bt_two",
    icon: require("../../../assets/img/transform.png"),
    position: 2,
  },
];

@connectActionSheet
class Dashboard extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = {
      _showFab: false,
    };
  }

  showModalScreen = () => {
    this.props.navigator.showModal({
      screen: Constants.Screens.MODAL.screen,
      title: Constants.Screens.MODAL.title,
      // navigatorStyle: {
      //   statusBarColor: "transparent",
      // },
    });
  };

  showContextualMenu = () => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    let options = ["Option A", "Option B", "Cancel"];
    let destructiveButtonIndex = 0;
    let cancelButtonIndex = 2;

    this.props.showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
        destructiveButtonIndex,
      },
      buttonIndex => {},
    );
  };

  openCamera = () => {
    this.props.navigator.push({
      screen: Constants.Screens.CAMERA.screen,
      title: Constants.Screens.CAMERA.title,
      overrideBackPress: true,
      passProps: {
        showPreview: true,
        shouldSave: false,
        showFlash: true,
      },
    });
  };

  showInAppNotification = (text = "This is a notification to notify") => {
    this.props.navigator.showInAppNotification({
      screen: Constants.Screens.NOTIFICATION.screen,
      passProps: { text },
      autoDismissTimerSec: 4,
    });
  };

  showLightBoxWithOptions() {
    LightBox.showWithOptions(
      this.props.navigator,
      "Dialog Box",
      "This is a customizable DialogBox. Insert options with eventhandlers below..",
      this.insertOptions(),
    );
  }
  insertOptions() {
    return (
      <Button
        style={{
          alignSelf: "center",
          justifyContent: "center",
          width: "50%",
          marginTop: 5,
          height: 35,
          backgroundColor: Constants.Colors.primaryAccent,
        }}
        onPress={() => {
          LightBox.dismissLightBox(this.props.navigator);
          this.showInAppNotification("Greetings from Dialog Box!");
        }}>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#FFF" }}> Option A </Text>
        </View>
      </Button>
    );
  }

  render() {
    // const param = this.props.navigation.state.params;
    return (
      <Container style={styles.container}>
        <Content>
          <Text>
            {"This is the Dashboard . . ."}
            <Icon name="rocket" size={30} color="#900" />
          </Text>

          <View style={{ padding: 5 }} />

          <Text>
            MobX Injection :
            {this.props.appStore.isLoggedIn === true ? " True" : " False"}
          </Text>

          <View style={{ padding: 10 }} />

          <Button
            style={{
              // elevation: 0,
              alignSelf: "center",
              justifyContent: "center",
              width: "45%",
              height: 40,
              backgroundColor: Constants.Colors.primaryAccent,
            }}
            onPress={() => {
              this.props.navigator.showModal({
                screen: Constants.Screens.JWTTEST.screen,
                title: Constants.Screens.JWTTEST.title,
              });
            }}>
            <Text style={{ color: "#FFF" }}> Test JWT Auth </Text>
          </Button>

          <View style={{ padding: 10 }} />

          <Button
            style={{
              // elevation: 0,
              alignSelf: "center",
              justifyContent: "center",
              width: "45%",
              height: 40,
              backgroundColor: Constants.Colors.primaryAccent,
            }}
            onPress={() => {
              this.setState({ _showFab: !this.state._showFab });
            }}>
            <Text style={{ color: "#FFF" }}> Toggle FAB </Text>
          </Button>

          <View style={{ padding: 10 }} />

          <Button
            style={{
              // elevation: 0,
              alignSelf: "center",
              justifyContent: "center",
              width: "60%",
              height: 40,
              backgroundColor: Constants.Colors.primaryAccent,
            }}
            onPress={() => {
              this.showInAppNotification();
            }}>
            <Text style={{ color: "#FFF" }}> Show InApp Notification </Text>
          </Button>

          <View style={{ padding: 10 }} />

          <Button
            style={{
              // elevation: 0,
              alignSelf: "center",
              justifyContent: "center",
              width: "60%",
              height: 40,
              backgroundColor: Constants.Colors.primaryAccent,
            }}
            onPress={() => {
              this.showLightBoxWithOptions();
            }}>
            <Text style={{ color: "#FFF" }}> Show DialogBox w/Opts </Text>
          </Button>

          <View style={{ padding: 10 }} />

          <Button
            style={{
              // elevation: 0,
              alignSelf: "center",
              justifyContent: "center",
              width: "50%",
              height: 40,
              backgroundColor: Constants.Colors.primaryAccent,
            }}
            onPress={() => {
              this.showModalScreen();
            }}>
            <Text style={{ color: "#FFF" }}> Show Modal Screen </Text>
          </Button>

          <View style={{ padding: 10 }} />

          <Button
            style={{
              // elevation: 0,
              alignSelf: "center",
              justifyContent: "center",
              width: "60%",
              height: 40,
              backgroundColor: Constants.Colors.primaryAccent,
            }}
            onPress={() => {
              this.showContextualMenu();
            }}>
            <Text style={{ color: "#FFF" }}> Show Contextual Menu </Text>
          </Button>

          <View style={{ padding: 10 }} />

          <Button
            style={{
              // elevation: 0,
              alignSelf: "center",
              justifyContent: "center",
              width: "60%",
              height: 40,
              backgroundColor: Constants.Colors.primaryAccent,
            }}
            onPress={() => {
              this.openCamera();
            }}>
            <Text style={{ color: "#FFF" }}> Open Camera VF </Text>
          </Button>

          <View style={{ padding: 10 }} />
        </Content>

        {this.state._showFab === true ? (
          <Fab
            ref={ref => {
              this.fab = ref;
            }}
            actions={fabActions}
            position="right"
            onPressItem={name => {
              this.fab.animateButton();
              this.showInAppNotification(`FAB: ${name} Selected`);
            }}
          />
        ) : null}
      </Container>
    );
  }
}

export default Dashboard;
