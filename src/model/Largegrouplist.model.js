import dataSource from "../dataSource";
import format from "../utils/msg.format";
import MessageService from "../services/Message.service";

//获取群组列表
export default {
  namespace: "LargeGrouplist",
  state: {
    LargeGroups: []
  },
  reducers: {
    LargeGroup(state, { payload }) {
      return {
        ...state,
        ...{
          LargeGroups: payload.LargeGroups
        }
      };
    }
  },
  effects: {
    // 获取群聊信息列表
    *getlargegrouplist(payload, { select }) {
      const ws = yield select(state => state.Index.ws);
      //
      const data = dataSource[70001010].body;

      data.forEach(item => {
        if (payload[item.id] !== undefined) {
          item.value = payload[item.id];
          // if (item.type === 'string') {
          //   item.size = format.strStreamSize(item.value);
          // }
        } else {
          item.value = "";
        }
      });

      const buf = MessageService.set(parseInt(70001010, 16), data);

      //
      ws.send(buf);
    }
  }
};
