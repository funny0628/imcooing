import { LargeGroupMemInfo, SelfGroupInfo } from "./COMMON";
// 获取好友列表
const data = {
  // 请求
  "7000101C": {
    body: [
      {
        id: "groupUin",
        type: "uint64",
        size: 8
      }
    ]
  },
  // 响应
  "7000801c": {
    action: "GetLargeGroupDetail/setAdminInfo",
    body: [
      {
        id: "groupUin",
        type: "uint64",
        size: 8
      },
      // 群主的信息
      ...JSON.parse(JSON.stringify(LargeGroupMemInfo)),
      // 管理员列表
      {
        id: "adminList",
        type: "uint32",
        size: 4,
        // 是否数组
        isArray: true,
        // item结构体
        itemStruct: LargeGroupMemInfo
      }
    ]
  }
};

export default data;
