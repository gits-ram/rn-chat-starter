import { Provider } from "mobx-react/native";
import React, { Component } from "react";
import { StyleProvider, ActionSheet } from "native-base";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { Root } from "native-base";
import getTheme from "../native-base-theme/components";
import variables from "../native-base-theme/variables/platform";

import NavButtons from "./global/NavButtons";
import NavBar from "./global/NavBar";

export default function wrapProvider(
  MyComponent,
  stores,
  attachNavButtons,
  attachActionSheet = false,
) {
  return class extends React.Component {
    constructor(props) {
      super(props);
      // NavigationActions.setNavigator(props.navigator);
    }

    static navigatorButtons = attachNavButtons === true ? NavButtons.WithSideMenu : null;
    static navigatorStyle = attachNavButtons === true ? NavBar.Default : null;

    render() {
      return (
        <StyleProvider style={getTheme(variables)}>
          <Provider {...stores}>
            <Root>
              {attachActionSheet ? (
                <ActionSheetProvider>
                  <MyComponent {...this.props} />
                </ActionSheetProvider>
              ) : (
                <MyComponent {...this.props} />
              )}
            </Root>
          </Provider>
        </StyleProvider>
      );
    }
  };
}
