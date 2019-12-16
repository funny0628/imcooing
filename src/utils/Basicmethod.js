import pinyin from "js-pinyin";
import format from "./msg.format.js";
import { session } from "./lib.js";

import dayjs from "dayjs";
// import { config } from 'rx-core';

//capitalLetter
export const imgurl = "https://cooing.oss-cn-beijing.aliyuncs.com/";

//处理所有的未读信息数
export function Handelunreadmsgnum(list) {
  let totalnum = 0;
  for (var i = 0; i < list.length; i++) {
    totalnum += list[i].UnreadMsgCount;
  }
  return totalnum;
}

//处理好友列表
export function Handelusername(friendlist, state) {
  let list = [];
  list["#"] = [];
  for (var i = 0; i < friendlist.length; i++) {
    let item = friendlist[i];
    let s = item.nickName;
    let char = s.slice(0, 1);
    let regs = /^[A-Z-a-z]$/; //判断是拼音
    let _regs = /[\u4E00-\u9FA5]/i; //判断是中文
    if (regs.test(char)) {
      //字母的首字母转成大写
      let pinyinname = format.capitalLetter(char);
      let letter = pinyinname.slice(0, 1);

      //判断在list中是否存在
      if (!(letter in list)) {
        list[letter] = [];
      }

      list[letter].push(item);
    } else if (_regs.test(char)) {
      //中文转成首字母大写的字母
      const pinyinname = pinyin.getCamelChars(char);
      let letter = pinyinname.slice(0, 1);
      // 判断在list中是否存在
      if (!(letter in list)) {
        list[letter] = [];
      }
      list[letter].push(item);
    } else {
      list["#"].push(item);
    }
  }

  let resault = [];
  for (let key in list) {
    resault.push({
      letter: key,
      list: list[key]
    });
  }
  resault.sort((a, b) => {
    return a.letter.charCodeAt(0) - b.letter.charCodeAt(0);
  });

  let last_arr = resault[0];
  resault.splice(0, 1);
  resault.push(last_arr);

  state.listdata = resault;

  state.friendnum = friendlist.length;
}

//处理时间为时分秒
export function formatDuring(mss, type) {
  //当前时间当天的零时(开始)时间戳
  const start = dayjs()
    .startOf("date")
    .valueOf();
  //当前时间下本周的第一天时间戳
  const currentWeekStart = dayjs()
    .startOf("week")
    .valueOf();
  //当前时间的时间戳
  const now = new Date().getTime();
  //当前年
  const currentYear = new Date().getFullYear();
  //当前时间前一天的零时(开始)时间戳
  const yesterdayStart = start - 24 * 60 * 60 * 1000;
  //传入的时间戳的年月日时分秒
  const importTime = dayjs(mss);
  // 年 ：
  const Y = importTime.year();
  // 月 ：
  const M =
    importTime.month() + 1 < 10
      ? "0" + (importTime.month() + 1)
      : importTime.month() + 1;
  // 日 ：
  const D =
    importTime.date() < 10 ? "0" + importTime.date() : importTime.date();
  // 星期 ：
  const week = importTime.day();
  // 时 ：
  const h =
    importTime.hour() < 10 ? "0" + importTime.hour() : importTime.hour();
  // 分 ：
  const m =
    importTime.minute() < 10 ? "0" + importTime.minute() : importTime.minute();
  // 秒 ：
  const s =
    importTime.second() < 10 ? "0" + importTime.second() : importTime.second();
  //传入的时间戳与当前时间戳的差值
  const diff = now - mss;
  if (diff < 24 * 60 * 60 * 1000) {
    if (mss >= start) {
      return h + ":" + m;
    } else {
      return "昨天" + " " + h + ":" + m;
    }
  } else if (diff >= 24 * 60 * 60 * 1000 && diff <= 7 * 24 * 60 * 60 * 1000) {
    if (mss >= yesterdayStart && mss <= start) {
      return "昨天" + " " + h + ":" + m;
    } else {
      if (mss >= currentWeekStart) {
        return "周" + "日一二三四五六".charAt(week) + " " + h + ":" + m;
      } else {
        if (type === "messageList") {
          return M + "月" + D + "日";
        } else if (type === "chatPage") {
          return M + "月" + D + "日" + " " + h + ":" + m;
        }
      }
    }
  } else if (diff >= 7 * 24 * 60 * 60 * 1000) {
    if (Y === currentYear) {
      if (type === "messageList") {
        return M + "月" + D + "日";
      } else if (type === "chatPage") {
        return M + "月" + D + "日" + " " + h + ":" + m;
      }
    } else {
      if (type === "messageList") {
        return Y + "年";
      } else if (type === "chatPage") {
        return Y + "年" + M + "月" + D + "日" + " " + h + ":" + m;
      }
    }
  }
}
//获取数组中指定差值的索引
export function getIndex(arr, diff) {
  let flag = 0; //标记索引位置的标记
  const res = []; //定义一个空数组保存得到的索引
  res.push(0); //以数组的第一项索引作为基准
  for (let i = 0; i < arr.length; i++) {
    const item = arr[i];
    if (item - diff > arr[flag]) {
      flag = i;
      res.push(i);
    }
  }
  return res;
}

//处理具体人员信息
export function Handelfrienddetai(list, msgid) {
  const res = list.find(item => item.id === msgid);
  return res.value;
}

//处理未读消息数量的方法
export function fromatunreadmsgnum(unreadnum) {
  if (unreadnum > 1000) {
    const num = unreadnum / 1000;
    var newnum = Math.round(num * 100) / 100;
    return newnum + "k";
  } else {
    return unreadnum;
  }
}

//处理message 对话框的数据
export function fromatMessage(currentUin, ChatList) {
  //处理聊天的消息格式
  let ChatMsgList = [];
  let curContent = [];
  if (ChatList) {
    ChatList.forEach(item => {
      let ChatMsgObj = {};
      item.forEach(childrenItem => {
        const itemid = childrenItem.id;
        const itemvalue = childrenItem.value;
        if (itemid === "Content") {
          ChatMsgObj[itemid] = JSON.parse(itemvalue);
        } else {
          ChatMsgObj[itemid] = itemvalue;
        }
      });
      ChatMsgList.push(ChatMsgObj);
    });
    session(currentUin, JSON.stringify(ChatMsgList));
    const historyChatlist = session(currentUin);
    return {
      data: JSON.parse(historyChatlist)
    };
  } else {
    const historyChatlist = session(currentUin);
    if (!historyChatlist) {
      return {
        data: []
      };
    } else {
      return {
        data: JSON.parse(historyChatlist)
      };
    }
  }
}

// 将得到的消息newMsgList friendList转换成我们自己想要的类型。
export const translateMsgList = (msgList, needId = false) => {
  if (!msgList || !msgList.length) return [];
  return msgList.map(item => {
    const re = {};
    //唯一ID,代表了各种信息
    needId ? (re.uniqueId = item[0].value) : "";
    // ChatType 这里代表了1个人   2 群聊
    item.forEach(x => {
      if (!([x.id] in re)) re[x.id] = x.value;
      else return;
    });
    try {
      re.Content ? (re.Content = JSON.parse(re.Content)) : "";
    } catch (error) {
      re.Content
        ? (re.Content = { data: { content: "" }, msgType: "text" })
        : "";
    }

    if (!re.nickName) re.nickName = re.nickName || re.dialogTitle;
    // delete re.dstUin;
    return re;
  });
};

// 将好友列表转换成自己想要的类型
export const handlerList = (
  type,
  singChatList,
  GroupChatMsgList,
  singlehistoryChatlist,
  grouphistorylist
) => {
  if (type === 1) {
    return (singlehistoryChatlist || []).concat(singChatList || []);
  } else {
    return (grouphistorylist || []).concat(GroupChatMsgList || []);
  }
};

export const handleRemarkNickName = (remark = "", nickName) => {
  return remark || nickName;
};
