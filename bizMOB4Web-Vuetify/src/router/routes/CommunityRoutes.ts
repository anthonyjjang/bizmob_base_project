import type { RouteRecordRaw } from 'vue-router';

export const CommunityRoutes: Array<RouteRecordRaw> = [
    {
        path: '/notice_list',
        component: () => import(/* webpackChunkName: "community" */ '@/layouts/full/FullLayout.vue'),
        meta: {
            requiresLogin: false
        },
        children: [
            {
                name: 'COM0010',
                path: '/notice_list',
                component: () => import(/* webpackChunkName: "community" */ '@/views/community/notice/index.vue')
            },
            {
                name: 'COM0011',
                path: '/notice_list/:id',
                component: () => import(/* webpackChunkName: "community" */ '@/views/community/notice/detail.vue')
            },
        ]
    },
];