/* services/api/ChatApi.js
 *Declare all the REST API base calls here
 * Callbacks will be handled by the respective Store(mobX)
 *
 */

import config from "./config";
import Axios from "axios";

const dummyImages = [
  "https://cnet1.cbsistatic.com/img/_QgPMW663-rUhx1Y3EWZ6n0RPG4=/936x527/2015/05/12/0bd24541-9769-4e4d-bf56-a5c4e60ad8bb/panasonic-fz1000-sample-photo-10.jpg",
  "https://www.slrlounge.com/wp-content/uploads/2013/11/Nikon-D5300-Sample-Image-Night.jpg",
  "https://www.gettyimages.co.nz/gi-resources/images/Embed/new/embed2.jpg",
  "https://www.w3schools.com/w3images/lights.jpg",
  "http://spayce.me/wp-content/uploads/2018/02/hawaii-wallpaper-hd-1920x1080-nature-landscape-tropical-island-beach-palm-trees-white-sand-sea-summer-clouds.jpg",
  "https://static.motor.es/fotos-noticias/2017/09/min652x435/suzuki-swift-sport-2018-201739407_1.jpg",
  "http://fujifilm.com.ph/Products/digital_cameras/x/fujifilm_x20/sample_images/img/index/ff_x20_008.JPG",
];

export function postUserAction(params: any, source: any) {
  //   var instance = Axios.create();
  //   instance.interceptors.request.use(request => {
  //     console.log("Starting Request", request);
  //     return request;
  //   });
  //   return instance.get(
  //     config.chatApiUrl,
  //     {
  //       params: {
  //         text: params.text,
  //       },
  //     },
  //     {
  //       cancelToken: source.token,
  //     },
  //   );

  //CREATING DELAYED PROMISES FOR SIMULATION AND STUBBED RESPONSES
  let responseObject = "";
  if (params.text.toLowerCase() === "hello") {
    responseObject = [
      {
        type: "txt",
        text: "Hello User..",
      },
      {
        type: "txt",
        text: "How can I help you ?",
      },
    ];
  } else if (params.text.toLowerCase() === "image") {
    responseObject = [
      {
        type: "txt",
        text: "A random image..",
      },
      {
        type: "img",
        text: null,
        imageUrl: dummyImages[Math.floor(Math.random() * 7)],
      },
    ];
  } else if (params.text.toLowerCase() === "fly") {
    responseObject = {
      type: "txt",
      text: "Where would you like to go?",
      options: [
        { id: 0, title: "NewYork, USA", action: "details/city=Newyork" },
        { id: 1, title: "Cairo, Egypt", action: "" },
        { id: 2, title: "Paris, France", action: "" },
      ],
    };
  } else if (params.action === "details/city=Newyork") {
    responseObject = [
      {
        type: "img",
        imageUrl:
          "https://vignette.wikia.nocookie.net/cnc/images/4/47/New_york.jpg/revision/latest?cb=20160331233915",
        text: "NewYork, United States of America. This line is long which needs to be wrapped.",
      },
      {
        type: "txt",
        text: "New York City or simply New York, is the most populous city in the United States.",
      },
      {
        type: "txt",
        text: "New York City is the cultural, financial, and media capital of the world.",
      },
      {
        type: "txt",
        text: "Would you like to book for a vacay?",
        options: [{ title: "Yes", action: "booking/city=NewYork" }, { title: "No", action: "" }],
      },
    ];
  } else if (params.text.toLowerCase() === "eat") {
    responseObject = [
      {
        type: "txt",
        text: "Would you like to have a fruit ?",
      },
      {
        type: "opts",
        text: "",
        options: [
          { id: 0, title: "Apple", action: "" },
          { id: 1, title: "Banana", action: "" },
          { id: 2, title: "Orange", action: "details/fruit=Orange" },
          { id: 3, title: "Grapes", action: "" },
          { id: 4, title: "Mango", action: "" },
          { id: 5, title: "Pineapple", action: "" },
        ],
      },
    ];
  } else if (params.action === "details/fruit=Orange") {
    responseObject = [
      {
        type: "txt",
        text: "Good choice..",
      },
      {
        type: "img",
        imageUrl: "http://files.uk2sitebuilder.com/uk2group263018/image/orange.jpg",
        text: "Orange",
      },
    ];
  }
  let chatPromise = new Promise((resolve, reject) => {
    // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
    // In this example, we use setTimeout(...) to simulate async code.
    // In reality, you will probably be using something like XHR or an HTML5 API.
    setTimeout(function() {
      resolve(responseObject); // Yay! Everything went well!
    }, 2200);
  });

  return chatPromise;
}
