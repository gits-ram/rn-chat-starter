// @flow
import * as React from "react";
import { observer, inject } from "mobx-react/native";
import PeopleList from "../../screens/InfiniteFlatList";

export interface Props {
  navigator: any;
}
export interface State {}

let peopleStore: object;

@inject("peopleStore")
@observer
export default class InfiniteFlatListContainer extends React.Component<Props, State> {
  componentDidMount() {
    peopleStore = this.props.peopleStore;

    peopleStore.resetList();
    peopleStore.fetchPeopleList(1);
  }

  _handleRefresh = () => {
    peopleStore.resetList();
    peopleStore.fetchPeopleList();
  };

  _handleLoadMore = () => {
    console.log("LOADING MORE>>>>");
    peopleStore.setPage(peopleStore.page + 1);
    peopleStore.fetchPeopleList();
  };

  _deleteItem(id) {
    peopleStore.removeItem(id);
  }

  render() {
    const { peopleStore } = this.props;
    const list = peopleStore.peopleList.toJS();
    return (
      <PeopleList
        navigator={this.props.navigator}
        peopleList={list}
        showLoader={peopleStore.fetchingApi}
        handleRefresh={() => this._handleRefresh()}
        handleLoadMore={() => this._handleLoadMore()}
        deleteItem={this._deleteItem}
      />
    );
  }
}
