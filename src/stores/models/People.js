import { observable } from "mobx";

export default class PeopleModel {
  @observable id;
  @observable gender;
  @observable name;
  @observable email;
  @observable image;

  constructor(obj, i) {
    this.key = i;
    this.gender = obj.gender;
    this.name = obj.name.first + " " + obj.name.last;
    this.email = obj.email;
    this.image = obj.picture.large;
  }

  //Sample JSON ITEM
  //   {"gender":"male","name":{"title":"mr","first":"janique","last":"costa"},"location":{"street":"5236 rua tiradentes
  //   ","city":"bragança","state":"alagoas","postcode":81417},"email":"janique.costa@example.com","login":
  //   {"username":"bluerabbit924","password":"thrasher","salt":"c7QvzaON","md5":"b37c938f78f4789510051ce9068f617c",
  //   "sha1":"67e4995483263d9e9c7b521b80343479cdde43a8","sha256":"106255c234f8633d3f39f5f172147e238d5a5525713308fa0bda0960
  //   6dda74b9"},"dob":"1969-10-22 10:35:24","registered":"2014-09-22 22:38:28","phone":"(48) 4518-1459","cell":"(22)
  //   3632-3660","id":{"name":"","value":null},"picture":{"large":"https://randomuser.me/api/portraits/men/97.jpg","me
  //   dium":"https://randomuser.me/api/portraits/med/men/97.jpg","thumbnail":"https://randomuser.me/api/portraits/thum
  //   b/men/97.jpg"},"nat":"BR"}
}
