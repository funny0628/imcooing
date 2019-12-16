import dataSource from "../dataSource";
import format from "../utils/msg.format";
import MessageService from "../services/Message.service";
import { deepCopy } from "../utils/lib";

// 大群消息已达 这里是可以传入id的
export default {
  namespace: "LargeGroupMsgArrival",
  state: {
    LargeGroupMsg: {}
  },
  reducers: {
    LargeGroupMsgHand(state, { payload }) {
      return {
        ...state
      };
    }
  },
  effects: {
    * SendLargeGroupMsgArrive({payload}, { select }) {
      const ws = yield select(state => state.Index.ws);
      const data = deepCopy(dataSource[70001012].body);
      const res = {
        groupUin: payload.groupUin,
        count: payload.msgIdList.length,
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
      payload.msgIdList.forEach((msgId)=>{
        data.push({
           type: 'uint64',
            size: 8,
            value: msgId
        })
      })
      console.log('最后发送的dat',data)
      const buf = MessageService.set(parseInt(70001012, 16), data);
      ws.send(buf);
    }
  }
};
