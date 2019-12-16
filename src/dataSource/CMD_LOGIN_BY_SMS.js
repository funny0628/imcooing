import { userInfo } from './COMMON';
// 验证码登录
const data = {
  // 请求
  30011010: {
    body: [
      {
        id: 'phoneNumber',
        type: 'string'
      },
      {
        id: 'langCode',
        type: 'string'
      },
      {
        id: 'SmsCode',
        type: 'string'
      },
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
      },
      {
        id: 'pushToken',
        type: 'string'
      }
    ]
  },
  // 响应
  30018010: {
    action: 'User/userInfoOfLoginSuccess',
    body: [
      {
        id: 'sessionId',
        type: 'uint64',
        size: 8
      },
      ...userInfo,
      {
        id: 'state',
        type: 'uint32',
        size: 4
      },
      {
        id: 'stepNum',
        type: 'uint32',
        size: 4
      }
    ]
  }
};
export default data;
