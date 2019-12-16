const data = {
  // 请求
  10001001: {
    body: [
      {
        id: 'ping',
        type: 'uint64',
        size: 8
      }
    ]
  },
  // 响应
  10008001: {
    action: 'heartBeat',
    body: [
      {
        id: 'pong',
        type: 'uint64',
        size: 8
      }
    ]
  }
};
export default data;
