export const AppTitle = "Cooing网页版";

export const setTitle = newTitle => {
  document.title = newTitle || AppTitle;
};
export const wsAPI = {
  development: "ws://10.99.50.88:18808",
  // development: "ws://10.99.50.120:18808",
  // development: "ws://10.99.50.45:18808",
  // development: "ws://47.91.228.223:18808",
  // test: "ws://47.91.228.223:18808",
  test: "ws://47.91.228.223:18808", // 测试环境
  //  production: "ws://47.91.228.223:18808" // 测试环境
  production: "ws://47.97.62.38:18808" // 生产
}[NODE_ENV || "development"];
