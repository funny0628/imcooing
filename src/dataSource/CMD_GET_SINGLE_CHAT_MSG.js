import { message } from './COMMON.js';
// 获取单聊消息
const data = {
  // 请求
  60011008: {
    body: [
      {
        id: 'dstUin',
        type: 'uint64',
        size: 8
      },
      {
        id: 'startMsgId',
        type: 'uint64',
        size: 8
      },
      {
        id: 'count',
        type: 'uint32',
        size: 4
      }
    ]
  },
  // 响应
  60018008: {
    action: 'Chat/singChatMsg',
    body: [
      {
        id: 'singChatList',
        type: 'uint32',
        size: 4,
        // 是否数组
        isArray: true,
        // item结构体
        itemStruct: message
      }
    ]
  }
};

export default data;
