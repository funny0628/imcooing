//有新消息推送
export default {
  namespace: "PushHasMsg",
  state: {
    hasPushNewMag: {},
    isFlagNewMsg: false
  },
  reducers: {
    PushHasNewMsg(state, { payload }) {
      return {
        ...state,
        isFlagNewMsg: true,
        hasPushNewMag: payload
      };
    },
    setFlagFalse(state) {
      return {
        ...state,
        isFlagNewMsg: false
      };
    }
  }
};
