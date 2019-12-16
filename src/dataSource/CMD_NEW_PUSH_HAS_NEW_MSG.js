import { message } from "./COMMON";

const HasNewMsgDialog = [
  {
    id: "dstUin",
    type: "uint64",
    size: 8
  },
  {
    id: "dialogTitle",
    type: "string"
  },
  {
    id: "groupAvatarUrl",
    type: "string"
  },
  {
    id: "ChatType",
    type: "uint32",
    size: 4
  },
  {
    id: "uinType",
    type: "uint32",
    size: 4
  },
  {
    id: "belongToUin",
    type: "uint64",
    size: 8
  },
  {
    id: "UnreadMsgCount",
    type: "uint32",
    size: 4
  },
  ...message
];

//获取有新消息的、
// 左侧有新的
const data = {
  60018002: {
    action: "GetNewMsgList/NewMsg",
    body: [
      {
        id: "ChatType",
        type: "uint32",
        size: 4
      },
      {
        id: "uniqueId",
        type: "uint64",
        size: 8
      },
      ...HasNewMsgDialog
      // {
      //   id: "newmsglist",
      //   type: "uint32",
      //   size: 4,
      //   // 是否数组
      //   isArray: true,
      //   // item结构体
      //   itemStruct: HasNewMsgDialog
      // }
    ]
  }
};

export default data;
