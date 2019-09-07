/*
 * 票务模块状态管理
 */
import * as types from '../mutation-types';

const ticketModules = {
    state: {
        sceneryId: '', // 景区Id
    },
    getters: {
        // 景区Id
        sceneryId (state) {
            return state.sceneryId;
        },
    },
    mutations: {
        // 修改景区ID
        [types.SET_SCENERYID](state, sceneryId) {
            state.sceneryId = sceneryId;
        },

    },
    // 异步驱动修改
    actions: {
        // 修改景区ID
        actionSceneryId({ commit }, { sceneryId }) {
            commit(types.SET_SCENERYID, sceneryId);
        }
    }
};

export default ticketModules;
