// @flow

import Constants from "../../constants";
import Stores from "../../../stores";

const stores = Stores();

export default {
  // leftButtons: stores.appStore.isAndroid
  //   ? [{ id: "sideMenu" }]
  //   : [
  //       {
  //         id: "menu",
  //         icon: require("../../../../assets/img/navicon_menu.png")
  //       }
  //     ]
  leftButtons: [
    {
      id: "menu",
      icon: require("../../../../assets/img/navicon_menu.png")
    }
  ]
};
