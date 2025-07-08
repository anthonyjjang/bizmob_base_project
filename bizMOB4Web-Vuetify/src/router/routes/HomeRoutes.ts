import type { RouteRecordRaw } from 'vue-router';

export const HomeRoutes: Array<RouteRecordRaw> = [
    {
        path: '/dashboard',
        component: () => import(/* webpackChunkName: "home" */ '@/layouts/full/FullLayout.vue'),
        meta: {
            requiresLogin: false
        },
        children: [
            {
                name: 'HOM0010',
                path: '/dashboard',
                component: () => import(/* webpackChunkName: "home" */ '@/views/home/dashboard/index.vue')
            },
        ]
    },
];