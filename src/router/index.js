import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

const router = new Router({
    mode: 'hash',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            redirect:'mine'
        },
        // 我的
        {
            path: '/mine',
            name: 'Mine',
            component: () =>
                import(/* webpackChunkName: "Mine" */ '@/views/Mine/Mine.vue'),
            meta: {
                showBaseTabbar: true,
                needLogin: false,
                name: '我的'
            }
        }
    ]
});

export default router;
