import type { RouteRecordRaw } from 'vue-router';

export const LoginRoutes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        component: () => import(/* webpackChunkName: "login" */ '@/layouts/blank/BlankLayout.vue'),
        meta: {
            requiresLogin: false
        },
        children: [
            {
                name: 'LOG0010',
                path: '/login',
                component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue')
            },
        ]
    },
];