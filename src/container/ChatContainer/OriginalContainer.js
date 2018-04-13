// @flow
import * as React from "react";
import { observer, inject } from "mobx-react/native";
import ChatPage from "../../screens/ChatPage";

export interface Props {
  navigator: any;
}
export interface State {}

let chatStore: Object;

const dummyImages = [
  "https://cnet1.cbsistatic.com/img/_QgPMW663-rUhx1Y3EWZ6n0RPG4=/936x527/2015/05/12/0bd24541-9769-4e4d-bf56-a5c4e60ad8bb/panasonic-fz1000-sample-photo-10.jpg",
  "https://www.slrlounge.com/wp-content/uploads/2013/11/Nikon-D5300-Sample-Image-Night.jpg",
  "https://www.gettyimages.co.nz/gi-resources/images/Embed/new/embed2.jpg",
  "https://www.w3schools.com/w3images/lights.jpg",
  "http://spayce.me/wp-content/uploads/2018/02/hawaii-wallpaper-hd-1920x1080-nature-landscape-tropical-island-beach-palm-trees-white-sand-sea-summer-clouds.jpg",
  "https://static.motor.es/fotos-noticias/2017/09/min652x435/suzuki-swift-sport-2018-201739407_1.jpg",
  "http://fujifilm.com.ph/Products/digital_cameras/x/fujifilm_x20/sample_images/img/index/ff_x20_008.JPG"
];

@inject("chatStore")
@observer
export default class OriginalContainer extends React.Component<Props, State> {
  componentDidMount() {
    //Hide Tab Bar
    this.props.navigator.toggleTabs({
      to: "hidden", // required, 'hidden' = hide tab bar, 'shown' = show tab bar
      animated: false // does the toggle have transition animation or does it happen immediately (optional)
    });

    chatStore = this.props.chatStore;

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent = (event: {}) => {};

  //Handle User Chat Input
  receiveUserIp(ipText, action) {
    chatStore.createUserChat(ipText);
    chatStore.contactAiApi(ipText, action);

    // console.log(JSON.stringify(chatStore.chatList));
  }

  render() {
    const { chatStore } = this.props;
    let chatList = chatStore.chatList.toJS();
    return (
      <ChatPage
        navigator={this.props.navigator}
        chatList={chatList}
        sendPressed={this.receiveUserIp}
      />
    );
  }
}
