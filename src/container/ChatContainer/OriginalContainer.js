// @flow
import * as React from "react";
import { observer, inject } from "mobx-react/native";
// import { observer } from "mobx-react";
import { View, PermissionsAndroid, Platform, Linking } from "react-native";
import ChatPage from "../../screens/ChatPage";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import Sound from "react-native-sound";
import * as FileUtil from "../../utils/FileStorageUtil";
import { DatePickerDialog } from "../../components/datepickerdialog";
import moment from "moment";
import Constants from "../../global/constants";

export interface Props {
  navigator: any;
}
export interface State {}

let chatStore: Object;
let chatView: Object;
var sound: Sound;

const welcomeMessage = [
  {
    type: "txt",
    text: "Hello there, " + greetMsg(),
  },
  {
    type: "txt",
    text: "I'm Erica! How can I help you today?",
  },
  {
    type: "txt",
    text: "If you want to see some recommendations, press Yes!",
    options: [{ title: "Yes", action: "demo/functions" }, { title: "No", action: "demo/no" }],
  },
];

function greetMsg() {
  let msg = "";
  let d = new Date(),
    h = d.getHours();

  if (h > 5 && h < 12) {
    msg = "good morning!";
  } else if (h >= 12 && h < 15) {
    msg = "good afternoon!";
  } else {
    msg = "good evening!";
  }
  return msg;
}

@inject("chatStore", "chatViewStore")
@observer
export default class OriginalContainer extends React.Component<Props, State> {
  componentDidMount() {
    //Hide Tab Bar
    this.props.navigator.toggleTabs({
      to: "hidden", // required, 'hidden' = hide tab bar, 'shown' = show tab bar
      animated: false, // does the toggle have transition animation or does it happen immediately (optional)
    });

    //Bind React-Native-Navigation eventNavigator
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));

    //Init ChatStore Obj
    chatStore = this.props.chatStore;
    //Init ChatViewStore Obj
    chatView = this.props.chatViewStore;

    //Create a Pvt Folder to save all chat voice recordings
    if (chatView.lastChatRecName === "1") {
      FileUtil.deleteFilePath(
        AudioUtils.DocumentDirectoryPath + "/ChatRecordings",
        () => {
          console.log("Chat recording dir purged!");
        },
        () => {
          console.log("Chat recording dir NOT purged");
        },
      );
    }
    FileUtil.makeDir(
      "ChatRecordings",
      () => {
        console.log("Chat recording dir created!");
      },
      () => {
        console.log("Chat recording dir NOT created!");
      },
      true,
    );

    //Check Mic Record Permission for voice recording on Android
    //Delay it a bit, to avoid crashes w.r.t activity not getting bound
    setTimeout(() => {
      this._checkPermission().then(hasPermission => {
        chatView.hasMicPermission = true;

        if (!hasPermission) {
          return;
        }

        // this.prepareRecordingPath(this.state.audioPath);

        AudioRecorder.onProgress = data => {
          chatView.updateRecordingTime(Math.floor(data.currentTime));
        };

        AudioRecorder.onFinished = data => {
          // Android callback comes in the form of a promise instead.
          if (Platform.OS === "ios") {
            this._finishRecording(data.status === "OK", data.audioFileURL);
          }
        };

        //Welcome Chat Flow Trigger
        this.fireWelcomeMessages();
      });
    }, 500);
  }

  componentWillReceiveProps(nextProps) {
    // console.warn("OC:" + JSON.stringify(nextProps.chatStore));
  }

  componentWillUnmount() {
    this._stopSound();
  }

  //React-Native-Navigation handler for drawer etc.,
  onNavigatorEvent = (event: {}) => {};

  fireWelcomeMessages() {
    for (let i = 0; i < welcomeMessage.length; i++) {
      setTimeout(() => {
        let type = welcomeMessage[i].type;
        let text = welcomeMessage[i].text;
        let action = welcomeMessage[i].action;
        let options = welcomeMessage[i].options;
        let slides = welcomeMessage[i].slides;
        let imageUrl = welcomeMessage[i].imageUrl;
        let showIcon = false;
        let replaceFirstInd = false;
        let animate = 1;
        if (i === 0) {
          showIcon = true;
          animate = 1; //fadeInLeft
        } else {
          animate = 2; //fadeInDown
        }

        chatStore.createResponseChat(
          replaceFirstInd,
          type,
          text,
          action,
          options,
          imageUrl,
          "",
          showIcon,
          animate,
          slides,
        );
      }, i * 700);
    }
  }

  _checkPermission() {
    if (Platform.OS !== "android") {
      return Promise.resolve(true);
    }

    const rationale = {
      title: "Microphone Permission",
      message: "The app needs access to your microphone so you can talk to the bot.",
    };

    return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, rationale).then(
      result => {
        console.log("Permission result:", result);
        return result === true || result === PermissionsAndroid.RESULTS.GRANTED;
      },
    );
  }

  // invoke DatePickerDialog
  invokeDatePickerDialog = () => {
    let date = new Date();

    //To open the dialog
    this.dateDialog.open({
      date: date,
      maxDate: new Date(), //To restrict future date
    });
  };

  // Call back for date Dialog picked event
  onDatePicked = date => {
    // console.warn(moment(date).format("DD-MMM-YYYY"));
    this._receiveUserIp(moment(date).format("DD-MMM-YYYY"), "booking/flight=city?date");
  };

  //Handle User Chat Input and other actions
  _receiveUserIp(inputData, action) {
    if (action === "phone/imgPreview") {
      chatView.imageToPreview = inputData;
    } else if (action === "phone/mapView") {
      this.props.navigator.showModal({
        screen: Constants.Screens.MAPS.screen,
        title: "SFO to AMS",
        navigatorStyle: {
          navBarButtonColor: Constants.Colors.white,
          navBarTextColor: Constants.Colors.white,
          navigationBarColor: Constants.Colors.black,
          navBarBackgroundColor: Constants.Colors.chatPrimaryAccent,
          statusBarColor: Constants.Colors.chatDarkAccent,
          tabFontFamily: "Roboto",
        },
      });
    } else if (action === "phone/datepicker") {
      this.invokeDatePickerDialog();
    } else if (action === "phone/contact") {
      Linking.canOpenURL("tel:+919988776655")
        .then(supported => {
          if (!supported) {
            console.log("Can't handle url: " + "url");
          } else {
            return Linking.openURL("tel:+919988776655");
          }
        })
        .catch(err => console.error("An error occurred", err));
    } else if (action === "phone/bookingdetails") {
      this.props.navigator.push({
        screen: Constants.Screens.TEMPLATEBLOBFV.screen,
        title: "Booking Details",
        navigatorStyle: {
          navBarButtonColor: Constants.Colors.white,
          navBarTextColor: Constants.Colors.white,
          navigationBarColor: Constants.Colors.black,
          navBarBackgroundColor: Constants.Colors.chatPrimaryAccent,
          statusBarColor: Constants.Colors.chatDarkAccent,
          tabFontFamily: "Roboto",
        },
        passProps: {
          slideData: inputData,
        },
        overrideBackPress: true,
      });
    } else {
      //If last chat type is opts or text with opts, then replace when user chooses it
      let replace =
        this.props.chatStore.chatList &&
        this.props.chatStore.chatList.length > 0 &&
        this.props.chatStore.chatList[0].type === "opts" &&
        (action && action.substring(0, 4)) !== "demo"; //Dont replace Demo Option list
      chatStore.createUserChat(replace ? true : false, inputData, replace ? 2 : 1);
      chatStore.contactAiApi(inputData, action);

      // console.log(JSON.stringify(chatStore.chatList));
    }
  }

  _prepareRecordingPath(audioPath) {
    // Prepare Audio Recorder Lib
    AudioRecorder.prepareRecordingAtPath(audioPath, {
      SampleRate: 22050,
      Channels: 1,
      AudioQuality: "Low",
      AudioEncoding: "aac",
      AudioEncodingBitRate: 32000,
    });
  }

  async _startRecording() {
    if (this.props.chatViewStore.voiceRecording) {
      console.warn("Already recording!");
      return;
    }

    if (!this.props.chatViewStore.hasMicPermission) {
      console.warn("Can't record, no permission granted!");
      return;
    }

    //Prepare Audio Recorder with an audioPath
    let audioPath =
      AudioUtils.DocumentDirectoryPath +
      "/ChatRecordings/" +
      this.props.chatViewStore.lastChatRecName +
      ".aac";
    this._prepareRecordingPath(audioPath);

    this.props.chatViewStore.setVoiceRecording(true);

    try {
      const filePath = await AudioRecorder.startRecording();
    } catch (error) {
      console.error(error);
    }
  }

  _finishRecording(didSucceed, filePath) {
    let temp = parseInt(this.props.chatViewStore.lastChatRecName) + 1;
    this.props.chatViewStore.lastChatRecName = "" + temp;

    chatStore.createAudioChat(true, filePath, 1);
    chatStore.contactAiApi("", "user/voice");

    console.log(
      `Finished recording of duration ${
        this.props.chatViewStore.recordingTime
      } seconds at path: ${filePath}`,
    );
  }

  async _stopRecording(cancelled) {
    if (!this.props.chatViewStore.voiceRecording) {
      console.warn("Can't stop, not recording!");
      return;
    }

    this.props.chatViewStore.setVoiceRecording(false);
    if (cancelled || this.props.chatViewStore.recordingTime < 1) {
      await AudioRecorder.stopRecording();
      return;
    }

    try {
      const filePath = await AudioRecorder.stopRecording();

      if (Platform.OS === "android") {
        this._finishRecording(true, filePath);
      }
      return filePath;
    } catch (error) {
      console.error(error);
    }
  }

  _chatAnimate(indx) {
    chatStore.setAnimate(indx, false);
  }

  _playSound(ind, audioPath) {
    this._stopSound();

    this.props.chatStore.setAudioPlaying(ind, true);

    sound = new Sound(audioPath, "", error => {
      if (error) {
        console.log("failed to load the sound", error);
      }
    });
    // setTimeout(() => {
    setTimeout(() => {
      sound.play(success => {
        if (success) {
          this._stopSound();
          console.log("successfully finished playing");
        } else {
          console.log("playback failed due to audio decoding errors");
        }
      });
    }, 100);
    // }, 100);
  }
  _stopSound() {
    this.props.chatStore.stopAllPlaying();

    if (sound) {
      setTimeout(() => {
        sound.stop(success => {
          if (success) {
            console.warn("successfully finished stopping");
          } else {
            console.warn("stop failed due to audio decoding errors");
          }
        });
      }, 100);
    }
  }

  _renderDateDialog() {
    return (
      <DatePickerDialog
        ref={ref => {
          this.dateDialog = ref;
        }}
        onDatePicked={this.onDatePicked.bind(this)}
      />
    );
  }

  render() {
    let chatList = this.props.chatStore.chatList.toJS();
    return (
      <View style={{ flex: 1 }}>
        <ChatPage
          navigator={this.props.navigator}
          chatList={chatList}
          sendPressed={this._receiveUserIp.bind(this)}
          chatAnimate={this._chatAnimate.bind(this)}
          startRecording={this._startRecording.bind(this)}
          stopRecording={this._stopRecording.bind(this)}
          playSound={this._playSound.bind(this)}
          stopSound={this._stopSound.bind(this)}
        />

        {this._renderDateDialog()}
      </View>
    );
  }
}
