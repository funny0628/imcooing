import dataSource from "../dataSource";
import format from "../utils/msg.format";
import MessageService from "../services/Message.service";
import { message } from "antd";

export default {
  namespace: "User",
  state: {
    loginSuccess: false,
    logoutSuccess: false,
    smsReturn: {},
    // 登录成功后保存的用户信息
    userInfoByLogin: {
      nickName: "",
      gender: "",
      phoneNumber: "",
      message: "登录验证提示",
      errorCode: -1,
      uin: -1,
      sessionId: "",
      smallAvatarUrl: "",
      originAvatarUrl: "",
      langCode: ""
    }
  },
  reducers: {
    userInfoOfLoginSuccess(state, { payload }) {
      if (payload.errorCode !== 0) {
        // 登录失败，这里要写提示
        message.warning(payload.message);
        return { ...state, ...{ loginSuccess: "error" } };
      }
      return {
        ...state,
        ...{
          loginSuccess: "success",
          userInfoByLogin: {
            nickName: payload.nickName,
            gender: payload.gender,
            message: payload.message,
            phoneNumber: payload.phoneNumber,
            uin: payload.uin,
            errorCode: payload.errorCode,
            sessionId: payload.sessionId,
            smallAvatarUrl: payload.smallAvatarUrl,
            originAvatarUrl: payload.originAvatarUrl,
            langCode: payload.langCode
          }
        }
      };
    },
    smsReturn(state, { payload }) {
      return {
        ...state,
        smsReturn: {
          errorCode: payload.errorCode,
          message: payload.message
        }
      };
    },
    resetSmsReturn(state, { payload }) {
      return {
        ...state,
        smsReturn: {}
      };
    },
    setLoginSuccess(state, { payload }) {
      return {
        ...state,
        loginSuccess: payload
      };
    },
    setLogoutSuccess(state, { flag }) {
      return { ...state, logoutSuccess: flag };
    },
    logoutAc(state, { payload }) {
      if (payload.errorCode !== 0) {
        message.warning(payload.message);
        return { ...state, ...{ logoutSuccess: "error" } };
      }
      return {
        ...state,
        ...{ logoutSuccess: "success" }
      };
    }
  },
  effects: {
    //发送短信获取短信验证码
    *sendSms(payload, { select }) {
      const ws = yield select(state => state.Index.ws);
      const data = dataSource[30011006].body;
      const value = {
        phoneNumber: payload.sendSmsParam.phoneNumber,
        langCode: payload.sendSmsParam.countryNum,
        BusinessType: 1
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
      const buf = MessageService.set(parseInt(30011006, 16), data);
      ws.send(buf);
    },
    // 短信验证码登录
    *loginBySms(payload, { select }) {
      const ws = yield select(state => state.Index.ws);
      const data = dataSource[30011010].body;

      const value = {
        phoneNumber: payload.smsParam.phoneNumber,
        // phoneNumber: "15100000000",
        langCode: payload.smsParam.countryNum,
        // langCode: "+86",
        // SmsCode: '2012',
        SmsCode: payload.smsParam.msgCode,
        deviceType: 3,
        imei: "",
        brand: "",
        model: "",
        pushToken: ""
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
      const buf = MessageService.set(parseInt(30011010, 16), data);
      ws.send(buf);
    },
    // 密码登录
    *loginByPsd(payload, { select }) {
      const { psdParam } = payload;
      const ws = yield select(state => state.Index.ws);
      const data = dataSource[30011003].body;
      const value = {
        phoneNumber: psdParam.mobileNumber,
        langCode: psdParam.countryNum,
        password: psdParam.verifyPassword,
        deviceType: 3,
        imei: "",
        brand: "",
        model: "",
        pushToken: ""
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
      const buf = MessageService.set(parseInt(30011003, 16), data);
      ws.send(buf);
    },
    //用户退出登录
    *logout(payload, { select }) {
      const ws = yield select(state => state.Index.ws);
      const data = dataSource[30011004].body;

      const value = {
        appVersion: 0,
        deviceType: 3,
        imei: "",
        brand: "",
        model: ""
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
      const buf = MessageService.set(parseInt(30011004, 16), data);
      ws.send(buf);
    }
  }
};
