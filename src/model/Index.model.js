import WebSocketService from "../services/Websocket.service";
import MessageService from "../services/Message.service";
import { wsAPI } from "../config/index";
import Login from "../views/Login";
import Http from "../api/index";
let timeId = null;
// 初始化websocket
const initWebsocket = async dispatch => {
  const ws = new WebSocketService({
    // url: "ws://10.99.50.120:18808",
    // url: "ws://10.99.50.88:18808", // 调试加密的
    // url: "ws://47.91.228.223:18808", // 测试环境
    url: window.__wsAPI || wsAPI, // 测试环境
    // 心跳检测间隔
    timeout: 10000,
    // 重连callback  这里重连有问题
    reconnect: () => {
      // dispatch({
      //   type: 'initWs',
      //   payload: { ws: { readyState: 0 } }
      // });
      // initWebsocket(dispatch);
    }
  });
  const wsInstance = await ws.init();
  // 心跳检测
  wsInstance.reset().start();
  //
  dispatch({
    type: "initWs",
    payload: { ws: wsInstance }
  });
  // 第一次握手 发送 公钥
  // 这里面重新赋值了 实例
  dispatch({
    type: "HandShake/sendPublicKey",
    payload: { ws: wsInstance }
  });

  wsInstance.onmessage = e => {
    const { result, action } = MessageService.get(e.data);
    // 收到心跳检测回复,重置心跳检测
    if (["heartBeat"].includes(action)) {
      wsInstance.reset().start();
      return false;
    }
    // 如果登录成功 也要 重置开始心跳
    if (["User/userInfoOfLoginSuccess"].includes(action)) {
      wsInstance.reset().start();
    }
    dispatch({
      type: action,
      payload: result
    });
  };
  wsInstance.onclose = e => {
    console.log(e, "WebSockets 断开了");
    dispatch({
      type: "socketClose"
    });
  };
  window.onoffline = () => {
    dispatch({
      type: "socketClose"
    });
  };
};
export default {
  namespace: "Index",
  state: {
    // websocket 连接
    ws: {
      readyState: 0
    },
    // 0 正在连接  1 连接成功  2 正在关闭   3 连接断开
    wsState: 0,
    isKickUser: false //被踢出状态.
  },
  reducers: {
    initWs(state, { payload: { ws } }) {
      return {
        ...state,
        ws,
        wsState: 1
      };
    },
    socketClose(state) {
      if (state.isKickUser) return { ...state };
      return {
        ...state,
        wsState: 3
      };
    }, //用户收到被踢出的消息提示

    kickUser(state, { payload }) {
      return { ...state, isKickUser: true };
    },
    setKickUser(state, { value }) {
      return { ...state, isKickUser: value };
    }
  },
  effects: {
    *init({ payload: dispatch }, { put }) {
      yield put({
        type: "initWs",
        payload: {
          ws: {
            readyState: 0
          }
        }
      });
      yield put({
        type: "HandShake/setShakeHandsSuccess",
        payload: false
      });
      initWebsocket(action => {
        dispatch(action);
      });
    },
    *getConfig({ payload: dispatch }) {
      Http.get()
        .then(res => {
          if (res.error === 0) {
            window.__wsAPI = `ws://${res.data.im_web}`;
            dispatch({
              type: "init",
              payload: dispatch
            });
          }
        })
        .catch(err => {
          clearTimeout(timeId);
          timeId = setTimeout(() => {
            dispatch({
              type: "getConfig",
              payload: dispatch
            });
          }, 500);
        });
    }
    // 不知道为什么  退出之后在 重新链接   这里不会触发
    // 然后在 sendPublicKey 重新赋值了 ws 实例
    // *setWs(
    //   {
    //     payload: { ws, dispatch }
    //   },
    //   { put }
    // ) {
    //
    //   yield put({
    //     type: 'initWs',
    //     payload: {
    //       ws
    //     }
    //   });

    //   // 第一次握手 发送 公钥
    //   dispatch({
    //     type: 'HandShake/sendPublicKey'
    //   });
    // }
  },
  subscriptions: {
    // 监听websocket 消息接收,根据不同命令字 dispatch不同reducer
    onMessage({ dispatch }) {
      // 先 获取 config 在 init
      if (process.env.NODE_ENV === "production") {
        dispatch({
          type: "getConfig",
          payload: dispatch
        });
        return;
      }

      // 2019.12.11 现在需要请求一个 http 接口 获取 websocket url 然后在触发这个 actions
      return dispatch({
        type: "init",
        payload: dispatch
      });
      // return initWebsocket(action => {
      //
      //   dispatch(action);
      // });
    }
  }
};
