// @flow
import * as React from "react";
import { FlatList, View, Platform, UIManager, TextInput } from "react-native";
import { Container, Spinner } from "native-base";
import debounce from "lodash/debounce";
import styles from "./styles";
import ListRow from "../../components/ListRow";

export interface Props {
  navigator: any;
}

export interface State {
  refreshing: boolean;
  peopleList: Object[];
  renderedListData: Object[];
  searchText: string;
}

var debounceIp;

class InfiniteFlatList extends React.Component<Props, State> {
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
      renderedListData: [],
      searchText: "",
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showLoader != this.props.showLoader) {
      if (!nextProps.showLoader) {
        this.setState({ refreshing: false });
      }
    }
    if (nextProps.peopleList != this.props.peopleList) {
      this.setState({
        peopleList: nextProps.peopleList,
        renderedListData: nextProps.peopleList,
      });
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
          backgroundColor: "#CED0CE",
          marginLeft: "14%",
        }}
      />
    );
  };

  _onPressDelete = id => {
    this.props.deleteItem(id);
  };

  //Use Lodash Debounce to minimize reacting to type changes
  debounceIp = debounce(text => {
    this._handleSearchInput(text);
  }, 500);

  onTextInputChange = (value: string) => {
    this.setState({ searchText: value });
    this.debounceIp(value);
  };

  _renderHeader = () => {
    return (
      <TextInput
        style={styles.TextInputStyleClass}
        onChangeText={text => {
          this.onTextInputChange(text);
        }}
        value={null}
        underlineColorAndroid="transparent"
        placeholder="Search Here"
      />
      // <View
      //   style={{
      //     height: 20,
      //     width: "100%",
      //     backgroundColor: "#CED0CE",
      //   }}
      // />
    );
  };

  /* TODO: IMPORTANT
   * SEARCH BAR UI/FILTER LOGIC SHOULD IDEALLY BE MOVED TO THE CONTAINER (OR) BETTER THE MOBX STORE
   * AND PASS DOWN ONLY THE LIST[] TO BE RENDERED FOR THE FLATLIST HERE
   * */
  _handleSearchInput(e) {
    let text = e.toLowerCase();
    let fullList = this.state.peopleList;
    let filteredList = fullList.filter(item => {
      // search from a full list, and not from a previous search results list
      if (item.name.toLowerCase().match(text)) {
        return item;
      }
    });
    // if no match and text is empty
    if (!text || text === "") {
      this.setState({
        renderedListData: fullList,
        noData: false,
      });
    } else if (!filteredList.length) {
      // set no data flag to true so as to render flatlist conditionally
      this.setState({
        noData: true,
      });
    } else if (Array.isArray(filteredList)) {
      this.setState({
        noData: false,
        renderedListData: filteredList,
      });
    }
  }

  _renderFooter = () => {
    if (!this.props.showLoader || this.state.refreshing) {
      return null;
    }

    return (
      // <View
      //   style={{
      //     paddingVertical: 20,
      //     borderTopWidth: 1,
      //     borderColor: "#CED0CE",
      //   }}>
      <Spinner color="#356CB1" />
      // { </View> }
    );
  };

  _handleRefresh = () => {
    this.setState({ refreshing: true });
    this.props.handleRefresh();
  };

  _handleLoadMore = () => {
    // if (!this.onEndReachedCalledDuringMomentum) {
    if (this.state.searchText === "") {
      this.props.handleLoadMore();
    }
    //   this.onEndReachedCalledDuringMomentum = true;
    // }
  };

  render() {
    // const param = this.props.navigation.state.params;

    return (
      <Container style={styles.container}>
        {/* {this._renderNavBar(param)} */}

        {/* Has performance issues when number of items exceed over 60, needs further research/optimization */}
        <FlatList
          data={this.state.renderedListData}
          renderItem={({ item }) => (
            <ListRow
              id={item.key}
              name={item.name}
              picture={item.image}
              email={item.email}
              navigator={this.props.navigator}
              deleteItem={this._onPressDelete}
            />
          )}
          keyExtractor={item => item.key}
          shouldItemUpdate={(props, nextProps) => {
            //Performance Fixes
            return props.item !== nextProps.item;
          }}
          removeClippedSubviews={true} //Possible perfomance Fix
          ItemSeparatorComponent={this._renderSeparator}
          ListHeaderComponent={this._renderHeader}
          ListFooterComponent={this._renderFooter()}
          onRefresh={this._handleRefresh}
          refreshing={this.state.refreshing}
          onEndReached={debounce(
            () => {
              this._handleLoadMore();
            },
            1000,
            false,
          )}
          onEndReachedThreshold={0.01} //onMomentumScrollBegin={() => {this.onEndReachedCalledDuringMomentum = false;}}
        />
      </Container>
    );
  }
}

export default InfiniteFlatList;
