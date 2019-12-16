// 握手  即 加密

const data = {
  // 请求
  10001003: {
    body: [
      {
        id: 'publicEccKey',
        type: 'string'
      },
      {
        id: 'timestamp',
        type: 'uint64',
        size: 8
      },
      {
        id: 'publicKeyIndex',
        type: 'uint8',
        size: 1
      },
      {
        id: 'sign',
        type: 'string'
      }
    ]
  },
  // 响应
  10008003: {
    action: 'HandShake/getPublicKey',
    body: [
      {
        id: 'serverPublicEccKey',
        type: 'string'
      },
      {
        id: 'serverNonce',
        type: 'string'
      }
    ]
  }
};
export default data;
