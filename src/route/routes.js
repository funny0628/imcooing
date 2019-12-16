const dynamic = require("dva").dynamic;
import App from "../views/App";
import Login from "../views/Login";

function Routes(app) {
  return [
    {
      path: "/",
      // component: dynamic({
      //   app,
      //   // models: () => [import('../model/App.model')],
      //   component: () => import('../views/App')
      // }),
      component: App,
      exact: true,
      // 是否需要鉴权
      auth: true
    },
    {
      path: "/login",
      // component: dynamic({
      //   app,
      //   // models: () => [import('../model/App.model')],
      //   component: () => import('../views/Login')
      // }),
      component: Login,
      exact: false,
      // 是否需要鉴权
      auth: false
    }
  ];
}
export default Routes;
