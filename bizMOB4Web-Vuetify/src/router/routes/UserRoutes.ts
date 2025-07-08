import type { RouteRecordRaw } from 'vue-router';

export const UserRoutes: Array<RouteRecordRaw> = [
    {
        path: '/user_admin',
        component: () => import(/* webpackChunkName: "community" */ '@/layouts/full/FullLayout.vue'),
        meta: {
            requiresLogin: false
        },
        children: [
            {
                name: 'USR0010',
                path: '/user_admin',
                component: () => import(/* webpackChunkName: "community" */ '@/views/user/admin/index.vue')
            },
            {
                name: 'USR0020',
                path: '/user_group',
                component: () => import(/* webpackChunkName: "community" */ '@/views/user/group/index.vue')
            },
        ]
    },
];