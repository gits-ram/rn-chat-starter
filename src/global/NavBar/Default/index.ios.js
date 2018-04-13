// @flow

import Constants from "../../constants";

// [more info] - https://wix.github.io/react-native-navigation/#/styling-the-navigator
export default {
  tabFontFamily: "Roboto",
  navBarTextColor: Constants.Colors.statusBarText,
  statusBarColor: Constants.Colors.darkAccent,
  navBarButtonColor: Constants.Colors.statusBarText,
  navBarBackgroundColor: Constants.Colors.primaryAccent,
  screenBackgroundColor: Constants.Colors.statusBarText

  // statusBarTextColorScheme : Constants.Colors.statusBarColor, // make sure that in Xcode > project > Info.plist, the property View controller-based status bar appearance is set to YES
};
