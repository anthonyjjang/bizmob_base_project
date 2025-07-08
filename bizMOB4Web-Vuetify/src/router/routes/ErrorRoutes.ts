import type { RouteRecordRaw } from 'vue-router';

export const ErrorRoutes: Array<RouteRecordRaw> = [
    {
        path: '/error',
        component: () => import(/* webpackChunkName: "error" */ '@/layouts/blank/BlankLayout.vue'),
        meta: {
            requiresLogin: false
        },
        children: [
            {
                name: 'ERR0010',
                path: '/error/404',
                component: () => import(/* webpackChunkName: "error" */ '@/views/error/404.vue')
            },
        ]
    },
];