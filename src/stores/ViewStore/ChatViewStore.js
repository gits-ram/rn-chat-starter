//@flow
import { observable, action } from "mobx";

export default class ChatViewStore {
  @observable inputString = "";
  @observable imageToPreview = "";
  @observable voiceRecording = false;
  @observable recordingTime = 0.0;
  @observable hasMicPermission = false;
  @observable micTouchX = 0;
  @observable micTouchY = 0;
  @observable lastChatRecName = "1";

  @action
  setVoiceRecording(state) {
    this.voiceRecording = state;
  }

  @action
  updateRecordingTime(time) {
    this.recordingTime = time;
  }
}
