
//有新消息推送
const data = {
   //响应的
    60018000:{
        action:"PushHasMsg/PushHasNewMsg",
        body:[
            {
                id: 'ChatType',
                type: 'uint32',
                size: 4
            },
            {
                id: 'dstUin',
                type: 'uint64',
                size: 8,
            }
        ]
    }
}

export default data;