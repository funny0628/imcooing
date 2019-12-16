
// 短信验证
const data = {
  // 请求
  30011006: {
    body: [
      {
        id: 'phoneNumber',
        type: 'string'
      },
      {
        id: 'langCode',
        type: 'string'
      },
      {
        id: 'BusinessType',
        type: 'uint32',
        size: 4
      }
    ]
  },
  // 响应
  30018006: {
    action: 'User/smsReturn',
    body: []
  }
};

export default data;
