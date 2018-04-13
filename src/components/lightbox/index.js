import Constants from "../../global/constants";

const showWithOptions = (navigator, mainTitle, cont, opts) => {
  navigator.showLightBox({
    screen: Constants.Screens.LIGHTBOX.screen,
    passProps: {
      title: mainTitle,
      content: cont,
      options: opts,
      onClose: () => dismissLightBox(navigator),
    },
    style: {
      backgroundBlur: "dark",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      tapBackgroundToDismiss: true,
    },
  });
};

const dismissLightBox = navigator => {
  navigator.dismissLightBox();
};

export default { showWithOptions, dismissLightBox };
