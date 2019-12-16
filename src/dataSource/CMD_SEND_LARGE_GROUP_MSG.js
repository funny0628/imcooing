//发送大群消息
const data = {
    70001011:{
        body:[
            {
                id: 'groupUin',
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
    70008011:{
        action:"SendLargeGroupMsg/sendGroupmsg",
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