/* services/api/ChatApi.js
 *Declare all the REST API base calls here
 * Callbacks will be handled by the respective Store(mobX)
 *
 */

import config from "./config";
import Axios from "axios";
import * as DirectionsAPI from "../../components/maps/DirectionsAPI";
import * as StaticMaps from "../../components/maps/StaticMaps";

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
  let chatPromise = new Promise((resolve, reject) => {
    // We call resolve(...) when what we were doing asynchronously was successful, and reject(...) when it failed.
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
    } else if (params.action === "demo/flightplan" || params.text.toLowerCase() === "map") {
      DirectionsAPI.getMapDirections(
        {
          origin: "37.3458, -121.9091",
          destination: "37.6169, -122.3832",
          depTime: 1534232450000,
        },
        null,
        response => {
          let staticMap = StaticMaps.staticMapPolylineRoute(
            { lat: 37.3458, lon: -121.9091 },
            { lat: 37.6169, lon: -122.3832 },
            response.routes[0].overview_polyline.points,
            "900x550",
          );
          let dist = response.routes[0].legs[0].distance.text;
          let duration = response.routes[0].legs[0].duration.text;
          let traffic = response.routes[0].legs[0].duration_in_traffic.text;
          // console.log("SM:" + staticMap);
          responseObject = [
            {
              type: "txt",
              text: "Fetching route information and traffic prediction data..",
            },
            {
              type: "map",
              slides: {
                imageUrl: staticMap,
                summary: "Distance information to airport and traffic prediction data.",
                mapData: {
                  origin: "San Jose",
                  destination: "SFO Airport",
                  distance: dist,
                  duration: duration,
                  "duration in Traffic": traffic,
                },
                // options: [{ id: 0, title: "Open Full Map View", action: "phone/mapView" }],
              },
            },
          ];

          setTimeout(function() {
            resolve(responseObject); // Yay! Everything went well!
          }, 1000);
        },
        err => {
          console.log(err);
        },
      );
    } else if (params.action === "demo/pics" || params.text.toLowerCase() === "pics") {
      responseObject = [
        {
          type: "txt",
          text: "Posting some random pictures for demo purpose..",
        },
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
      responseObject = [
        {
          type: "txt",
          text: "A Random picture..",
        },
        {
          type: "img",
          text: null,
          imageUrl: dummyImages[Math.floor(Math.random() * 7)],
        },
      ];
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
    } else if (params.action === "demo/opts" || params.text.toLowerCase() === "options") {
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
    } else if (params.action === "demo/carousel" || params.text.toLowerCase() === "carousel") {
      responseObject = [
        {
          type: "txt",
          text: "Demo to showcase a carousel.",
        },
        {
          type: "txt",
          text: "Book a boeing flight from below..",
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
    } else if (params.action === "demo/avail" || params.text.toLowerCase() === "availability") {
      responseObject = [
        {
          type: "txt",
          text: "Demo to showcase availability template. ",
        },
        {
          type: "txt",
          text: "Choose your route plan for shipping cargo from below..",
        },
        {
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
                { id: 1, title: "Check Weather Conditions", action: "demo/weather" },
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
                { id: 1, title: "Check Weather Conditions", action: "demo/weather" },
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
                { id: 1, title: "Check Weather Conditions", action: "demo/weather" },
              ],
            },
          ],
        },
      ];
    } else if (params.action === "demo/booking" || params.text.toLowerCase() === "booking") {
      responseObject = [
        {
          type: "txt",
          text: "Demo to showcase flight booking template. ",
        },
        {
          type: "txt",
          text: "Your booking is finalized. Receipt is attached below..",
        },
        {
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
              options: [
                { id: 0, title: "Full Receipt", action: "phone/bookingdetails" },
                { id: 1, title: "Show Flight Plan", action: "demo/flightplan" },
              ],
            },
          ],
        },
      ];
    } else if (params.action === "demo/status" || params.text.toLowerCase() === "status") {
      responseObject = [
        {
          type: "txt",
          text: "Demo to showcase flight status template. ",
        },
        {
          type: "txt",
          text: "The current status of the flight is..",
        },
        {
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
              options: [{ id: 0, title: "Contact Carrier", action: "phone/contact" }],
            },
          ],
        },
      ];
    } else if (params.text.toLowerCase() === "weather") {
      responseObject = [
        {
          type: "txt",
          text: "Demo to showcase Weather template. ",
        },
        {
          type: "txt",
          text: "Please find below for the current weather conditions at SanFrancisco.",
        },
        {
          type: "weather",
          slides: [
            {
              id: 0,
              templateType: "current",
              headerTitle: "Current Conditions",
              headerValue: "12:00 PM",
              airportCode: "SFO",
              destination: "San Francisco",
              icon: "partly-cloudy-day",
              temperature: "29",
              summary: "Partly cloudy through the hour.",
              humidity: "0.58",
              dewPoint: "66.25",
              cloudCover: "0.54",
              pressure: "1018.65",
              windSpeed: "2.4",
              visibility: "9.5",
              description:
                "Area to add more description or add info on emergency weather alerts as described by the government for that area.",
            },
          ],
        },
      ];
    } else if (params.action === "demo/weather" || params.text.toLowerCase() === "weathers") {
      responseObject = [
        {
          type: "txt",
          text: "Demo to showcase Weather template. ",
        },
        {
          type: "txt",
          text: "Weather condition at arrival and destination locations on July 27, 2018.",
        },
        {
          type: "weather",
          slides: [
            {
              id: 0,
              templateType: "future",
              headerTitle: "Weather Prediction",
              headerValue: "July 27, 2018",
              airportCode: "SFO",
              destination: "San Francisco",
              icon: "rain",
              temperatureMin: "16",
              temperatureMax: "21",
              summary: "Consistent rain through the day.",
              humidity: "0.78",
              dewPoint: "73.25",
              cloudCover: "0.94",
              pressure: "1055.65",
              windSpeed: "24.4",
              visibility: "1.5",
            },
            {
              id: 1,
              templateType: "future",
              headerTitle: "Weather Prediction",
              headerValue: "July 27, 2018",
              airportCode: "JFK",
              destination: "New York",
              icon: "fog",
              temperatureMin: "9",
              temperatureMax: "17",
              summary: "Hazy day with poor visibility.",
              humidity: "0.84",
              dewPoint: "43.5",
              cloudCover: "0.64",
              pressure: "1055.65",
              windSpeed: "4.4",
              visibility: "0.5",
            },
          ],
        },
      ];
    } else if (params.text.toLowerCase() === "demo" || params.action === "demo/functions") {
      responseObject = [
        {
          type: "txt",
          text: "Great! Lets get you started..",
        },
        {
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
            { id: 8, title: "Weather Sample", action: "demo/weather" },
            { id: 9, title: "Maps Sample", action: "demo/flightplan" },
          ],
        },
      ];
    } else if (params.action === "demo/no") {
      responseObject = {
        type: "txt",
        text: "Alright then. If you like to talk to me, go ahead and press the mic button below.",
        action: "phone/blinkmic",
      };
    }

    // In this example, we use setTimeout(...) to simulate async code.
    // In reality, we will probably be calling a RestApi using XHR/Axios etc.,
    if (params.action !== "demo/flightplan" && params.text.toLowerCase() !== "map") {
      setTimeout(function() {
        resolve(responseObject); // Yay! Everything went well!
      }, 2000);
    }
  });

  return chatPromise;
}
