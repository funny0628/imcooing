import { userInfo } from './COMMON';
//  踢出用户，也就是用户被挤掉的情况
const data = {
  // 响应
  10001007: {
    action: 'Index/kickUser',
    body: [
      {
        id: 'kickType',
        type: 'uint32',
        size: 4
      }
    ]
  }
};
export default data;
