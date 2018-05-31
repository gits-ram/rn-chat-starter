import React from "react";
import {
  View,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  TouchableHighlight,
  BackHandler,
  Dimensions,
  Text,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import RNFS from "react-native-fs";

import Storage from "../../utils/AsyncStorageUtil";
import Fab from "../../components/fab";
import DamagedUldList from "../../screens/DamagedUlds/DamagedUldList";
import PreviewScreen from "../../components/SingleImagePreviewer";
import Constants from "../../global/constants";

const fabActions = [
  {
    text: "Capture a Damaged Uld",
    name: "bt_camera",
    icon: <Icon name="camera" size={20} color="#fff" />,
    position: 1,
  },
];

export default class DamagedUldContainer extends React.Component {
  constructor(props) {
    super(props);

    //Enable LayoutAnimation for Android
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);

      //Device Back Handler
      this.handleBackButtonClick = this.handleBackButtonClick.bind(this);
    }

    this.state = {
      uldsList: [],
      showPreview: false,
      imgPath: "",
    };
  }

  componentWillMount() {
    BackHandler.addEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener("hardwareBackPress", this.handleBackButtonClick);
  }

  componentDidMount() {
    this._getUpdatedList();
  }

  handleBackButtonClick() {
    if (this.state.showPreview) {
      this.setState({ showPreview: false });

      //Show Tab Bar
      this.props.navigator.toggleTabs({ to: "shown", animated: true });
    } else {
      this._goBack();
    }
    return true;
  }

  _goBack() {
    this.props.navigator.pop();
  }

  //Create a new object and add it to state list object (Method Passed as Param to Child Component)
  saveImage = destPath => {
    let splitArr = destPath.split("/");
    let name = String(splitArr[splitArr.length - 1].split(".")[0]);
    let uldItem = { key: name, id: "Damaged ULD Item " + name, path: destPath };
    this.state.uldsList.push(uldItem);

    this._saveDamagedUldsList();
  };

  //Delete Uld Item (Method Passed as Param to Child Component)
  async deleteUldItem(item) {
    try {
      let tempArr = this.state.uldsList.filter(indx => {
        return indx.id !== item.id;
      });

      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      this.setState({ uldsList: tempArr });

      let response = await RNFS.unlink(item.path);

      this._saveDamagedUldsList();
    } catch (error) {
      console.log("Delete ULD Item: " + error);
    }
  }

  //Show Preview (Method Passed as param to child component)
  previewUldImage(imagePath) {
    //Hide Tab Bar
    this.props.navigator.toggleTabs({
      to: "hidden",
      animated: false,
    });

    this.setState({ showPreview: true, imgPath: imagePath });
  }

  //Save state list object to AsyncStorage
  async _saveDamagedUldsList() {
    try {
      await Storage.write("DAMAGED_ULD_LIST", JSON.stringify(this.state.uldsList));

      this._getUpdatedList();
    } catch (error) {
      console.log("Write Damaged ULDs: " + error);
    }
  }

  //Retrieve Damaged ULDs List from AsyncStorage
  async _getUpdatedList() {
    try {
      let response = await Storage.read("DAMAGED_ULD_LIST");
      let listOfUlds = (await JSON.parse(response)) || [];

      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
      this.setState({ uldsList: listOfUlds });
    } catch (error) {
      console.log("Read Damaged ULDs: " + error);
    }
  }

  _openCamera = () => {
    //Maintain Last Saved Filename
    Storage.read("DAMAGEDULD_IMG_NAME").then(data => {
      //Increment FileName and persist last FileName
      let fileName = "1.jpg";
      if (data) {
        fileName = data;
        let splitArr = fileName.split(".");
        fileName = Number(splitArr[0]) + 1;
        fileName = String(fileName) + ".jpg";
      }
      Storage.write("DAMAGEDULD_IMG_NAME", fileName);

      this.props.navigator.push({
        screen: Constants.Screens.CAMERA.screen,
        title: Constants.Screens.CAMERA.title,
        passProps: {
          showPreview: true,
          shouldSave: true,
          saveName: fileName,
          saved: this.saveImage,
        },
      });
    });
  };

  _renderFab = () => {
    return (
      <Fab
        ref={ref => {
          this.fab = ref;
        }}
        actions={fabActions}
        position="right"
        onPressItem={name => {
          this.fab.animateButton();
          this._openCamera();
        }}
      />
    );
  };

  _renderCloseIcon = () => {
    return (
      <TouchableHighlight
        style={styles.closeIcon}
        underlayColor="rgba(255, 255, 255, 0.5)"
        onPress={() => {
          this.setState({ showPreview: false });
          //Show Tab Bar
          this.props.navigator.toggleTabs({ to: "shown", animated: true });
        }}>
        <Icon
          name="close"
          style={{ alignSelf: "center", alignItems: "center" }}
          size={36}
          color={"#FFF"}
        />
      </TouchableHighlight>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.showPreview ? (
          <View
            style={[
              { width: Dimensions.get("window").width, height: Dimensions.get("window").height },
            ]}>
            <PreviewScreen imagePath={this.state.imgPath} />
            {this._renderCloseIcon()}
          </View>
        ) : (
          <View style={styles.container}>
            {this.state.uldsList && this.state.uldsList.length > 0 ? (
              <DamagedUldList
                listings={this.state.uldsList}
                deleteItem={this.deleteUldItem.bind(this)}
                previewItem={this.previewUldImage.bind(this)}
              />
            ) : (
              <Text
                style={{
                  color: "black",
                  fontSize: 18,
                  alignSelf: "center",
                  paddingTop: 20,
                }}>
                No Damaged ULDs to show
              </Text>
            )}
            {this._renderFab()}
          </View>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "column",
    flex: 1,
  },
  closeIcon: {
    alignSelf: "flex-start",
    position: "absolute",
    width: 50,
    height: 50,
    right: 20,
    top: 10,
    borderRadius: 25,
    borderWidth: 4,
    borderColor: "#FFF",
  },
});
