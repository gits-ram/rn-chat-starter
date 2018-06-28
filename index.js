// import { AppRegistry } from "react-native";
import App from "./src/App";
import { YellowBox } from "react-native";

//Suppress Yellowbox 'isMounted.." warning during development
YellowBox.ignoreWarnings(["Warning: isMounted(...) is deprecated", "Module RCTImageLoader"]);

//Not needed when using wix/react-native-navigation
// AppRegistry.registerComponent('ReactNativeBaseApp', () => App);
