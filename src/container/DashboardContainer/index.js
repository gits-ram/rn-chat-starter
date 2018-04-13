// @flow
import * as React from "react";
import { observer, inject } from "mobx-react/native";
import Dashboard from "../../screens/Dashboard";
import { View, Text } from "react-native";
import { Container, Toast } from "native-base";

export interface Props {
  navigation: any;
}
export interface State {}

@inject("appStore", "peopleStore")
@observer
export default class DashboardContainer extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    const { appStore, navigator } = this.props;
    appStore.rootNavigator = navigator;

    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent.bind(this));
  }

  onNavigatorEvent = (event: {}) => {
    if (event.id === "menu") {
      this.props.navigator.toggleDrawer({
        side: "left",
        animated: true,
      });
    }
  };

  goBack() {
    this.props.navigator.pop();
  }

  componentDidMount() {
    // this.props.peopleStore.fetchPeopleList(1);
  }

  componentWillUnmount() {
    // Toast.toastInstance = null;
  }

  render() {
    return (
      <Dashboard
        goBack={() => this.goBack()}
        navigator={this.props.navigator}
        appStore={this.props.appStore}
      />
    );
  }
}
