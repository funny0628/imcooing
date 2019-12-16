import React, { Component } from "react";
import { connect } from "dva";
import styles from "./index.less";
import countryData from "./dataSource";
import Clock from "./clock";
import { message, notification, Spin } from "antd";
import "antd/dist/antd.css";
import ClickOutside from "react-click-outside";
const { SHA256 } = require("crypto-js");
import { session, removeSession } from "../../utils/lib";
import { validLogin, getBtnActive } from "./lib";
import { setTitle } from "../../config";
var isOnComposition = false;
import { message as Message } from "antd";

// const isChrome = !!window.chrome && !!window.chrome.webstore
const TIME = 60;

@connect(
  ({ User }) => {
    return {
      userInfoByLogin: User.userInfoByLogin,
      smsReturn: User.smsReturn,
      loginSuccess: User.loginSuccess
    };
  },
  dispatch => ({
    CLEARLOCALMESSAGES: () =>
      dispatch({
        type: "LOCALMESSAGE/CLEARLOCALMESSAGES"
      }),
    saveTouchItem: item =>
      dispatch({
        type: "Todos/saveTouchItem",
        item
      }),
    loginBySms: smsParam =>
      dispatch({
        type: "User/loginBySms",
        smsParam: smsParam
      }),

    sendSms: sendSmsParam =>
      dispatch({
        type: "User/sendSms",
        sendSmsParam: sendSmsParam
      }),
    loginByPsd: psdParam =>
      dispatch({
        type: "User/loginByPsd",
        psdParam
      }),
    resetSmsReturn: () =>
      dispatch({
        type: "User/resetSmsReturn"
      }),
    setLoginSuccess: payload =>
      dispatch({
        type: "User/setLoginSuccess",
        payload
      })
  })
)
class Login extends Component {
  constructor(props) {
    super(props);
    const rememberPass = session("rememberPass")
      ? JSON.parse(session("rememberPass"))
      : false;
    const verifyPassword = session("verifyPassword")
      ? JSON.parse(session("verifyPassword"))
      : "";
    const mobileNumber = session("mobileNumber")
      ? JSON.parse(session("mobileNumber"))
      : "";
    this.state = {
      SpinModal: false,
      rememberPass,
      isVerifyCodeLogin: true,
      isSelCountry: false,
      value: "", // 选择国家区号搜索输入框的值
      countryNum: "+86",
      mobileNumber, //输入的手机号码
      msgCode: "", //短信验证码

      time: TIME, //短信验证码倒计时
      timerId: null,

      verifyPassword, //输入的密码
      searchArr: [],
      countryData: countryData,
      Timing: false, // 是否倒计时  是否会展示
      localInfo: this.localInfo.bind(this),
      localPassword: this.localPassword.bind(this),
      _this: this
    };
    //打开选择国家地区区号的弹框
    this.handleChange = this.handleChange.bind(this);
    //手机号码输入框的事件
    this.inputMobilNumber = this.inputMobilNumber.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    //短信验证码
    const {
      resetSmsReturn,
      userInfoByLogin,
      loginSuccess,
      smsReturn: { errorCode, message }
    } = props;
    const { _this } = state;
    // const { errorCode } = props.smsReturn;
    const { rememberPass, isVerifyCodeLogin, localInfo, localPassword } = state;
    if (["error"].includes(loginSuccess)) {
      props.setLoginSuccess(false);
      return { ...state, SpinModal: false };
    }

    if (errorCode !== undefined) {
      props.resetSmsReturn(); // 重置成  {} 对象
      if (errorCode === 0) {
        // 已发送短信验证码  开始倒计时
        return {
          ...state,
          ..._this.start(state.timerId) // 返回 计时器id 和 展示 计时器
        };
      } else {
        Message.warning(message);
        return null;
      }
    }
    if (loginSuccess === "success") {
      props.setLoginSuccess(false);
      notification.success({
        message: "登录成功",
        description: "欢迎进入COOING"
      });
      // 储存基本信息
      localInfo(userInfoByLogin);
      // 储存密码
      rememberPass && !isVerifyCodeLogin && localPassword(state);
      props.history.push("/");
      return null;
    }

    // if (![-2, 0].includes(errorCode)) {
    //   message.warning(props.smsReturn.message);
    //   resetSmsReturn();
    // }
    return null;
  }

  componentDidMount() {
    this.input.focus();
    this.props.CLEARLOCALMESSAGES();
    this.props.saveTouchItem({});
    setTitle();
    removeSession();
  }
  componentWillUnmount() {
    this.props.resetSmsReturn();
    this.stop();
  }
  // 登录成功储存登录密码
  localPassword(payload) {
    const { mobileNumber, verifyPassword } = payload;
    session("mobileNumber", JSON.stringify(mobileNumber));
    session("verifyPassword", JSON.stringify(verifyPassword));
    session("rememberPass", JSON.stringify(true));
  }
  localInfo(payload) {
    const { sessionId, uin } = payload;
    session("sessionId", sessionId);
    session("uin", uin);
    session("userInfo", JSON.stringify(payload));
  }
  //改变登录方式(密码登录或验证码登录)
  changeLoginWay = () => {
    this.setState(state => ({
      isVerifyCodeLogin: !state.isVerifyCodeLogin
    }));
  };
  //打开选择国家区号的弹框
  selCountry = () => {
    this.setState(state => ({
      isSelCountry: true
    }));
  };
  //搜索国家地区
  handleComposition(e) {
    if (e.type === "compositionend") {
      // composition is end
      isOnComposition = false;

      if (!isOnComposition) {
        // fire onChange
        this.handleChange(e);
      }
    } else {
      // in composition
      isOnComposition = true;
    }
  }
  handleChange(e) {
    this.state.searchArr = [];

    const val = e.target.value;

    this.setState({
      value: val
    });
    if (!isOnComposition) {
      if (val.trim() !== "") {
        this.state.countryData.forEach(item => {
          item.data.forEach(item1 => {
            if (item1.name.includes(val.trim())) {
              this.state.searchArr.push(item1);
            }
            if (item1.name === val.trim()) {
              this.setState({
                searchArr: [item1]
              });
            }
          });
        });
      } else {
        this.state.searchArr = [];
      }
    }
  }
  //选择国家区号
  chooseCountryNum(num) {
    this.setState(state => ({
      countryNum: num,
      isSelCountry: false,
      value: "",
      searchArr: []
    }));
  }
  // 获取短信验证码
  getMsgCode = e => {
    const { Timing, mobileNumber } = this.state;
    if (Timing) return false;
    if (mobileNumber.length <= 11 && mobileNumber.length >= 6) {
      // 这里要把 set 的逻辑放在 接口返回 之前
      // 这里不能set  因为你不知道 有没有成功
      // this.setState({
      //   Timing: true
      // });
      // this.start();
      //调用获取短信验证码方法
      this.props.sendSms({
        countryNum: this.state.countryNum,
        phoneNumber: this.state.mobileNumber
      });
    } else {
      // alert(this.props.userInfo.message);
      message.warning("请输入正确手机号", 1);
    }
  };
  //手机号码输入框的事件
  inputMobilNumber(e) {
    const { value } = e.target;
    const reg = /^\d*?$/; // 以任意数字开头和结尾，且中间出现零个或多个数字
    if ((reg.test(value) && value.length < 12) || value === "") {
      this.setState({
        mobileNumber: value
      });
    }
  }
  //短信验证码的事件
  inputMsgCode = e => {
    const { value } = e.target;
    const reg = /^\d*?$/; // 以任意数字开头和结尾，且中间出现零个或多个数字
    if ((reg.test(value) && value.length < 5) || value === "") {
      this.setState({
        msgCode: value
      });
    }
  };
  //输入验证密码的事件
  inputVerifyCode = e => {
    this.setState({
      verifyPassword: e.target.value
    });
  };
  //点击登录按钮登录
  loginSubmit = e => {
    const {
      isVerifyCodeLogin,
      mobileNumber,
      msgCode,
      verifyPassword
    } = this.state;
    if (
      !getBtnActive(isVerifyCodeLogin, {
        mobileNumber,
        msgCode,
        verifyPassword
      })
    )
      return;
    // 这里做统一用户名密码校验
    const type = this.state.isVerifyCodeLogin ? "sms" : "pass";
    const body = {
      type,
      phone: mobileNumber, //输入的手机号码
      msgCode, //短信验证码
      password: verifyPassword
    };
    if (!validLogin(body)) return;
    this.state.isVerifyCodeLogin ? this.loginSMS() : this.loginPASS();
    this.setState({ SpinModal: true });
  };
  loginSMS() {
    const { mobileNumber, msgCode, countryNum } = this.state;
    this.props.loginBySms({
      countryNum: countryNum,
      phoneNumber: mobileNumber,
      msgCode: msgCode
    });
  }
  loginPASS() {
    const { mobileNumber, verifyPassword, countryNum } = this.state;
    this.props.loginByPsd({
      countryNum,
      mobileNumber,
      verifyPassword: SHA256(verifyPassword).toString()
    });
  }
  //
  changeRemeber = e => {
    const { checked } = e.target;
    this.setState({
      rememberPass: checked
    });
  };
  //点击回车键登录
  enterLogin = e => {
    if (e.keyCode === 13) {
      this.loginSubmit();
    }
  };

  hideCountryArea = () => {
    this.setState({
      isSelCountry: false
    });
  };

  // 子组件 会 重新设置 这个

  start = timerId => {
    clearInterval(timerId);
    return {
      timerId: setInterval(() => {
        this.setState(state => ({ time: state.time - 1 }));
        this.state.time <= 0 && this.stop();
      }, 1000),
      Timing: true
    };
  };
  stop = () => {
    // 停止计时器并重置
    clearInterval(this.state.timerId);
    this.setState({
      timerId: null,
      time: TIME,
      Timing: false
    });
  };

  render() {
    console.log("重新render login");
    const {
      isVerifyCodeLogin,
      isSelCountry,
      searchArr,
      countryData,
      Timing,
      SpinModal,
      mobileNumber,
      msgCode,
      verifyPassword,
      time
    } = this.state;
    const btnActive = getBtnActive(isVerifyCodeLogin, {
      mobileNumber,
      msgCode,
      verifyPassword
    });
    const countryList = countryData.map((item, index) => (
      <li key={index} className={styles.outer}>
        <span>{item.title}</span>
        {item.data.map((item1, index1) => (
          <div
            key={index1}
            className={styles.inner}
            onClick={() => {
              this.chooseCountryNum(item1.num);
            }}
          >
            <span className={styles.name}>{item1.name}</span>
            <span className={styles.num}>{item1.num}</span>
          </div>
        ))}
      </li>
    ));

    const search = searchArr.map((item1, index1) => (
      <li
        key={index1}
        className={styles.inner}
        onClick={() => {
          this.chooseCountryNum(item1.num);
        }}
      >
        <span className={styles.name}>{item1.name}</span>
        <span className={styles.num}>{item1.num}</span>
      </li>
    ));
    return (
      <div className={styles.login}>
        {/* 选择国家地区弹框 */}
        {SpinModal && (
          <div className={styles.spinWrap}>
            <Spin tip="正在登录..." size="large"></Spin>
          </div>
        )}
        {isSelCountry && (
          <ClickOutside onClickOutside={this.hideCountryArea}>
            <div className={styles.selLocation}>
              <div className={styles.searchArea}>
                <img
                  onClick={() => {
                    this.hideCountryArea();
                  }}
                  src={require("../../assets/image/close.png")}
                  className={styles.closeIcon}
                />
                <div className={styles.title}>选择国家地区</div>
                <div className={styles.search}>
                  <input
                    type="text"
                    autoComplete="off"
                    value={this.state.value}
                    onChange={this.handleChange}
                    onCompositionStart={this.handleComposition.bind(this)}
                    onCompositionUpdate={this.handleComposition.bind(this)}
                    onCompositionEnd={this.handleComposition.bind(this)}
                    placeholder="请输入国家名称搜索"
                  />
                </div>
              </div>
              <div className={styles.listWrap}>
                <ul id="ul" className={styles.list}>
                  {searchArr.length === 0 ? countryList : search}
                </ul>
              </div>
            </div>
          </ClickOutside>
        )}
        {/* 登录页面左侧logo */}
        <div className={styles.logo}>
          <img src={require("../../assets/image/login/logo.png")} alt="" />
          <span className={styles.welcom}>欢迎登录COOING</span>
        </div>
        {/* 登录信息填写 */}
        <div className={styles.loginPage}>
          <div className={styles.username}>
            <img
              className={styles.userImg}
              src={require("../../assets/image/login/userIcon.png")}
              alt=""
            />
            <div className={styles.mobilePhone}>
              <div className={styles.selArea}>
                <span onClick={this.selCountry}>
                  <i className={styles.left}>({this.state.countryNum}</i>
                  <img
                    className={styles.dropdown}
                    src={require("../../assets/image/login/dropdown.png")}
                    alt=""
                  />
                  <i className={styles.right}>)</i>
                </span>
              </div>
              <input
                ref={input => (this.input = input)}
                value={this.state.mobileNumber}
                maxLength="11"
                onChange={this.inputMobilNumber}
                type="text"
                placeholder="请输入手机号码"
              />
            </div>
          </div>
          {isVerifyCodeLogin ? (
            <div className={styles.code}>
              <img
                src={require("../../assets/image/login/codeIcon.png")}
                alt=""
              />
              <input
                value={this.state.msgCode}
                onChange={this.inputMsgCode}
                maxLength="4"
                onKeyUp={this.enterLogin}
                type="text"
                placeholder="请输入验证码"
              />
              <div onClick={this.getMsgCode} className={styles.codeText}>
                获取验证码
                {/* {Timing && <Clock time={time} />} */}
                {Timing && <span>&nbsp; {time}</span>}
              </div>
            </div>
          ) : (
            <div className={styles.code}>
              <img
                src={require("../../assets/image/login/codeIcon.png")}
                alt=""
              />
              <input
                value={this.state.verifyPassword}
                onChange={this.inputVerifyCode}
                onKeyUp={this.enterLogin}
                type="password"
                maxLength="15"
                placeholder="请输入密码"
              />
            </div>
          )}
          {!isVerifyCodeLogin ? (
            <div className={styles.remember}>
              {/* <input
                type="checkbox"
                name="remeberPass"
                checked={this.state.rememberPass}
                onChange={this.changeRemeber}
              />
              <span>记住密码</span> */}
            </div>
          ) : null}
          <input
            type="button"
            value="登录"
            onClick={this.loginSubmit}
            className={btnActive ? styles.loginBtn : styles.loginBtnFalse}
          />
          <p onClick={this.changeLoginWay}>
            {this.state.isVerifyCodeLogin ? "密码登录" : "验证码登录"}
          </p>
        </div>
      </div>
    );
  }
}
export default Login;
