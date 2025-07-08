import type { RouteRecordRaw } from 'vue-router';

export const ScreenRoutes: Array<RouteRecordRaw> = [
    {
        path: '/screen',
        component: () => import(/* webpackChunkName: "screen" */ '@/layouts/full/FullLayout.vue'),
        meta: {
            requiresLogin: false
        },
        children: [
            {
                name: 'SCREEN0010',
                path: '/screen',
                component: () => import(/* webpackChunkName: "screen" */ '@/views/screen/screen/index.vue')
            },
        ]
    },
    {
        path: '/screen_group',
        component: () => import(/* webpackChunkName: "screen" */ '@/layouts/full/FullLayout.vue'),
        meta: {
            requiresLogin: false
        },
        children: [
            {
                name: 'SCREEN0020',
                path: '/screen_group',
                component: () => import(/* webpackChunkName: "screen" */ '@/views/screen/screengroup/index.vue')
            },
            {
                name: 'SCREEN0021',
                path: '/screen_add',
                component: () => import(/* webpackChunkName: "screen" */ '@/views/screen/screengroup/screen_add.vue')
            },
        ]
    },
];