import { userInfo ,LargeGroupInfo,LargeGroupMemInfo} from './COMMON';
// 大群列表

const LargeGroupContact=[
...LargeGroupInfo,
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
const data = {
  // 请求
  '70001015': {

    body: []
  },
  // 响应
  '70008015': {
    action: 'Grouplist/groups',
    body: [{
        id: 'grouplist',
        type: 'uint32',
        size: 4,
        // 是否数组
        isArray: true,
        // item结构体
        itemStruct: LargeGroupContact
    }]
  }
};

export default data;
