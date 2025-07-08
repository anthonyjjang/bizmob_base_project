import type { RouteRecordRaw } from 'vue-router';

export const MenuRoutes: Array<RouteRecordRaw> = [
    {
        path: '/menu_admin',
        component: () => import(/* webpackChunkName: "community" */ '@/layouts/full/FullLayout.vue'),
        meta: {
            requiresLogin: false
        },
        children: [
            {
                name: 'MNU0010',
                path: '/menu_admin',
                component: () => import(/* webpackChunkName: "community" */ '@/views/user/admin/index.vue')
            },
            // {
            //     name: 'USR0011',
            //     path: '/user_admin/:id',
            //     component: () => import(/* webpackChunkName: "community" */ '@/views/community/notice/detail.vue')
            // },
        ]
    },
];