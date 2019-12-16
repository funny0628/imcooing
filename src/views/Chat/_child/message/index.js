import React, { Component } from "react";
import styles from "./index.less";
import msgicon from "../../../../assets/image/menu/msgicon.png";
import {
  session,
  deepCopy,
  getLastArr,
  removeDuplicate
} from "../../../../utils/lib";
// import { message } from 'antd';
import { connect } from "dva";
import Dialog from "./dialog";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import {
  imgurl,
  getIndex,
  handleRemarkNickName
} from "../../../../utils/Basicmethod";
import MaxImg from "./MaxImg";
import PopupUserInfo from "./_child/popupUserInfo";

let ScrollMessageScrollHeight = 0;
const ScrollMessageHeight = 500;

@connect(
  ({
    GetNewMsgList,
    Friendlist,
    Grouplist,
    Todos,
    Chat,
    GroupChat,
    PushHasMsg,
    PushHasGreetMsg,
    SingleChatHistoryMsg,
    LargeGroupHistoryMsg,
    LOCALMESSAGE,
    GetLargeGroupDetail,
    QueryFriendRelationByUin
  }) => ({
    newmsglist: GetNewMsgList.newmsglist,
    friendid: Todos.friendid,
    touchItem: Todos.touchItem,
    singChatList: Chat.singChatList,
    GroupChatMsgList: GroupChat.GroupChatMsgList,
    friendlist: Friendlist.friendlist,
    grouplist: Grouplist.grouplist,
    hasPushNewMag: PushHasMsg.hasPushNewMag, //查询是否有推送来的消息
    singChatHistoryList: SingleChatHistoryMsg.singChatHistoryList,
    GroupHistoryMsg: LargeGroupHistoryMsg.GroupHistoryMsg,
    hasPushGreetMag: PushHasGreetMsg.hasPushGreetMag,
    LOCALMESSAGES: LOCALMESSAGE.LOCALMESSAGES,
    pullMsg: Todos.pullMsg,
    //个人信息弹框是否展示   群聊个人信息是否展示
    maskKeyword: Todos.maskKeyword,
    //禁止私聊
    // NoPrivateChat: Todos.NoPrivateChat,
    //通过uin或手机号查询是否是好友关系-->获取用户的信息
    // friendRelation: QueryFriendRelationByUin.friendRelation,
    friendRelation: {},
    // errorCode: QueryFriendRelationByUin.errorCode,
    uin: QueryFriendRelationByUin.uin,
    // 群主 管理员信息 用来判断是否可以私聊
    adminInfo: GetLargeGroupDetail.adminInfo
  }),
  dispatch => ({
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
    // 大群消息已经到达 可以传idList的
    SendLargeGroupMsgArrive: payload =>
      dispatch({
        type: "LargeGroupMsgArrival/SendLargeGroupMsgArrive",
        payload
      }),
    sendReceiptOk: payload =>
      dispatch({
        type: "AeceiptMsgArrival/sendReceiptOk",
        payload
      }),
    //单聊消息
    getSingleChat: () =>
      dispatch({
        type: "Chat/getSingleChat"
      }),
    sendMsg: sendCurrentMsg =>
      dispatch({
        type: "SendMsg/sendMsg",
        sendCurrentMsg
      }),
    //发送大群消息
    SendLargeGroup: sendCurrentMsg =>
      dispatch({
        type: "SendLargeGroupMsg/SendLargeGroup",
        sendCurrentMsg
      }),
    //大群消息
    getGroupChatList: () =>
      dispatch({
        type: "GroupChat/getGroupChatList"
      }),
    // 获取点击li保存的id
    saveid: id =>
      dispatch({
        type: "Todos/saveid",
        friendid: id
      }),
    //获取点击img保存的传递是否要显示大图的关键字
    checkImgShow: isShow =>
      dispatch({
        type: "Todos/checkImgShow",
        imgShow: isShow
      }),
    SETLOCALMESSAGES: payload =>
      dispatch({
        type: "LOCALMESSAGE/SETLOCALMESSAGES",
        payload
      }),
    clearSingleChat: () =>
      dispatch({
        type: "Chat/clearSingleChat"
      }),
    clearSingleChatHistoryMsg: () =>
      dispatch({
        type: "SingleChatHistoryMsg/clearSingleChatHistoryMsg"
      }),
    clearGroupChatList: () =>
      dispatch({
        type: "GroupChat/clearGroupChatList"
      }),
    clearGroupHistoryMsg: () =>
      dispatch({
        type: "LargeGroupHistoryMsg/clearGroupHistoryMsg"
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
    //切换选中
    saveTouchItem: item =>
      dispatch({
        type: "Todos/saveTouchItem",
        item
      }),
    // 添加newMsglist项目
    addNewMsgList: item =>
      dispatch({
        type: "GetNewMsgList/addNewMsgList",
        item
      }),
    // 修改sidemenu 的默认选中
    changeMenuTilte: () =>
      dispatch({
        type: "Todos/changeMenuTilte"
      }),
    getSingleChatHistoryMsg: payload => {
      dispatch({
        type: "SingleChatHistoryMsg/getSingleChatHistoryMsg",
        dstUin: payload
      });
    },
    GetGroupHistoryMsg: payload => {
      dispatch({
        type: "LargeGroupHistoryMsg/GetGroupHistoryMsg",
        dstUin: payload
      });
    },
    clearMsgDrag: id =>
      dispatch({
        type: "GetNewMsgList/clearMsgDrag",
        id
      }),
    checkeLastMessage: lastMessageType =>
      dispatch({
        type: "Todos/checkeLastMessage",
        lastMessageType
      }),
    //查询好友信息
    GetFriendRelation: id =>
      dispatch({
        type: "QueryFriendRelationByUin/GetFriendRelation",
        uin: id
      })
  })
)
class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // friend: false,
      //好友的头像
      fsmalAvaUrl: "",
      // 渲染title
      titlemsg: false,
      //渲染删除信息
      deletemsg: "",
      //渲染user详细信息
      showUserDetailAR: false,
      // 展示不让查看好友信息
      showNoSeeUserInfo: false,
      showUserDetailId: null,
      // userShow: false,
      uniqueId: "",
      //点击图片显示大图的关键字
      showImg: null,
      SetSaveLOCAL: this.SetSaveLOCAL.bind(this),
      clearAllChat: this.clearAllChat.bind(this),
      messageScrollBottom: this.messageScrollBottom.bind(this),
      //不允许查看好友详情的弹框

      // NoCheck:false

      loading: false,
      notMore: false,
      list: [],

      maxImgSrc: "",
      showMaxImg: false
    };
  }

  //index.js
  static getDerivedStateFromProps(props, state) {
    const {
      singChatList, // 单聊
      GroupChatMsgList, // 群聊新消息
      singChatHistoryList,
      GroupHistoryMsg,
      LOCALMESSAGES
    } = props;

    const { uniqueId, nickName, ChatType, dialogTitle } = props.touchItem;
    // 这里是怎么设置LOCALMESSAGES了
    const sins = Object.keys(singChatHistoryList).length;
    const grous = Object.keys(GroupHistoryMsg).length;
    // 这块逻辑等待修改，这块不管是不是当前的页面都要塞进去了
    if (ChatType === 1 && (singChatList.length || sins)) {
      state.SetSaveLOCAL(
        uniqueId,
        {
          list: singChatList,
          history: singChatHistoryList,
          LOCALMESSAGES
        },
        state.clearAllChat,
        ChatType
      );
    }

    if (ChatType === 2 && (GroupChatMsgList.length || grous)) {
      state.SetSaveLOCAL(
        uniqueId,
        {
          list: GroupChatMsgList,
          history: GroupHistoryMsg,
          LOCALMESSAGES
        },
        state.clearAllChat,
        ChatType
      );
    }

    if (uniqueId !== state.uniqueId) state.messageScrollBottom();

    if (ChatType === 1)
      return {
        ...state,
        // 头部title
        Title: nickName,
        uniqueId,
        list: props.newmsglist
      };
    else if (ChatType === 2)
      return {
        ...state,
        // 头部title
        Title: dialogTitle,
        uniqueId,
        list: props.newmsglist
      };
  }
  SetSaveLOCAL(uniqueId, body, cb, type) {
    // list数组 history 对象
    const { list, history, LOCALMESSAGES } = body;
    const _local = deepCopy(LOCALMESSAGES[uniqueId] || []);

    // 历史
    if (history[uniqueId] && history[uniqueId].length) {
      const historyList = (history[uniqueId] || []).concat(_local);
      this.props.SETLOCALMESSAGES({
        id: uniqueId,
        list: historyList
      });
      // 设置 左侧newMsgList
      const msgIdList = [historyList[historyList.length - 1]].map(
        msg => msg.msgId
      );
      this.msgArrive(uniqueId, type, msgIdList);
    }

    // 新消息如果是 个人的就取src 如果是群的就取dst
    if (list && list.length) {
      // 注意这里的新消息一定是有的，所以这里
      const newSrcId = type === 1 ? list[0].srcUin : list[0].dstUin;
      // 仅仅为了去除重复
      const newList = removeDuplicate(_local.concat(list));
      this.props.SETLOCALMESSAGES({
        id: newSrcId,
        list: newList
      });
      // 设置 左侧newMsgList 这里新的消息不再需要设置newMsgList 这里直接走了默认
      // this.setNewMsgList(getLastArr(newList));

      // 新消息特别处理,比如改了头像啊什么的
      this.specailMessage(list, uniqueId, type);

      // 新消息已达
      const msgIdList = list.map(msg => msg.msgId);
      this.msgArrive(newSrcId, type, msgIdList);
    }

    // 清除 传入
    type === 1 && list.length && cb(1, true);
    type === 2 && list.length && cb(3, true);
    type === 1 && Object.keys(history).length && cb(2, !_local.length);
    type === 2 && Object.keys(history).length && cb(4, !_local.length);
  }

  specailMessage(list, uniqueId, type) {
    // 如果不是系统消息 暂时新消息一条一条的推送,后面可以改
    if (type !== 2) return;
    // remove_large_group_admin.删除大群管理员通知
    // update_large_group_title_or_icon 修改大群名称或头像通知
    // update_large_group_view_profile_chat_set.大群更新查看资料、 私聊设置通知
    // update_large_group_member_say 大群成员被禁言通知
    // banned_large_group_mem 大群更新全体禁言设置通知
    const specailMessageArr = [
      "remove_large_group_admin",
      "update_large_group_view_profile_chat_set",
      "update_large_group_member_say",
      "update_large_group_title_or_icon",
      "banned_large_group_mem",
      "remove_large_group_mem", // 群成员减少
      "add_large_group_mem", // 群成员增加
      "quit_large_group" // 群成员解散
    ];
    console.log(list, "99999999999");
    const systems = list.map(msg => msg.Content && msg.Content.data.pushType);
    if (systems.some(pushType => specailMessageArr.includes(pushType))) {
      // 发送请求群聊详情的东西
      this.props.sendGetLargeGroupDetail(uniqueId);
      this.props.getLargeAdminInfo(uniqueId);
    }
  }

  setNewMsgList(item) {
    const { touchItem } = this.props;
    const {
      uniqueId,
      smallAvatarUrl,
      ChatType,
      uinType,
      dialogTitle
    } = touchItem;
    const { Content, SendTime } = item;
    // 群聊单独做处理
    let _content = deepCopy(Content);

    // content: ; content: {groupUin: 100000003, prompt: "跋山涉水开启全员禁言"}

    const pro = {
      uniqueId: uniqueId,
      dstUin: uniqueId,
      dialogTitle,
      smallAvatarUrl,
      ChatType,
      uinType, //  暂时字段
      belongToUin: 0, // 暂时字段
      UnreadMsgCount: 0,
      msgId: item.msgId,
      srcUin: item.srcUin,
      Content: _content,
      SendTime: `${SendTime}`.length > 10 ? SendTime : SendTime * 1000,
      nickName: touchItem.nickName
    };
    const isInNewMsgList = this.props.newmsglist.some(
      item => item.uniqueId === uniqueId
    );
    isInNewMsgList && this.props.addNewMsgList(pro);
  }

  msgArrive(id, type, msgIdList) {
    type === 1 && this.props.sendReceiptOk({ dstUin: id, msgIdList });
    type === 2 &&
      this.props.SendLargeGroupMsgArrive({ groupUin: id, msgIdList });
  }

  clearAllChat = (type, isScroll = false) => {
    type === 1 && this.props.clearSingleChat();
    type === 2 && this.props.clearSingleChatHistoryMsg();
    type === 3 && this.props.clearGroupChatList();
    type === 4 && this.props.clearGroupHistoryMsg();
    // 这个滚到底部先加上去，之后看情况
    isScroll && this.messageScrollBottom();
  };

  reSendMsg = item => {
    const { SETLOCALMESSAGES, LOCALMESSAGES, touchItem } = this.props;
    const body = {
      dstUin: touchItem.uniqueId,
      srcUin: +session("uin"),
      localId: +(
        `${new Date().getTime()}`.substr(10).padStart(4, 1) + touchItem.uniqueId
      ),
      Content: item.Content
    };

    const { ChatType } = touchItem;
    // 单聊和群聊发送各自的消息

    ChatType === 1 ? this.props.sendMsg(body) : this.props.SendLargeGroup(body);

    //删除当前item
    const _nowList = LOCALMESSAGES[touchItem.uniqueId];
    const index = _nowList.findIndex(x => x.localId === item.localId);
    _nowList.splice(index, 1);
    SETLOCALMESSAGES({
      id: touchItem.uniqueId,
      list: _nowList
    });

    this.props.addLocal(body, this.props.touchItem);
    this.messageScrollBottom();
  };

  //点击三个小点
  opentitlemsg = () => {
    this.setState({
      //渲染title 的信息框
      titlemsg: !this.state.titlemsg
    });
  };

  changeshowUserDetailAR = (flag, id) => {
    this.setState({
      showUserDetailAR: flag,
      showUserDetailId: id,
      titlemsg: false
    });
  };

  //点击查看个人/群组详细信息/如果这里没有选中就提示
  showFriendInfo = id => {
    // id 当前点的id
    // 展示 好友信息
    const { ChatType } = this.props.touchItem;
    if (ChatType === 1) {
      this.changeshowUserDetailAR(true, id);
      return;
    }
    // isPrivateChat 这里是判断了 自己能不能私聊
    // 首先 判断 isPrivateChat  是否有设置禁止私聊
    const { isPrivateChat, adminInfo } = this.props;
    if (!isPrivateChat) {
      // 还需要在判断 身份   群主、管理员可以与  群主、管理员、普通成员 私聊
      // 普通成员 可以和 群主、管理员 私聊

      // 是否有读取个人信息 的权限
      // const myId = +session("uin");
      const isReadUserInfo =
        adminInfo.uin === id || adminInfo.adminList.find(v => v.uin === id);
      if (isReadUserInfo) {
        this.changeshowUserDetailAR(true, id);
        return;
      }

      // 显示禁止私聊 提示
      this.setState({
        showNoSeeUserInfo: true
      });
      return;
    }
    this.changeshowUserDetailAR(true, id);
  };

  //点击了发送消息
  closesend = () => {
    this.setState({
      showUserDetailAR: false,
      titlemsg: false,
      showNoSeeUserInfo: false
    });
  };

  //进入当前点击的好友的聊天界面
  enterChat(userInfo) {
    const { newmsglist } = this.props;
    const { uniqueId } = userInfo;
    const type = 1;

    //切换选中
    this.props.saveTouchItem({
      ...userInfo,
      touchType: "friendList",
      ChatType: type
    });

    this.props.clearMsgDrag(uniqueId);

    //修改sideMenu的选中
    // this.props.changeMenuTilte();

    //添加到对话列表
    // if (newmsglist.every(msg => msg.uniqueId !== uniqueId)) {
    //   this.pushNewMsgList();
    // }

    // 拉取新消息
    this.pullManage(type, uniqueId);
  }

  pullManage(type, id) {
    const { LOCALMESSAGES, newmsglist } = this.props;
    // 本地是否有 缓存
    const isHave = Boolean(LOCALMESSAGES[id] && LOCALMESSAGES[id].length);
    const sendInfo = {
      dstUin: id,
      startMsgId: 0,
      count: 20
    };
    // 是否有新消息
    const isNewMsg = !!(
      newmsglist.find(x => x.uniqueId === id) || { UnreadMsgCount: 0 }
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
    }
  }

  //聊天列表添加一项
  pushNewMsgList(id) {
    const { friendRelation } = this.props;
    const item = {
      ChatType: 1,
      SendTime: new Date().getTime(),
      UnreadMsgCount: 0,
      belongToUin: 0,
      nickName: friendRelation.nickName,
      groupTitle: friendRelation.groupTitle || "",
      dialogTitle: friendRelation.nickName,
      smallAvatarUrl: friendRelation.smallAvatarUrl,
      srcUin: friendRelation.uniqueId,
      uinType: 1,
      uniqueId: friendRelation.uniqueId
    };

    this.props.addNewMsgList(item);
  }

  //点击了其他位置关闭弹窗
  close = () => {
    console.log("close");
    this.props.informatclose(); // 不知道这个函数干嘛  好像没有用 但是我不敢删
    this.setState({
      //渲染title 的信息框
      titlemsg: false,
      showUserDetailAR: false,
      showNoSeeUserInfo: false
    });
  };

  //群有被设置禁言,不可以查看
  noCheckInfo = () => {};
  showUserInfo(showUserDetailAR) {
    const { ChatType } = this.props.touchItem;
    const id = this.state.showUserDetailId;
    return (
      <CSSTransition in={showUserDetailAR} timeout={100} classNames="fade">
        <PopupUserInfo
          uniqueId={id}
          ChatType={ChatType}
          clsoeSingle={this.closesend}
          clsoeGroup={e => {
            this.enterChat(e);
          }}
        />
      </CSSTransition>
    );
  }
  //不可以查看信息
  renderprompt() {
    const { showNoSeeUserInfo } = this.state;
    return (
      <CSSTransition in={showNoSeeUserInfo} timeout={100} classNames="fade">
        <div className={styles.usermsg} style={{ textAlign: "center" }}>
          <p className={styles.prompttitle}> 提示 </p>
          <p className={styles.promptuserid}>
            管理员已开启禁止私聊功能， 你无法查看对方资料。
          </p>
          <span className={styles.promptkonw} onClick={this.closesend}>
            我知道了
          </span>
        </div>
      </CSSTransition>
    );
  }
  //渲染title 的信息框
  rendertitlemsg(id) {
    const { touchItem } = this.props;
    const renderId = id || touchItem.uniqueId;
    return (
      <div className={styles.titlemsg}>
        <p
          onClick={() => {
            this.showFriendInfo(renderId);
          }}
        >
          {touchItem.ChatType === 1 && "查看个人信息"}
        </p>
      </div>
    );
  }

  //点击消息里面的图片
  clickImg = curType => {
    if (curType === "picture") {
      this.setState({
        showImg: true
      });
    }
  };

  //点击图片后显示的大图
  rendershowImgMask() {
    return (
      <div id={styles.myModal} className={styles.modal}>
        <span className={styles.close}> × </span>
        <img
          className={styles.modalContent}
          src="https://cooing.oss-cn-beijing.aliyuncs.com/1573109319268-my-act.png"
          id={styles.img01}
        />
        <div id={styles.caption}> </div>
      </div>
    );
  }
  componentDidMount() {
    ScrollMessageScrollHeight = this.ScrollMessage.scrollHeight;
    // 调用父组件方法把当前实例传给父组件
    this.props.onRef("Message", this);

    setTimeout(() => {
      //
      // this.props.SendLargeGroupMsgArrive({
      //   groupUin: 100000005,
      //   msgIdList:[666,999,888]
      // });
    }, 5000);
    const { uin } = this.props;
    const id = uin !== -1 ? uin : this.props.friendid;
    // this.props.GetFriendRelation(id);
  }
  componentWillUnmount() {
    // this.props.resetErrorCodeStatus();
  }
  messageScrollBottom() {
    // 暂时这么写，因为不知道nextTick
    setTimeout(() => {
      this.ScrollMessage
        ? (this.ScrollMessage.scrollTop =
            this.ScrollMessage.offsetHeight + 999999999999)
        : "";
    }, 30);
  }

  loadMore = () => {
    if (this.state.loading) return;
    this.setState({
      loading: true
    });
    const first = this.ScrollMessage.scrollHeight - ScrollMessageHeight;
    ScrollMessageScrollHeight =
      this.ScrollMessage.scrollHeight - ScrollMessageHeight;

    const {
      getSingleChatHistoryMsg,
      GetGroupHistoryMsg,
      LOCALMESSAGES,
      touchItem: { uniqueId, nickName, ChatType, dialogTitle }
    } = this.props;
    const query = {
      dstUin: uniqueId,
      startMsgId: LOCALMESSAGES[uniqueId][0].msgId,
      count: 20,
      cb: len => {
        // len === 0 隐藏加载更多

        setTimeout(v => {
          const last = this.ScrollMessage.scrollHeight;
          const gap = last - first - 500;
          this.ScrollMessage.scrollTop = gap;
        }, 30);

        this.setState({
          loading: false,
          notMore: len === 0
        });
      }
    };
    if (ChatType === 1) {
      getSingleChatHistoryMsg(query);
    } else if (ChatType === 2) {
      GetGroupHistoryMsg(query);
    }
    // const dstUin =
  };
  showMaxImgFn = src => {
    this.setState({
      showMaxImg: true,
      maxImgSrc: src
    });
  };
  HideMaxImg = () => {
    this.setState({
      showMaxImg: false,
      maxImgSrc: ""
    });
  };

  render() {
    const {
      touchItem,
      maskKeyword,
      NoPrivateChat,
      friendRelation,
      TotalCount,
      uin,
      isPrivateChat,
      bannedText
    } = this.props;
    const { ChatType, remark, nickName, dialogTitle } = touchItem;
    const list = this.props.LOCALMESSAGES[touchItem.uniqueId] || [];
    const {
      Title,
      titlemsg,
      showUserDetailAR,
      maxImgSrc,
      showMaxImg,
      showNoSeeUserInfo
    } = this.state;
    console.log(ChatType, 99999);
    const timeArr = [];
    list.map((item, index) => {
      timeArr.push(item.SendTime);
    });

    const groupTitle = `${Title} `;

    const peopleCount = `${TotalCount > 0 ? `(${TotalCount})` : ""}`;
    const id = uin !== -1 ? uin : this.props.friendid;
    return (
      <div className={styles.message}>
        {/* 给弹窗的 遮罩层 */}
        {(showUserDetailAR || showNoSeeUserInfo) && (
          <div className={styles.mask} onClick={this.close}></div>
        )}

        {/* <TransitionGroup> */}
        <header className={styles.header}>
          <div
            className={styles.Ttitle}
            onClick={() => {
              ChatType === 1 && this.showFriendInfo(this.props.friendid);
            }}
          >
            {ChatType === 2
              ? groupTitle
              : ChatType === 1
              ? //&& touchItem.uniqueId === friendRelation.uniqueId
                handleRemarkNickName(remark, nickName || dialogTitle)
              : ""}
          </div>
          {ChatType === 2 && <span>{peopleCount}</span>}
          {ChatType === 1 && (
            <img
              className={styles.img}
              onClick={this.opentitlemsg}
              src={msgicon}
            />
          )}
          {titlemsg && this.rendertitlemsg()}
          {/* {deletemsg && this.renderdeletemask()} */}

          <TransitionGroup>
            {/* {showUserDetailAR && this.prevFriendInfo()} */}
            {showUserDetailAR && this.showUserInfo(showUserDetailAR)}

            {/* {maskKeyword && this.renderFriendInfo()} */}
            {/* 无法私聊弹窗 */}
            {showNoSeeUserInfo && this.renderprompt()}
          </TransitionGroup>
        </header>
        {/* </TransitionGroup> */}
        <div
          className={styles.scroll}
          // onClick={this.close}
          ref={ref => {
            this.ScrollMessage = ref;
          }}
        >
          <ul
            ref={ref => {
              this.ScrollMessageUl = ref;
            }}
          >
            {!this.state.notMore && !!list.length && (
              <li className={styles.more}>
                <i
                  style={{
                    color: "#1890ff",
                    cursor: "pointer"
                  }}
                  onClick={this.loadMore}
                >
                  加载更多
                </i>
              </li>
            )}
            {list.map((data, index) => {
              const showTimeIndex = getIndex(timeArr, 300).find(item => {
                return item === index;
              });
              return (
                <Dialog
                  data={data}
                  index={index}
                  showTimeIndex={showTimeIndex}
                  showMaxImgFn={this.showMaxImgFn}
                  timeArr={timeArr}
                  key={`${touchItem.uniqueId}-${data.msgId}-${index}`}
                  clickImg={e => {
                    this.clickImg(e);
                  }}
                  // playAudio={this.playAudio}
                  reSendMsg={item => {
                    this.reSendMsg(item);
                  }}
                  showInfo={this.showFriendInfo}
                  showNoReadInfo={this.noCheckInfo}
                  // 禁言新加的
                  isPrivateChat={isPrivateChat}
                  bannedText={bannedText}
                ></Dialog>
              );
            })}
          </ul>
        </div>
        {/* 好像展示没有这个需求 */}
        {/* {showImg && this.rendershowImgMask()} */}
        <MaxImg
          maxImgSrc={maxImgSrc}
          showMaxImg={showMaxImg}
          HideMaxImg={this.HideMaxImg}
        ></MaxImg>
      </div>
    );
  }
}
export default Message;
