/*
 * 提交状态修改，即set、get中的set; 是Vuex中唯一修改state的方式 不支持异步操作
 */

import * as types from './mutation-types';

export default {
    // 修改默认收货信息
    [types.SET_DEFAULTADDRESS] (state, defaultAddress) {
        state.defaultAddress = defaultAddress;
    }
};
