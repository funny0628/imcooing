import { message } from './COMMON';
const HasNewMsgDialog =[
    {
        id: 'dstUin',
        type: 'uint64',
        size: 8
    },
    {
        id: 'dialogTitle',
        type: 'string',
    },
    {
        id: 'smallAvatarUrl',
        type: 'string',
    },
    {
        id: 'ChatType',
        type: 'uint32',
        size: 4
    },
    {
        id: 'uinType',
        type: 'uint32',
        size: 4
    },
    {
        id: 'belongToUin',
        type: 'uint64',
        size: 8
    },
    {
        id: 'UnreadMsgCount',
        type: 'uint32',
        size: 4
    },
    ...message
   
]


//获取有新消息的会话列表
const data = {
  '60011024': {
    body: []
  },
  '60018024': {
    action: 'GetNewMsgList/dispatchNewMsgList',
    body: [
      {
        id: 'newmsglist',
        type: 'uint32',
        size: 4,
        // 是否数组
        isArray: true,
        // item结构体
        itemStruct: HasNewMsgDialog
      }
    ]
  }
};

export default data;

