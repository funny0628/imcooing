import dataSource from "../dataSource";
import MessageService from "../services/Message.service";
import { translateMsgList } from "../utils/Basicmethod";
export default {
  namespace: "LargeGroupHistoryMsg",
  state: {
    GroupHistoryMsg: {},
    cb: null,
    len: 0
  },
  reducers: {
    // 大聊历史消息
    setGroupHistoryMsg(state, { payload }) {
      console.log(payload,9999999999)
      return {
        ...state,
        GroupHistoryMsg: {
          ...payload
        }
      };
    },
    setData(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
    clearGroupHistoryMsg(state, { payload }) {
      return {
        ...state,
        GroupHistoryMsg: {}
      };
    }
  },
  effects: {
    // 获取大聊历史消息
    *GetGroupHistoryMsg(payload, { select, put }) {
      const ws = yield select(state => state.Index.ws);
      const data = dataSource[70001032].body;
      const res = {
        dstUin: payload.dstUin.dstUin,
        startMsgId: payload.dstUin.startMsgId,
        count: payload.dstUin.count
      };

      yield put({
        type: "setData",
        payload: {
          cb: payload.dstUin.cb
        }
      });

      data.forEach(item => {
        item.value = res[item.id];
      });
      const buf = MessageService.set(parseInt(70001032, 16), data);
      ws.send(buf);
    },
    *GroupHistoryMsg({ payload }, { select, put }) {
      const res = translateMsgList(payload.GroupHistoryMsg);
      const cb = yield select(state => state.LargeGroupHistoryMsg.cb);

      //
      typeof cb === "function" && cb(res.length);

      yield put({
        type: "setGroupHistoryMsg",
        payload: {
          [payload.pullUin]: res.reverse()
        }
      });
    }
  }
};
