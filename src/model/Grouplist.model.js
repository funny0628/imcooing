import MessageService from "../services/Message.service";
import { translateMsgList } from "../utils/Basicmethod";

//获取群组列表
export default {
  namespace: "Grouplist",
  state: {
    grouplist: [],
    // 选中的群组成员信息
    selectItem: null
  },
  reducers: {
    groups(state, { payload }) {
      return {
        ...state,
        ...{
          grouplist: translateMsgList(payload.grouplist, true)
        }
      };
    },
    selectGroupItem(state, { payload }) {
      return { ...state, ...payload };
    }
  },
  effects: {
    // 获取群聊信息列表
    *getgrouplist(payload, { select, call, put }) {
      const ws = yield select(state => state.Index.ws);
      //

      const buf = MessageService.set(parseInt("70001015", 16));

      //
      ws.send(buf);
    }
  }
};
