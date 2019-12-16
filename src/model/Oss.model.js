import dataSource from "../dataSource";
import MessageService from "../services/Message.service";

// 获取 oss 签名用的
export default {
  namespace: "Oss",
  state: {
    ossInfo: {
      EndPoint: "",
      AccessKeyId: "",
      AccessKeySecret: "",
      Bucket: ""
    }
  },
  reducers: {
    ossReceive(state, { payload }) {
      const { EndPoint, AccessKeyId, AccessKeySecret, Bucket } = payload;
      const ossInfo = { EndPoint, AccessKeyId, AccessKeySecret, Bucket };
      return {
        ...state,
        ossInfo
      };
    }
  },
  effects: {
    // 获取签名
    *getSign(payload, { select }) {
      const ws = yield select(state => state.Index.ws);
      const data = dataSource[70001031].body;

      const buf = MessageService.set(parseInt(70001031, 16), data);

      ws.send(buf);
    }
  }
};
