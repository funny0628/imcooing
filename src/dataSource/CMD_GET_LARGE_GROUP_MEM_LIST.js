
import {LargeGroupMemInfo} from './COMMON';

//获取大群的成员列表
const data = {
  // 请求
  '70001010': {
    body: [
      {
        id: 'groupUin',
        type: 'uint64',
        size: 8
      },
      {
        id: 'startId',
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
  '70008010': {
    action: 'largeGroup/largegrouplist',
    body: [
      {
        id: 'count',
        type: 'uint32',
        size: 4
      },
      {
        id: 'largegrouplist',
        type: 'uint32',
        size: 4,
        // 是否数组
        isArray: true,
        // item结构体
        itemStruct: LargeGroupMemInfo
      },
      {
        id: 'hasMore',
        type: 'uint32',
        size: 4
      }
    ]
  }
};

export default data;
