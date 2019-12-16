const BenzAMRRecorder = require("benz-amr-recorder");
import { imgurl } from "../../../../../utils/Basicmethod.js";

// 用来保存 历史 音频的实例
const audioInstanceList = [];

class PlayAudio {
  constructor() {
    this.audioInstance = null;
  }
  init(url) {
    if (audioInstanceList.length) {
      audioInstanceList.forEach((v, i) => {
        v.stop();
        audioInstanceList.splice(i, 1);
      });
    }
    const amr = new BenzAMRRecorder();
    amr.initWithUrl(`${imgurl}/${url}`).then(() => {
      amr.play();
    });
    audioInstanceList.push(amr);
    this.audioInstance = amr;
    return amr;
  }

  stop() {
    // 停止 音频   会触发 onEnded
    this.audioInstance.stop();
  }

  remove() {}

  static removeAll() {}
}

// new PlayAudio();

export default PlayAudio;
