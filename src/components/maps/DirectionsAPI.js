import Axios from "axios";
import Google_Api_Key from "../../../API_KEYS";

const Sample_Future_Traffic_Directions_Url =
  "https://maps.googleapis.com/maps/api/directions/json?origin=37.3332,-122.4194&destination=37.6213,-121.8915&departure_time=1534232450000&mode=driving&key=AIzaSyD3sTp3Xl_BJwQEfIaAmhecKVOLAnR099Y";
const BASE_URL = "https://maps.googleapis.com/maps/api/directions/json?";
const API_KEY = Google_Api_Key;

function formUrl() {
  let URL = BASE_URL;
  return URL;
}

export function getMapDirections(params: any, source: any, success, failure) {
  var instance = Axios.create();
  instance.interceptors.request.use(request => {
    // console.log("Directions Request", JSON.stringify(request));
    return request;
  });

  instance
    .get(
      formUrl(),
      {
        params: {
          origin: params.origin,
          destination: params.destination,
          departure_time: params.depTime,
          mode: "driving",
          key: API_KEY,
        },
      },
      {
        cancelToken: source !== null ? source.token : undefined,
      },
    )
    .then(response => {
      if (response) {
        // console.log("DirectionsResponse" + response);
        if (response.data) {
          success(response.data);
          // this.parseIncomingData(response.data.results);
        } else {
          //No Data Found?
          failure("No Data From API");
        }
      }
    })
    .catch(error => {
      this.fetchingApi = false;
      if (Axios.isCancel(error)) {
        console.log("Directions Request cancelled");
      } else {
        console.log("Directions Error " + error);
        failure(error);
      }
    });
}
