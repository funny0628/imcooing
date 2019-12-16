import { deepCopy, session, removeSession, sessionListen } from "../utils/lib";
const LOCALMESSAGES = session("COOING_LOCALMESSAGES")
  ? JSON.parse(session("COOING_LOCALMESSAGES"))
  : {};
// 这里保存了 重要的本地存储信息以及重要的会话信息
export default {
  namespace: "LOCALMESSAGE",
  state: {
    // 当前用户对应的MESSAGE消息
    LOCALMESSAGES
    // key value 形式  10086:{}
    // 如果是自己发送过去对方的消息，要多一个字段  successStatus：'success'  'error'  'loading' 三个状态
    // 点击切换的时候先判断是否存在这个属性，如果存在就只拉去新的消息 新的消息和旧的消息做匹配 不存在几句拉大部分的消息
  },
  reducers: {
    SETLOCALMESSAGES(state, { payload }) {
      const { id, list } = payload;
      const _Lo = deepCopy(state.LOCALMESSAGES);
      _Lo[id] = list;
      // 这里的本地记录暂时做了保存，后面如果要处理更多的细节的话，可以选择不保存本地的记录
      // 如果不做本地存储的工作的话  那么可以选择不要监听session 太多的功能
      session("COOING_LOCALMESSAGES", JSON.stringify(_Lo));
      sessionListen();
      return {
        ...state,
        LOCALMESSAGES: _Lo
      };
    },
    CLEARLOCALMESSAGES(state) {
      removeSession("COOING_LOCALMESSAGES");
      return {
        ...state,
        LOCALMESSAGES: {}
      };
    }
  },
  effects: {
    // 获取群聊信息列表
  },
  subscriptions: {
    // 监听session存储，如果session存储超过sessionMax 那么弹框显示清除
  }
};
