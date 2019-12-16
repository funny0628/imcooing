import React, { Component } from "react";
import styles from "./index.less";
import { connect } from "dva";
import { Modal } from "antd";
import { removeSession } from "../../utils/lib";
import { withRouter } from "react-router";
import { session } from "../../utils/lib";
import { imgurl } from "../../utils/Basicmethod";
const defaultAvater = require("../../assets/image/menu/user.png");

let logoutFlag = true;

@withRouter
@connect(
  ({ User }) => {
    return { logoutSuccess: User.logoutSuccess };
  },
  dispatch => ({
    logout: () =>
      dispatch({
        type: "User/logout"
      }),
    setLogoutSuccess: flag =>
      dispatch({
        type: "User/setLogoutSuccess",
        flag
      }),
    //握手
    sendPublicKey: payload => {
      dispatch({
        type: "HandShake/sendPublicKey"
      });
    },
    init: payload => {
      //
      dispatch({
        type: "Index/init",
        payload: dispatch
      });
    }
  })
)
class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: {
        name: "",
        gender: "",
        phon: "",
        userid: "",
        smallAvatarUrl: "",
        langCode: ""
      }
    };
  }
  static getDerivedStateFromProps(props, state) {
    const { logoutSuccess, setLogoutSuccess } = props;
    if (logoutSuccess === "success" && logoutFlag) {
      setLogoutSuccess(false);
      logoutFlag = false;
      removeSession();
      window.onbeforeunload = null;
      window.location.reload();
      return null;
    }
    return null;
  }

  componentDidMount(props) {
    const userInfo = JSON.parse(session("userInfo"));
    this.setState({
      users: {
        name: userInfo.nickName,
        gender: userInfo.gender,
        phon: userInfo.phoneNumber,
        userid: userInfo.uin,
        smallAvatarUrl: userInfo.smallAvatarUrl,
        langCode: userInfo.langCode
      }
    });
  }

  //退出登录
  logoutDler() {
    Modal.confirm({
      title: "提示",
      content: "您确定退出登录吗？",
      cancelText: "取消",
      okText: "确认",
      onOk: () => {
        this.props.logout();
      }
    });
  }

  render() {
    const {
      name,
      gender,
      phon,
      userid,
      smallAvatarUrl = defaultAvater,
      langCode
    } = this.state.users;
    return (
      <div className={styles.User}>
        <h3 className={styles.title}>cooing</h3>
        <div className={styles.icon}>
          <img
            src={imgurl + smallAvatarUrl}
            onError={e => {
              e.target.src = defaultAvater;
            }}
          />
          <div>{name}</div>
          <p>ID:{userid}</p>
        </div>
        {/* <p className={styles.gender}>
          性别 : <span> {gender} </span>
        </p> */}
        <p className={styles.gender}>
          手机 :{" "}
          <span>
            {langCode}-{phon}{" "}
          </span>
        </p>
        <p
          onClick={() => {
            this.logoutDler();
          }}
          className={styles.login}
        >
          退出登录
        </p>
      </div>
    );
  }
}
export default User;
