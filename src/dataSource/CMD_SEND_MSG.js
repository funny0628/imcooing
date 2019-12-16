//发送消息
const data = {
    60011001:{
        body:[
            {
                id: 'dstUin',
                type: 'uint64',
                size: 8
            },
            {
                id: 'localId',
                type: 'uint64',
                size: 8,
            },
            {
                id: 'Content',
                type: 'string'
            },
        ]
    },
    60018001:{
        action:"SendMsg/sendmsg",
        body:[
            {
                id: 'localId',
                type: 'uint64',
                size: 8,
                value:0
            },
            {
                id: 'msgId',
                type: 'uint64',
                size: 8
            },
            {
                id: 'SendTime',
                type: 'uint64',
                size: 8
            },
        ]
    }
}

export default data;