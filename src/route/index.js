import React, { useState, useEffect, Component } from "react";
const { withRouter, Router, Route, Switch, Redirect } = require("dva").router;
import { TransitionGroup, CSSTransition } from "react-transition-group";
import RouteList from "./routes";
import styles from "../assets/style/index.less";
import { connect } from "dva";
import Loading from "../views/Loading";
import { session } from "../utils/lib";
import { Modal } from "antd";
function isLogin() {
  return session("sessionId");
}
// fix warning while use react-transition-group :You tried to redirect to the same route you're currently on
function RedirectHandle(isRedirect) {
  if (!isRedirect.value) {
    isRedirect.value = true;
    return <Redirect to="/login" />;
  }
  setTimeout(() => {
    isRedirect.value = false;
  }, 0);
  return <React.Fragment></React.Fragment>;
}

const Routes = withRouter(({ location, app, ws, isShakeHandsSuccess }) => {
  const isRedirect = { value: false };
  return (
    <TransitionGroup>
      <CSSTransition
        key={location.pathname}
        timeout={300}
        classNames={{
          enter: styles[`fade-enter`],
          enterActive: styles[`fade-enter-active`],
          exit: styles[`fade-exit`],
          exitActive: styles[`fade-exit-active`]
        }}
      >
        <Switch>
          {RouteList(app).map(
            ({ path, component: Component, exact, auth }, index) => (
              <Route
                key={index}
                path={path}
                exact={exact}
                render={props => {
                  // isShakeHandsSuccess 等待握手完成
                  if (ws.readyState !== 1 || !isShakeHandsSuccess)
                    return <Loading />;
                  // if (ws.readyState !== 1) return <Loading />;
                  return !auth || isLogin() ? (
                    <Component {...props} />
                  ) : (
                    RedirectHandle(isRedirect)
                  );
                }}
              />
            )
          )}
        </Switch>
      </CSSTransition>
    </TransitionGroup>
  );
});
@connect(
  ({ Index, HandShake }) => ({
    ws: Index.ws,
    wsState: Index.wsState,
    isShakeHandsSuccess: HandShake.isShakeHandsSuccess
  }),
  dispatch => ({
    init: payload => {
      //
      dispatch({
        type: "Index/init",
        payload: dispatch
      });
    }
  })
)
class RouteConfig extends Component {
  constructor(props) {
    super(props);
    this.state = {
      openModal: false,
      closeFn: this.closeFn.bind(this)
    };
  }

  static getDerivedStateFromProps(props, state) {
    const { wsState } = props;
    const { openModal } = state;
    if (wsState === 3 && openModal === false) {
      state.closeFn();
      return { ...state, openModal: true };
    } else {
      return {
        ...state,
        openModal: false
      };
    }
  }

  closeFn() {
    Modal.warning({
      title: "网络连接失败",
      content: "请确定电脑的网络连接有效",
      okText: "重新连接",
      onOk: () => {
        window.location.reload();
      }
    });
  }

  render() {
    const { history } = this.props;
    return (
      <div className={styles.appSpace}>
        <Router history={history} className="app-bg">
          <Routes {...this.props} />
        </Router>
      </div>
    );
  }
}
export default RouteConfig;
