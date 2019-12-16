import MessageService from "../services/Message.service";
import { session, deepCopy } from "../utils/lib";
import { translateMsgList } from "../utils/Basicmethod";

const getUniqueId = () => {
  const touchItem = session("WEB_COOING_TOUCH_ITEM")
    ? JSON.parse(session("WEB_COOING_TOUCH_ITEM"))
    : {};
  return touchItem.uniqueId;
};

function setNickName(item) {
  item.lastSendNickName = item.nickName;
  item.nickName = item.dialogTitle;
}


// 获取有新消息的会话列表
export default {
  namespace: "GetNewMsgList",
  state: {
    flag: true,
    newmsglist: session("newmsglist") ? JSON.parse(session("newmsglist")) : [],
    lastMsg: {},
    isFlagNewMsg: false
  },
  reducers: {
    dispatchNewMsgList(state, { payload }) {
      const uniqueId = getUniqueId();

      const oldMsgList = deepCopy(state.newmsglist);

      let _newMsgs = translateMsgList(payload.newmsglist, true) || [];

      const oldIds = oldMsgList.map(pro => pro.uniqueId);
      const sameIndexs = [];
      // 将相同的添加进去
      _newMsgs.forEach(msg => {
        // 在根源处清除未读消息
        msg.uniqueId === uniqueId ? (msg.UnreadMsgCount = 0) : "";
        // 发送时间 = 后端*1000
        msg.SendTime = msg.SendTime * 1000;
        oldIds.includes(msg.uniqueId) && sameIndexs.push(msg.uniqueId);

        setNickName(msg);
      });
      // 过滤掉旧的相同的
      const _oldMsgList = oldMsgList.filter(
        x => !sameIndexs.includes(x.uniqueId)
      );
      const result = [..._newMsgs, ..._oldMsgList].sort(
        (a, b) => b.SendTime - a.SendTime
      );

      session("newmsglist", JSON.stringify(result));
      return {
        ...state,
        newmsglist: result
      };
    },
    clearMsgDrag(state, { id }) {
      let _newMsgs = deepCopy(state.newmsglist);
      _newMsgs.forEach(el => {
        el.uniqueId === id ? (el.UnreadMsgCount = 0) : true;
      });
      _newMsgs = _newMsgs.sort((a, b) => b.SendTime - a.SendTime);

      session("newmsglist", JSON.stringify(_newMsgs));
      return {
        ...state,
        newmsglist: _newMsgs
      };
    },
    addNewMsgList(state, { item }) {
      const newMsgList = Array.from(deepCopy(state.newmsglist));
      let result;
      const index = newMsgList.findIndex(x => x.uniqueId === item.uniqueId);
      if (index !== -1) {
        newMsgList.splice(index, 1);
        newMsgList.unshift(item);
        result = newMsgList;
      } else {
        result = [item].concat(newMsgList);
      }
      result = result.sort((a, b) => b.SendTime - a.SendTime);
      session("newmsglist", JSON.stringify(result));

      return {
        ...state,
        newmsglist: result
      };
    },
    // NewMsg(state, { payload }) {
    //

    //   return {
    //     ...state,
    //     flag: false
    //   };
    // }
    setLastMsg(state, { item }) {
      return {
        ...state,
        lastMsg: item
      };
    },
    setIsFlagNewMsg(state, { flag }) {
      return {
        ...state,
        isFlagNewMsg: flag
      };
    }
  },
  effects: {
    // 只有进来才请求一次   然后通过 NewMsg 获取新的推送
    // NewMsg 要改变左侧 的数据 （最后一条 ） 未读条数 时间？
    *Getnewmsglist(payload, { select }) {
      const ws = yield select(state => state.Index.ws);
      const buf = MessageService.set(parseInt("60011024", 16));
      //
      ws.send(buf);
    },

    // 左边有新的东西
    *NewMsg({ payload }, { select, put }) {
      // lastMsg

      let res = deepCopy(payload);

      res.Content = JSON.parse(res.Content);
      res.SendTime = res.SendTime * 1000;
      res.personalAvatarUrl = res.smallAvatarUrl;
      res.smallAvatarUrl = res.groupAvatarUrl;
      // 名称
      setNickName(res);
      const touchItem = yield select(state => state.Todos.touchItem);

      const uniqueId = touchItem.uniqueId;

      if (uniqueId === res.uniqueId) {
        res.UnreadMsgCount = 0;
        yield put({
           type: "setIsFlagNewMsg",
           flag: true
        });
      }
   
     
      yield put({
        type: "setLastMsg",
        item: res
      });
      yield put({
        type: "addNewMsgList",
        item: res
      });
    },

  }
};
