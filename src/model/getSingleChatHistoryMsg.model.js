import dataSource from "../dataSource";
import format from "../utils/msg.format";
import MessageService from "../services/Message.service";
import { translateMsgList } from "../utils/Basicmethod";
export default {
  namespace: "SingleChatHistoryMsg",
  state: {
    singChatHistoryList: {}
  },
  reducers: {
    // 单聊历史消息
    setSingChatHistoryMsg(state, { payload }) {
      return {
        ...state,
        singChatHistoryList: {
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
    clearSingleChatHistoryMsg(state) {
      return {
        ...state,
        singChatHistoryList: {}
      };
    }
  },
  effects: {
    // 获取单聊消息
    *getSingleChatHistoryMsg(payload, { select, put }) {
      const ws = yield select(state => state.Index.ws);
      yield put({
        type: "setData",
        payload: {
          cb: payload.dstUin.cb
        }
      });
      const data = dataSource[70001030].body;
      // COOING_LOCALMESSAGES[payload.dstUin.dstUin][0].msgId;
      const res = {
        dstUin: payload.dstUin.dstUin,
        startMsgId: payload.dstUin.startMsgId,
        count: payload.dstUin.count
      };

      data.forEach(item => {
        item.value = res[item.id];
      });
      //
      const buf = MessageService.set(parseInt(70001030, 16), data);
      //
      ws.send(buf);
    },
    *singChatHistoryMsg({ payload }, { select, put }) {
      const cb = yield select(state => state.SingleChatHistoryMsg.cb);
      const res = translateMsgList(payload.singChatHistoryMsg);
      typeof cb === "function" && cb(res.length);

      yield put({
        type: "setSingChatHistoryMsg",
        payload: {
          [payload.pullUin]: res.reverse()
        }
      });
    }
  }
};
