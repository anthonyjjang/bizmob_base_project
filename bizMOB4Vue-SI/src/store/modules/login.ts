import { useNetwork } from '@/shared';

export default {
    namespaced: true,
    state: {
        loginToken: '', // 자동 로그인 관련 토큰
    },
    getters: {
        // 로그인 토큰
        loginToken: (state: any) => {
            return state.loginToken;
        },
    },
    mutations: {
        setState(state: any, { key, value }: any) {
            state[key] = value;
        }
    },
    actions: {
        async postLogin({ commit }: any, payload: {
            userId: string, // 사용자 아이디
            password: string, // 사용자 패스워드
        }) {
            const { requestLogin } = useNetwork();
            const { result, header, body }: Res = await requestLogin({
                isMock: true,
                trcode: 'DM0001',
                userId: payload.userId,
                password: payload.password,
                body: {
                    userId: payload.userId,
                    passwd: payload.password,
                }
            });

            return result ? { header, body } : null;
        },
        // 로그인 토큰 저장
        setLoginToken({ commit }: any, loginToken: string) {
            commit('setState', { key: 'loginToken', value: loginToken });
        },
    },
};