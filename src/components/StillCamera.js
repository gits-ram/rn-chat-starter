import React from "react";
import {
  StyleSheet,
  Dimensions,
  Text,
  View,
  TouchableOpacity,
  TouchableHighlight,
  Image,
  Slider,
  Alert,
} from "react-native";
import { Button } from "native-base";
import { RNCamera } from "react-native-camera";
import RNFS from "react-native-fs";
import { BackHandler } from "react-native";

const landmarkSize = 2;

const flashModeOrder = {
  off: "on",
  on: "auto",
  auto: "torch",
  torch: "off",
};

const wbOrder = {
  auto: "sunny",
  sunny: "cloudy",
  cloudy: "shadow",
  shadow: "fluorescent",
  fluorescent: "incandescent",
  incandescent: "auto",
};

export interface Props {
  navigator: any;
  showPreview: Boolean;
  shouldSave: Boolean;
  saveName: String;
  saved: Function;
  showFlash: Boolean;
}
export interface State {
  photoPath: String;
  flash: String;
  zoom: Number;
  autoFocus: String;
  depth: Number;
  type: String;
  whiteBalance: String;
  ratio: String;
  ratios: [];
  photoId: Number;
  showGallery: Boolean;
  photos: [];
  faces: [];
}

export default class StillCamera extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      photoPath: "", //Last captured image's path
      flash: "off",
      zoom: 0,
      autoFocus: "on",
      depth: 0,
      type: "back",
      whiteBalance: "auto",
      ratio: "16:9",
      ratios: [],
      photoId: 1,
      showGallery: false,
      photos: [],
      faces: [],
    };

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent(event) {
    switch (event.id) {
      case "willAppear":
        this.backHandler = BackHandler.addEventListener("hardwareBackPress", this.handleBackPress);
        break;
      case "willDisappear":
        this.backPressed = 0;
        this.backHandler.remove();
        break;
      case "backPress":
        this.handleBackPress();
        break;
      default:
        break;
    }
  }

  handleBackPress = () => {
    if (this.state.photoPath) {
      this._deletePicture();
    } else {
      this.setState({ photoPath: "grr" });
      this.props.navigator.pop({ animated: true });
    }
    return false;

    // Alert.alert("Back button press!", "Handling back press in JS", [
    //   {
    //     text: "Pop",
    //     onPress: () => {
    //       this.props.navigator.pop();
    //     },
    //   },
    // ]);

    // if (this.backPressed && this.backPressed > 0) {
    //   this.props.navigator.pop({ animated: true });
    //   return false;
    // }

    // this.backPressed = 1;
    // this.props.navigator.showSnackbar({
    //   text: "Press one more time to exit",
    //   duration: "long",
    // });
    // return true;
  };

  componentWillMount() {
    //Hide Tab Bar
    this.props.navigator.toggleTabs({
      to: "hidden", // required, 'hidden' = hide tab bar, 'shown' = show tab bar
      animated: false, // does the toggle have transition animation or does it happen immediately (optional)
    });

    this._makeImageDir();
  }
  componentWillUnmount() {
    //Show Tab Bar
    this.props.navigator.toggleTabs({
      to: "shown", // required, 'hidden' = hide tab bar, 'shown' = show tab bar
      animated: true, // does the toggle have transition animation or does it happen immediately (optional)
    });
  }

  getRatios = async function() {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };

  toggleView() {
    this.setState({
      showGallery: !this.state.showGallery,
    });
  }

  toggleFacing() {
    this.setState({
      type: this.state.type === "back" ? "front" : "back",
    });
  }

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash],
    });
  }

  setRatio(ratio) {
    this.setState({
      ratio,
    });
  }

  toggleWB() {
    this.setState({
      whiteBalance: wbOrder[this.state.whiteBalance],
    });
  }

  toggleFocus() {
    this.setState({
      autoFocus: this.state.autoFocus === "on" ? "off" : "on",
    });
  }

  zoomOut() {
    this.setState({
      zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1,
    });
  }

  zoomIn() {
    this.setState({
      zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1,
    });
  }

  setFocusDepth(depth) {
    this.setState({
      depth,
    });
  }

  takePicture = async function() {
    try {
      if (this.camera) {
        const cameraData = await this.camera.takePictureAsync({
          fixOrientation: false,
          skipProcessing: true, //android hack, to reduce delay when taking pics
          width: 1280,
        });
        this.setState({ photoPath: cameraData.uri });
      }
    } catch (err) {
      console.log("TakePictureErr: " + err);
    }
  };

  onFacesDetected = ({ faces }) => this.setState({ faces });
  onFaceDetectionError = state => console.warn("Faces detection error:", state);

  renderFace({ bounds, faceID, rollAngle, yawAngle }) {
    return (
      <View
        key={faceID}
        transform={[
          { perspective: 600 },
          { rotateZ: `${rollAngle.toFixed(0)}deg` },
          { rotateY: `${yawAngle.toFixed(0)}deg` },
        ]}
        style={[
          styles.face,
          {
            ...bounds.size,
            left: bounds.origin.x,
            top: bounds.origin.y,
          },
        ]}>
        <Text style={styles.faceText}>ID: {faceID}</Text>
        <Text style={styles.faceText}>rollAngle: {rollAngle.toFixed(0)}</Text>
        <Text style={styles.faceText}>yawAngle: {yawAngle.toFixed(0)}</Text>
      </View>
    );
  }

  renderLandmarksOfFace(face) {
    const renderLandmark = position =>
      position && (
        <View
          style={[
            styles.landmark,
            {
              left: position.x - landmarkSize / 2,
              top: position.y - landmarkSize / 2,
            },
          ]}
        />
      );
    return (
      <View key={`landmarks-${face.faceID}`}>
        {renderLandmark(face.leftEyePosition)}
        {renderLandmark(face.rightEyePosition)}
        {renderLandmark(face.leftEarPosition)}
        {renderLandmark(face.rightEarPosition)}
        {renderLandmark(face.leftCheekPosition)}
        {renderLandmark(face.rightCheekPosition)}
        {renderLandmark(face.leftMouthPosition)}
        {renderLandmark(face.mouthPosition)}
        {renderLandmark(face.rightMouthPosition)}
        {renderLandmark(face.noseBasePosition)}
        {renderLandmark(face.bottomMouthPosition)}
      </View>
    );
  }

  renderFaces() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces.map(this.renderFace)}
      </View>
    );
  }

  renderLandmarks() {
    return (
      <View style={styles.facesContainer} pointerEvents="none">
        {this.state.faces.map(this.renderLandmarksOfFace)}
      </View>
    );
  }

  renderFullCamera() {
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        zoom={this.state.zoom}
        whiteBalance={this.state.whiteBalance}
        ratio={this.state.ratio}
        faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
        onFacesDetected={this.onFacesDetected}
        onFaceDetectionError={this.onFaceDetectionError}
        focusDepth={this.state.depth}
        permissionDialogTitle={"Permission to use camera"}
        permissionDialogMessage={"We need your permission to use your camera phone"}>
        <View
          style={{
            flex: 0.5,
            backgroundColor: "transparent",
            flexDirection: "row",
            justifyContent: "space-around",
          }}>
          <TouchableOpacity style={styles.flipButton} onPress={this.toggleFacing.bind(this)}>
            <Text style={styles.flipText}> FLIP </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.flipButton} onPress={this.toggleFlash.bind(this)}>
            <Text style={styles.flipText}> FLASH: {this.state.flash} </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.flipButton} onPress={this.toggleWB.bind(this)}>
            <Text style={styles.flipText}> WB: {this.state.whiteBalance} </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            flex: 0.4,
            backgroundColor: "transparent",
            flexDirection: "row",
            alignSelf: "flex-end",
          }}>
          <Slider
            style={{ width: 150, marginTop: 15, alignSelf: "flex-end" }}
            onValueChange={this.setFocusDepth.bind(this)}
            step={0.1}
            disabled={this.state.autoFocus === "on"}
          />
        </View>
        <View
          style={{
            flex: 0.1, //0.1
            backgroundColor: "transparent",
            flexDirection: "row",
            alignSelf: "flex-end", //flex-end
          }}>
          <TouchableOpacity
            style={[styles.flipButton, { flex: 0.1, alignSelf: "flex-end" }]}
            onPress={this.zoomIn.bind(this)}>
            <Text style={styles.flipText}> + </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flipButton, { flex: 0.1, alignSelf: "flex-end" }]}
            onPress={this.zoomOut.bind(this)}>
            <Text style={styles.flipText}> - </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flipButton, { flex: 0.25, alignSelf: "flex-end" }]}
            onPress={this.toggleFocus.bind(this)}>
            <Text style={styles.flipText}> AF : {this.state.autoFocus} </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flipButton, styles.picButton, { flex: 0.3, alignSelf: "flex-end" }]}
            onPress={this.takePicture.bind(this)}>
            <Text style={styles.flipText}> SNAP </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.flipButton, styles.galleryButton, { flex: 0.25, alignSelf: "flex-end" }]}
            onPress={this.toggleView.bind(this)}>
            <Text style={styles.flipText}> Gallery </Text>
          </TouchableOpacity>
        </View>
        {this.renderFaces()}
        {this.renderLandmarks()}
      </RNCamera>
    );
  }

  renderCamera() {
    return (
      <RNCamera
        ref={ref => {
          this.camera = ref;
        }}
        style={{
          flex: 1,
        }}
        type={this.state.type}
        flashMode={this.state.flash}
        autoFocus={this.state.autoFocus}
        permissionDialogTitle={"Permission to use camera"}
        permissionDialogMessage={"We need your permission to use your camera phone"}>
        {this.props.showFlash ? (
          <View
            style={{
              flex: 0.5,
              justifyContent: "flex-start",
              alignItems: "center",
              marginTop: 10,
            }}>
            <TouchableOpacity
              style={{
                borderRadius: 8,
                borderColor: "white",
                borderWidth: 3,
                padding: 5,
                alignItems: "center",
                justifyContent: "center",
                width: "30%",
                height: 35,
              }}
              onPress={this.toggleFlash.bind(this)}>
              <Text style={styles.flipText}> FLASH: {this.state.flash} </Text>
            </TouchableOpacity>
          </View>
        ) : null}
        <View
          style={
            this.props.showFlash
              ? { flex: 0.5, justifyContent: "flex-end", marginBottom: 20 }
              : { flex: 0.9, justifyContent: "flex-end" }
          }>
          <TouchableHighlight
            style={styles.captureRing}
            onPress={this.takePicture.bind(this)}
            underlayColor="rgba(255, 255, 255, 0.5)">
            <View />
          </TouchableHighlight>
        </View>
      </RNCamera>
    );
  }

  _makeImageDir() {
    //Make A New Directory to Store Captured Images
    let dirPath = RNFS.DocumentDirectoryPath + "/AflsCam";

    RNFS.exists(dirPath)
      .then(isExists => {
        if (!isExists) {
          RNFS.mkdir(dirPath)
            .then(() => {
              console.log(dirPath);
              RNFS.exists(dirPath).then(isExists => {
                if (isExists) {
                  console.log("Camera Directory Created!");
                }
              });
            })
            .catch(err => console.log("RNFS MkDir:" + err));
        }
      })
      .catch(err => console.log("RNFS Exists:" + err));
  }

  _savePicture() {
    //Move Captured Image From Gallery To Private Folder
    let destPath = RNFS.DocumentDirectoryPath + "/AflsCam/" + this.props.saveName;
    RNFS.moveFile(this.state.photoPath, destPath)
      .then(() => {
        //Update UI to keep showing Preview Snap
        this.setState({ photoPath: "file://" + destPath });
        this.props.saved("file://" + destPath);
        this.props.navigator.pop();
      })
      .catch(err => console.log("RNFS Move:" + err));
  }

  _deletePicture() {
    RNFS.unlink(this.state.photoPath)
      .then(() => {
        console.log("Image Deleted!");
        this.setState({ path: null });
      })
      .catch(err => console.log("RNFS unlink:" + err));

    this.props.navigator.pop();
  }

  renderImage() {
    return (
      <View style={{ flex: 1 }}>
        <Image source={{ uri: this.state.photoPath }} style={styles.previewSnap} />

        {this.props.shouldSave ? (
          <View style={styles.saveRing}>
            <Button
              success
              rounded
              onPress={this._savePicture.bind(this)}
              style={{ paddingHorizontal: 30, paddingVertical: 15 }}>
              <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "bold" }}>Save</Text>
            </Button>
          </View>
        ) : null}
        <View style={this.props.shouldSave ? styles.cancelRing : styles.cancelRing2}>
          <Button
            danger
            rounded
            onPress={this._deletePicture.bind(this)}
            style={{ paddingHorizontal: 30, paddingVertical: 15 }}>
            <Text style={{ color: "#FFF", fontSize: 16, fontWeight: "bold" }}>Cancel</Text>
          </Button>
        </View>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.photoPath && this.props.showPreview ? this.renderImage() : this.renderCamera()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: "#000",
  },
  captureRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 7,
    borderColor: "#FFF",
    alignSelf: "center",
  },
  previewSnap: {
    justifyContent: "flex-start",
    alignItems: "center",
    height: Dimensions.get("window").height,
    width: Dimensions.get("window").width,
  },
  saveRing: {
    // width: 70,
    // height: 40,
    position: "absolute",
    right: "10%",
    bottom: "10%",
    // borderRadius: 35,
    // borderWidth: 6,
    // borderColor: "#FFF",
  },
  cancelRing: {
    // width: 80,
    // height: 40,
    position: "absolute",
    left: "10%",
    bottom: "10%",
    // borderRadius: 35,
    // borderWidth: 6,
    // borderColor: "#FFF",
  },
  cancelRing2: {
    // width: "30%",
    // height: 40,
    position: "absolute",
    left: "35%",
    bottom: "10%",
    // borderRadius: 35,
    // borderWidth: 6,
    // borderColor: "#FFF",
  },
  save: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    color: "#FFF",
    fontWeight: "600",
    fontSize: 17,
  },
  cancel: {
    alignSelf: "center",
    alignItems: "center",
    backgroundColor: "transparent",
    color: "#FFF",
    fontWeight: "600",
    fontSize: 17,
  },

  navigation: {
    flex: 1,
  },
  gallery: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  flipButton: {
    flex: 0.3,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    borderRadius: 8,
    borderColor: "white",
    borderWidth: 1,
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  flipText: {
    color: "white",
    fontSize: 15,
  },
  item: {
    margin: 4,
    backgroundColor: "indianred",
    height: 35,
    width: 80,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  picButton: {
    backgroundColor: "darkseagreen",
  },
  galleryButton: {
    backgroundColor: "indianred",
  },
  facesContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
    top: 0,
  },
  face: {
    padding: 10,
    borderWidth: 2,
    borderRadius: 2,
    position: "absolute",
    borderColor: "#FFD700",
    justifyContent: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  landmark: {
    width: landmarkSize,
    height: landmarkSize,
    position: "absolute",
    backgroundColor: "red",
  },
  faceText: {
    color: "#FFD700",
    fontWeight: "bold",
    textAlign: "center",
    margin: 10,
    backgroundColor: "transparent",
  },
  row: {
    flexDirection: "row",
  },
});
