import dataSource from "../dataSource";
import MessageService from "../services/Message.service";
//移除大群成员
export default {
  namespace: "RemoveLargeGroupMem",
  state: {
    //获取点击的群的groupUin
    groupUin: -1,
    //拿到要被删除的群成员组成的数组
    removeMemList: []
  },
  reducers: {
    RemoveGroupMem(state, { payload }) {
      return {
        ...state
      };
    },
    filterWillRemoveGroupMem(state, payload) {}
  },
  effects: {
    // 获取群聊信息列表
    *RemoveGroupMemPort(payload, { select }) {
      const ws = yield select(state => state.Index.ws);
      const data = dataSource[0x70001014].body;

      const value = {
        groupUin: payload.groupUin,
        Count: payload.Count,
        UinList: payload.UinList
      };
      data.forEach(item => {
        if (value[item.id] !== undefined) {
          item.value = value[item.id];
          if (item.type === "string") {
            item.size = format.strStreamSize(item.value);
          }
        } else {
          item.value = "";
        }
      });
      const buf = MessageService.set(parseInt(0x70001014, 16), data);
      ws.send(buf);
    }
  }
};
