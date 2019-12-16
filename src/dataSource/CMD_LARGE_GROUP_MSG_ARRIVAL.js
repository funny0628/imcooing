// 大群消息已达回执
const data = {
    // 请求
    70001012: {
        body: [{
                id: 'groupUin',
                type: 'uint64',
                size: 8
            },
            {
               id:"count",
               type: 'uint32',
               size: 4
            },
        ]
    },
    // 响应
    70008012: {
        action: 'LargeGroupMsgArrival/LargeGroupMsgHand',
        body: []
    }
};

export default data;
