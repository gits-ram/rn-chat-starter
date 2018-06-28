import * as React from "react";
import { View, FlatList, LayoutAnimation, Platform, UIManager } from "react-native";
import { Observer } from "mobx-react/native";
import styles from "./styles";
import ChatTextBlob from "../../components/chat/TextBlob";
import ChatImageBlob from "../../components/chat/ImageBlob";
import LoaderIndicator from "../../components/chat/LoadingIndicator";
import OptionsBlob from "../../components/chat/OptionsBlob";
import AudioBlob from "../../components/chat/AudioBlob";
import CarouselBlob from "../../components/chat/CarouselBlob";
import TemplateBlob from "../../components/chat/TemplateBlob";

export interface State {}
export interface Props {}

export default class ChatList extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentWillReceiveProps(nextProps) {
    //Scroll To Begining(or end, since inverted) when new chat gets updated in chatlist
    if (nextProps.chatList.length > 2) {
      this.listRef.scrollToIndex({ animated: true, index: 0 });
    }

    // LayoutAnimation.configureNext({
    //   duration: 400,
    //   create: {
    //     type: LayoutAnimation.Types.linear,
    //     property: LayoutAnimation.Properties.opacity,
    //   },
    //   update: {
    //     type: LayoutAnimation.Types.easeInEaseOut,
    //     property: LayoutAnimation.Properties.scaleXY,
    //   },
    //   delete: {
    //     type: LayoutAnimation.Types.spring,
    //     property: LayoutAnimation.Properties.scaleXY,
    //     springDamping: 1.0,
    //   },
    // });
  }

  componentWillReact() {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
  }

  _renderChatItem(itm, indx) {
    let item = itm;
    let tempAnim = item.animate;

    //Turn Animation state/type to 0, as we have animated once
    this.props.chatAnimate(indx, 0);
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
                playSound={this.props.playSound.bind(this)}
                stopSound={this.props.stopSound.bind(this)}
                animate={tempAnim}
              />
            );
        }
        break;

      case false: //Bot Response Chats
        switch (item.type) {
          case "txt":
            return (
              <ChatTextBlob
                title={item.title}
                text={item.text}
                isUser={false}
                options={item.options}
                chatAction={this.props.receiveChatAction.bind(this)}
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
                chatAction={this.props.receiveChatAction.bind(this)}
                showIcon={item.showIcon}
                animate={tempAnim !== false ? tempAnim : 1}
              />
            );

          case "loader":
            return <LoaderIndicator />;

          case "opts":
            return (
              <OptionsBlob
                optionsList={item.options}
                chatAction={this.props.receiveChatAction.bind(this)}
                animate={tempAnim}
              />
            );

          case "carousel":
            return (
              <CarouselBlob
                slidesList={item.slides}
                chatAction={this.props.receiveChatAction.bind(this)}
                animate={tempAnim}
                showPagination={false}
                showIcon={item.showIcon}
              />
            );

          case "template":
            return (
              <TemplateBlob
                slidesList={item.slides}
                chatAction={this.props.receiveChatAction.bind(this)}
                animate={tempAnim}
                showPagination={false}
                showIcon={item.showIcon}
              />
            );
        }
    }
  }

  render() {
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
          //     length: this.state.mixedHeights[index],
          //     offset: this.state.cumulativeMixedHeights[index],
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
}
