import * as types from './mutation-types.js';

export default {
    // 修改默认收货信息
    actionDefaultAddress ({ commit }, { defaultAddress }) {
        commit(types.SET_DEFAULTADDRESS, defaultAddress); // 异步驱动修改token
    }
};