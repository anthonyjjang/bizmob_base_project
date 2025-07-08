import { createRouter, createWebHistory } from '@ionic/vue-router';
import { alertController, modalController, menuController } from '@ionic/vue';
import { StoreService, useMessage, useNetwork } from '@/shared';
import App from '@/bizMOB/Xross/App';
import Event from '@/bizMOB/Xross/Event';
import Device from '@/bizMOB/Xross/Device';

import readme from '@/router/routes/readme';

/** Sample */
import loginRoutes  from '@/router/routes/login';
import boardRoutes from '@/router/routes/board';
import mainRoutes from '@/router/routes/main';

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes: [
    // Default Path 설정
        {
            path: '/',
            redirect: '/login',
        },

        // 라우터 추가
        ...readme,

        // Sample
        ...loginRoutes,
        ...mainRoutes,
        ...boardRoutes,

        // 비 선언 Path 처리
        {
            path: '/:pathMatch(.*)*',
            redirect: '/', // 선언되지 않은 Path릂 지정된 경로로 리다이렉트
        },
    ]
});

/**
 * 네비게이션 가드 설정
 * to: 이동할 url
 * from: 현재 url
 * next: to에서 지정한 url로 이동하기 위해 호출하는 함수
 */
let isAppKillDelay = false;
router.beforeEach(async(to, from) => {
    const { requestTr } = useNetwork();
    const { toast } = useMessage();
    const appStore = new StoreService('app');
    const isRouteNext = appStore.getters('isRouteNext');

    // Root 화면
    if (from.path === '/') {
        // 화면 추적(App 첫 화면 열기) 전문 호출 (await 없이 호출)
        requestTr({
            trcode: 'DM9999',
            body: {
                from: from.path,
                to: to.path,
            },
            isMock: true
        });

        appStore.dispatch('setNavigationDirection', 'forward'); // 화면 이동 방향 설정
        appStore.dispatch('setRouteNext', false);
        return true;
    }
    // 화면 Open 여부
    else if (isRouteNext) {
        // 화면 추적(화면 열기) 전문 호출 (await 없이 호출)
        requestTr({
            trcode: 'DM9999',
            body: {
                from: from.path,
                to: to.path,
            },
            isMock: true
        });

        appStore.dispatch('setNavigationDirection', 'forward'); // 화면 이동 방향 설정
        appStore.dispatch('setRouteNext', false);
        return true;
    }
    // 뒤로가기
    else {
        const [ alert, modal, isMenu ] = await Promise.all([
            alertController.getTop(),
            modalController.getTop(),
            menuController.isOpen(),
        ]);

        // Alert이 있는 경우
        if (alert) {
            return false;
        }
        // Menu가 Open되어 있는 경우
        else if (isMenu) {
            menuController.close();
            return false;
        }
        // Modal이 있는 경우
        else if (modal) {
            // Modal이 Backbutton을 막아야 하는 경우
            if (modal.classList.contains('backbutton-prevent')) {
                return false;
            }
            // Modal Type 중 Select인 경우
            else if (modal.classList.contains('ion-select-wrapper')) {
                modalController.dismiss(null, 'cancel'); // Modal 닫기
                return false;
            }
            // Modal Type 중 Sheet인 경우
            else if (modal.classList.contains('ion-sheet-wrapper')) {
                modalController.dismiss(null, 'cancel'); // Modal 닫기
                return false;
            }
            // Modal Type 중 Modal인 경우
            else if (modal.classList.contains('ion-modal-wrapper')) {
                modalController.dismiss(null, 'cancel'); // Modal 닫기
                return false;
            }
            // Modal Type 중 Popup인 경우
            else if (modal.classList.contains('ion-popup-wrapper')) {
                modalController.dismiss(null, 'cancel'); // Modal 닫기
                return false;
            }
            // 그 외
            else {
                modalController.dismiss(null, 'cancel'); // Modal 닫기
                return false;
            }
        }
        // 메인 화면인 경우 뒤로가기 버튼을 누르면 앱 종료
        else if ([ '/main' ].includes(from.path)) {
            if (isAppKillDelay) {
                App.exit({ _sType: 'kill' });
            }
            else {
                toast('앱을 종료하시려면 한번 더 뒤로가기 버튼을 눌러주세요.');
                isAppKillDelay = true;

                setTimeout(() => isAppKillDelay = false, 1500);
                return false;
            }
        }
        // 그 외
        else {
            // 화면 추적(화면 닫기) 전문 호출 (await 없이 호출)
            requestTr({
                trcode: 'DM9999',
                body: {
                    from: from.path,
                    to: to.path,
                },
                isMock: true
            });

            appStore.dispatch('setNavigationDirection', 'back'); // 화면 이동 방향 설정
            appStore.dispatch('setRouteNext', false);
            return true;
        }
    }
});

// 라우터 이동 후 이벤트 설정
router.afterEach((to, from) => {
    // bizMOB Backbutton Default Event Setup
    Device.isApp() && Event.setEvent('backbutton', () => router.back());
});

export default router;
