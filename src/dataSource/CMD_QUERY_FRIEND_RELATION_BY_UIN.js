

  
import {userInfo} from './COMMON'

  //查询用户信息
const data = {
    31111021:{
        body:[
            {
                id: 'uin',
                type: 'uint64',
                size: 8
            }
        ]
    },
    31118021:{
        action:"QueryFriendRelationByUin/FriendRelation",
        body:[
           ...userInfo,
           {
            id:'userStatus',
            type: 'uint8',
            size: 1
           },
           {
            id:'state',
            type: 'uint32',
            size: 4
           }
           
        ]
    }
}

export default data;