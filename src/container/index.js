import { Navigation, ScreenVisibilityListener } from "react-native-navigation";

import Constants from "../global/constants";

import wrapProvider from "../Provider";
import Drawer from "./Drawer";

import NotificationBox from "../components/Notification";
import LightBox from "../components/lightbox/LightBox";
import Modal from "../components/Modal";

import Dash from "./DashboardContainer"; //Dashboard
import Components from "./HomeContainer"; //Home Page
import ChatDummyLanding from "./ChatContainer"; //Chat Dummy Landing Page
import Chat from "./ChatContainer/OriginalContainer"; //Chat Dummy Landing Page
import Login from "./LoginContainer";

import InfinitePeopleList from "./InfiniteFlatlistContainer";
import StickyLargeList from "./StickyLargeListContainer";
import SwipeList from "./SwipeListContainer";
import AutoComplete from "./AutoCompleteContainer";
import FormUi from "./FormUiContainer";
import StickySectionList from "./ExpSticSecListContainer";
import AudioRecorder from "./AudioRecordContainer";
import IndicatedScrollView from "../container/IndicatedScrollContainer";
import CarouselDetails from "../container/CarouselDetailContainer";

import CollapsibleScrollView from "../components/AnimatedHeaderScrollView";
import CollapsibleFlatList from "../components/AnimatedHeaderFlatList";

/** Register All Containers/Screens to
 * React-Native-Navigation Library
 */
export function registerScreens(store, provider) {
  // console.log("STORES:" + JSON.stringify(store));
  Navigation.registerComponent(Constants.Screens.LOGIN.screen, () =>
    wrapProvider(Login, store, false),
  );

  Navigation.registerComponent(Constants.Screens.DRAWER.screen, () =>
    wrapProvider(Drawer, store, false),
  );
  //// POPUP/REUSABLE COMPONENTS ////
  Navigation.registerComponent(Constants.Screens.NOTIFICATION.screen, () =>
    wrapProvider(NotificationBox, store, false),
  );
  Navigation.registerComponent(Constants.Screens.LIGHTBOX.screen, () =>
    wrapProvider(LightBox, store, false),
  );
  Navigation.registerComponent(Constants.Screens.MODAL.screen, () =>
    wrapProvider(Modal, store, false),
  );

  Navigation.registerComponent(Constants.Screens.DASH.screen, () =>
    wrapProvider(Dash, store, true, true),
  );
  Navigation.registerComponent(Constants.Screens.COMPONENTS.screen, () =>
    wrapProvider(Components, store, false),
  );
  //Dummy Chat Landing Page
  Navigation.registerComponent(Constants.Screens.CHAT_DUMMY_LANDING.screen, () =>
    wrapProvider(ChatDummyLanding, store, false),
  );
  Navigation.registerComponent(Constants.Screens.CHAT.screen, () =>
    wrapProvider(Chat, store, false),
  );

  ////COMPONENT SCREENS////
  Navigation.registerComponent(Constants.Screens.PEOPLEFLATLIST.screen, () =>
    wrapProvider(InfinitePeopleList, store, false, true),
  );
  Navigation.registerComponent(Constants.Screens.STICKYLARGELIST.screen, () =>
    wrapProvider(StickyLargeList, store, false),
  );
  Navigation.registerComponent(Constants.Screens.SWIPELISTVIEW.screen, () =>
    wrapProvider(SwipeList, store, false, true),
  );
  Navigation.registerComponent(Constants.Screens.AUTOCOMPLETE.screen, () =>
    wrapProvider(AutoComplete, store, false),
  );
  Navigation.registerComponent(Constants.Screens.COLLAPSIBLEHEADERSCROLLVIEW.screen, () =>
    wrapProvider(CollapsibleScrollView, store, false),
  );
  Navigation.registerComponent(Constants.Screens.COLLAPSIBLEHEADERFLATLIST.screen, () =>
    wrapProvider(CollapsibleFlatList, store, false),
  );
  Navigation.registerComponent(Constants.Screens.EXPANDABLESTICKYSECTIONLIST.screen, () =>
    wrapProvider(StickySectionList, store, false),
  );
  Navigation.registerComponent(Constants.Screens.FORMUI.screen, () =>
    wrapProvider(FormUi, store, false),
  );
  Navigation.registerComponent(Constants.Screens.AUDIORECORDER.screen, () =>
    wrapProvider(AudioRecorder, store, false),
  );
  Navigation.registerComponent(Constants.Screens.INDICATEDSCROLLVIEW.screen, () =>
    wrapProvider(IndicatedScrollView, store, false),
  );
  Navigation.registerComponent(Constants.Screens.CAROUSELDETAILS.screen, () =>
    wrapProvider(CarouselDetails, store, false),
  );
}

export function registerScreenVisibilityListener() {
  new ScreenVisibilityListener({
    willAppear: ({ screen }) => console.log(`Displaying screen ${screen}`),
    didAppear: ({ screen, startTime, endTime, commandType }) =>
      console.log(
        "screenVisibility",
        `Screen ${screen} displayed in ${endTime - startTime} millis [${commandType}]`,
      ),
    willDisappear: ({ screen }) => console.log(`Screen will disappear ${screen}`),
    didDisappear: ({ screen }) => console.log(`Screen disappeared ${screen}`),
  }).register();
}
