import Vue from "vue"
import { Message } from 'view-design';
Vue.component('Message', Message);

export default {
    MsgError: (msg) => {
        console.log(msg)
        console.log(this.$Message)
        this.$Message.error(msg)
    },
    loadCss: (url) => {
        let css=document.createElement("link");
        css.rel="stylesheet";
        css.href=url;
        css.type="text/css";
        document.getElementsByTagName('head')[0].appendChild(css);
    },
    //判断时间时分秒大小
    CompareTime: (startTime,endTime) => {
        if (startTime instanceof Date) {
            startTime = startTime.getHours()+":"+startTime.getMinutes()+":"+startTime.getSeconds();
        }
        if (endTime instanceof Date) {
            endTime = endTime.getHours()+":"+endTime.getMinutes()+":"+endTime.getSeconds();
        }
        var startTimeArr = startTime.split(":");
        var endTimeArr = endTime.split(":");
        if(parseInt(startTimeArr[0])>parseInt(endTimeArr[0])){
            return 1;
        }else if(parseInt(startTimeArr[0])<parseInt(endTimeArr[0])){
            return -1;
        }else{
            if(parseInt(startTimeArr[1])>parseInt(endTimeArr[1])){
                return 1;
            }else if(parseInt(startTimeArr[1])<parseInt(endTimeArr[1])){
                return -1;
            }else{
                if(parseInt(startTimeArr[2])>parseInt(endTimeArr[2])){
                    return 1;
                } else if(parseInt(startTimeArr[1])<parseInt(endTimeArr[1])){
                    return -1;
                } else {
                    return 0;
                }
            }
        }
    },
}