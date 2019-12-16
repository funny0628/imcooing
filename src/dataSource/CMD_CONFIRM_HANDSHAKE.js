// 握手确认  即 加密

const data = {
  // 请求
  10001004: {
    body: [
      {
        id: 'timestamp',
        type: 'uint64',
        size: 8
      },
      {
        id: 'sign',
        type: 'string'
      }
    ]
  },
  // 响应
  10008004: {
    action: 'HandShake/confirmHandShakeSuccess',
    body: []
  }
};
export default data;
