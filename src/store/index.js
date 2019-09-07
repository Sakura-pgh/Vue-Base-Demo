import Vue from 'vue';
import Vuex from 'vuex';
import state from './state.js';
import * as getters from './getters.js';
import mutations from './mutations.js';
import actions from './actions.js';
import ticketModules from './modules/ticket.js'; // 洗车服务子模块
import createLogger from 'vuex/dist/logger'; // 修改日志
import createPersistedState from 'vuex-persistedstate'; // 状态持久化页面刷新vuex数据不丢失

Vue.use(Vuex);

const debug = process.env.NODE_ENV === 'development'; // 开发环境中为true，否则为false

export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules: {
        ticketModules
    },
    // 状态持久化页面刷新vuex数据不丢失
    plugins: debug
        ? [
            createLogger(),
            createPersistedState({
                storage: window.sessionStorage
            })
        ]
        : [
            createPersistedState({
                storage: window.sessionStorage
            })
        ]
});
