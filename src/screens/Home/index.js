import * as React from "react";
import { Image as AnimImage, View as AnimView } from "react-native-animatable";
import {
  Container,
  Header,
  Title,
  Content,
  Text,
  Button,
  Icon,
  Left,
  Body,
  Right,
  List,
  ListItem,
} from "native-base";
import Constants from "../../global/constants";
import styles from "./styles";

export interface Props {
  navigator: any;
  list: any;
}
export interface State {}

class Home extends React.Component<Props, State> {
  constructor(props) {
    super(props);
  }
  componentDidMount() {}

  render() {
    return (
      <Container style={styles.container}>
        {/* <Header>
          <Left>
            <Button transparent>
              <Icon
                active
                name="menu"
                onPress={() => this.props.navigation.navigate("DrawerOpen")}
              />
            </Button>
          </Left>
          <Body>
            <Title>Home Screen</Title>
          </Body>
          <Right />
        </Header> */}

        <Content>
          <List
            onScroll={() => {
              console.log("Home List being scrolled");
            }}>
            {this.props.list.map((item, i) => (
              <ListItem
                key={i}
                onPress={() => {
                  //OLD - React-Navigation
                  // let navRoute = "BlankPage";
                  // if (item === "FlatList with Animated/Collapsible Header") {
                  //   navRoute = "AnimatedHeaderFlatList";
                  // } else if (item === "ScrollView with Animated/Collapsible Header") {
                  //   navRoute = "AnimatedHeaderScrollView";
                  // } else if (item === "Infinite People Flatlist With Search") {
                  //   navRoute = "PeopleList";
                  // } else if (item === "Sticky LargeList-Grid (Ext Lib)") {
                  //   navRoute = "StickyLargeList";
                  // } else if (item === "Chat UI") {
                  //   navRoute = "ChatUI";
                  // } else if (item === "AutoComplete/TypeAhead") {
                  //   navRoute = "AutoComplete";
                  // }
                  // this.props.navigation.navigate(navRoute, {
                  //   name: { item },
                  // });

                  /*** New - React-native-navigation ***/
                  if (item === "FlatList with Animated/Collapsible Header") {
                    this.props.navigator.push({
                      screen: Constants.Screens.COLLAPSIBLEHEADERFLATLIST.screen,
                      title: Constants.Screens.COLLAPSIBLEHEADERFLATLIST.title,
                    });
                  } else if (item === "ScrollView with Animated/Collapsible Header") {
                    this.props.navigator.push({
                      screen: Constants.Screens.COLLAPSIBLEHEADERSCROLLVIEW.screen,
                      title: Constants.Screens.COLLAPSIBLEHEADERSCROLLVIEW.title,
                    });
                  } else if (item === "Infinite People Flatlist With Search") {
                    this.props.navigator.push({
                      screen: Constants.Screens.PEOPLEFLATLIST.screen,
                      title: Constants.Screens.PEOPLEFLATLIST.title,
                    });
                  } else if (item === "Sticky LargeList (Ext Lib)") {
                    this.props.navigator.push({
                      screen: Constants.Screens.STICKYLARGELIST.screen,
                      title: Constants.Screens.STICKYLARGELIST.title,
                    });
                  } else if (item === "AutoComplete/TypeAhead") {
                    this.props.navigator.push({
                      screen: Constants.Screens.AUTOCOMPLETE.screen,
                      title: Constants.Screens.AUTOCOMPLETE.title,
                    });
                  } else if (item === "List View with Swipe Menu") {
                    this.props.navigator.push({
                      screen: Constants.Screens.SWIPELISTVIEW.screen,
                      title: Constants.Screens.SWIPELISTVIEW.title,
                    });
                  } else if (item === "Expandable Sticky Section List") {
                    this.props.navigator.push({
                      screen: Constants.Screens.EXPANDABLESTICKYSECTIONLIST.screen,
                      title: Constants.Screens.EXPANDABLESTICKYSECTIONLIST.title,
                    });
                  } else if (item === "Form UI Components") {
                    this.props.navigator.push({
                      screen: Constants.Screens.FORMUI.screen,
                      title: Constants.Screens.FORMUI.title,
                    });
                  } else if (item === "Audio Recorder/Player") {
                    this.props.navigator.push({
                      screen: Constants.Screens.AUDIORECORDER.screen,
                      title: Constants.Screens.AUDIORECORDER.title,
                    });
                  } else if (item === "ScrollView With Custom Indicator") {
                    this.props.navigator.push({
                      screen: Constants.Screens.INDICATEDSCROLLVIEW.screen,
                      title: Constants.Screens.INDICATEDSCROLLVIEW.title,
                    });
                  }
                }}>
                <Text>{item}</Text>
              </ListItem>
            ))}
          </List>
        </Content>
      </Container>
    );
  }
}

export default Home;
