import React, { Component } from "react";
import styles from "./index.less";
import welcomeicon from "../../../src/assets/image/menu/welcome.png";
import { deepCopy } from "../../utils/lib";
// 消息
import Message from "./_child/message";
import { message } from 'antd';
// 输入框
import InputBox from "./_child/input-box";

import { connect } from "dva";

@connect(
  ({ Grouplist, Todos, PushHasMsg, GetNewMsgList,GetLargeGroupDetail }) => ({
    grouplist: Grouplist.grouplist,
    touchItem: Todos.touchItem,
    isFlagNewMsg: GetNewMsgList.isFlagNewMsg, //查询是否有推送来的消息
    hasPushNewMag: PushHasMsg.hasPushNewMag, //查询是否有推送来的消息
    GROUPDETAIL: GetLargeGroupDetail.GROUPDETAIL,
    GroupErrorDetail: GetLargeGroupDetail.GroupErrorDetail,
    // 服务端有消息推送过来了
    lastMsg: GetNewMsgList.lastMsg,
  }),
  dispatch => ({
    //初始化大群详情
    initGroupState: () =>
      dispatch({
        type: "GetLargeGroupDetail/initState"
      }),
    groups: () =>
      dispatch({
        type: "Grouplist/groups"
      }), 
    //点击清除侧边栏消息
    setIsFlagNewMsg: flag =>
      dispatch({
        type: "GetNewMsgList/setIsFlagNewMsg",
        flag
      }), 
    //获取有未读信息的好友列表
    //大群消息
    getGroupChatList: ChatInfo =>
      dispatch({
        type: "GroupChat/getGroupChatList",
        ChatInfoMsg: ChatInfo
      }),
    saveTouchItem: item =>
      dispatch({
        type: "Todos/saveTouchItem",
        item
      }),
    //单聊消息
    getSingleChat: ChatInfo =>
      dispatch({
        type: "Chat/getSingleChat",
        ChatInfoMsg: ChatInfo
      }),
    setLastMsg: payload => {
      dispatch({
        type: "GetNewMsgList/setLastMsg",
        item: payload
      });
    }
  })
)
class Chat extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeindex: -1,
      grouplistshow: "",
      groupTitle: "",
      // 这里和子组件都有一个 但是这里仅仅是用来设置禁言的逻辑 input是currentId
      chatUniqueId:-1,
      //表示 群是否被设置禁言 默认被禁言
      isBanned: true,
      // 禁言的内容
      bannedText: "",
      isPrivateChat:false, // 默认禁止私聊
      TotalCount:0, // 这里如果是群的话就会展示
      pullNowMsgs: this.pullNowMsgs.bind(this),
      setTouchItem:this.setTouchItem.bind(this)
    };
  }

  changemsg = a => {
    this.setState({
      grouplistshow: a
    });
  };
  close = () => {
    this.setState({
      grouplistshow: false
    });
  };

  pullNowMsgs(hasPushNewMag, id) {
    const body = { dstUin: id, startMsgId: 0, count: 20 };
    if (hasPushNewMag.ChatType === 1) {
      //单聊
      console.log("拉取了单聊消息")
      this.props.getSingleChat(body);
    } else {
      this.props.getGroupChatList(body);
    }
  }


  messageScrollBottom = () => {
    this.Message.messageScrollBottom();
  };

  static getDerivedStateFromProps(props, state) {
    //
    const {
      isFlagNewMsg,
      touchItem,
      lastMsg,
      GROUPDETAIL,
      GroupErrorDetail,
      initGroupState
    } = props;
    const { uniqueId,ChatType } = touchItem || {};
    const { chatUniqueId } = state;
    if (isFlagNewMsg) {
      if (lastMsg.uniqueId === uniqueId) {
        state.pullNowMsgs(lastMsg, uniqueId);
        props.setIsFlagNewMsg(false);
      }
    }
    // 这里把禁言的逻辑放到这里了
    // 切换了touch 这里是同步
    if (chatUniqueId !== uniqueId){
      // 这里有一个特殊的逻辑 ，点击的时候 如果当前有新的消息的话，那么要清空本地的存储的那一项
      // 因为特殊情况拿的是本地的记录
      // state.setLocalLocal


      return {
        ...state,
        TotalCount:0,
        chatUniqueId: uniqueId,
        isBanned: ChatType === 2 ? true : false, // 这里做了单聊的处理
        isPrivateChat: ChatType === 2 ? true : false, // 单聊允许，群聊默认关闭
          // 禁言的内容
        bannedText: "",
      }
    }

    // 关于禁言的逻辑 这里是异步请求得到的结果 // 这里如果不是群成员的话后端会返回id为0
    if (GROUPDETAIL.uniqueId !== chatUniqueId) return null;
    if (!GROUPDETAIL.INITFLAG) {
      const _GroupErrorDetail = deepCopy(GroupErrorDetail);
      const _GROUPDETAIL = deepCopy(GROUPDETAIL);
      initGroupState(); // 清空数据
      const {
        memberType,
        memberBanned,
        banned,
        ViewProfileChatSet,
        TotalCount
      } = _GROUPDETAIL;
      // 特殊提示情况，关于用户被踢出了群啊，或者群已经解散了的
      if (_GroupErrorDetail.errorCode) {
        GroupErrorDetail.message && message.warning(GroupErrorDetail.message, 0.8);
        return {
          ...state,
          TotalCount,
          isBanned: true,
          bannedText: GroupErrorDetail.message,
          isPrivateChat:false
        }
      } else {
        // 正常情况，返回了详情的
        // 自己被禁言了
        console.log(GROUPDETAIL,99999999999)
        // 特殊情况，这里设置群详情的时候可能会改变了头像或者什么的，所以要改变touchItem
        state.setTouchItem(_GROUPDETAIL);
        let bannedText = ''; 
        let isBanned = false;
        let isPrivateChat = false;
        if (memberType !== 1 && memberBanned === 0){
          bannedText = '抱歉,你已被管理员禁言';
          isBanned = true;
        }
        if (![1,2].includes(memberType) && banned === 0){
          bannedText = '抱歉 ,管理员已开启了全体禁言'
          isBanned = true;
        }
        isPrivateChat = [1, 2].includes(memberType) || ViewProfileChatSet === 1;
        bannedText && message.warning(bannedText,0.8);
        return {
          ...state,
          TotalCount,
          isBanned,
          bannedText,
          isPrivateChat
        }
      }
    }
    return null;
  }
  // 获取子组件
  onRef(name, ref) {
    this[name] = ref;
  }
  addLocal = (sendCurrentMsg, touchItem) => {
    this.InputBox.addLOCALMESSAGE(sendCurrentMsg, touchItem);
  };
  setTouchItem(detail){
    const {touchItem} = this.props;
    const {dialogTitle,smallAvatarUrl} = touchItem;
    const {groupTitle} = detail;
    if (dialogTitle !== groupTitle || smallAvatarUrl !== detail.groupIcon) {
      const _touchItem = Object.assign({}, touchItem, {
        dialogTitle:groupTitle,
        nickName:groupTitle,
        smallAvatarUrl: detail.groupIcon,
        groupAvatarUrl: detail.groupIcon,
      })

      this.props.saveTouchItem(_touchItem)
    }
  }

  render() {
    // const { grouplistshow } = this.state;
    const { touchItem } = this.props;
    const {isBanned,bannedText,isPrivateChat , TotalCount} = this.state;
    return touchItem.uniqueId ? (
      <div className={styles.chat}>
        <Message
          key={touchItem.uniqueId}
          informatshow={this.changemsg}
          informatclose={this.close}
          onRef={this.onRef.bind(this)}
          addLocal={(a1, a2) => {
            this.addLocal(a1, a2);
          }}
          // 禁言查看新加的
          isPrivateChat={ isPrivateChat }
          bannedText={ bannedText }
          TotalCount={ TotalCount }
        />
        {/* 输入框区域 */}
        <InputBox
          isBanned={isBanned}
          bannedText={bannedText}
          informatclose={this.close}
          messageScrollBottom={this.messageScrollBottom}
          onRef={this.onRef.bind(this)}
        />
      </div>
    ) : (
      <div className={styles.chat}>
        <img className={styles.initchat} src={welcomeicon} />
      </div>
    );
  }
}
export default Chat;
