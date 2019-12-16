import dataSource from "../dataSource";
import format from "../utils/msg.format";
import MessageService from "../services/Message.service";

//所有的单聊消息已达
export default {
  namespace: "AllSingleMsgArrival",
  state: {
    AllSingleMsg: {}
  },
  reducers: {
    AllSingleMsg(state, { payload }) {
      return {
        ...state
        //   sendGroupmsg:payload.sendGroupmsg
      };
    }
  },
  effects: {
    *SendAllSingleMsgl(payload, { select }) {
      const ws = yield select(state => state.Index.ws);
      const data = dataSource[60011015].body;
      const res = {
        DstUin: payload.DstUin.dstUin
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
      const buf = MessageService.set(parseInt(60011015, 16), data);
      ws.send(buf);
    }
  }
};
