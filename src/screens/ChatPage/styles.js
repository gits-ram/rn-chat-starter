import { StyleSheet } from "react-native";

const styles: any = StyleSheet.create({
  container: {
    backgroundColor: "#ebf2f9",
    flexDirection: "column",
    width: "100%",
    height: "100%",
    flex: 1,
  },
  ListView: {
    marginTop: 5,
    width: "100%",
    flex: 0.9,
  },
  InputBarView: {
    marginTop: 3,
    width: "100%",
    flex: 0.1,
    flexDirection: "row",
    borderRadius: 3,
    backgroundColor: "#FFF",
    padding: 3,
  },
  InputBar: {
    flexDirection: "row",
    position: "absolute",
    bottom: 2,
    width: "100%",
    height: 45,
  },
  TextInputStyleClass: {
    textAlign: "center",
    height: 40,
    borderWidth: 1,
    borderColor: "#009688",
    borderRadius: 7,
    backgroundColor: "#FFFFFF",
  },
  closeIcon: {
    alignSelf: "flex-start",
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    width: 50,
    height: 50,
    right: 20,
    top: 10,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#fff",
  },
});
export default styles;
