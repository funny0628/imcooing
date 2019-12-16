// 返回版本号和更新提示
const data = {
  // 请求
  70001028: {
    body: [
      {
        id: 'clientversion',
        type: 'string'
      }
    ]
  },
  // 响应
  70008028: {
    action: 'App/add',
    body: [
      {
        id: 'currentversion',
        type: 'string'
      },
      {
        id: 'updatetip',
        type: 'uint32',
        size: 4
      }
    ]
  }
};

export default data;
