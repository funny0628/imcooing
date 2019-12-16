//有新消息推送
export default {
  namespace: "PushHasGreetMsg",
  state: {
    hasPushGreetMag: {}
  },
  reducers: {
    PushHasGreetMsg(state, { payload }) {
      return {
        ...state
      };
    }
  }
};
