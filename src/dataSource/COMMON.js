// 通用body
// 用户信息
export const userInfo = [
  {
    id: "uin",
    type: "uint64",
    size: 8
  },
  {
    id: "nickName",
    type: "string"
  },
  {
    id: "langCode",
    type: "string"
  },
  {
    id: "phoneNumber",
    type: "string"
  },
  {
    id: "smallAvatarUrl",
    type: "string"
  },
  {
    id: "originAvatarUrl",
    type: "string"
  },
  {
    id: "email",
    type: "string"
  },
  {
    id: "qrcode",
    type: "string"
  },
  {
    id: "gender",
    type: "uint8",
    size: 1
  },
  {
    id: "uinType",
    type: "uint32",
    size: 4
  },
  {
    id: "certificateStatus",
    type: "uint32",
    size: 4
  },
  {
    id: "chatTag",
    type: "string"
  },
  {
    id: "birthday",
    type: "uint64",
    size: 8
  },
  {
    id: "remark",
    type: "string"
  },
  {
    id: "maritalStatus",
    type: "uint32",
    size: 4
  },
  {
    id: "sexualOrientation",
    type: "uint32",
    size: 4
  },
  {
    id: "friendIntention",
    type: "uint32",
    size: 4
  },
  {
    id: "belongToUin",
    type: "uint64",
    size: 8
  }
];

// 通用body
// 大群属性
export const LargeGroupInfo = [
  {
    id: "groupUin",
    type: "uint64",
    size: 8
  },
  {
    id: "isUnTitle",
    type: "uint32",
    size: 4
  },
  {
    id: "groupTitle",
    type: "string"
  },
  {
    id: "TotalCount",
    type: "uint32",
    size: 4
  },
  {
    id: "qrcode",
    type: "string"
  },
  {
    id: "ViewProfileChatSet",
    type: "uint32",
    size: 4
  },
  {
    id: "groupIcon",
    type: "string"
  },
  {
    id: "banned",
    type: "uint32",
    size: 4
  }
];
//群主加铍铜成员
export const LargeGroupMemInfo = [
  {
    id: "uin",
    type: "uint64",
    size: 8
  },
  {
    id: "nickName",
    type: "string"
  },
  {
    id: "joinTime",
    type: "uint64",
    size: 8
  },
  {
    id: "memberType",
    type: "uint32",
    size: 4
  },
  {
    id: "smallAvatarUrl",
    type: "string"
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
    id: "Id",
    type: "uint64",
    size: 8
  },
  {
    id: "memberBanned",
    type: "uint32",
    size: 4
  },
  {
    id: "state",
    type: "uint32",
    size: 4
  }
];
//自己在大群中的信息
export const SelfGroupInfo = [
  {
    id: "uin",
    type: "uint64",
    size: 8
  },
  {
    id: "nickName",
    type: "string"
  },
  {
    id: "joinTime",
    type: "uint64",
    size: 8
  },
  {
    id: "memberType",
    type: "uint32",
    size: 4
  },
  {
    id: "smallAvatarUrl",
    type: "string"
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
    id: "Id",
    type: "uint64",
    size: 8
  },
  {
    id: "memberBanned",
    type: "uint32",
    size: 4
  },
  {
    id: "state",
    type: "uint32",
    size: 4
  }
];

export const message = [
  {
    id: "msgId",
    type: "uint64",
    size: 8
  },
  {
    id: "srcUin",
    type: "uint64",
    size: 8
  },
  {
    id: "dstUin",
    type: "uint64",
    size: 8
  },
  {
    id: "Content",
    type: "string"
  },
  {
    id: "SendTime",
    type: "uint64",
    size: 8
  },
  {
    id: "nickName",
    type: "string"
  },
  {
    id: "smallAvatarUrl",
    type: "string"
  }
];
