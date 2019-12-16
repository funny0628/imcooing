import React, { Component } from "react";
import styles from "./index.less";
import groupchat from "../../../assets/image/menu/groupchat.png";
import Singlechat from "../../../assets/image/menu/Singlechat.png";

import {
  imgurl,
  Handelusername,
  Handelfrienddetai,
  handleRemarkNickName
} from "../../../utils/Basicmethod.js";

import { connect } from "dva";

@connect(
  ({ Friendlist, GetNewMsgList, Todos }) => ({
    friendlist: Friendlist.friendlist,
    // friendid: Todos.friendid,
    touchItem: Todos.touchItem,
    newmsglist: GetNewMsgList.newmsglist
  }),
  dispatch => ({
    friends: () =>
      dispatch({
        type: "Friendlist/friends"
      }),
    Getfriendlist: () =>
      dispatch({
        type: "Friendlist/Getfriendlist"
      }),
    // GetNewMsgList: () =>
    //   dispatch({
    //     type: "GetNewMsgList/Getnewmsglist"
    //   }),
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
    //单聊消息
    getSingleChat: ChatInfo =>
      dispatch({
        type: "Chat/getSingleChat",
        ChatInfoMsg: ChatInfo
      }),
    //获取单聊历史消息
    getSingleChatHistoryMsg: id =>
      dispatch({
        type: "SingleChatHistoryMsg/getSingleChatHistoryMsg",
        dstUin: id
      }),

    //所有单聊消息已达
    SendAllSingleMsgl: id =>
      dispatch({
        type: "AllSingleMsgArrival/SendAllSingleMsgl",
        DstUin: id
      }),
    SETLOCALMESSAGES: payload => {
      dispatch({
        type: "LOCALMESSAGE/SETLOCALMESSAGES",
        payload
      });
    },
    clearMsgDrag: id =>
      dispatch({
        type: "GetNewMsgList/clearMsgDrag",
        id
      })
  })
)
class FriendsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listdata: [],
      friendnum: "",
      togroup: "123456"
    };
    this.friendListUl = React.createRef();
  }

  componentDidMount() {
    const { Getfriendlist, Friendlist } = this.props;
    Getfriendlist();
    this.friendListUl.current.scrollTop = 0;
  }

  static getDerivedStateFromProps(props, state) {
    const { friendlist } = props;
    //处理好友列表数据
    Handelusername(friendlist, state);
    return null;
  }

  //获取动态下标,渲染bgc,---待优化---
  toggleli = item => {
    const { touchItem } = this.props;
    const id = item.uniqueId;
    if (id === touchItem.uniqueId) return;
    // .UnreadMsgCount
    // 会话列表 是否有 当前项
    // const obj = newmsglist.find(x => x.uniqueId === id) || {
    //   UnreadMsgCount: 0
    // };
    // if (obj.UnreadMsgCount > 0) {
    // 有新的消息
    this.props.SETLOCALMESSAGES({ id, list: [] });
    // }

    //保存当前切换的id
    this.props.saveid({
      friendid: id
    });
    this.props.saveTouchItem({ ...item, touchType: "friendList", ChatType: 1 });
    this.props.clearMsgDrag(item.uniqueId);



    const sendInfo = {
      dstUin: id,
      startMsgId: 0,
      count: 100000000
    };

    //获取单聊历史记录
    this.props.getSingleChatHistoryMsg(sendInfo);

    //所有单聊消息已达
    // this.props.SendAllSingleMsgl({ dstUin: id });
  };

  //点击群组
  Togroup = () => {
    this.props.hasgroup();
  };

  //渲染好友列表
  renderAddressBook() {
    const { listdata } = this.state;
    const activeId = this.props.touchItem.uniqueId;
    return listdata.map((liitem, liindex) => (
      <li key={liindex}>
        <ul>
          {liitem.list.length ? (
            <div className={styles.title}>{liitem.letter}</div>
          ) : (
            ""
          )}

          {liitem.list.map((item, index) => (
            <li
              onClick={() => this.toggleli(item)}
              key={index}
              className={activeId === item.uniqueId ? styles.liitem : ""}
            >
              <div className={styles.icon}>
                {item.smallAvatarUrl ? (
                  <img src={imgurl + item.smallAvatarUrl} />
                ) : (
                  <img src={Singlechat} />
                )}
              </div>
              <div className={styles.news}>
                {handleRemarkNickName(item.remark, item.nickName)}
              </div>
            </li>
          ))}
        </ul>
      </li>
    ));
  }

  render() {
    //

    const { friendnum } = this.state;
    return (
      <div ref={this.friendListUl} className={styles.AddressBook}>
        <h3 className={styles.title}>cooing</h3>
        <div className={styles.scroll}>
          {/* 渲染是否有群组 */}
          <div onClick={this.Togroup} className={styles.group}>
            <img src={groupchat} alt="" />
            <span>群聊</span>
          </div>
          {/* 好友列表 */}
          <ul>
            {friendnum > 0 ? (
              this.renderAddressBook()
            ) : (
              <div className={styles.frinum}>暂无好友</div>
            )}
            {friendnum > 0 && (
              <div className={styles.frinum}>{friendnum}位联系人</div>
            )}
          </ul>
        </div>
      </div>
    );
  }
}

export default FriendsList;
