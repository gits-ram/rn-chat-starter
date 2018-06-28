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
  let responseObject = [
    {
      type: "txt",
      text: "I am sorry.",
    },
    {
      type: "txt",
      text: "Try another command..",
    },
  ];
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
  } else if (params.action === "demo/pics" || params.text.toLowerCase() === "pics") {
    responseObject = [
      {
        type: "img",
        text: null,
        imageUrl: dummyImages[Math.floor(Math.random() * 7)],
      },
      {
        type: "img",
        text: null,
        imageUrl: dummyImages[Math.floor(Math.random() * 7)],
      },
    ];
  } else if (params.text.toLowerCase() === "pic") {
    responseObject = {
      type: "img",
      text: null,
      imageUrl: dummyImages[Math.floor(Math.random() * 7)],
    };
  } else if (params.action === "demo/sequ" || params.text.toLowerCase() === "fly") {
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
  } else if (params.action === "demo/opts" || params.text.toLowerCase() === "eat") {
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
  } else if (params.text.toLowerCase() === "opts") {
    responseObject = {
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
    };
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
  } else if (params.action === "demo/carousel" || params.text.toLowerCase() === "boeing") {
    responseObject = [
      {
        type: "txt",
        text: "Book Boeing flights from below",
      },
      {
        type: "carousel",
        slides: [
          {
            id: 0,
            title: "Boeing 737",
            subtitle: "First flight	 April 9, 1967",
            illustration: require("../../../assets/img/flight/Boe737.jpg"),
            options: [
              { id: 0, title: "Book Flight Seat", action: "flight/booking" },
              { id: 1, title: "Ship Cargo Via Carrier", action: "flight/cargobooking" },
            ],
          },
          {
            id: 1,
            title: "Boeing 747",
            subtitle: "First flight  February 9, 1969",
            illustration: require("../../../assets/img/flight/Boe747.jpg"),
            options: [
              { id: 0, title: "Book Flight", action: "flight/booking" },
              { id: 1, title: "Ship Cargo", action: "flight/cargobooking" },
            ],
          },
          {
            id: 2,
            title: "Boeing 757",
            subtitle: "First flight	 February 19, 1982",
            illustration: require("../../../assets/img/flight/Boe757.jpg"),
            options: [
              { id: 0, title: "Book Flight Seats", action: "flight/booking" },
              { id: 1, title: "Ship Cargo Via Carrier", action: "flight/cargobooking" },
            ],
          },
          {
            id: 3,
            title: "Boeing 767",
            subtitle: "First flight	 September 26, 1984",
            illustration: require("../../../assets/img/flight/Boe767.jpg"),
            options: [
              { id: 0, title: "Book Flight", action: "flight/booking" },
              { id: 1, title: "Ship Cargo", action: "flight/cargobooking" },
            ],
          },
          {
            id: 4,
            title: "Boeing 777",
            subtitle: "First flight	 June 12, 1994",
            illustration: require("../../../assets/img/flight/Boe777.jpg"),
            options: [
              { id: 0, title: "Book Seats", action: "flight/booking" },
              { id: 1, title: "Ship Cargo", action: "flight/cargobooking" },
            ],
          },
          {
            id: 5,
            title: "Boeing 787",
            subtitle: "First flight	 December 15, 2009",
            illustration: require("../../../assets/img/flight/Boe787.jpg"),
            options: [
              { id: 0, title: "Book Flight Seats", action: "flight/booking" },
              { id: 1, title: "Ship Cargo Via Carrier", action: "flight/cargobooking" },
            ],
          },
        ],
      },
    ];
  } else if (params.text.toLowerCase() === "carousel") {
    responseObject = {
      type: "carousel",
      slides: [
        {
          id: 0,
          title: "Boeing 737",
          subtitle: "First flight	 April 9, 1967",
          illustration: require("../../../assets/img/flight/Boe737.jpg"),
          options: [
            { id: 0, title: "Book Flight", action: "flight/booking" },
            { id: 1, title: "Ship Cargo", action: "flight/cargobooking" },
          ],
        },
        {
          id: 1,
          title: "Boeing 747",
          subtitle: "First flight  February 9, 1969",
          illustration: require("../../../assets/img/flight/Boe747.jpg"),
          options: [
            { id: 0, title: "Book Flight", action: "flight/booking" },
            { id: 1, title: "Ship Cargo", action: "flight/cargobooking" },
          ],
        },
        {
          id: 2,
          title: "Boeing 757",
          subtitle: "First flight	 February 19, 1982",
          illustration: require("../../../assets/img/flight/Boe757.jpg"),
          options: [
            { id: 0, title: "Book Flight", action: "flight/booking" },
            { id: 1, title: "Ship Cargo", action: "flight/cargobooking" },
          ],
        },
        {
          title: "Boeing 767",
          subtitle: "First flight	 September 26, 1984",
          illustration: require("../../../assets/img/flight/Boe767.jpg"),
          options: [
            { id: 0, title: "Book Flight", action: "flight/booking" },
            { id: 1, title: "Ship Cargo", action: "flight/cargobooking" },
          ],
        },
        {
          id: 3,
          title: "Boeing 777",
          subtitle: "First flight	 June 12, 1994",
          illustration: require("../../../assets/img/flight/Boe777.jpg"),
          options: [
            { id: 0, title: "Book Seats", action: "flight/booking" },
            { id: 1, title: "Ship Cargo", action: "flight/cargobooking" },
          ],
        },
        {
          id: 4,
          title: "Boeing 787",
          subtitle: "First flight	 December 15, 2009",
          illustration: require("../../../assets/img/flight/Boe787.jpg"),
          options: [
            { id: 0, title: "Book Seats", action: "flight/booking" },
            { id: 1, title: "Ship Cargo", action: "flight/cargobooking" },
          ],
        },
      ],
    };
  } else if (params.action === "flight/booking") {
    responseObject = [
      {
        type: "txt",
        text: "Choose a destination",
      },
      {
        type: "opts",
        text: "",
        options: [
          { id: 0, title: "Delhi", action: "flight/booking=City" },
          { id: 1, title: "Bombay", action: "flight/booking=City" },
          { id: 2, title: "Calcutta", action: "flight/booking=City" },
          { id: 3, title: "Madras", action: "flight/booking=City" },
          { id: 4, title: "Bangalore", action: "flight/booking=City" },
          { id: 5, title: "Cochin", action: "flight/booking=City" },
        ],
      },
    ];
  } else if (params.action === "flight/booking=City") {
    responseObject = [
      {
        type: "txt",
        text: "Choose a date",
        options: [{ id: 0, title: "Open Date Picker", action: "phone/datepicker" }],
      },
    ];
  } else if (params.action === "booking/flight=city?date") {
    responseObject = [
      {
        type: "txt",
        text: "Sorry! No flight seats available for the chosen date.",
      },
    ];
  } else if (params.action === "user/voice") {
    responseObject = [
      {
        type: "txt",
        text: "Couldn't process the voice input.",
      },
    ];
  } else if (params.text.toLowerCase() === "availability") {
    responseObject = {
      type: "template",
      slides: [
        {
          id: 0,
          templateType: "template-availability",
          headerTitle: "Flight Availability",
          headerValue: "Available",
          cargoDetails: [
            { param: "Max Dimensions", value: "300x400x100cm" },
            { param: "Max Weight", value: "1500Kgs" },
            { param: "Perishable allowed", value: "Yes" },
          ],
          cargoRoutes: [
            {
              flight: "KL0605",
              type: "Non-Stop",
              departure: "Amsterdam(AMS)",
              arrival: "SanFrancisco(SFO)",
              departs: "Wed, Mar 30 10:00PM",
              arrives: "Thu, Mar 31 8:00PM",
            },
          ],
          cargoPricing: { shipping: "$4000", tax: "$340", discount: "$100", total: "$4240" },
          illustration: require("../../../assets/img/flight/Boe737.jpg"),
          options: [
            { id: 0, title: "Book Flight", action: "flight/booking" },
            { id: 1, title: "Contact Carrier", action: "flight/contact" },
          ],
        },
      ],
    };
  } else if (params.action === "demo/avail" || params.text.toLowerCase() === "3xavailability") {
    responseObject = {
      type: "template",
      slides: [
        {
          id: 0,
          templateType: "template-availability",
          headerTitle: "Flight Availability",
          headerValue: "Available",
          cargoDetails: [
            { param: "Max Dimensions", value: "150x200x200cm" },
            { param: "Max Weight", value: "500Kgs" },
            { param: "Perishable allowed", value: "Yes" },
          ],
          cargoRoutes: [
            {
              flight: "LF3125",
              type: "",
              departure: "Amsterdam(AMS)",
              arrival: "SanFrancisco(SFO)",
              departs: "Wed, Mar 30 11:00PM",
              arrives: "Thu, Mar 31 9:00PM",
            },
          ],
          cargoPricing: { shipping: "$4300", tax: "$340", discount: "$100", total: "$4540" },
          illustration: require("../../../assets/img/flight/Boe737.jpg"),
          options: [
            { id: 0, title: "Book Flight", action: "flight/booking" },
            { id: 1, title: "Contact Carrier", action: "flight/contact" },
          ],
        },
        {
          id: 1,
          templateType: "template-availability",
          headerTitle: "Flight Availability",
          headerValue: "Available",
          cargoDetails: [
            { param: "Max Weight", value: "2500Kgs" },
            { param: "Perishable allowed", value: "No" },
          ],
          cargoRoutes: [
            {
              flight: "CA48371",
              type: "Non-Stop",
              departure: "Amsterdam(AMS)",
              arrival: "SanFrancisco(SFO)",
              departs: "Wed, Mar 30 7:00PM",
              arrives: "Thu, Mar 31 5:00PM",
            },
          ],
          cargoPricing: { shipping: "$4600", tax: "$380", discount: "$100", total: "$4880" },
          illustration: require("../../../assets/img/flight/Boe737.jpg"),
          options: [
            { id: 0, title: "Book Flight", action: "flight/booking" },
            { id: 1, title: "Contact Carrier", action: "flight/contact" },
          ],
        },
        {
          id: 2,
          templateType: "template-availability",
          headerTitle: "Flight Availability",
          headerValue: "Available",
          cargoDetails: [
            { param: "Space Available", value: "Yes" },
            { param: "Max Weight", value: "1500Kgs" },
            { param: "Perishable allowed", value: "Yes" },
          ],
          cargoRoutes: [
            {
              flight: "KL0605",
              type: "",
              departure: "Amsterdam(AMS)",
              arrival: "SanFrancisco(SFO)",
              departs: "Wed, Mar 30 10:00PM",
              arrives: "Thu, Mar 31 8:00PM",
            },
          ],
          cargoPricing: { shipping: "$4000", tax: "$340", discount: "$100", total: "$4240" },
          illustration: require("../../../assets/img/flight/Boe737.jpg"),
          options: [
            { id: 0, title: "Book Flight", action: "flight/booking" },
            { id: 1, title: "Contact Carrier", action: "flight/contact" },
          ],
        },
      ],
    };
  } else if (params.action === "demo/booking" || params.text.toLowerCase() === "booking") {
    responseObject = {
      type: "template",
      slides: [
        {
          id: 0,
          templateType: "template-booking",
          headerTitle: "Booking Number",
          headerValue: "A274872",
          cargoDetails: [
            { param: "Dairy products", value: "2000Kg" },
            { param: "Clothings", value: "500Kg" },
            { param: "Machinery", value: "1000Kg" },
          ],
          cargoRoutes: [
            {
              flight: "TL0641",
              type: "Non-Stop",
              departure: "Osaka(ITM)",
              arrival: "NewYork(JFK)",
              departs: "Wed, Mar 30 10:00PM",
              arrives: "Thu, Mar 31 8:00PM",
            },
          ],
          cargoPricing: { shipping: "$4000", tax: "$340", discount: "- $100", total: "$4240" },
          illustration: require("../../../assets/img/flight/Boe737.jpg"),
          options: [{ id: 0, title: "Show Full Receipt", action: "phone/bookingdetails" }],
        },
      ],
    };
  } else if (params.action === "demo/status" || params.text.toLowerCase() === "status") {
    responseObject = {
      type: "template",
      slides: [
        {
          id: 0,
          templateType: "template-status",
          headerTitle: "Flight Status",
          headerValue: "DELAYED",
          bookingNumber: "F2824793",
          cargoRoutes: [
            {
              flight: "TL0641",
              type: "Non-Stop",
              departure: "Osaka(ITM)",
              arrival: "NewYork(JFK)",
              departs: "10:00PM",
              arrives: "8:00PM",
            },
          ],
          illustration: require("../../../assets/img/flight/Boe737.jpg"),
          options: [{ id: 0, title: "Contact Carrier", action: "flight/contact" }],
        },
      ],
    };
  } else if (params.text.toLowerCase() === "demo" || params.action === "demo/functions") {
    responseObject = {
      type: "opts",
      text: "",
      options: [
        { id: 0, title: "Pics Sample", action: "demo/pics" },
        { id: 1, title: "Sequence Sample", action: "demo/sequ" },
        { id: 3, title: "Carousel Sample", action: "demo/carousel" },
        { id: 4, title: "Availability Sample", action: "demo/avail" },
        { id: 5, title: "Options Sample", action: "demo/opts" },
        { id: 6, title: "Booking Sample", action: "demo/booking" },
        { id: 7, title: "Status Sample", action: "demo/status" },
      ],
    };
  }
  let chatPromise = new Promise((resolve, reject) => {
    // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
    // In this example, we use setTimeout(...) to simulate async code.
    // In reality, we will probably be calling a RestApi using XHR/Axios etc.,
    setTimeout(function() {
      resolve(responseObject); // Yay! Everything went well!
    }, 2000);
  });

  return chatPromise;
}
