import dataSource from "../dataSource";
import format from "../utils/msg.format";
import MessageService from "../services/Message.service";
export default {
  namespace: "App",
  state: {},
  reducers: {
    add(state, { payload }) {
      return {
        ...state
      };
    }
  },
  effects: {
    *getData(payload, { select }) {
      const ws = yield select(state => state.Index.ws);

      const data = dataSource[70001028].body;
      const str = "我有一只小毛驴";
      data[0].size = format.strStreamSize(str);
      data[0].value = str;
      const buf = MessageService.set(parseInt(70001028, 16), data);
      //
      ws.send(buf);
    }
  }
};
