import dataSource from "../dataSource";
import MessageService from "../services/Message.service";
//通过uin或手机号查询是否是好友关系-->获取用户的信息QueryFriendRelationByUin
export default {
  namespace: "QueryFriendRelationByUin",
  state: {
    friendRelation: {},
    userInfo: {}, //
    errorCode: -1, //获取好友信息成功时返回 errorCode = 0
    uin: -1 //在群聊里面点击的人的id
  },
  reducers: {
    resetErrorCodeStatus(state, payload) {
      return {
        ...state
        // errorCode: -1,
        // uin: -1
      };
    },
    setUserInfo(state, { payload }) {
      const uncertainState = payload.state;
      const uniqueId = payload.uin;
      return {
        ...state,
        userInfo: {
          ...payload,
          uniqueId,
          // userStatus, //0:未添加；=1:已添加为好友
          uncertainState //0 没开启消息免打扰 =1 开启消息免打扰
        }
        // errorCode: payload.errorCode
      };
    },
    //保存点击用户的id
    getSaveClickUin(state, payload) {
      return {
        ...state,
        uin: payload.uin
      };
    }
  },
  effects: {
    // 通过uin或手机号查询是否是好友关系-->获取用户的信息
    *GetFriendRelation(payload, { select }) {
      const ws = yield select(state => state.Index.ws);
      const data = dataSource[31111021].body;

      const value = {
        uin: payload.uin
      };
      data.forEach(item => {
        if (value[item.id] !== undefined) {
          item.value = value[item.id];
          if (item.type === "string") {
            item.size = format.strStreamSize(item.value);
          }
        } else {
          item.value = "";
        }
      });
      const buf = MessageService.set(parseInt(31111021, 16), data);
      ws.send(buf);
    },
    // *FriendRelation(state, { payload }) {
    *FriendRelation({ payload }, { select, put }) {
      console.log(payload, "我是获取好友信息的接口");

      // 这里需要重新 set  touchItem  messageList
      yield put({
        type: "setUserInfo",
        payload
      });
      const touchItem = yield select(state => state.Todos.touchItem);
      // 最新的用户信息
      const { uin: id, nickName, smallAvatarUrl, remark } = payload;
      // const { uniqueId, nickName, smallAvatarUrl} = touchItem
      if (touchItem.uniqueId !== id || touchItem.ChatType === 2) return;

      const res = {};
      // 对比本地的用户信息 是否 是最新的   如果不是 重新set
      if (touchItem.nickName !== nickName) {
        res.nickName = nickName;
        res.remark = remark || nickName;
        res.dialogTitle = remark || nickName;
      }
      if (touchItem.smallAvatarUrl !== smallAvatarUrl) {
        res.smallAvatarUrl = smallAvatarUrl;
      }
      // 重新 set  注意有两个需要重新set
      if (JSON.stringify(res) !== "{}") {
        // console.log("res--->", {
        //   ...touchItem,
        //   ...res
        // });
        yield put({
          type: "Todos/saveTouchItem",
          item: {
            ...touchItem,
            ...res
          }
        });
        const newMsgList = yield select(
          state => state.GetNewMsgList.newmsglist
        );
        // 拿到原来的值
        const newMsgListCurItem = newMsgList.find(v => v.uniqueId === id);

        // console.log(a, newMsgList);
        yield put({
          type: "GetNewMsgList/addNewMsgList",
          item: {
            ...newMsgListCurItem,
            ...res
          }
        });
      }
    }
  }
};
