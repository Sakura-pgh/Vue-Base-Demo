/**
 * api请求地址配置
 */
let baseURL = '/api'; // 默认请求链接
// 判断开发环境 设置不同的请求域名
if (process.env.NODE_ENV === 'development') {
    // 开发环境
    baseURL = 'https://www.easy-mock.com/mock/5cd2d1fb5110c02a69f7b52c/example/';
} else {
    switch (process.env.VUE_APP_ENV) {
        // 测试环境
        case 'testEnvironment':
            baseURL = 'https://www.easy-mock.com/mock/5cd2d1fb5110c02a69f7b52c/example/';
            break;
        // 演练环境
        case 'ppeEnvironment':
            baseURL = 'https://www.easy-mock.com/mock/5cd2d1fb5110c02a69f7b52c/example/';
            break;
        // 灰度环境
        case 'hdEnvironment':
            baseURL = 'https://www.easy-mock.com/mock/5cd2d1fb5110c02a69f7b52c/example/';
            break;
        // 生产环境
        case 'prodEnvironment':
            baseURL = 'https://www.easy-mock.com/mock/5cd2d1fb5110c02a69f7b52c/example/';
            break;
        default:
            console.log('当前环境变量不存在！');
    }
}

export { baseURL };
