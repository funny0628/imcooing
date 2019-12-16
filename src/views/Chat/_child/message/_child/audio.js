import * as React from "react";

import styles from "../index.less";
import ohterPlay from "../../../../../assets/image/audio/other-play.png";
import ohterPlaying from "../../../../../assets/image/audio/other-playing.gif";
import ohterPause from "../../../../../assets/image/audio/other-pause.png";
import ohterAudio from "../../../../../assets/image/audio/other-audio.png";

import myPlay from "../../../../../assets/image/audio/my-play.png";
import myPlaying from "../../../../../assets/image/audio/my-playing.gif";
import myPause from "../../../../../assets/image/audio/my-pause.png";
import myAudio from "../../../../../assets/image/audio/my-audio.png";

import PlayAudio from "./playAudio";

export default class Audio extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isPlay: false,
      audioInstance: null
    };
  }
  // 播放 语音
  playAudio(url) {
    // url = `${imgurl}/${url}`;
    const playAudioInstance = new PlayAudio();

    const audio = playAudioInstance.init(url);

    audio.onEnded(() => {
      this.stopAudio();
    });

    this.setState({
      audioInstance: playAudioInstance
    });
  }

  stopAudio() {
    this.setState({
      isPlay: false
    });
    this.state.audioInstance && this.state.audioInstance.stop();
    this.state.audioInstance = null;
  }

  handlPlay = (res, url) => {
    if (res) {
      this.playAudio(url);
    } else {
      this.stopAudio();
    }
    this.setState({
      isPlay: res
    });
  };

  componentWillUnmount() {
    //
    this.stopAudio();
    // 在这个钩子不能使用异步的方法 以下代码为： 为了 防止 内存泄漏
    this.setState = (state, callback) => {
      return;
    };
    // this.state.audioInstance = null;
  }

  render() {
    const { isSelf, Content } = this.props;
    return (
      <div
        className={styles.voice}
        onClick={() => {
          this.handlPlay(
            !this.state.isPlay,
            Content.data.attribute.audioObjectKey
          );
        }}
      >
        {/* {Content.data.attribute.audioObjectKey} */}
        {isSelf ? (
          <div className={styles.voiceIcon}>
            {/* {Math.floor(Content.data.attribute.length || 0)}s */}
            <img
              src={this.state.isPlay ? myPlaying : myAudio}
              className={styles.playProgress}
            />
            <img
              src={this.state.isPlay ? myPause : myPlay}
              className={styles.play}
              alt="播放"
            />
          </div>
        ) : (
          <div className={styles.voiceIcon}>
            <img
              src={this.state.isPlay ? ohterPause : ohterPlay}
              className={styles.play}
              alt="播放"
            />
            <img
              src={this.state.isPlay ? ohterPlaying : ohterAudio}
              className={styles.playProgress}
            />
            {/* {Math.floor(Content.data.attribute.length || 0)}s */}
          </div>
        )}
        {Math.floor(Content.data.attribute.length || 0)}s{/* 暂时不要小红点 */}
        {/* <i className={styles.unread}></i> */}
      </div>
    );
  }
}
