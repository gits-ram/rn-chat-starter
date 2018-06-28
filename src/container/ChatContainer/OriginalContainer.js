// @flow
import * as React from "react";
import { observer, inject } from "mobx-react/native";
// import { observer } from "mobx-react";
import { PermissionsAndroid, Platform, LayoutAnimation } from "react-native";
import ChatPage from "../../screens/ChatPage";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import Sound from "react-native-sound";
import * as FileUtil from "../../utils/FileStorageUtil";

export interface Props {
  navigator: any;
}
export interface State {}

let chatStore: Object;
let chatView: Object;
var sound: Sound;

const dummyImages = [
  "https://cnet1.cbsistatic.com/img/_QgPMW663-rUhx1Y3EWZ6n0RPG4=/936x527/2015/05/12/0bd24541-9769-4e4d-bf56-a5c4e60ad8bb/panasonic-fz1000-sample-photo-10.jpg",
  "https://www.slrlounge.com/wp-content/uploads/2013/11/Nikon-D5300-Sample-Image-Night.jpg",
  "https://www.gettyimages.co.nz/gi-resources/images/Embed/new/embed2.jpg",
  "https://www.w3schools.com/w3images/lights.jpg",
  "http://spayce.me/wp-content/uploads/2018/02/hawaii-wallpaper-hd-1920x1080-nature-landscape-tropical-island-beach-palm-trees-white-sand-sea-summer-clouds.jpg",
  "https://static.motor.es/fotos-noticias/2017/09/min652x435/suzuki-swift-sport-2018-201739407_1.jpg",
  "http://fujifilm.com.ph/Products/digital_cameras/x/fujifilm_x20/sample_images/img/index/ff_x20_008.JPG",
];

const welcomeMessage = [
  {
    type: "txt",
    text: "Hello there, " + greetMsg(),
  },
  {
    type: "txt",
    text: "I'm your virtual assistant. I can help you make cargo bookings.",
  },
  {
    type: "txt",
    text: "You can either chat or speak to me using the input bar below.",
  },
  {
    type: "txt",
    text: "Would you like to see some recommendations on what I can do? If so, press YES!",
    options: [{ title: "Yes", action: "demo/functions" }],
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

    //Check Mic Record Permission for voice recording on Android
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
    });

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

    this.fireWelcomeMessages();
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

  //Handle User Chat Input
  _receiveUserIp(ipText, action) {
    //If last chat type is opts, then replace when user chooses it
    let replace =
      this.props.chatStore.chatList &&
      this.props.chatStore.chatList.length > 0 &&
      this.props.chatStore.chatList[0].type === "opts" &&
      (action && action.substring(0, 4)) !== "demo"; //Dont replace Demo Option list
    chatStore.createUserChat(replace ? true : false, ipText, replace ? 2 : 1);
    chatStore.contactAiApi(ipText, action);

    // console.log(JSON.stringify(chatStore.chatList));
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

  render() {
    let chatList = this.props.chatStore.chatList.toJS();
    return (
      // <View style={{ flex: 1 }}>
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
      // </View>
    );
  }
}
