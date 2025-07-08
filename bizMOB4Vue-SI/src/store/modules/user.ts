export default {
    namespaced: true,
    state: {
        user: null, // 사용자 정보
        // userId: '', // 사용자 ID
        // userName: '', // 사용자 이름
        // userSeq: '', // 사용자 고유값
    },
    getters: {
        // 사용자 ID
        userId: (state: any) => {
            return state.user.userId;
        },
        // 사용자 이름
        userName: (state: any) => {
            return state.user.userName;
        },
        // 사용자 정보 반환
        user: (state: any) => {
            return state.user;
        },
        // 고유 값으로 본인 여부 확인
        isSelf: (state: any) => (seq: string) => {
            return state.user.userSeq === seq;
        },
    },
    mutations: {
        setState(state: any, { key, value }: any) {
            state[key] = value;
        }
    },
    actions: {
        // 유저 정보 저장
        setUser({ commit }: any, user: Json) {
            commit('setState', { key: 'user', value: user });
        },
    },
};