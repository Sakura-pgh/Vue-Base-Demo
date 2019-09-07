const path = require('path');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

function resolve(dir) {
    return path.join(__dirname, './', dir);
}

// cdn预加载使用
const externals = {
    vue: 'Vue',
    'vue-router': 'VueRouter',
    vuex: 'Vuex',
    axios: 'axios',
    'vant': 'vant',
};

const cdn = {
    // 开发环境
    dev: {
        css: ['https://cdn.jsdelivr.net/npm/vant@2.1/lib/index.css'],
        js: []
    },
    // 生产环境
    build: {
        css: ['https://cdn.jsdelivr.net/npm/vant@2.1/lib/index.css'],
        js: [
            'https://cdn.bootcss.com/vue/2.6.10/vue.min.js',
            'https://cdn.bootcss.com/vue-router/3.0.3/vue-router.min.js',
            'https://cdn.bootcss.com/vuex/3.0.1/vuex.min.js',
            'https://cdn.bootcss.com/axios/0.18.0/axios.min.js',
            'https://cdn.jsdelivr.net/npm/vant@2.1/lib/vant.min.js'
        ]
    }
};

// 是否使用gzip
const productionGzip = true;
// 需要gzip压缩的文件后缀
const productionGzipExtensions = ['html', 'js', 'css', 'json', 'ico', 'svg'];

module.exports = {
    outputDir: 'dist',
    publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
    assetsDir: 'static',
    productionSourceMap: false,
    chainWebpack: config => {
        /**
         * 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
         */
        config.plugin('html').tap(args => {
            if (process.env.NODE_ENV === 'production') {
                args[0].cdn = cdn.build;
            }
            if (process.env.NODE_ENV === 'development') {
                args[0].cdn = cdn.dev;
            }
            return args;
        });

        // svg loader
        const svgRule = config.module.rule('svg'); // 找到svg-loader
        svgRule.uses.clear(); // 清除已有的loader, 如果不这样做会添加在此loader之后
        svgRule.exclude.add(/node_modules/); // 正则匹配排除node_modules目录
        svgRule // 添加svg新的loader处理
            .test(/\.svg$/)
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            });

        // 修改images loader 添加svg处理
        const imagesRule = config.module.rule('images');
        imagesRule.exclude.add(resolve('src/icons'));
        config.module.rule('images').test(/\.(png|jpe?g|gif|svg)(\?.*)?$/);

        config.resolve.alias
            .set('@', resolve('src'))
            .set('assets', resolve('src/assets'))
            .set('components', resolve('src/components'))
            .set('utils', resolve('src/utils'));

        // 无需使用@import在每个scss文件中引入变量或者mixin，也可以避免大量@import导致build变慢
        const oneOfsMap = config.module.rule('scss').oneOfs.store;
        // scss资源文件，可以在里面定义变量，mixin,全局混入样式等
        const sassResources = ['mixin.scss', 'param.scss', 'reset.scss'];
        oneOfsMap.forEach(item => {
            item.use('sass-resources-loader')
                .loader('sass-resources-loader')
                .options({
                    resources: sassResources.map(file =>
                        path.resolve(__dirname, 'src/style/' + file)
                    )
                })
                .end();
        });
    },
    // 修改webpack config, 使其不打包externals下的资源
    configureWebpack: config => {
        const myConfig = {};
        if (process.env.NODE_ENV === 'production') {
            // 1. 生产环境npm包转CDN
            myConfig.externals = externals;

            myConfig.plugins = [];
            // 2. 构建时开启gzip，降低服务器压缩对CPU资源的占用，服务器也要相应开启gzip
            productionGzip &&
                myConfig.plugins.push(
                    new CompressionWebpackPlugin({
                        test: new RegExp(
                            '\\.(' + productionGzipExtensions.join('|') + ')$'
                        ),
                        threshold: 8192,
                        minRatio: 0.8
                    })
                );
        }

        return myConfig;
    },
    devServer: {
        // host: 'localhost',
        host: '0.0.0.0',
        port: 8000, // 端口号
        https: false, // https:{type:Boolean}
        open: true, // 配置自动启动浏览器  http://172.16.1.12:7071/rest/mcdPhoneBar/
        hotOnly: true, // 热更新
        // proxy: 'http://localhost:8000'   // 配置跨域处理,只有一个代理
        proxy: {
            '/api': {
                target: 'http://10.101.130.9:8082/',
                changeOrigin: true,
                ws: true,
                pathRewrite: {
                    '^/api': ''
                }
            }
        }
    }
};
