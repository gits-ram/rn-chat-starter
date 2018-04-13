import { observable, action } from "mobx";
import { Platform } from "react-native";

export default class AppStore {
  @observable rootNavigator = null; // so we can navigate from DRAWER on iOS (react-native-nav issue)

  @observable isConnected = true;
  @observable isLoggedIn = false;
  @observable testMobx = "GRRRR";

  @observable isAndroid = Platform.OS === "android";
  @observable isIOS = Platform.OS === "ios";

  @action
  changeNetworkState(state) {
    this.isConnected = state;
  }

  @action
  setLoggedIn(state) {
    this.isLoggedIn = state;
  }
}
