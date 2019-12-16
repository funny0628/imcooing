import dataSource from "../dataSource";
import format from "../utils/msg.format";
import MessageService from "../services/Message.service";
import { message } from "antd";

//发送消息
export default {
  namespace: "SendMsg",
  state: {
    sendMsgs: {}
  },
  reducers: {
    sendmsg(state, { payload }) {
      if (payload.errorCode !== 0) {
        message.error(payload.message || "");
      }

      return {
        ...state,
        sendMsgs: payload
      };
    },
    clearSendMsgs(state) {
      return {
        ...state,
        sendMsgs: {}
      };
    }
  },
  effects: {
    *sendMsg(payload, { select }) {
      const ws = yield select(state => state.Index.ws);
      const data = dataSource[60011001].body;
      const res = {
        dstUin: payload.sendCurrentMsg.dstUin,
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
      const buf = MessageService.set(parseInt(60011001, 16), data);
      ws.send(buf);
    }
  }
};
