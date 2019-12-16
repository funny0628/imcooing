import dataSource from "../dataSource";
import MessageService from "../services/Message.service";
import { translateMsgList } from "../utils/Basicmethod";
export default {
  namespace: "GroupChat",
  state: {
    GroupChatMsgList: []
  },
  reducers: {
    // 大群消息
    largeChatMsg(state, { payload }) {
      return {
        ...state,
        GroupChatMsgList: translateMsgList(payload.largegroupChatList)
      };
    },
    clearGroupChatList(state) {
      return {
        ...state,
        GroupChatMsgList: []
      };
    }
  },
  effects: {
    // 获取大群消息
    *getGroupChatList(payload, { select }) {
      const ws = yield select(state => state.Index.ws);
      const data = dataSource[60011009].body;
      const res = {
        dstUin: payload.ChatInfoMsg.dstUin,
        startMsgId: payload.ChatInfoMsg.startMsgId,
        count: payload.ChatInfoMsg.count
      };

      data.forEach(item => {
        item.value = res[item.id];
      });
      const buf = MessageService.set(parseInt(60011009, 16), data);
      ws.send(buf);
    }
  }
};
