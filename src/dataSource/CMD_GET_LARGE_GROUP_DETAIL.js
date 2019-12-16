import {LargeGroupInfo,SelfGroupInfo,LargeGroupMemInfo} from './COMMON.js'

//获取大群详情
const data = {
    "7000100f": {
    body: [
        {
            id: 'groupUin',
            type: 'uint64',
            size: 8
        },
    ]
  },
  '7000800f': {
    action: 'GetLargeGroupDetail/LargeGroupDetail',
    body: [
        ...LargeGroupInfo,
        ...SelfGroupInfo,
      {
        id: 'LargeGroupMemInfo',
        type: 'uint32',
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



