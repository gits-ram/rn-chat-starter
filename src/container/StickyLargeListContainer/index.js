// @flow
import * as React from "react";
import { observer, inject } from "mobx-react/native";
import StickyLargeList from "../../screens/StickyLargeList";

export interface Props {
  navigator: any;
}
export interface State {}

let peopleStore: object;

@inject("peopleStore")
@observer
export default class StickyLargeListContainer extends React.Component<Props, State> {
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
    peopleStore.setPage(peopleStore.page + 1);
    peopleStore.fetchPeopleList();
  };

  render() {
    const { peopleStore } = this.props;
    const list = peopleStore.peopleList.toJS();

    return (
      <StickyLargeList
        navigator={this.props.navigator}
        peopleList={list}
        showLoader={peopleStore.fetchingApi}
        handleRefresh={() => this._handleRefresh()}
        handleLoadMore={() => this._handleLoadMore()}
      />
    );
  }
}
