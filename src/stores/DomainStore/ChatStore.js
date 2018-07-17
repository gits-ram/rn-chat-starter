import { observable, action } from "mobx";
import * as ChatApi from "../../services/api/ChatApi";
import Axios from "axios";
import ChatModel from "../models/Chat";

//For Axios
var CancelToken = null;
var source = null;

export default class ChatStore {
  @observable hasErrored = false;
  @observable fetchingApi = false;
  @observable chatList = [];

  //Placeholder method for future impl
  @action
  contactAiApi(txt, act) {
    if (act) {
      //If action is available, process/manpipulate as needed before firing request
      //.....
    }

    //Observable tripped to true, to show loader
    this.fetchingApi = true;
    //Insert Loading Indicator as a Chat Entity and Remove it once response is received
    setTimeout(() => {
      this.createResponseChat(false, "txt", "loading..", null, null, null, null, true, 1);
      // this.createResponseChat("loader", "", null, null);
    }, 300);

    //Create a new Cancel Token and pass it to Axios request
    CancelToken = Axios.CancelToken;
    source = CancelToken.source();

    //Implement API Service request Here
    //Use Services/API class
    ChatApi.postUserAction({ text: txt, action: act }, source)
      .then(response => {
        this.fetchingApi = false;
        //Remove Loader Chat
        // this.deleteLastChat();

        this.resp = response;

        if (response) {
          console.log("PARSING CHAT:" + JSON.stringify(response));
          if (response instanceof Array) {
            let ind = 0;
            for (ind; ind < response.length; ind++) {
              let type = response[ind].type;
              let text = response[ind].text;
              let action = response[ind].action;
              let options = response[ind].options;
              let slides = response[ind].slides;
              let imageUrl = response[ind].imageUrl;
              let showIcon = false;
              let replaceFirstInd = false;
              let animate = 1;
              if (ind === 0) {
                showIcon = true;
                replaceFirstInd = true;
                animate = 1; //fadeInLeft
              } else {
                animate = 2; //fadeInDown
              }

              setTimeout(() => {
                this.createResponseChat(
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
              }, ind * 600);
            }
          } else {
            this.createResponseChat(
              true, //repace first index (which is the loader indicator)
              response.type,
              response.text,
              response.action,
              response.options,
              response.imageUrl,
              "",
              true, //show Ai icon?
              1, //animate type
              response.slides,
            );
          }
        }
      })
      .catch(error => {
        this.fetchingApi = false;
        if (Axios.isCancel(error)) {
          console.log("ChatAPi Request cancelled");
        } else {
          console.log("ChatApi Error " + error);
        }
      });
  }

  createUserChat(replaceFirstInd, text, animateType) {
    // let index = 0;
    // if (this.chatList.length > 0) {
    //   index = this.chatList.length;
    // }
    let index = 0;
    if (replaceFirstInd) {
      index = this.chatList.length - 1;
    } else {
      if (this.chatList.length > 0) {
        index = this.chatList.length;
      }
    }

    let obj = {
      isUser: true,
      type: "txt",
      position: "right",
      title: "You",
      text: text,
      imgUrl: "",
      url: "",
      subText: "dummy",
      options: null,
      showIcon: true,
      animate: animateType,
      slides: null,
    };
    // console.log("USR INDEX:" + index);
    let chat = new ChatModel(obj, index);

    // this.insertChatData(chat);
    if (replaceFirstInd) {
      this.chatList[0] = chat;
    } else {
      this.insertChatData(chat);
    }
  }

  createAudioChat(isUser, path, animateType) {
    let index = 0;
    if (this.chatList.length > 0) {
      index = this.chatList.length;
    }

    let obj = {
      isUser: isUser,
      type: "audio",
      position: "right",
      title: "",
      text: "",
      imgUrl: "",
      url: "",
      subText: "dummy",
      options: null,
      showIcon: true,
      isPlaying: false,
      audioPath: path,
      animate: animateType,
      slides: null,
    };
    // console.log("USR INDEX:" + index);
    let chat = new ChatModel(obj, index);

    this.insertChatData(chat);
  }

  //Currently stubbed to give dummy responses
  createResponseChat(replaceFirstInd, type, txt, act, opts, imgUrl, URL, showIc, animType, slide) {
    let index = 0;
    if (replaceFirstInd) {
      index = this.chatList.length - 1;
    } else {
      if (this.chatList.length > 0) {
        index = this.chatList.length;
      }
    }

    let obj = {};
    obj = {
      isUser: false,
      type: type,
      position: "left",
      title: "AI",
      text: txt,
      action: act,
      imgUrl: imgUrl,
      url: URL,
      subText: "dummy",
      options: opts,
      showIcon: showIc,
      animate: animType,
      slides: slide,
    };
    // console.log("AI INDEX:" + index);
    let chat = new ChatModel(obj, index);

    if (replaceFirstInd) {
      this.chatList[0] = chat;
    } else {
      this.insertChatData(chat);
    }
  }

  @action
  insertChatData(chatModel) {
    this.chatList = [chatModel, ...this.chatList];
    // this.chatList.push(chatModel);
  }

  @action
  deleteLastChat() {
    this.chatList.shift();
  }

  @action
  clearChat() {
    this.chatList = [];
  }

  @action
  setAnimate(indx, state) {
    this.chatList[indx].animate = state;
  }

  @action
  setAudioPlaying(indx, state) {
    this.chatList[indx].isPlaying = state;
  }

  @action
  stopAllPlaying() {
    for (let i = 0; i < this.chatList.length; i++) {
      if (this.chatList[i].isPlaying) {
        this.chatList[i].isPlaying = false;
      }
    }
  }
}
