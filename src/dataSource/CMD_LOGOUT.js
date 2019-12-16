// 退出登录
const data = {
  // 请求
  30011004: {
    body: [
      {
        id: 'appVersion',
        type: 'uint32',
        size: 4
      },
      {
        id: 'deviceType',
        type: 'uint8',
        size: 1
      },
      {
        id: 'imei',
        type: 'string'
      },
      {
        id: 'brand',
        type: 'string'
      },
      {
        id: 'model',
        type: 'string'
      }
    ]
  },
  // 响应
  30018004: {
    action: 'User/logoutAc',
    body: []
  }
};
  
  export default data;
  