//发送消息
const data = {
    0x70001014:{
        body:[
            {
                id: 'groupUin',
                type: 'uint64',
                size: 8
            },
            {
                id: 'Count',
                type: 'uint32',
                size: 4,
            },
            {
                id: 'UinList',
                type: 'uint64',
                type: 8
            },
        ]
    },
    0x70008014:{
        action:"RemoveLargeGroupMem/RemoveGroupMem",
        body:[]
    }
}

export default data;