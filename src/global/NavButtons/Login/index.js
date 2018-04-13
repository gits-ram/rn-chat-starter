// @flow

import Constants from "../../constants";
import Stores from "../../../stores";

const stores = Stores();

export default {
  leftButtons: stores.appStore.isAndroid
    ? [{ id: "cancel" }]
    : [
        {
          id: "cancel",
          title: "Cancel"
        }
      ]

  // rightButtons: [{
  //   id    : '...',
  //   title : '...',
  // }],
};
