import React, { Component } from "react";
import { connect } from "dva";
import { message as Message } from "antd";

const TIME = 60;
@connect(
  ({ User }) => {
    return {
      // smsReturn: User.smsReturn
    };
  },
  dispatch => ({
    // resetSmsReturn: () =>
    //   dispatch({
    //     type: "User/resetSmsReturn"
    //   })
  })
)
class Clock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // Timer: null,
      // count: TIME,
      // _this: this
    };
  }

  /* static getDerivedStateFromProps(props, state) {
    const {
      smsReturn: { errorCode, message }
    } = props;
    const { _this } = state;

    if (errorCode === undefined) return null;

    // 开始倒计时
    if (errorCode !== 0) {
      props.setClock(false);
      Message.warning(message);
    }
    props.resetSmsReturn();
    // return {
    //   ...state,
    //   count: state.count,
    //   Timer: state.Timer
    // };
    return {
      ...state,
      Timer: errorCode === 0 ? _this.start(state.Timer) : state.Timer
    };
  } */

  // start = Timer => {
  //   clearInterval(Timer);
  //   this.props.setClock(true);
  //   return setInterval(() => {
  //     this.setState(state => ({ count: state.count - 1 }));
  //     this.state.count <= 0 && this.stop();
  //   }, 1000);
  // };
  // stop = () => {
  //   clearInterval(this.state.Timer);
  //   this.props.setClock(false);
  //   this.setState({
  //     Timer: null,
  //     count: TIME
  //   });
  // };
  // componentWillUnmount() {
  //   //
  //   console.log("我被销毁了饿");
  //   // 正常情况下不会别销毁    这个切换密码登录会被销毁
  //   this.stop();
  //   this.setState = (state, callback) => {
  //     return;
  //   };
  // }

  render() {
    const {
      state: { count },
      props: { time }
    } = this;
    return <div style={{ display: `inline-block` }}>&nbsp;({time})</div>;
    // return (
    //   <div style={{ display: `inline-block` }}>
    //     {Timing && <span>&nbsp;({count})</span>}
    //   </div>
    // );
  }
}
export default Clock;
