import Constants from "../constants";
import { Platform } from "react-native";
import { Navigation } from "react-native-navigation";

const openLoginAsLaunch = () => {
  Navigation.startSingleScreenApp({
    screen: {
      screen: Constants.Screens.LOGIN.screen, // unique ID registered with Navigation.registerScreen
      title: Constants.Screens.LOGIN.title, // title of the screen as appears in the nav bar (optional)
      navigatorStyle: {}, // override the navigator style for the screen, see "Styling the navigator" below (optional)
      navigatorButtons: {}, // override the nav buttons for the screen, see "Adding buttons to the navigator" below (optional)
    },
  });
};

// if (Platform.OS === "android") {
//   tabs.push({
//     label: "Chat",
//     screen: Global.CHAT.screen,
//     // icon: require("../img/transform.png"),
//     title: "Chat"
//   });
// }

const openTabsAsMain = () => {
  const tabs = [
    {
      label: "Dashboard",
      screen: Constants.Screens.DASH.screen,
      icon: require("../../../assets/img/transform.png"),
      title: "Dashboard",
    },
    {
      label: "Components",
      screen: Constants.Screens.COMPONENTS.screen,
      icon: require("../../../assets/img/list.png"),
      title: "Components",
    },
    {
      label: "Chat",
      screen: Constants.Screens.CHAT_DUMMY_LANDING.screen,
      icon: require("../../../assets/img/swap.png"),
      title: "Chat",
    },
  ];

  Navigation.startTabBasedApp({
    tabs,
    animationType: Platform.OS === "ios" ? "slide-down" : "fade",
    tabsStyle: {
      tabBarBackgroundColor: Constants.Colors.primaryAccent,
      tabBarSelectedButtonColor: Constants.Colors.white,
      tabBarButtonColor: Constants.Colors.darkAccent,
      tabFontFamily: "Roboto",
    },
    appStyle: {
      tabBarBackgroundColor: Constants.Colors.primaryAccent,
      navBarButtonColor: Constants.Colors.white,
      tabBarButtonColor: Constants.Colors.darkAccent,
      navBarTextColor: Constants.Colors.white,
      tabBarSelectedButtonColor: Constants.Colors.white,
      navigationBarColor: Constants.Colors.black,
      navBarBackgroundColor: Constants.Colors.primaryAccent,
      statusBarColor: Constants.Colors.darkAccent,
      tabFontFamily: "Roboto",
    },
    drawer: {
      left: {
        screen: Constants.Screens.DRAWER.screen,
        fixedWidth: 500,
      },
      disableOpenGesture: false,
    },
  });
};

const openLoginModalIn = (navigator: { showModal: Function }, withCancelButton: boolean = true) => {
  navigator.showModal({
    ...Constants.Screens.LOGIN_SCREEN,
    passProps: { withCancelButton },
    overrideBackPress: true, // [Android] if you want to prevent closing a modal by pressing back button in Android
  });
};

export default { openLoginAsLaunch, openTabsAsMain };
