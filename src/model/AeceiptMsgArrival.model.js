import dataSource from "../dataSource";
import format from "../utils/msg.format";
import MessageService from "../services/Message.service";
import { deepCopy } from "../utils/lib";
export default {
  namespace: "AeceiptMsgArrival",
  state: {
  },
  reducers: {
    // 单聊消息
    receiptOk(state, { payload }) {
      console.log('shoudaole ',payload)
      return {
        ...state,
      };
    },
  },
  effects: {
    // 告诉后端消息已经到达的回执
    *sendReceiptOk({payload}, { select }) {
      const ws = yield select(state => state.Index.ws);
      const data = deepCopy(dataSource[60011023].body);
      const res = {
        dstUin: payload.dstUin,
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
      // 
      console.log("最后发送的data",data)
      
      const buf = MessageService.set(parseInt(60011023, 16), data);
      ws.send(buf);
    }
  }
};
