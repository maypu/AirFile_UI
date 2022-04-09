import { Message } from 'view-design'
import axios from 'axios'

let errorMsgDuration = 4

let instance = axios.create({
    baseURL: process.env.API_ROOT,
    timeout: 300000,  // 超时(毫秒)，401
})

instance.interceptors.request.use(config => {
    return config;
}, error => {
    console.log(error);
    return Promise.reject(error);
});

// 添加响应拦截器
instance.interceptors.response.use((res) => {
    // 对响应数据做点什么
    if (res && res.data) {
        if (res.data.Code == 200) {
            return res.data
        } else {
            console.log(res.data)
            Message.error({
                content: res.data.Message,
                duration: errorMsgDuration
            })
            // return Promise.reject(res.data)
        }
    } else {
        console.log(res)
        // return Promise.reject(res.data)
    }
}, function (error) {
    console.log(error)
    if (error.message = "Network Error") {
        Message.error({
            content: '网络错误',
            duration: errorMsgDuration
        })
    } else {
        Message.error({
            content: error.message,
            duration: errorMsgDuration
        })
    }
    if (error.response) {
        // 对响应错误做点什么;没有权限401
        if (error.response.status === 401) {
            Message.error({
                content: '登录超时',
                duration: errorMsgDuration
            })
        } else if (error.response.status === 403) {
            Message.error({
                content: '暂无权限',
                duration: errorMsgDuration
            })
        }
    }
    return Promise.reject(error);
});
export default instance