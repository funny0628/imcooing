import dataSource from "../dataSource";
import format from "../utils/msg.format";
import ECDH from "../services/encrypt/ecdh";
import MessageService from "../services/Message.service";
import AES from "../services/encrypt/aes";
const { SHA256 } = require("crypto-js");
let cb = () => {};
export default {
  namespace: "HandShake",
  state: {
    ecdh: null,
    // 是否握手成功
    isShakeHandsSuccess: false
  },
  reducers: {
    setShakeHandsSuccess(state, { payload }) {
      return {
        ...state,
        isShakeHandsSuccess: payload
      };
    },
    setECDH(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    }
  },
  effects: {
    //  发送客户端生成的 pubkey  第一次握手
    *sendPublicKey({ payload: { ws } }, { select, put }) {
      // 创建 ecdh 实例 并生成客户端 公私钥
      const ecdh = new ECDH();

      yield put({
        type: "setECDH",
        payload: { ecdh }
      });
      yield put({
        type: "Index/initWs",
        payload: {
          ws
        }
      });

      // const ws = yield select(state => state.Index.ws);
      const data = dataSource[10001003].body;

      const value = {
        publicEccKey: ecdh.pubKey,
        timestamp: Math.floor(new Date() / 1000),
        publicKeyIndex: 1,
        sign: ""
      };
      //
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
      const buf = MessageService.set(parseInt(10001003, 16), data);
      ws.send(buf);
    },
    // 这里拿到了服务端 公钥   并且 得到 aes
    *getPublicKey({ payload }, { put, select }) {
      const { serverPublicEccKey, serverNonce } = payload;
      // const serverPublicEccKey = 'A9vUoX+O6jxD9KjENT3StB+DCK69Ot09xAGpTXpp1YtP';
      // const serverNonce = 'Hq1wnkjSz0';

      const ecdh = yield select(state => {
        return state.HandShake.ecdh;
      });
      //
      // 获取到 AES 秘钥信息 并存储
      ecdh.getAESInfo(serverPublicEccKey);
      // const { AESKEY, AESIV } = ecdh.getAESInfo(serverPublicEccKey);
      // 设置AES key 以及 iv
      // AES.setAES({ AESKEY, AESIV });
      // const AESKEY = '67f92c0d7af93e1e';
      // const AESIV = '3bc8b5339b895ad3';
      //
      // 这步没有问题 和 ios 一样
      // let str = `${serverPublicEccKey} ${serverNonce}         `;

      // 按照  服务端所说的方式 将两个字符串拼接
      // `${str1}补0${str2}补0}` 这里补0 是补数字0 不是字符串0
      let str = `${serverPublicEccKey} ${serverNonce} `;
      str = str.replace(/ /g, "\0");

      //
      //
      // let strHex = `${stohex(serverPublicEccKey)}${stohex(serverNonce)}`;
      //

      // 将服务端 公钥 以及 服务端返回的随即字符串 拼接 得到 sha256 的 string
      const sha256Str = SHA256(str).toString();
      //

      yield put({
        type: "seedConfirmHandShake",
        payload: {
          sha256Str
          // AESKEY,
          // AESIV
        }
      });
    },
    // 第二次 确认握手 发送 客户端的 sign 以供服务端验证
    *seedConfirmHandShake({ payload: { sha256Str } }, { put, select }) {
      //
      //
      const ws = yield select(state => state.Index.ws);
      const data = dataSource[10001004].body;
      const encodeStr = AES.encode(sha256Str);
      const value = {
        timestamp: Math.floor(new Date() / 1000),
        // sign: stob64(encodeStr)
        sign: encodeStr
      };
      //
      // //
      //
      //

      //
      //
      //
      //
      //
      // let _AESKEY = 'e70258a6995da62f',
      //   _AESIV = '2e6fb8fc2e0c906a';
      // const text = '123456';
      // const jiamide = AES.encode(text, _AESKEY, _AESIV);
      //
      //

      //

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
      const buf = MessageService.set(parseInt(10001004, 16), data);
      //
      ws.send(buf);
    },
    // ConfirmHandShake 第二期确认握手成功
    *confirmHandShakeSuccess({ payload }, { put, select }) {
      yield put({
        type: "setShakeHandsSuccess",
        payload: true
      });
      //
    }
  }
};
