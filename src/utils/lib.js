import { Modal } from "antd";
//生成对话信息的唯一 id的库
import uuid from "uuidjs";

export const imgPre = `https://cooing.oss-cn-beijing.aliyuncs.com/`;

// session 所占用的最大空间是4;
export const sessionMax = 4;

// 文件主要放一些关于逻辑上的小型封装
export const local = (key, value) => {
  if (value) {
    return window.localStorage.setItem(key, value);
  } else {
    return window.localStorage.getItem(key);
  }
};

export const removeLocal = key => {
  if (key) {
    if (typeof key === "string") window.localStorage.removeItem(key);
    if (Array.isArray(key))
      key.forEach(x => {
        window.localStorage.removeItem(x);
      });
  } else {
    return window.localStorage.clear();
  }
};

export const session = (key, value) => {
  if (value) {
    return window.sessionStorage.setItem(key, value);
  } else {
    return window.sessionStorage.getItem(key);
  }
};

export const removeSession = key => {
  if (key) {
    if (typeof key === "string") window.sessionStorage.removeItem(key);
    if (Array.isArray(key))
      key.forEach(x => {
        window.sessionStorage.removeItem(x);
      });
  } else {
    return window.sessionStorage.clear();
  }
};
// 注意这里深拷贝不支持函数等类型的拷贝。
export const deepCopy = s => {
  return JSON.parse(JSON.stringify(s));
};

export const uuidGenerate = () => {
  return uuid.generate();
};

export const getSessionSize = isM => {
  const len = JSON.stringify(sessionStorage).length;
  return isM ? (len / 1024 / 1024).toFixed(5) : len;
};

let setFlag = 1;
export const sessionListen = () => {
  if (getSessionSize(true) > sessionMax) {
    if (setFlag !== 1) return;
    Modal.confirm({
      title: "温馨提示",
      content: "系统检测到你本地聊天记录存储量过大,需要现在清除吗？",
      okText: "确认",
      cancelText: "稍后清除",
      onOk() {
        removeSession("COOING_LOCALMESSAGES");
        window.location.reload();
      },
      onCancel() {
        setFlag = 1;
      }
    });
    setFlag++;
    return true;
  }
};

// 获取数组的最后一项
export const getLastArr = arr => {
  if (!Array.isArray(arr) || arr.length === 0) return undefined;
  else return arr[arr.length - 1];
};



export const removeDuplicate = (arr)=>{
  const result = [];
  const resultId = [];
  arr.forEach(msg=>{
    if(!resultId.includes(msg.msgId)){
      result.push(msg);
      resultId.push(msg.msgId);
    }
  })
  return result;
}