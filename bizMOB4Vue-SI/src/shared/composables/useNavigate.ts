import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useIonRouter, menuController } from '@ionic/vue';
import { StoreService } from '@/shared';

/**
 * @title Navigate Composable
 * @description 화면 제어와 연관된 공통함수
 */
export function useNavigate() {
    const ionRouter = useIonRouter();
    const route = useRoute();
    const router = useRouter();

    function getLocation(name: string, params?: any) {
        const location: any = {};

        // name이 '/'로 시작하면 path로 인식
        if (name.indexOf('/') === 0) {
            location['path'] = name;
        }
        else {
            location['name'] = name;
        }

        if (params) {
            location['query'] = params;
        }

        return location;
    }

    return {
        // 실시간 hash를 반환하는 함수
        getHashComp: () => {
            return computed(() => route.hash);
        },

        // 실시간 props를 반환하는 함수
        getPropsComp: (def: Record<any, any>) => {
            return computed(() => ({ ...def, ...route.params, ...route.query }));
        },

        isBackNavigation: () => {
            // 'app'이라는 이름의 새로운 StoreService 인스턴스를 생성합니다.
            const appStore = new StoreService('app');
            return appStore.getters('isBackNavigation');
        },

        // 화면 오픈 (to는 path 또는 name)
        openPage: (to: string | Json, params?: Json, isAnimation = true): void => {
            // 'app'이라는 이름의 새로운 StoreService 인스턴스를 생성합니다.
            const appStore = new StoreService('app');
            // 'setRouteNext' 액션을 디스패치하여 다음 라우트를 설정합니다.
            appStore.dispatch('setRouteNext', true);

            // 'to'가 문자열인 경우, getLocation 함수를 사용하여 위치를 가져옵니다.
            // 'to'가 Json 객체인 경우, 'to'를 그대로 사용합니다.
            const location = (typeof  to === 'string') ? getLocation(to, params) : to;
            // ionRouter를 사용하여 페이지를 이동합니다.
            // isAnimation이 true인 경우, 'forward' 애니메이션을 사용하고,
            // false인 경우, 애니메이션 없이 페이지를 이동합니다.
            ionRouter.navigate(location, isAnimation ? 'forward' : 'none', 'push');
        },

        // 화면 교체 (to는 path 또는 name)
        replacePage: (to: string | Json, params?: Json, isAnimation = true): void => {
            const appStore = new StoreService('app');
            appStore.dispatch('setRouteNext', true);

            const location = (typeof  to === 'string') ? getLocation(to, params) : to;
            ionRouter.navigate(location, isAnimation ? 'forward' : 'none', 'replace');
        },

        // 화면 닫기
        back: (): void => {
            router.back();
        },

        // 메뉴 열기
        openMenu: (): void => {
            const appStore = new StoreService('app');
            appStore.dispatch('openMenu');
        },

        // 메뉴 닫기
        closeMenu: async (): Promise<boolean> => {
            return await menuController.close();
        }
    };
}