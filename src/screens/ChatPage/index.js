// @flow
import styles from "./styles";
import * as React from "react";
import {
  View,
  Platform,
  UIManager,
  FlatList,
  TouchableHighlight,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import { Observer, inject, observer } from "mobx-react/native";
import { View as AnimView, Text as AnimText } from "react-native-animatable";
import {
  Container,
  Header,
  Title,
  Button,
  Left,
  Icon as Ico,
  Right,
  Body,
  Text,
  Item,
  Input,
} from "native-base";
import Icon from "react-native-vector-icons/FontAwesome";
import { AudioRecorder, AudioUtils } from "react-native-audio";
import Constants from "../../global/constants";
import ChatTextBlob from "../../components/chat/TextBlob";
import ChatImageBlob from "../../components/chat/ImageBlob";
import LoaderIndicator from "../../components/chat/LoadingIndicator";
import OptionsBlob from "../../components/chat/OptionsBlob";
import ImagePreviewer from "../../components/SingleImagePreviewer";
import AudioBlob from "../../components/chat/AudioBlob";

export interface Props {
  navigator: any;
  chatList: [];
  chatAnimate: Function;
  sendPressed: Function;
  playSound: Function;
  stopSound: Function;
  startRecording: Function;
  stopRecording: Function;
}

export interface State {}

let chatView: object;

@inject("chatViewStore")
@observer
class ChatPage extends React.Component<Props, State> {
  _micRef: any;

  constructor() {
    //Enable LayoutAnimation for Android
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    super();
    this.state = {};

    this.listRef = null;
  }

  componentDidMount() {
    chatView = this.props.chatViewStore;
  }

  componentWillReceiveProps(nextProps) {
    // console.warn("CL:" + JSON.stringify(nextProps.chatList));
  }

  _receiveChatAction(ipTxt, action) {
    if (action === "imgPreview") {
      chatView.imageToPreview = ipTxt;
    } else {
      this.props.sendPressed(ipTxt, action);
    }
  }

  _sendChat() {
    if (chatView.inputString !== "") {
      this.props.sendPressed(chatView.inputString, null);
      this.input._root.clear();
      this._micRef.bounceIn(400).then(() => {
        chatView.inputString = "";
      });
    }
  }

  _recordingTimer() {
    let actualTime = this.props.chatViewStore.recordingTime;
    let recordTime = "00:00";
    let minutes = 0;
    let seconds = actualTime;
    if (actualTime > 59) {
      minutes = Math.floor(actualTime / 60);
      seconds = actualTime % 60;
    }
    if (seconds < 10) {
      if (minutes === 0) {
        recordTime = "00:0" + seconds;
      } else {
        recordTime = "0" + minutes + ":0" + seconds;
      }
    } else {
      if (minutes === 0) {
        recordTime = "00:" + seconds;
      } else {
        recordTime = "0" + minutes + ":" + seconds;
      }
    }

    return recordTime;
  }

  _playSound(id, audioPath) {
    this.props.playSound(id, audioPath);
  }
  _stopSound() {
    this.props.stopSound();
  }

  // _renderNavBar(param: any) {
  //   return (
  //     <Header>
  //       <Left>
  //         <Button transparent onPress={() => this.props.navigation.goBack()}>
  //           <Ico name="ios-arrow-back" />
  //         </Button>
  //       </Left>

  //       <Body style={{ flex: 3 }}>
  //         <Title>{param ? param.name.item : "Blank Page"}</Title>
  //       </Body>

  //       <Right />
  //     </Header>
  //   );
  // }

  _renderInputBar() {
    let recordTime = this._recordingTimer();
    let chatView = this.props.chatViewStore;

    return (
      <View style={styles.InputBarView}>
        {chatView.voiceRecording ? (
          <View
            style={{
              flex: chatView.voiceRecording ? 0.85 : 0.9,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-evenly",
            }}>
            <AnimView
              useNativeDriver={true}
              animation="flash"
              easing="ease-in-out-sine"
              iterationCount="infinite"
              style={{ flex: 0.3, alignItems: "center", justifyContent: "center" }}>
              <Icon name="microphone" size={30} color={"#FF0000"} />
            </AnimView>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                flex: 0.7,
                justifyContent: "space-between",
              }}>
              <AnimText
                style={{ fontSize: 15 }}
                useNativeDriver={true}
                animation="pulse"
                easing="ease-in-out-sine"
                iterationCount="infinite">
                {recordTime}
              </AnimText>
              <Text style={{ color: "grey" }}> Slide to Cancel </Text>
            </View>
          </View>
        ) : (
          <Item rounded style={{ flex: 0.9 }}>
            <Input
              ref={ref => {
                this.input = ref;
              }}
              onChangeText={text => {
                chatView.inputString = text;
              }}
              style={{ height: 90 }}
              multiline={true}
              placeholder="Start typing here.."
            />
          </Item>
        )}

        <AnimView
          style={{
            flex: chatView.voiceRecording ? 0.15 : 0.1,
            alignItems: "center",
            justifyContent: "center",
          }}
          ref={ref => {
            this._micRef = ref;
          }}>
          {chatView.inputString.length === 0 ? (
            <TouchableWithoutFeedback
              onPressIn={evt => {
                chatView.micTouchX = Math.floor(evt.nativeEvent.locationX);
                chatView.micTouchY = Math.floor(evt.nativeEvent.locationY);
                this._micRef.swing(300).then(() => {
                  this.props.startRecording();
                });
              }}
              onPressOut={evt => {
                let tempX = evt.nativeEvent.locationX;
                let tempY = evt.nativeEvent.locationY;
                this._micRef.zoomOut(300).then(() => {
                  if (
                    Math.abs(Math.floor(tempX) - chatView.micTouchX > 30) ||
                    Math.abs(Math.floor(tempY) - chatView.micTouchY > 30)
                  ) {
                    this.props.stopRecording(true);
                  } else {
                    this.props.stopRecording(false);
                  }
                  this._micRef.zoomIn(300);
                });
              }}
              style={{ padding: chatView.voiceRecording ? 2 : 6 }}>
              <Icon
                name="microphone"
                size={chatView.voiceRecording ? 40 : 30}
                color={Constants.Colors.darkAccent}
              />
            </TouchableWithoutFeedback>
          ) : (
            <TouchableOpacity
              onPress={() => {
                this._sendChat();
              }}
              style={{ padding: 3, paddingRight: 2 }}>
              <Icon
                name="comment"
                size={30}
                color={Constants.Colors.darkAccent}
                style={{ marginTop: -3 }}
              />
            </TouchableOpacity>
          )}
        </AnimView>
      </View>
    );
  }

  _renderChatItem(itm, indx) {
    let item = itm;
    let tempAnim = item.animate;

    this.props.chatAnimate(indx, false);
    // console.warn("RENDER ITEM:" + JSON.stringify(item));

    switch (item.isUser) {
      case true:
        switch (item.type) {
          case "txt":
            return (
              <ChatTextBlob
                title={item.title}
                text={item.text}
                isUser={true}
                chatAction={null}
                animate={tempAnim}
              />
            );

          case "audio":
            return (
              <AudioBlob
                id={indx}
                isUser={true}
                isPlaying={item.isPlaying}
                audioPath={item.audioPath}
                playSound={this._playSound.bind(this)}
                stopSound={this._stopSound.bind(this)}
              />
            );
        }
        break;

      case false:
        switch (item.type) {
          case "txt":
            return (
              <ChatTextBlob
                title={item.title}
                text={item.text}
                isUser={false}
                options={item.options}
                chatAction={this._receiveChatAction.bind(this)}
                showIcon={item.showIcon}
                animate={tempAnim}
              />
            );

          case "img":
            return (
              <ChatImageBlob
                title={item.title}
                text={item.text}
                image={item.imgUrl}
                chatAction={this._receiveChatAction.bind(this)}
                showIcon={item.showIcon}
                animate={tempAnim}
              />
            );

          case "loader":
            return <LoaderIndicator />;

          case "opts":
            return (
              <OptionsBlob
                optionsList={item.options}
                chatAction={this._receiveChatAction.bind(this)}
                animate={item.animate}
              />
            );
        }
    }
  }

  _renderChatList() {
    // let chatList = this.props.chatStore.chatList.toJS();
    return (
      <View style={styles.ListView}>
        <FlatList
          inverted={true}
          ref={ref => {
            this.listRef = ref;
          }}
          style={{ width: "100%" }}
          renderItem={({ item, index }) => {
            return <Observer>{() => this._renderChatItem(item, index)}</Observer>;
          }}
          keyExtractor={item => "" + item.id}
          // initialScrollIndex = {this.state.initialScrollIndex}

          // Fixed Height getItemLayout
          // getItemLayout = {(data, index) => {
          //   return {length: 400, offset: 400 * index, index}
          // }}

          // Variable Height getItemLayout (REF: FLATLISTHEIGHTTEST PROJECT)
          // getItemLayout={(data, index) => {
          //   return {
          //     length: this.state.imageHeights[index],
          //     offset: this.state.cumulativeImageHeights[index],
          //     index,
          //   };
          // }}
          initialListSize={5} //listview optimization
          pageSize={10} //listview optimization
          data={this.props.chatList}
          // extraData={this.props.chatStore.chatList.toJS()}
        />
      </View>
    );
  }

  _renderImagePreview() {
    return (
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}>
        <ImagePreviewer imagePath={chatView.imageToPreview} />

        <TouchableHighlight
          style={styles.closeIcon}
          underlayColor="rgba(255, 255, 255, 0.5)"
          onPress={() => {
            chatView.imageToPreview = "";
          }}>
          <Ico
            name="close"
            style={{
              alignSelf: "center",
              justifyContent: "center",
              color: "#f4511e",
            }}
            size={42}
          />
        </TouchableHighlight>
      </View>
    );
  }

  _renderCoreUI(param) {
    return (
      <View style={styles.container}>
        {/* {this._renderNavBar(param)} */}

        {this._renderChatList()}

        {this._renderInputBar()}
      </View>
    );
  }

  render() {
    const param = null; //this.props.navigation.state.params;
    // const { chatViewStore } = this.props;

    return (
      <Container style={styles.container}>
        {this.props.chatViewStore.imageToPreview &&
        this.props.chatViewStore.imageToPreview.length > 0
          ? this._renderImagePreview()
          : this._renderCoreUI(param)}
      </Container>
    );
  }
}

export default ChatPage;
