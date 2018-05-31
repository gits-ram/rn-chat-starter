// @flow

// import { create } from "mobx-persist";
// import { AsyncStorage } from "react-native";

import AppStore from "./DomainStore/AppStore";
import MainStore from "./DomainStore/HomeStore";
import PeopleStore from "./DomainStore/PeopleStore";
import ChatStore from "./DomainStore/ChatStore";

import LoginViewStore from "./ViewStore/LoginViewStore";
import RegisterViewStore from "./ViewStore/RegisterViewStore";
import ChatViewStore from "./ViewStore/ChatViewStore";

// const hydrate = create({ storage: AsyncStorage });

export default function() {
  const appStore = new AppStore();
  const mainStore = new MainStore();
  const loginViewStore = new LoginViewStore();
  const registerViewStore = new RegisterViewStore();
  const peopleStore = new PeopleStore();
  const chatStore = new ChatStore();
  const chatViewStore = new ChatViewStore();

  return {
    appStore,
    loginViewStore,
    registerViewStore,
    mainStore,
    peopleStore,
    chatStore,
    chatViewStore,
  };
}

// const stores = {
//   AppStore,
//   MainStore,
//   PeopleStore,
//   ChatStore,
//   LoginStore,
//   ChatViewStore
// };

// you can hydrate stores here with mobx-persist
// hydrate("LoginStore", stores.loginStore);

// export default {
//   ...stores
// };
