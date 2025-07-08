export default {
    namespaced: true,
    state: {
        loadingHandler: [], // 로딩 핸들러
        isShowLoading: false, // 프로그레스 표시 여부
        isShowMenu: false, // 메뉴 표시 여부
        isRouteNext: false, // 다음 화면 오픈 여부
        navigationDirection: 'forward', // 화면 이동 방향 (forward, back)
    },
    getters: {
        // 로딩 핸들러
        loadingHandler: (state: any) => {
            return state.loadingHandler;
        },
        // 프로그레스 표시 여부
        isShowLoading: (state: any) => {
            return state.isShowLoading;
        },
        // 메뉴 표시 여부
        isShowMenu: (state: any) => {
            return state.isShowMenu;
        },
        // 다음 화면 오픈 여부
        isRouteNext: (state: any) => {
            return state.isRouteNext;
        },
        // 화면 이동 방향
        navigationDirection: (state: any) => {
            return state.navigationDirection;
        },
        // back으로 화면 진입 여부
        isBackNavigation: (state: any) => {
            return state.navigationDirection === 'back';
        },
    },
    mutations: {
        setState(state: any, { key, value }: any) {
            state[key] = value;
        },
        pushLoadingHandler(state: any) {
            state.loadingHandler.push(true);
        },
        popLoadingHandler(state: any) {
            state.loadingHandler.pop();
        },
    },
    actions: {
        // 프로그레스 표시 여부 설정
        setLoadingState({ commit }: any, is: boolean) {
            commit('setState', { key: 'isShowLoading', value: is });
        },
        // 프로그레스 Show
        showLoading({ commit, getters }: any) {
            if (getters.loadingHandler.length === 0) {
                commit('pushLoadingHandler');
                commit('setState', { key: 'isShowLoading', value: true });
            }
            else {
                commit('pushLoadingHandler');
            }
        },
        // 프로그레스 Hide
        hideLoading({ commit, getters }: any) {
            setTimeout(async() => {
                commit('popLoadingHandler');

                if (getters.loadingHandler.length === 0) {
                    commit('setState', { key: 'isShowLoading', value: false });
                }
            }, 100);
        },

        // 메뉴 표시 여부 설정
        setMenuState({ commit }: any, is: boolean) {
            commit('setState', { key: 'isShowMenu', value: is });
        },
        // 메뉴 Open
        openMenu({ commit }: any) {
            commit('setState', { key: 'isShowMenu', value: true });
        },
        // 메뉴 Close
        closeMenu({ commit }: any) {
            commit('setState', { key: 'isShowMenu', value: false });
        },

        // 화면 이동 방향 설정
        setNavigationDirection({ commit }: any, direction: string) {
            commit('setState', { key: 'navigationDirection', value: direction });
        },
        // 다음 화면 오픈 여부 설정
        setRouteNext({ commit }: any, is: boolean) {
            commit('setState', { key: 'isRouteNext', value: is });
        },
    },
};