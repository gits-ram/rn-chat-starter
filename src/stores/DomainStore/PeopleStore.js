import { observable, action } from "mobx";
import * as Api from "../../services/api/Api";
import Axios from "axios";
import PeopleModel from "../models/People";

var CancelToken = null;
var source = null;

export default class PeopleStore {
  @observable hasErrored = false;
  @observable fetchingApi = false;
  @observable page = 1;
  @observable peopleList = [];

  @action
  setPage(pg) {
    this.page = pg;
  }

  @action
  fetchPeopleList() {
    //Observable tripped to true, to show loader
    this.fetchingApi = true;

    //Create a new Cancel Token and pass it to Axios request
    CancelToken = Axios.CancelToken;
    source = CancelToken.source();

    Api.getRandomPeople(
      {
        seed: 1,
        page: this.page,
        results: 15,
      },
      source,
    )
      .then(response => {
        this.fetchingApi = false;
        if (response) {
          // console.log("PeopleAPIResponse" + response);
          if (response.data && response.data.results.length > 0) {
            // Parse, Create People Objects and Populate PeopleList array
            this.parseIncomingData(response.data.results);
          } else {
            //No Data Found?
          }
        }
      })
      .catch(error => {
        this.fetchingApi = false;
        if (Axios.isCancel(error)) {
          console.log("People Request cancelled");
        } else {
          console.log("People Error " + error);
        }
      });
  }

  parseIncomingData(data) {
    let peopleArr = [];
    data.map((itm, i) => {
      let people = new PeopleModel(itm, this.page.toString() + i.toString());
      // this.pushToList(people);
      peopleArr.push(people);
      // console.log("PARSING..." + i);
    });
    // console.log("PARSED:" + peopleArr.length + " item(s)");
    this.setFullList(peopleArr);
  }

  @action
  setFullList(arr) {
    arr.map(itm => {
      this.peopleList.push(itm);
    });
  }

  @action
  pushToList(data) {
    this.peopleList.push(data);
    // console.log(data);
  }

  @action
  resetList() {
    this.setPage(1);
    this.peopleList = [];
  }

  @action
  removeItem(itemKey) {
    for (var i = this.peopleList.length - 1; i >= 0; i--) {
      if (this.peopleList[i].key === itemKey) {
        this.peopleList.splice(i, 1);
      }
    }
    // let tempArr = this.peopleList.filter(indx => {
    //   console.log("Indx:" + indx.key + "  ITMID:" + itemKey);
    //   return indx.key !== itemId;
    // });

    // this.peopleList = [];
    // this.setFullList(tempArr);
  }
}
