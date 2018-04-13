// @flow
import Constants from "./global/constants";
import Stores from "./stores";
import MobXProvider from "./utils/MobxRnnProvider";
import { registerScreens, registerScreenVisibilityListener } from "./container/index";

const stores = Stores();

registerScreens(stores, MobXProvider);
registerScreenVisibilityListener();

Constants.Global.openLoginAsLaunch();
