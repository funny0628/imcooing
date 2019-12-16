import React, { Component } from "react";
import styles from "./index.less";

import {
  imgurl,
  formatDuring,
  getIndex,
  handleRemarkNickName
} from "../../../../utils/Basicmethod.js";
import { connect, connectAdvanced } from "dva";
import { session, imgPre } from "../../../../utils/lib";
import emoji from "./emoji";
const loadingImg = require("../../../../assets/image/loading.png");
const errorImg = require("../../../../assets/image/error.png");
import { Modal, message } from "antd";
import { urlReg, faceReg } from "../../../../utils/reg";

import Audio from "./_child/audio";
@connect(
  ({ Todos, GetLargeGroupDetail, QueryFriendRelationByUin }) => ({
    touchItem: Todos.touchItem,
    GROUPDETAIL: GetLargeGroupDetail.GROUPDETAIL,
    GroupErrorDetail: GetLargeGroupDetail.GroupErrorDetail
  }),
  dispatch => ({
    //查询群好友是否被禁言
    GetFriendRelation: id =>
      dispatch({
        type: "QueryFriendRelationByUin/GetFriendRelation",
        uin: id
      }),
    getSaveClickUin: id =>
      dispatch({
        type: "QueryFriendRelationByUin/getSaveClickUin",
        uin: id
      })
  })
)
class Dialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 是否在播放语音  仅限 msgType === 'voice' 时 使用
      isPlay: false,
      audioInstance: null,
      showImg: false,
      imgSrc: ""
    };
  }

  //点击消息里面的图片
  clickImg = e => {
    const src = e.target.src;
    if (!src) return;
    this.props.showMaxImgFn(src);
  };
  reSend(item) {
    Modal.confirm({
      cancelText: "取消",
      okText: "确认",
      title: "温馨提示",
      content: `是否要重新发送该条消息`,
      onOk: () => {
        this.props.reSendMsg(item);
      }
    });
  }

  FilterEmoji(str = "", content) {
    if (str === "") return "";
    const uuid = require("uuid");
    const flag = uuid();
    const flag2 = uuid();

    // 匹配空格符号
    let re = str.replace(/ /g, val => {
      return ` ${flag} ${flag2}&nbsp;${flag} `;
    });

    // 匹配标签链接
    re = re.replace(urlReg, val => {
      urlReg.lastIndex = 0;
      let newVal = val.substr(0, 4) === "http" ? val : `//${val}`;
      return ` ${flag} ${flag2}<a href='${newVal}' target="_blank">${val}</a>${flag} `;
    });
    // 匹配表情
    re = re.replace(faceReg, val => {
      if (emoji.hasOwnProperty(val)) {
        const src = `/emjoy/${emoji[val]}@2x.png`;
        return ` ${flag} ${flag2}<img class='${styles.emjoy}' src='${src}' alt='${val}' width='50%' />${flag} `;
      }
      return val;
    });
    // 匹配换行符号
    re = re.replace(/\n/g, val => {
      return `${flag} ${flag2}<br/>${flag} `;
    });

    // 这里增加一个空格标示 仅仅是为了更加严谨
    const result = re.split(`${flag} `).map((x, i) => {
      const ar = x.split(`${flag2}`);
      if (ar.length > 1) {
        return (
          <span
            key={i}
            dangerouslySetInnerHTML={{
              __html: ar[1]
            }}
          ></span>
        );
      } else {
        return <React.Fragment key={i}>{x}</React.Fragment>;
      }
    });

    return result;
  }

  //点击对方的头像进入私聊
  toPrivateChat(e, id) {
    e.stopPropagation();

    const { isPrivateChat, bannedText } = this.props;
    console.log(isPrivateChat, bannedText, id);

    this.props.showInfo(id);
    // if(isPrivateChat){
    // }else{
    //   bannedText&&message.warning(bannedText)
    // }
  }
  shouldComponentUpdate(nextProps, nextState) {
    // 暂时截流写法，不更新代码
    return (
      this.props.data !== nextProps.data ||
      this.props.touchItem !== nextProps.touchItem
      // || this.state.isPlay != nextState
    );
  }

  render() {
    const {
      data: {
        Content,
        nickName,
        remark,
        smallAvatarUrl,
        srcUin,
        successStatus
      },
      index,
      timeArr,
      showTimeIndex,
      touchItem
    } = this.props;

    const userIcon = this.props.data.smallAvatarUrl;
    const type = touchItem.ChatType;

    // 是否本人
    const isSelf = srcUin === +session("uin");
    // 对话是否为系统信息
    const isSystem = Content.msgType === "system";
    // 有些消息类型不需要展示 发信人
    const hideAvater = isSystem && getHideAvater(Content.data.pushType);

    // 如果是个人聊天，并且是不是isSelf 那么选用对方头像是touchitem.smallAvatarUrl
    let otherAvatar =
      !isSelf && type === 1 ? touchItem.smallAvatarUrl : smallAvatarUrl;

    return (
      <li key={index} className={isSelf ? styles.right : styles.left}>
        {/* 退出大群通知 */}
        <div className={styles.showTime}>
          {index === showTimeIndex
            ? formatDuring(timeArr[index] * 1000, "chatPage")
            : ""}
        </div>
        {hideAvater ? (
          ""
        ) : isSelf ? (
          <img className={styles.avater} src={imgurl + userIcon} />
        ) : (
          <img
            onClick={e => {
              this.toPrivateChat(e, srcUin);
              // this.props.checkFriendInfo(srcUin);
            }}
            className={styles.avater}
            src={imgurl + otherAvatar}
          />
        )}
        {type === 1 || isSelf ? (
          ""
        ) : (
          <p className={styles.name}>
            {handleRemarkNickName(remark, nickName)}
          </p>
        )}
        <div className={styles.information}>
          {Content.msgType === "text" && (
            <div className={styles.msg}>
              {this.FilterEmoji(Content.data.content, Content)}
            </div>
          )}
          {Content.msgType === "picture" && (
            <div className={styles.pic}>
              <img
                className={styles.picture}
                onClick={e => this.clickImg(e)}
                src={
                  imgPre +
                  (Content.data &&
                    Content.data.attribute &&
                    (Content.data.attribute.thumbnailObjectKey || ""))
                }
              />
            </div>
          )}
          {Content.msgType === "voice" && (
            <Audio isSelf={isSelf} Content={Content}></Audio>
          )}
          {Content.msgType === "vedio" && (
            <div className={styles.msg}>不支持的消息类型，可在手机上查看</div>
          )}
          {Content.msgType === "location" && (
            <div className={styles.msg}>不支持的消息类型，可在手机上查看</div>
          )}
          {/* 系统推送的消息 */}
          {hideAvater && (
            <div className={styles.system}>
              <div className={styles.systemText}>
                {Content.data.content.prompt}
              </div>
            </div>
          )}
          {isSelf &&
            ((successStatus === "error" && (
              <img
                src={errorImg}
                onClick={() => {
                  this.reSend(this.props.data);
                }}
                className={styles.prevImg}
                alt=""
              />
            )) ||
              (successStatus === "loading" && (
                <img src={loadingImg} className={styles.prevImg} alt="" />
              )))}
        </div>
      </li>
    );
  }
}
export default Dialog;

function getHideAvater(type) {
  return [
    "has_new_greet",
    "add_friend",
    "cancel_single_msg",
    "start_audio_call",
    "accept_audio_call",
    "reject_audio_call",
    "cancel_audio_call",
    "end_audio_call",
    "timeout_audio_call",
    "add_large_group_mem",
    "remove_large_group_mem",
    "add_large_group_admin",
    "remove_large_group_admin",
    "update_large_group_title_or_icon",
    "update_large_group_view_profile_chat_set",
    "update_large_group_member_say",
    "banned_large_group_mem",
    "quit_large_group"
  ].includes(type);
}
