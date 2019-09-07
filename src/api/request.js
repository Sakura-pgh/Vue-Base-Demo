import Vue from 'vue';
import axios from "axios";
import {
    baseURL
} from './baseURL.js';
import {
    Toast,
    Dialog
} from 'vant';

Vue.use(Dialog);
const formatParams = obj => {
    let newParams = new URLSearchParams();
    Object.keys(obj).forEach(key => {
        newParams.append(key, obj[key]);
    });
    console.log(newParams);
    return newParams;
};

//  发起网络请求
const post = (
    method,
    params = {}, {
        showWait = true, // 是否需要显示等待
        interceptData = true, // 是否需要拦截数据，返回对象里如果code !== '200',则拒绝
        errorToast = true, // 是否需要提示错误
        timeout = 100000, // 超时（毫秒）
        contentType = 'application/json', // 请求头内容类型
        type = 'post', // 请求类型
        url = baseURL,
        waitMessage = '加载中...'
    } = {}
) => {
    //  创建axios实例
    const Request = axios.create({
        baseURL: url,
        timeout: timeout // 超时（毫秒）
    });

    axios.defaults.headers.post['Content-Type'] = contentType;
    axios.defaults.headers['SESSIONNO'] =
        params.token || localStorage.getItem('token');

    //  //  添加请求拦截器
    Request.interceptors.request.use(
        function (config) {
            //  //  在发送请求之前做些什么
            if (showWait) {
                Toast.loading({
                    mask: false,
                    forbidClick: true,
                    message: waitMessage,
                    duration: 0
                });
            }
            return config;
        },
        function (error) {
            //  对请求错误做些什么
            Toast.clear();
            return Promise.reject(error);
        }
    );
    //  添加响应拦截器
    Request.interceptors.response.use(
        function (response) {
            //  对响应数据做点什么
            Toast.clear();
            return response;
        },
        function (error) {
            //  对响应错误做点什么
            Toast.clear();
            return Promise.reject(error);
        }
    );

    // 设置公共参数
    params.token = params.token || localStorage.getItem('token');
    params.reqId = new Date().getTime();

    // 调用接口了

    // 成功回调
    const success = res => {
        let result = res.data; // 接口返回的数据
        if (interceptData) {
            if (result.resType) {
                if (result && result.resType !== '00') {
                    // 接口返回数据状态了
                    return Promise.reject(result);
                }
            } else {
                if (result && (result.code !== '200' || result.status !== 200)) {
                    // 接口返回数据状态了
                    return Promise.reject(result);
                }
            }
        }
        return Promise.resolve(result);
    };

    // 失败回调
    const fail = error => {
        // 是否需要提示错误
        errorToast && Toast(error.msg || error.message || '网络错误，请重试');
        return Promise.reject(error);
    };

    if (contentType === 'application/x-www-form-urlencoded') {
        // FORM表单提交，需转换参数
        params = formatParams(params);
    }

    if (type.toLowerCase() === 'get') {
        return Request.get(method, {
            params: params
        })
            .then(success)
            .catch(fail);
    } else {
        return Request.post(method, params)
            .then(success)
            .catch(fail);
    }
};
export default post;
