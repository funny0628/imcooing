import dataSource from "../dataSource";
import format from "../utils/msg.format";
import MessageService from "../services/Message.service";
import { message } from "antd";
//发送大群消息
export default {
  namespace: "SendLargeGroupMsg",
  state: {
    sendGroupmsg: {}
  },
  reducers: {
    sendGroupmsg(state, { payload }) {
      if (payload.errorCode !== 0) {
        message.warning(payload.message || "");
      }

      return {
        ...state,
        sendGroupmsg: payload
      };
    },
    clearSendGroupMsg(state, { payload }) {
      return {
        ...state,
        sendGroupmsg: {}
      };
    }
  },
  effects: {
    *SendLargeGroup(payload, { select }) {
      const ws = yield select(state => state.Index.ws);
      const data = dataSource[70001011].body;

      const res = {
        groupUin: payload.sendCurrentMsg.dstUin,
        localId: payload.sendCurrentMsg.localId,
        Content: JSON.stringify(payload.sendCurrentMsg.Content)
      };
      data.forEach(item => {
        if (res[item.id] !== undefined) {
          item.value = res[item.id];
          if (item.type === "string") {
            item.size = format.strStreamSize(item.value);
          }
        } else {
          item.value = "";
        }
      });
      const buf = MessageService.set(parseInt(70001011, 16), data);
      ws.send(buf);
    }
  }
};
