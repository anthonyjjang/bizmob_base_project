// README용 라우터 경로. 실제 프로젝트 작업시 제거.
export default [
    {
        path: '/readme',
        name: 'README01',
        props: true,
        component: () => import(/* webpackChunkName: "readme" */ '@/views/README/README01.vue')
    },
    {
        path: '/readme/template',
        name: 'README02',
        props: true,
        component: () => import(/* webpackChunkName: "readme" */ '@/views/README/README02.vue')
    },
];