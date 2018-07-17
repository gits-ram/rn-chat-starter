import { NetInfo, Platform } from "react-native";
import { observer } from "mobx-react/native";

//UTIL SLEEPER+PROMISE FUNCTION
export function sleeper(ms) {
  return function(x) {
    return new Promise(resolve => setTimeout(() => resolve(x), ms));
  };
}

//Returns an empty promise
export function emptyPromise(val = null) {
  return new Promise(resolve => {
    resolve(val);
  });
}

export function handleFirstConnectivityChange(isConnected, appStore, callback) {
  appStore.changeNetworkState(isConnected);
  if (!isConnected) {
    callback();
  }
  console.log("NetInfo Handler, is " + (isConnected ? "online" : "offline"));
  NetInfo.isConnected.removeEventListener("connectionChange", handleFirstConnectivityChange);
}

export function checkNetworkstate(appStore, callback) {
  if (Platform.OS === "android") {
    NetInfo.isConnected.fetch().then(isConnected => {
      appStore.changeNetworkState(isConnected);
      if (!isConnected) {
        callback();
      }
      console.log("NetInfo First, is " + (isConnected ? "online" : "offline"));
    });
  } else {
    NetInfo.isConnected.addEventListener("connectionChange", () => {
      handleFirstConnectivityChange(this, appStore, callback);
    });
  }
}

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
