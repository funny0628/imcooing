import React, { Component } from "react";
import Singlechat from "../../../assets/image/menu/Singlechat.png";
import groupchat from "../../../assets/image/menu/groupchat.png";
import styles from "./index.less";
import back from "../../../assets/image/menu/back.png";
import { imgurl } from "../../../utils/Basicmethod.js";

import { connect } from "dva";

@connect(
  ({ Grouplist, Todos, GetLargeGroupDetail, LOCALMESSAGE, GetNewMsgList }) => ({
    grouplist: Grouplist.grouplist,
    touchItem: Todos.touchItem,
    GROUPDETAIL: GetLargeGroupDetail.GROUPDETAIL,
    LOCALMESSAGES: LOCALMESSAGE.LOCALMESSAGES, //存储的所有的消息列表
    newmsglist: GetNewMsgList.newmsglist
  }),
  dispatch => ({
    groups: () =>
      dispatch({
        type: "Grouplist/groups"
      }),
    getgrouplist: () =>
      dispatch({
        type: "Grouplist/getgrouplist"
      }),
    // 选中group项目
    selectGroupItem: payload =>
      dispatch({
        type: "Grouplist/selectGroupItem",
        payload
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
    //获取群聊历史消息
    GetGroupHistoryMsg: id =>
      dispatch({
        type: "LargeGroupHistoryMsg/GetGroupHistoryMsg",
        dstUin: id
      }),
    //大群消息
    getGroupChatList: ChatInfo =>
      dispatch({
        type: "GroupChat/getGroupChatList",
        ChatInfoMsg: ChatInfo
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
    initState: () =>
      dispatch({
        type: "GetLargeGroupDetail/initState"
      }),
    clearMsgDrag: id =>
      dispatch({
        type: "GetNewMsgList/clearMsgDrag",
        id
      }),
    SETLOCALMESSAGES: payload => {
      dispatch({
        type: "LOCALMESSAGE/SETLOCALMESSAGES",
        payload
      });
    }
  })
)
class Group extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      groupnum: 0,
      forgroup: ""
    };
  }
  componentDidMount() {
    //
    const { getgrouplist, Friendlist } = this.props;

    getgrouplist();
  }
  static getDerivedStateFromProps(props, state) {
    const { grouplist } = props;
    return {
      ...state,
      list: grouplist,
      groupnum: grouplist.length
    };
  }

  //点击群组
  changetitle = () => {
    this.props.group();
  };

  changebgc = (id, item) => {
    this.props.saveTouchItem({
      ...item,
      touchType: "groupList",
      ChatType: 2,
      dialogTitle: item.groupTitle,
      nickName: item.groupTitle,
      smallAvatarUrl: item.groupIcon
    });

    this.props.clearMsgDrag(item.uniqueId);


    //保存当前切换的id
    this.props.saveid({
      friendid: id
    });

    //发送群聊
    this.props.getGroupChatList({
      dstUin: id,
      startMsgId: 0,
      count: 20
    });
    // 获取群聊历史
    const { LOCALMESSAGES } = this.props;

    const isHave = Boolean(LOCALMESSAGES[id] && LOCALMESSAGES[id].length);

    const { newmsglist } = this.props;
    const obj = newmsglist.find(x => x.uniqueId === id) || {
      UnreadMsgCount: 0
    };
    if (obj.UnreadMsgCount > 0) {
      this.props.SETLOCALMESSAGES({ id, list: [] });
    }
    if (obj.UnreadMsgCount > 0 || !isHave) {
      //
      // 有新的消息  需要拉取 历史记录    或者本地没有存储
      const sendInfo = {
        dstUin: id,
        startMsgId: 0,
        count: 20
      };
      this.props.GetGroupHistoryMsg(sendInfo);
    }
    this.props.initState();
    //获取大群详情
    this.props.sendGetLargeGroupDetail(id);
    this.props.getLargeAdminInfo(id);
  };

  //群组列表
  rendergroup() {
    const { list } = this.state;
    const activeId = this.props.touchItem.uniqueId;
    return (
      <div className={styles.scroll}>
        <ul>
          {list.map((item, index) => (
            <li
              key={index}
              onClick={() => this.changebgc(item.groupUin, item)}
              className={activeId === item.groupUin ? styles.liitem : ""}
            >
              <img src={item.groupIcon ? imgurl + item.groupIcon : groupchat} />
              <div className={styles.left}>{item.groupTitle}</div>
            </li>
          ))}
        </ul>
      </div>
      // </div>
    );
  }

  render() {
    const { groupnum } = this.state;
    return (
      <>
        <div className={styles.group}>
          <h3 className={styles.title}>
            <div onClick={this.changetitle}>
              <span>
                <img src={back} />
                群组
              </span>
            </div>
          </h3>
          {groupnum > 0 ? (
            this.rendergroup()
          ) : (
            <div className={styles.frinum}>暂无群聊</div>
          )}
        </div>
      </>
    );
  }
}

export default Group;
