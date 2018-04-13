// @flow
import * as React from "react";
import { View, Platform, UIManager } from "react-native";
import { Container, Spinner, Text } from "native-base";
import styles from "./styles";
import { LargeList } from "react-native-largelist";
import ListRow from "../../components/ListRow";
import Constants from "../../global/constants";

export interface Props {
  navigator: any;
}

export interface State {
  refreshing: boolean;
  peopleList: Object[];
}

class StickyLargeList extends React.Component<Props, State> {
  minCellHeight = 64;
  maxCellHeight = 64;
  minSectionHeight = 32;
  maxSectionHeight = 32;
  refreshing = false;
  largeList: LargeList;

  constructor() {
    //Enable LayoutAnimation for Android
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental &&
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    super();
    this.state = {
      refreshing: false,
      peopleList: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showLoader != this.props.showLoader) {
      if (!nextProps.showLoader) {
        this.setState({ refreshing: false });
      }
    }
    if (nextProps.peopleList != this.props.peopleList) {
      this.setState({ peopleList: nextProps.peopleList });
      this.largeList.numberOfRowsInSection = nextProps.peopleList.length;
      this.largeList.reloadData();
    }
  }

  // _renderNavBar = (param: any) => {
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
  // };

  _renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#cccccc",
          marginLeft: "14%",
        }}
      />
    );
  };

  _renderHeader = () => {
    return (
      <View
        style={{
          height: 40,
          width: "100%",
          backgroundColor: "#EBF2F9",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Text> Dummy Header </Text>
      </View>
    );
  };

  _renderItem = (section: number, row: number) => {
    if (this.state.peopleList && this.state.peopleList.length <= 0) {
      return null;
    }

    let item = this.state.peopleList[row];
    if (item === undefined) {
      return;
    }
    // console.log("PEOPLEITEM:" + JSON.stringify(item));
    // console.log("Row:" + row + " Item:" + item.name + "ID: " + item.key);
    return <ListRow name={item.name} picture={item.image} email={item.email} />;
  };

  _renderFooter = () => {
    if (!this.props.showLoader || this.state.refreshing) {
      return null;
    }

    return <Spinner color="#356CB1" />;
  };

  _handleRefresh = () => {
    this.setState({ refreshing: true });
    this.props.handleRefresh();
  };

  _handleLoadMore = () => {
    if (this.state.searchText === "") {
      this.props.handleLoadMore();
    }
  };

  render() {
    // const param = this.props.navigation.state.params;

    return (
      <Container style={styles.container}>
        {/* {this._renderNavBar(param)} */}
        {/* Refer: https://github.com/bolan9999/react-native-largelist For new updates and more features */}
        <LargeList
          style={{ flex: 1 }}
          ref={ref => (this.largeList = ref)}
          bounces={true}
          refreshing={this.state.refreshing}
          onRefresh={() => {
            this.setState({ refreshing: true });
            setTimeout(() => this.setState({ refreshing: false }), 2000);
          }}
          safeMargin={600}
          numberOfRowsInSection={() => this.state.peopleList.length} //section => (this.state.peopleList.length > 0 ? 15 : 0)}
          numberOfSections={() => 1}
          heightForCell={(section, row) => (row % 2 ? this.minCellHeight : this.maxCellHeight)}
          renderCell={this._renderItem.bind(this)}
          heightForSection={section =>
            section % 2 ? this.minSectionHeight : this.maxSectionHeight
          }
          renderHeader={this._renderHeader.bind(this)}
          renderFooter={this._renderFooter.bind(this)}
          renderSection={section => {
            return (
              <View
                style={{
                  flex: 1,
                  backgroundColor: section % 2 ? "#FFF" : "#FFF",
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text style={{ color: "#007d87" }}>I am section {section}</Text>
              </View>
            );
          }}
        />
      </Container>
    );
  }
}

export default StickyLargeList;
