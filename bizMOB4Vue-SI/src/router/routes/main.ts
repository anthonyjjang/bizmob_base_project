import { RouteRecordRaw } from 'vue-router';

const mainRoutes: Array<RouteRecordRaw> = [
    {
        path: '/main',
        component: () => import(/* webpackChunkName: "main" */ '@/layouts/PageLayout.vue'),
        children: [
            {
                path: '',
                name: 'MAIN0100',
                props: true,
                component: () => import(/* webpackChunkName: "main" */ '@/views/MAIN/MAIN0100.vue')
            },
            {
                path: '/sandbox',
                name: 'MAIN0200',
                props: true,
                component: () => import(/* webpackChunkName: "main" */ '@/views/MAIN/MAIN0200.vue')
            },
        ]
    },
];
export default mainRoutes;
