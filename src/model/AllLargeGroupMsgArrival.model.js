import dataSource from "../dataSource";
import format from "../utils/msg.format";
import MessageService from "../services/Message.service";

//所有的大群消息已达
export default {
  namespace: "AllLargeGroupMsgArrival",
  state: {
    AllLargeGroupMsg: {}
  },
  reducers: {
    AllLargeGroupMsg(state, { payload }) {
      return {
        ...state
        //   sendGroupmsg:payload.sendGroupmsg
      };
    }
  },
  effects: {
    *SendAllLargeGroupMsg(payload, { select }) {
      const ws = yield select(state => state.Index.ws);
      const data = dataSource[70001021].body;
      const res = {
        groupUin: payload.groupUin.groupUin
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
      const buf = MessageService.set(parseInt(70001021, 16), data);
      ws.send(buf);
    }
  }
};
