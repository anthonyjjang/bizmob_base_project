import { RouteRecordRaw } from 'vue-router';

const loginRoutes: Array<RouteRecordRaw> = [
    {
        path: '/board',
        name: 'BOARD0100',
        props: true,
        component: () => import(/* webpackChunkName: "board" */ '@/views/BOARD/BOARD0100.vue')
    },
    {
        path: '/board/detail',
        name: 'BOARD0300',
        props: true,
        component: () => import(/* webpackChunkName: "board" */ '@/views/BOARD/BOARD0300.vue')
    }
];
export default loginRoutes;
