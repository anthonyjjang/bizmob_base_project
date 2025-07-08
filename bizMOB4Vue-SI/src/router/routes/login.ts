import { RouteRecordRaw } from 'vue-router';

const loginRoutes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'LOGIN0100',
        props: true,
        component: () => import(/* webpackChunkName: "login" */ '@/views/LOGIN/LOGIN0100.vue')
    }
];
export default loginRoutes;
