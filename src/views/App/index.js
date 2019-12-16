import React, { Component } from "react";
import { connect } from "dva";
// 左侧菜单
import SideMenu from "./sideMenu";
import { Modal } from "antd";
import { removeSession } from "../../utils/lib";
// 聊天窗口
import Chat from "../Chat";
@connect(
  ({ Todos, Index, User }) => ({
    showImg: Todos.showImg,
    isKickUser: Index.isKickUser,
    ws: Index.ws,
    logoutSuccess: User.logoutSuccess
  }),
  dispatch => ({
    init: () =>
      dispatch({
        type: "Index/init",
        payload: dispatch
      }),
    getData: () =>
      dispatch({
        type: "App/getData"
      }),
    setKickUser: value =>
      dispatch({
        type: "Index/setKickUser",
        value
      }),
    //关闭个人信息弹窗
    changeMask: isShowInfo =>
      dispatch({
        type: "Todos/changeMask",
        isShowInfo
      }),
    getSign: payload =>
      dispatch({
        type: "Oss/getSign"
      })
  })
)
class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalKick: this.modalKick.bind(this),
      isFirstLogout: true
    };
  }
  async componentDidMount() {
    const { getSign } = this.props;
    // 获取。。。
    getSign();

    window.onpopstate = e => {
      e.preventDefault();
      window.history.pushState("forward", null, "#");
      window.history.forward(1);
    };
    window.onbeforeunload = e => {
      if (this.props.logoutSuccess === "success") return;
      var dialogText = "要重新加载该网站吗？系统不会保存你所做的更改";
      e.returnValue = dialogText;
      return dialogText;
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { isKickUser, setKickUser } = props;

    if (isKickUser && state.isFirstLogout) {
      state.modalKick(setKickUser);
      return {
        ...state,
        isFirstLogout: false
      };
    }
    return null;
  }

  modalKick(setKickUser) {
    const _this = this;
    Modal.error({
      title: "温馨提示",
      content: "当前账号已在其他处登录,请重新登录",
      okText: "确认",
      okButtonProps: { size: "large" },
      onOk() {
        //我这里要跳到登录了 清空缓存了
        setKickUser(false);
        removeSession();
        window.onbeforeunload = null;
        window.location.reload();
      }
    });
  }
  closeInfoMask = () => {
    //
    //全局关闭个人信息弹框
    this.props.changeMask({ InfoMask: false, NoChat: false });
  };

  render() {
    return (
      <div onClick={this.closeInfoMask}>
        {/* 左侧菜单 */}
        <SideMenu />
        {/* 聊天窗口 */}
        <Chat />
      </div>
    );
  }
}
export default App;
