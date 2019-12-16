import React, { Component } from "react";

import group from "../../assets/image/menu/groupicon.png";
import groupchat from "../../assets/image/menu/groupchat.png";
import Singlechat from "../../assets/image/menu/Singlechat.png";
import styles from "./index.less";

import {
  imgurl,
  formatDuring,
  fromatunreadmsgnum,
  handleRemarkNickName
} from "../../utils/Basicmethod.js";

import { connect } from "dva";

@connect(
  ({ GetNewMsgList, Todos, LOCALMESSAGE, QueryFriendRelationByUin }) => ({
    newmsglist: GetNewMsgList.newmsglist,
    LOCALMESSAGES: LOCALMESSAGE.LOCALMESSAGES, //存储的所有的消息列表
    // friendid: Todos.friendid,
    touchItem: Todos.touchItem,
    friendRelation: QueryFriendRelationByUin.friendRelation
  }),
  dispatch => ({
    //获取有未读信息的好友列表
    Getnewmsglist: () =>
      dispatch({
        type: "GetNewMsgList/Getnewmsglist"
      }),
    //点击清除侧边栏消息
    clearMsgDrag: id =>
      dispatch({
        type: "GetNewMsgList/clearMsgDrag",
        id
      }),
    //单聊消息
    getSingleChat: ChatInfo =>
      dispatch({
        type: "Chat/getSingleChat",
        ChatInfoMsg: ChatInfo
      }),
    //大群消息
    getGroupChatList: ChatInfo =>
      dispatch({
        type: "GroupChat/getGroupChatList",
        ChatInfoMsg: ChatInfo
      }),
    //所有单聊消息已达
    SendAllSingleMsgl: id =>
      dispatch({
        type: "AllSingleMsgArrival/SendAllSingleMsgl",
        DstUin: id
      }),
    //所有大群消息已达
    SendAllLargeGroupMsg: id =>
      dispatch({
        type: "AllLargeGroupMsgArrival/SendAllLargeGroupMsg",
        groupUin: id
      }),
    //获取单聊历史消息
    getSingleChatHistoryMsg: id =>
      dispatch({
        type: "SingleChatHistoryMsg/getSingleChatHistoryMsg",
        dstUin: id
      }),
    //获取群聊历史消息
    GetGroupHistoryMsg: id =>
      dispatch({
        type: "LargeGroupHistoryMsg/GetGroupHistoryMsg",
        dstUin: id
      }),
    //获取大群详情
    sendGetLargeGroupDetail: id =>
      dispatch({
        type: "GetLargeGroupDetail/sendGetLargeGroupDetail",
        id
      }),
    getLargeAdminInfo: id =>
      dispatch({
        type: "GetLargeGroupDetail/getLargeAdminInfo",
        id
      }),
    //初始化大群详情
    initGroupState: () =>
      dispatch({
        type: "GetLargeGroupDetail/initState"
      }),
    //保存当前点击id
    saveid: id =>
      dispatch({
        type: "Todos/saveid",
        friendid: id
      }),

    saveTouchItem: item =>
      dispatch({
        type: "Todos/saveTouchItem",
        item
      }),
    SETLOCALMESSAGES: payload => {
      dispatch({
        type: "LOCALMESSAGE/SETLOCALMESSAGES",
        payload
      });
    },
    //查询好友信息
    GetFriendRelation: id =>
      dispatch({
        type: "QueryFriendRelationByUin/GetFriendRelation",
        uin: id
      })
  })
)
class MessageList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: []
    };
  }

  componentDidMount() {
    //拉取有未读消息的会话列表
    // 这里为什么要调？ GetNewMsgList/Getnewmsglist
    this.props.Getnewmsglist();
    //
    //
    //
    // const {newmsglist} = this.props
    // newmsglist.forEach((item,index)=>{
    //   if(item.ChatType===1) {
    //     this.props.GetFriendRelation(item.uniqueId);
    //   }
    // })
  }

  static getDerivedStateFromProps(props, state) {
    return {
      ...state,
      list: props.newmsglist
      // lastName
    };
  }

  toggleli = (item, activeId) => {
    const id = item.uniqueId;
    if (id === activeId) return;

    // 清空当前未读标记
    this.props.clearMsgDrag(id);

    //保存当前切换的id
    this.props.saveid({
      friendid: id
    });
    // 切换选中
    this.props.saveTouchItem({ ...item, touchType: "messageList" });
    //拉取的逻辑
    this.pullManage(item.ChatType, id);
  };

  pullManage(type, id) {
    const { LOCALMESSAGES } = this.props;
    // 本地是否有 缓存
    const isHave = Boolean(LOCALMESSAGES[id] && LOCALMESSAGES[id].length);
    const sendInfo = {
      dstUin: id,
      startMsgId: 0,
      count: 20
    };
    // 是否有新消息
    const isNewMsg = !!(
      this.state.list.find(x => x.uniqueId === id) || { UnreadMsgCount: 0 }
    ).UnreadMsgCount;

    isNewMsg && this.props.SETLOCALMESSAGES({ id, list: [] });

    if (type === 1) {
      //拉取的逻辑
      // this.props.getSingleChat(sendInfo);
      // 获取单聊历史记录 如果没有才拉历史消息  // 逻辑暂时更改成每次都拉
      // !isHave && this.props.getSingleChatHistoryMsg(sendInfo);
      // 有新消息 或者 本地没有缓存 请求 历史记录
      (isNewMsg || !isHave) && this.props.getSingleChatHistoryMsg(sendInfo);

      // 所有的单聊消息已达
      // this.props.SendAllSingleMsgl({ dstUin: id });
    } else if (type === 2) {
      // this.props.getGroupChatList(sendInfo);
      // 获取群聊历史记录  如果没有才拉取历史消息 // 逻辑更改成每次都拉
      // !isHave && this.props.GetGroupHistoryMsg(sendInfo);
      (isNewMsg || !isHave) && this.props.GetGroupHistoryMsg(sendInfo);
      // this.props.GetGroupHistoryMsg(sendInfo);
      //所有的大群消息已达
      // this.props.SendAllLargeGroupMsg({ groupUin: id });
      //初始化大群详情
      this.props.initGroupState();
      //获取大群详情
      this.props.sendGetLargeGroupDetail(id);
      this.props.getLargeAdminInfo(id);
    }
  }

  //处理最后一条信息
  handltext = lastmsg => {
    if (!lastmsg) return;

    try {
      if (lastmsg !== "") {
        const {
          data: { content },
          msgType
        } = lastmsg;
        const types = {
          text: content,
          picture: "[图片]",
          voice: " [语音]",
          // vedio: "[视频]",
          vedio: "不支持的消息类型，可在手机上查看",
          location: "不支持的消息类型，可在手机上查看",
          // system: "[系统]"
          system: (msgType === "system" && content.prompt) || ""
        };
        // 这里暂时做一个查缺的判断
        return types[msgType] || "不支持的消息类型，请联系管理员";
      }
    } catch (error) {}
  };

  rendermaglist() {
    const { list } = this.state;

    const { friendRelation } = this.props;

    /* 
    // 这是为了 点击右侧换名称或者头像了 把右边也变掉
    if (friendRelation.uniqueId) {
      list.forEach(item => {
        if (item.uniqueId === friendRelation.uniqueId) {
          if (item.smallAvatarUrl !== friendRelation.smallAvatarUrl) {
            item.smallAvatarUrl = friendRelation.smallAvatarUrl;
          }
          if (item.nickName !== friendRelation.nickName) {
            item.nickName = friendRelation.nickName;
          }
        }
      });
    } */
    const activeId = this.props.touchItem.uniqueId;

    return (
      <ul>
        {list.map((item, index) => (
          <li
            onClick={() => this.toggleli(item, activeId)}
            key={item.uniqueId}
            className={activeId === item.uniqueId ? styles.liitem : ""}
          >
            {}
            <div className={styles.icon}>
              {item.smallAvatarUrl ? (
                <img src={imgurl + item.smallAvatarUrl} />
              ) : item.ChatType === 1 ? (
                <img src={Singlechat} />
              ) : (
                <img src={groupchat} />
              )}
            </div>
            <div className={styles.news}>
              <div className={styles.nmsg}>
                <div className={styles.nameTitle}>
                  <p className={styles.name}>
                    {handleRemarkNickName(item.remark, item.nickName)}
                  </p>
                  <p className={styles.image}>
                    {item.ChatType === 2 && <img src={group} />}
                  </p>
                </div>
                <p className={styles.lastmsg}>{this.handltext(item.Content)}</p>
              </div>
              <div className={styles.left}>
                <div className={styles.time}>
                  {String(item.SendTime).length === 10
                    ? formatDuring(item.SendTime * 1000, "messageList")
                    : formatDuring(item.SendTime, "messageList")}
                </div>
                {item.UnreadMsgCount > 0 && (
                  <div className={styles.num}>
                    {fromatunreadmsgnum(item.UnreadMsgCount)}
                  </div>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    const list = this.state.list;
    return (
      <div className={styles.MessageList}>
        <h3 className={styles.title}>cooing</h3>
        <div className={styles.scroll}>
          {list.length > 0 ? (
            this.rendermaglist()
          ) : (
            <div className={styles.nomsg}>暂无会话</div>
          )}
        </div>
      </div>
    );
  }
}
export default MessageList;
