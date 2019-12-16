import React, { Component } from "react";
import styles from "./index.less";
// 消息列表
import MessageList from "../MessageList";
//通讯录
import AddressBook from "../AddressBook";
// 我的
import User from "../User";
import { AppTitle, setTitle } from "../../config";

//$RECYCLE.BIN
import {
  fromatunreadmsgnum,
  Handelunreadmsgnum
} from "../../utils/Basicmethod.js";
import { removeSession } from "../../utils/lib";

import { connect } from "dva";

@connect(
  ({ GetNewMsgList, Todos }) => ({
    newmsglist: GetNewMsgList.newmsglist,
    menuTitle: Todos.menuTitle
  }),
  dispatch => ({
    // GetNewMsgList: () =>
    //   dispatch({
    //     type: "GetNewMsgList/Getnewmsglist"
    //   }),
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
      })
  })
)
class SideMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // 当前菜单
      activeMenu: "msg",
      // tab菜单
      tabMenu: [
        {
          name: "消息",
          id: "msg"
        },
        {
          name: "通讯录",
          id: "book"
        },
        {
          name: "我的",
          id: "user"
        }
      ],
      showmsg: false,
      test: "是否可以拿到组件内部的值"
    };
    this.contentUlRef = React.createRef();
  }
  getComponent() {
    const { activeMenu, tabMenu, isfrienfd } = this.state;
    //

    const { id } = tabMenu.find(item => item.id === activeMenu);
    switch (id) {
      case "msg":
        return <MessageList clearAllChat={this.clearAllChat} />;
      case "book":
        return <AddressBook contentUlRef={this.contentUlRef} />;
      default:
        return <User title={this.showmsg} clearAllChat={this.clearAllChat} />;
    }
  }
  componentDidMount() {
    this.contentUlRef.current.scrollTop = 0;
  }
  componentUpdateMount() {
    this.contentUlRef.current.scrollTop = 0;
  }
  toggleTab = index => {
    // const {menuTitle} = this.props;

    this.setState(state => ({
      activeMenu: state.tabMenu[index].id
    }));
  };

  //拿到子组件的未读信息的数量

  clearAllChat = () => {
    this.props.clearSingleChat();
    this.props.clearSingleChatHistoryMsg();
    this.props.clearGroupChatList();
    this.props.clearGroupHistoryMsg();
  };

  static getDerivedStateFromProps(props, state) {
    //在sidemune页面拿到所有的未读消息数
    return {
      ...state
    };
  }

  //处理遮罩
  showmsg = a => {
    this.setState({
      showmsg: a
    });
  };
  open = () => {
    this.setState({
      showmsg: false
    });
  };
  close = () => {
    this.setState({
      showmsg: false
    });
  };

  //是否显示遮罩的
  rendermask() {
    return (
      <div className={styles.loginout}>
        <div className={styles.mytitle}>提示</div>
        <div className={styles.msg}>确定要退出登录?</div>
        <div className={styles.mybutton}>
          <p onClick={this.open}>取消</p>
          <p onClick={this.close}>确定</p>
        </div>
      </div>
    );
  }

  render() {
    const { activeMenu, tabMenu, showmsg } = this.state;
    const toutalUnRead = this.props.newmsglist.reduce(
      (total, item) => total + item.UnreadMsgCount,
      0
    );
    const docTitle =
      toutalUnRead > 0 ? `${AppTitle} (${toutalUnRead}) ` : AppTitle;
    if (document.title !== docTitle) {
      setTitle(docTitle);
    }

    // 这里差了一个未读消息列表
    return (
      <div className={styles.sideMenu}>
        {/* 标题区域 */}
        {/* 内容区域 */}
        <div ref={this.contentUlRef} className={styles.content}>
          {this.getComponent()}
        </div>
        {/* tab区域 */}
        <div className={styles.tabbar}>
          {tabMenu.map(({ name, id }, index) => (
            <span
              key={index}
              onClick={() => {
                this.toggleTab(index);
              }}
            >
              <img
                src={
                  activeMenu === id
                    ? require(`../../assets/image/menu/${id}-active.png`)
                    : require(`../../assets/image/menu/${id}.png`)
                }
                alt={name}
              />
              {id === "msg" && toutalUnRead > 0 && <i> {toutalUnRead} </i>}
            </span>
          ))}
        </div>
        {showmsg && this.rendermask()}
      </div>
    );
  }
}
export default SideMenu;
