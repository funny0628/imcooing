import { message } from './COMMON.js';
// 获取单聊历史消息
const data = {
  // 请求
  70001030: {
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
  70008030: {
    action: 'SingleChatHistoryMsg/singChatHistoryMsg',
    body: [
      // 当前拉取的uin   这块在后台有些文档上可能还是dstUin
      // 然后这块为了语义化使用了这个
      {
        id: 'pullUin',
        type: 'uint64',
        size: 8
      },
      // {
      //   id: 'dstUin',
      //   type: 'uint64',
      //   size: 8
      // },
      {
        id: 'singChatHistoryMsg',
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
