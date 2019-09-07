import post from './request.js';

// 获取商品分类
export const getGoosTypesInfo = (params, config) => {
    return post('getGoosTypesInfo', params, config);
};

// 查询商品具体信息
export const getGoodDetail = (params, config) => {
    return post('getGoodDetail', params, Object.assign({
        type: 'GET'
    }, config));
};