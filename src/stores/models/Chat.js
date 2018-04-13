import { observable } from "mobx";

export default class ChatModel {
  @observable id;
  @observable isUser;
  @observable type;
  @observable position; //User-Right //Response-Left
  @observable title;
  @observable text;
  @observable imgUrl;
  @observable url;
  @observable subText;
  @observable options;
  @observable showIcon;

  constructor(obj, i) {
    this.id = i;
    this.isUser = obj.isUser;
    this.type = obj.type;
    this.position = obj.position;
    this.title = obj.title;
    this.text = obj.text;
    this.imgUrl = obj.imgUrl;
    this.url = obj.url;
    this.subText = obj.subText;
    this.options = obj.options;
    this.showIcon = obj.showIcon;
  }
}
