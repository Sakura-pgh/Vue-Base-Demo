import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueWechatTitle from 'vue-wechat-title'; // 引入vue-wechat-title插件 用于动态改变标题
import * as filters from './utils/filter.js'; // 引入注册的过滤器


// vue在实例上注册过滤器
Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[key]);
});

Vue.use(VueWechatTitle);
Vue.config.productionTip = false;

new Vue({
    router,
    store,
    render: (h) => h(App)
}).$mount('#app');
