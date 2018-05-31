import { StyleSheet } from "react-native";
import Constants from "../../global/constants";

export default StyleSheet.create({
  textContainer: {
    justifyContent: "center",
    marginTop: 8,
    marginLeft: 8,
    marginRight: 8,
    paddingTop: 5,
    paddingBottom: 5,
    paddingHorizontal: 10,
    backgroundColor: "#7f8287",
    borderRadius: 10,
  },
  textContainerEven: {
    backgroundColor: "#adb2ba",
  },
  title: {
    color: "white",
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  titleEven: {
    color: "#383a3d",
  },
  subtitle: {
    marginTop: 6,
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 14,
    fontStyle: "italic",
  },
  subtitleEven: {
    color: "rgba(56, 58, 61, 0.8)",
  },
  body: {
    marginTop: 6,
    color: "white",
    fontSize: 12,
  },
  bodyEven: {
    color: "rgba(56, 58, 61, 0.9)",
  },
});
