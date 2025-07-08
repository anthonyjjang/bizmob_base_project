import { createRouter, createWebHistory } from 'vue-router';
import { ErrorRoutes } from './routes/ErrorRoutes';
import { LoginRoutes } from './routes/LoginRoutes';
import { HomeRoutes } from './routes/HomeRoutes';
import { CommunityRoutes } from './routes/CommunityRoutes';
import { ScreenRoutes } from './routes/ScreenRoutes';
import { UserRoutes } from './routes/UserRoutes';
import { MenuRoutes } from './routes/MenuRoutes';


import { useAuthStore } from '@/store/authStore';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/login',
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/error/404'
        },
        ...ErrorRoutes,
        ...LoginRoutes,
        ...HomeRoutes,
        ...CommunityRoutes,
        ...ScreenRoutes,
        ...UserRoutes,
        ...MenuRoutes,
    ]
});

router.beforeEach(async(to, from) => {
    const authStore = useAuthStore();

    if (to.path === '/login') {
        authStore.clearToken();
    }
    else {
        authStore.initBzToken();
    }

    return true;
});

export default router;
