import { userInfo } from './COMMON.js';
// 单聊详情
const data = {
  // 请求
  60011006: {
    body: [
      {
        id: 'dstUin',
        type: 'uint64'
      }
    ]
  },
  // 响应
  60018006: {
    action: 'App/add',
    body: userInfo
  }
};

export default data;
