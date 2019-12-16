// 消息已达回执 
const data = {
  // 请求
  60011023: {
    body: [{
        id: 'dstUin',
        type: 'uint64',
        size: 8
      },
      {
        id: "count",
        type: 'uint32',
        size: 4
      },
    ]
  },
  // 响应
  60018023: {
    action: 'AeceiptMsgArrival/receiptOk',
    body: []
  }
};

export default data;