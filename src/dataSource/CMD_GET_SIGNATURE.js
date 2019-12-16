// 握手  即 加密

const data = {
  // 请求
  70001031: {
    body: []
  },
  // 响应
  70008031: {
    action: 'Oss/ossReceive',
    body: [
      {
        id: 'EndPoint',
        type: 'string'
      },
      {
        id: 'AccessKeyId',
        type: 'string'
      },
      {
        id: 'AccessKeySecret',
        type: 'string'
      },
      {
        id: 'Bucket',
        type: 'string'
      },
    ]
  }
};
export default data;
