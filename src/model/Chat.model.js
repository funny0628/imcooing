import dataSource from "../dataSource";
import format from "../utils/msg.format";
import MessageService from "../services/Message.service";
import { translateMsgList } from "../utils/Basicmethod";
export default {
  namespace: "Chat",
  state: {
    singChatList: []
  },
  reducers: {
    // 单聊消息
    singChatMsg(state, { payload }) {
      console.log("收到的单聊消息", translateMsgList(payload.singChatList))
      return {
        ...state,
        singChatList: translateMsgList(payload.singChatList)
      };
    },
    clearSingleChat(state) {
      return { ...state, singChatList: [] };
    }
  },
  effects: {
    // 获取单聊消息
    *getSingleChat(payload, { select }) {
      const ws = yield select(state => state.Index.ws);
      const data = dataSource[60011008].body;
      const res = {
        dstUin: payload.ChatInfoMsg.dstUin,
        startMsgId: payload.ChatInfoMsg.startMsgId,
        count: payload.ChatInfoMsg.count
      };
      data.forEach(item => {
        item.value = res[item.id];
      });
      //
      const buf = MessageService.set(parseInt(60011008, 16), data);
      ws.send(buf);
    }
  }
};
