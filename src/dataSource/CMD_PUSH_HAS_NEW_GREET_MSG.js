import { message } from './COMMON.js';
//接收有新消息
const data = {
    //响应的
    60028000:{
        action:"PushHasGreetMsg/PushHasGreetMsg",
        body:[
            {
                ...message
            }
        ]
     }
 }
 
 export default data;