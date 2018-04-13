// @flow
import styles from "./styles";
import * as React from "react";
import {
  View,
  Platform,
  UIManager,
  FlatList,
  TouchableHighlight
} from "react-native";
import {
  Container,
  Header,
  Title,
  Button,
  Left,
  Icon,
  Right,
  Body,
  Text,
  Item,
  Input
} from "native-base";
import { observer } from "mobx-react/native";
import { inject } from "mobx-react/native";
import ChatTextBlob from "../../components/chat/TextBlob";
import ChatImageBlob from "../../components/chat/ImageBlob";
import LoaderIndicator from "../../components/chat/LoadingIndicator";
import OptionsBlob from "../../components/chat/OptionsBlob";
import ImagePreviewer from "../../components/SingleImagePreviewer";

export interface Props {
  navigator: any;
}

export interface State {}

let chatView: object;

@inject("chatViewStore")
@observer
class ChatPage extends React.Component<Props, State> {
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

  componentWillReceiveProps(nextProps) {}

  _receiveChatAction(ipTxt, action) {
    if (action === "imgPreview") {
      chatView.imageToPreview = ipTxt;
    } else {
      this.props.sendPressed(ipTxt, action);
    }
  }

  // _renderNavBar(param: any) {
  //   return (
  //     <Header>
  //       <Left>
  //         <Button transparent onPress={() => this.props.navigation.goBack()}>
  //           <Icon name="ios-arrow-back" />
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
    return (
      <View style={styles.InputBarView}>
        <Item rounded style={{ flex: 0.79 }}>
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
        <Button
          style={{
            marginLeft: 5,
            flex: 0.2,
            alignSelf: "center",
            borderRadius: 20
          }}
          onPress={() => {
            this.props.sendPressed(chatView.inputString, null);
            this.input._root.clear();
          }}
        >
          <Text>Send</Text>
        </Button>
      </View>
    );
  }

  _renderChatItem(itm) {
    let item = itm;
    // console.log("RENDER ITEM:" + JSON.stringify(item));

    switch (item.isUser) {
      case true:
        return (
          <ChatTextBlob
            title={item.title}
            text={item.text}
            isUser={true}
            chatAction={null}
          />
        );

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
              />
            );

          case "loader":
            return <LoaderIndicator />;

          case "opts":
            return (
              <OptionsBlob
                optionsList={item.options}
                chatAction={this._receiveChatAction.bind(this)}
              />
            );
        }
    }
  }

  _renderChatList() {
    return (
      <View style={styles.ListView}>
        <FlatList
          inverted={true}
          ref={ref => {
            this.listRef = ref;
          }}
          style={{ width: "100%" }}
          renderItem={({ item }) => this._renderChatItem(item)}
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
          left: 0
        }}
      >
        <ImagePreviewer imagePath={chatView.imageToPreview} />

        <TouchableHighlight
          style={styles.closeIcon}
          underlayColor="rgba(255, 255, 255, 0.5)"
          onPress={() => {
            chatView.imageToPreview = "";
          }}
        >
          <Icon
            name="close"
            style={{
              alignSelf: "center",
              justifyContent: "center",
              color: "#f4511e"
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
    const { chatViewStore } = this.props;

    return (
      <Container style={styles.container}>
        {chatViewStore.imageToPreview && chatViewStore.imageToPreview.length > 0
          ? this._renderImagePreview()
          : this._renderCoreUI(param)}
      </Container>
    );
  }
}

export default ChatPage;
