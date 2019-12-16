import { session, removeSession,deepCopy } from "../utils/lib";
removeSession('WEB_COOING_TOUCH_ITEM');
export default {
  namespace: "Todos",
  state: {
    touchItem: {}, //当前选中的item
    unSendMsgObj: {}, //未发送的消息列表,unSendMsg 代表草稿  friendsid  对应的身份
    friendid: -1, //好友的id
    NoSendaMsg: "", //未发送的消息,
    NoSendPlaceholder: "", //未发送消息的占位符
    pullMsg: {}, // 已发送的消息的数据
    menuTitle: "",
    maskKeyword: false,
    NoPrivateChat: false
  },
  reducers: {
    //存储未发送的消息,
    addUnReadMsg(state, payload) {
      const unSendMsgObj = Object.assign({}, state.unSendMsgObj, payload.messageInfo)
      return { ...state,...{unSendMsgObj} };
    },
    //根据id查询之前是否有未发送的信息
    // cheackuUnreagMsg(state, payload) {
    //   //
    //   const checkMsg = state.unSendMsgList.find(
    //     item => item.friendsid === payload.friendId.friendId
    //   );
    //   //
    //   if (checkMsg) {
    //     return {
    //       ...state,
    //       NoSendaMsg: checkMsg.unSendMsg
    //     };
    //   } else {
    //     return {
    //       ...state,
    //       NoSendaMsg: ""
    //     };
    //   }
    // },
    //保存当前点击的用户的id
    saveid(state, payload) {
      return {
        ...state,
        friendid: payload.friendid.friendid
      };
    },
    saveTouchItem(state, payload) {
      session("WEB_COOING_TOUCH_ITEM", JSON.stringify(payload.item));
      return { ...state, touchItem: payload.item };
    },

    changeMask(state, payload) {
      //群聊会话查看好友以及禁止私聊的弹框关键字
      return {
        ...state,
        maskKeyword: payload.isShowInfo.InfoMask,
        NoPrivateChat: payload.isShowInfo.NoChat
      };
    }
  }
};
