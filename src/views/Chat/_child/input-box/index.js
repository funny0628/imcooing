import React, { Component } from "react";
import styles from "./index.less";
import { connect } from "dva";
import OSS from "../../../../services/Oss.service";
import { deepCopy, session } from "../../../../utils/lib";
import { Modal, message } from "antd";

// 默认发送失败的时间 10s
const normalError = 10000;


@connect(
  ({
    SendMsg,
    Todos,
    LOCALMESSAGE,
    SendLargeGroupMsg,
    Oss
  }) => ({
    sendMsgs: SendMsg.sendMsgs,
    touchItem: Todos.touchItem,
    ossInfo: Oss.ossInfo,
    sendGroupmsg: SendLargeGroupMsg.sendGroupmsg,
    friendid: Todos.friendid,
    LOCALMESSAGES: LOCALMESSAGE.LOCALMESSAGES,
    unSendMsgObj: Todos.unSendMsgObj,
  }),
  dispatch => ({
    addUnReadMsg: messageInfo =>
      dispatch({
        type: "Todos/addUnReadMsg",
        messageInfo
      }),
    //发送消息
    sendMsg: sendCurrentMsg =>
      dispatch({
        type: "SendMsg/sendMsg",
        sendCurrentMsg
      }),
    clearSendMsgs: send =>
      dispatch({
        type: "SendMsg/clearSendMsgs"
      }),
    clearSendGroupMsg: () =>
      dispatch({
        type: "SendLargeGroupMsg/clearSendGroupMsg"
      }),

    SETLOCALMESSAGES: payload =>
      dispatch({
        type: "LOCALMESSAGE/SETLOCALMESSAGES",
        payload
      }),
    // 添加newMsglist项目
    addNewMsgList: item =>
      dispatch({
        type: "GetNewMsgList/addNewMsgList",
        item
      }),
    //发送大群消息
    SendLargeGroup: sendCurrentMsg =>
      dispatch({
        type: "SendLargeGroupMsg/SendLargeGroup",
        sendCurrentMsg
      }),
  })
)
class InputBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      placeholder: "请输入内容...",
      inputUinqueId:-1,
      arriveFn: this.arriveFn.bind(this),
    };
    this.textarea = React.createRef();
    this.sendMsgIcon = React.createRef();
  }

  msginput = e => {
    this.setState({
      value: e.target.value.replace(/^\s*/, "")
    });
  };

  //判断是否有聊天草稿，
  static getDerivedStateFromProps(props,state) {
    const {
      sendMsgs,
      sendGroupmsg,
      LOCALMESSAGES,
      touchItem,
      addUnReadMsg,
      unSendMsgObj
    } = props;
    // 新消息已达做的操作
    if (Object.keys(sendMsgs).length) {
      // 单聊成功  这个_arriveId 是用来记录id的
      state.arriveFn(sendMsgs, LOCALMESSAGES, sendMsgs.errorCode);
      props.clearSendMsgs();
    }
    if (Object.keys(sendGroupmsg).length) {
      // 群聊成功
      state.arriveFn(sendGroupmsg, LOCALMESSAGES, sendGroupmsg.errorCode);
      props.clearSendGroupMsg();
    }
    // 这里只做保存草稿的逻辑
    const { uniqueId } = touchItem||{};
    if (state.inputUinqueId !== uniqueId) {
      addUnReadMsg({[state.inputUinqueId]:state.value});
      const newValue = unSendMsgObj[uniqueId] || '';
      return {
          ...state,
          value: newValue,
          inputUinqueId: uniqueId,
        }
      }
    return null;
  }

  componentDidMount() {
    // 调用父组件方法把当前实例传给父组件
    this.props.onRef("InputBox", this);
  }

  arriveFn = (arriveObj, LOCALMESSAGES, errorCode) => {
    const _arriveId = `${arriveObj.localId}`.substr(4);
    const _localId = arriveObj.localId;

    const _nowItem = LOCALMESSAGES[_arriveId] || [];
    const successStatus = errorCode === 0 ? "success" : "error";

    _nowItem.forEach(x => {
      if (x.localId === _localId) {
        x.successStatus = successStatus;
        x.msgId = arriveObj.msgId;
        delete x.localId;
      }
    });
    this.props.SETLOCALMESSAGES({ id: _arriveId, list: _nowItem });
  };



  //点击enter 或者是发送的图片按钮
  sendEnter = (e, num) => {
  
    if(this.props.isBanned)return;
    //当前得到id
    const { touchItem, memberType } = this.props;
    let keyCode = e.keyCode || e.which || e.charCode;
    let ctrlKey = e.ctrlKey || e.metaKey;
    if (this.state.value === "") return;
    //如果输入的Ctrl和Enter--换行
    if (ctrlKey && keyCode === 13) {
      let str = this.textarea.current.value;
      str = str + "\n";

      this.setState({
        value: str
      });

      //如果输入的是enter或者是点击了发送信息的图片
    } else if (keyCode === 13 || num === 13) {
      const sendCurrentMsg = {
        dstUin: touchItem.uniqueId,
        srcUin: +session('uin'),
        localId: +(`${new Date().getTime()}`.substr(10).padStart(4, 1) + touchItem.uniqueId),
        Content: {
          data: {
            content: this.state.value
          },
          msgType: 'text'
        }
      };

      //发送群聊
      touchItem.ChatType === 2 && this.props.SendLargeGroup(sendCurrentMsg);
      //发送单聊
      touchItem.ChatType === 1 && this.props.sendMsg(sendCurrentMsg);
      // 如果没有的话进加入到当前消息列表
      this.pushNewMsgList();
      // 将消息滚动到最底下
      this.props.messageScrollBottom();
      // 将发送的消息塞进 local消息列表,添加定时器，8秒之后消息发送不成功，显示error
      this.addLOCALMESSAGE(sendCurrentMsg, touchItem);

      //清空文本
      this.setState({
        value: ""
      });
      //因为点击发送的图片已经失去焦点这时草稿也保存起来了 ,所以发送完再次切换到当前项的时候 , 还是有草稿在
      //保存未发送的信息
    }
  };

  addLOCALMESSAGE(sendCurrentMsg, touchItem) {
    const { uniqueId, nickName } = touchItem;
    const { smallAvatarUrl } = JSON.parse(session("userInfo"));
    const body = {
      ...sendCurrentMsg,
      SendTime: Date.parse(new Date()) / 1000,
      msgId: "",
      nickName,
      smallAvatarUrl,
      uniqueId,
      successStatus: "loading"
    };
    const { LOCALMESSAGES } = this.props;
    if (LOCALMESSAGES[uniqueId]) {
      const pre = deepCopy(LOCALMESSAGES[uniqueId]) || [];
      pre.push(body);
      this.props.SETLOCALMESSAGES({ id: uniqueId, list: pre });
    } else {
      this.props.SETLOCALMESSAGES({ id: uniqueId, list: [body] });
    }
    //8秒钟后检查该id
    setTimeout(() => {
      const item = this.props.LOCALMESSAGES[uniqueId].find(
        x => x.localId === sendCurrentMsg.localId
      );
      if (item && item.successStatus !== "success") {
        item.successStatus = "error";
        this.props.SETLOCALMESSAGES({
          id: uniqueId,
          list: deepCopy(this.props.LOCALMESSAGES[uniqueId])
        });
      }
    }, normalError);
  }

  sendimg = () => {};

  handleInputChange = event => {
    if (this.props.isBanned){
      message.warning("当前暂时不能发送图片,请稍后重试",1.5);
      this.refs.uploadimg.value = "";
      return;
    }
    
    const { ossInfo } = this.props;
    const ossObj = {
      endpoint: ossInfo.EndPoint,
      accessKeyId: ossInfo.AccessKeyId,
      accessKeySecret: ossInfo.AccessKeySecret,
      bucket: ossInfo.Bucket
    };

    const that = this;
    const { touchItem } = this.props;
    const files = Array.from(event.target.files);

    const MIMEType = ["image/gif", "image/jpeg", "image/png", "image/jpg"];
    let flag = true;
    const isSupportType = files.some(v => {
      return !MIMEType.includes(v.type);
    });
    if (isSupportType)
      return Modal.warning({
        title: "提示",
        content: "图片仅支持jpg、jpeg、png、gif格式, 请重新选择",
        okText: "确认"
      });

    if (files.length > 9) {
      Modal.warning({
        title: "提示",
        content: "图片数量不得超过9张，请重新选择",
        okText: "确认"
      });
      return;
    }

    // return;
    // 先获取 签名
    const client = new OSS(ossObj);
    client
      .upload(files)
      .then(res => {
        const { friendid } = this.props;
        res.forEach((v,index) => {
          //发送单聊
          const sendItem = getSendCurrentMsg(friendid, v, index);
          // this.props.sendMsg(sendItem);
          that.addLOCALMESSAGE(sendItem, touchItem);
          //发送群聊
          touchItem.ChatType === 2 && this.props.SendLargeGroup(sendItem);
          //发送单聊
          touchItem.ChatType === 1 && this.props.sendMsg(sendItem);
          this.pushNewMsgList("picture");
          this.props.messageScrollBottom();
        });
        this.refs.uploadimg.value = "";
      })
      .catch(err => {
        // 图片发送 失败

        this.refs.uploadimg.value = "";
      });

    function getSendCurrentMsg(friendid, attribute,add) {
      add = add || 0;
      const { extension, height, width, fileName } = attribute;
      return {
        dstUin: touchItem.uniqueId,
        srcUin: +session("uin"),
        localId: +(`${new Date().getTime() + add}`.substr(10).padStart(4,1) + touchItem.uniqueId),
        Content: {
          data: {
            content: "[图片]",
            attribute: {
              bucketName: ossInfo.Bucket,
              extension,
              originalObjectKey: fileName,
              thumbnailObjectKey: fileName,
              height,
              width
            }
          },
          msgType: "picture"
        }
      };
    }
  };
  pushNewMsgList(type = "text") {
    const { touchItem } = this.props;
    const { ChatType } = touchItem;
    const { value } = this.state;
    const { nickName } = JSON.parse(session("userInfo"));
    const _value = touchItem.ChatType === 1 ? value : `${nickName}:${value}`;

    const item = {
      Content: { data: { content: _value }, msgType: type },
      ChatType,
      SendTime: new Date().getTime(),
      UnreadMsgCount: 0,
      belongToUin: 0,
      nickName: touchItem.nickName,
      remark: touchItem.remark,
      groupTitle: touchItem.groupTitle,
      dialogTitle: touchItem.dialogTitle,
      smallAvatarUrl: touchItem.smallAvatarUrl,
      srcUin: touchItem.uniqueId,
      uinType: 1,
      uniqueId: touchItem.uniqueId
    };


    this.props.addNewMsgList(item);
  }
  close = () => {
    this.props.informatclose();
  };

  render() {
    const { value, placeholder } = this.state;
    const { isBanned,bannedText } = this.props;
    return (
      <div className={styles.inputBox} onClick={this.close}>
        {
        isBanned&&
        <div className={styles.inputDisabled} onClick={(e)=>{e.stopPropagation();}}>
          <div className={styles.disabledText}>{bannedText}</div>
        </div>
       }
        <textarea
          maxLength="500"
          ref={this.textarea}
          rows="5"
          value={isBanned?'':value}
          placeholder={isBanned?'':placeholder}
          disabled={isBanned}
          onKeyDown={e => this.sendEnter(e)}
          onChange={e => this.msginput(e)}
          type="text"
        ></textarea>
        <div
          ref={this.sendMsgIcon}
          onClick={even => this.sendEnter(even, 13)}
          className={isBanned ? styles.preventMsg : styles.sendmsg}
        ></div>

        <div
          // onClick={even => this.sendimg(even, 13)}
          className={isBanned ? styles.preventImg : styles.sendimg}
        >
          <input
            onChange={this.handleInputChange}
            multiple
            disabled={isBanned}
            ref="uploadimg"
            accept="image/gif, image/jpeg,  image/png,  image/jpg"
            type="file"
          />
        </div>
     
      </div>
    );
  }
}

export default InputBox;
