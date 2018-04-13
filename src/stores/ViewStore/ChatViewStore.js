//@flow
import { observable, action } from "mobx";

export default class ChatViewStore {
  @observable inputString = "";
  @observable imageToPreview = "";
}
