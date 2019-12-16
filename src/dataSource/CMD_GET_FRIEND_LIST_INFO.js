import { userInfo } from './COMMON';
// 获取好友列表
const data = {
  // 请求
  '7000100c': {
    body: []
  },
  // 响应
  '7000800c': {
    action: 'Friendlist/friends',
    body: [
      {
        id: 'friendlist',
        type: 'uint32',
        size: 4,
        // 是否数组
        isArray: true,
        // item结构体
        itemStruct: userInfo
      }
    ]
  }
};

export default data;
