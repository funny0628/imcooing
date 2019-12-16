import dataSource from "../dataSource";
import MessageService from "../services/Message.service";
import { translateMsgList } from "../utils/Basicmethod";
import { message } from "antd";
export default {
  namespace: "GetLargeGroupDetail",
  state: {
    GROUPDETAIL: {
      // 暂时的标示如果这里的标示是true 页面就不做任何渲染改变
      // 之后可以用should 生命周期改变
      INITFLAG: true
    }, // 大群详情
    GroupErrorDetail: {},
    adminInfo: {}
  },
  reducers: {
    // 获取大群详情
    LargeGroupDetail(state, { payload }) {
      if (![0, 55003].includes(payload.errorCode)) {
        message.warning(payload.message || "请求大群详情错误");
        return {
          ...{
            GROUPDETAIL: { INITFLAG: true },
            GroupErrorDetail: {}
          }
        };
      }
      const {
        errorCode, // 特殊情况如果是55003的时候就代表大群解散了
        message, // 如果是55003 那么群就解散了,就用这个message设置
        TotalCount, // 成员数量
        ViewProfileChatSet, // 1 表示允许普通成员查看资料，私聊
        banned, // 1表示允许普通成员聊天 （正常管理员所有的都允许聊天）
        belongToUin, // 金主归属的业务员,
        groupIcon, // 大群头像
        groupTitle, // 大群名称
        groupUin, // 大群唯一id
        isUnTitle, // =1表示群没有命名
        joinTime, // 加入大群的时间
        memberType, // =1是群主；=2表示管理员；=3表示普通群成员;=4表示游客；
        memberBanned, // 为1 表示该成员没有被禁言
        // state, // 0个人对群设置消息免打扰关闭， =1个人对群设置消息免打扰开启
        uin, // 当前用户的id 暂时不用
        uinType // =0表示机器人；=1表示非金主；=2表示金主；=3表示业务员" 暂时不用
      } = payload;

      const GROUPDETAIL = {
        memberType,
        INITFLAG: false,
        message,
        errorCode,
        TotalCount,
        ViewProfileChatSet,
        banned,
        belongToUin,
        groupIcon,
        groupTitle,
        uniqueId: groupUin,
        isUnTitle,
        joinTime,
        memberBanned,
        uin,
        uinType,
        LargeGroupMemInfo: translateMsgList(payload.LargeGroupMemInfo, true)
      };
      console.log("获取到的群详情", GROUPDETAIL, payload);
      let GroupErrorDetail = {};
      // 55003 代表群主已经解散该群 , 这个时候显示的信息是用户显示的信息
      if (errorCode === 55003) {
        GroupErrorDetail = {
          uniqueId: groupUin,
          message,
          errorCode
        };
      }

      return {
        ...state,
        ...{
          GROUPDETAIL,
          GroupErrorDetail
        }
      };
    },
    //被移除群的关键字
    removeEvenKeyWorld(state, payload) {
      return {
        ...state,
        removeKey: payload.key
      };
    },
    //初始化大群详情所有的状态值
    initState(state, payload) {
      return {
        GROUPDETAIL: {
          INITFLAG: true
        },
        GroupErrorDetail: {}
      };
    },
    setAdminInfo(state, { payload }) {
      console.log(JSON.parse(JSON.stringify(payload)));
      const adminList = translateMsgList(payload.adminList);
      payload.adminList = adminList;
      console.log(payload, "拿到的大群群主或者管理员信息");
      return { ...state, adminInfo: payload };
    }
  },
  effects: {
    // 获取大群详情
    *sendGetLargeGroupDetail(payload, { select }) {
      //
      const ws = yield select(state => state.Index.ws);
      const data = dataSource["7000100f"].body;
      const res = {
        groupUin: payload.id
      };
      data.forEach(item => {
        item.value = res[item.id];
      });
      const buf = MessageService.set(parseInt("7000100f", 16), data);
      ws.send(buf);
    },
    // 获取大群管理员和群主信息
    *getLargeAdminInfo(payload, { select }) {
      //
      const ws = yield select(state => state.Index.ws);
      const data = dataSource["7000101C"].body;
      const res = {
        groupUin: payload.id
      };
      data.forEach(item => {
        item.value = res[item.id];
      });
      const buf = MessageService.set(parseInt("7000101C", 16), data);
      ws.send(buf);
    }
  }
};
