import dataSource from "../dataSource";
import format from "../utils/msg.format";
import { translateMsgList } from "../utils/Basicmethod";
import MessageService from "../services/Message.service";

//获取好友列表
export default {
  namespace: "Friendlist",
  state: {
    friendlist: []
  },
  reducers: {
    friends(state, { payload }) {
      return {
        // state:payload.friendlist
        ...state,
        ...{
          // 这里做了一层格式化转换
          friendlist: translateMsgList(payload.friendlist, true)
        }
      };
    }
  },
  effects: {
    // 获取好友信息列表
    *Getfriendlist(payload, { select, call, put }) {
      const ws = yield select(state => state.Index.ws);
      //
      const buf = MessageService.set(parseInt("0x7000100C", 16));

      //
      ws.send(buf);
    }
    // 获取好友信息列表
    //   *getfriendlist(payload, { select }) {
    //     //
    //     //

    //
    //     var name = yield select(state => state.Friendlist.name);

    //
    // }
  }
};
