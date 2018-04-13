// @flow
import * as React from "react";
import { observer, inject } from "mobx-react/native";

import Home from "../../screens/Home";
import menuItem from "./menuItems";

export interface Props {
  navigator: any;
  mainStore: any;
}
export interface State {}

@inject("mainStore")
@observer
export default class HomeContainer extends React.Component<Props, State> {
  componentDidMount() {
    this.props.mainStore.fetchItems(menuItem);
  }
  render() {
    const list = this.props.mainStore.items.toJS();
    return <Home navigator={this.props.navigator} list={list} />;
  }
}
