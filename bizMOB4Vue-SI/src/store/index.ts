import { createStore, createLogger } from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import { customStorage } from './plugins'; // plugins 폴더에 있는 모든 플러그인 import

// 프로젝트에서 추가한 모듈 import
import app from './modules/app';
import login from './modules/login';
import user from './modules/user';

// Vuex 스토어 생성
export default createStore({
    modules: {
        app,
        login,
        user,
    },
    strict: process.env.NODE_ENV !== 'production',
    plugins: [
        // state 변화시 production 모드가 아니면 logger를 사용하여 console.log로 출력
        ...(
            process.env.NODE_ENV !== 'production'
                ? [ createLogger() ]
                : []
        ),
        // vuex state 변화시 SessionStorage에 저장하는 플러그인 (사용 안할 경우 paths를 []로 설정)
        createPersistedState({
            key: 'APP', // prefix key
            paths: ['user'], // sessionStorage에 저장할 모듈명 (Ex. ['user'] => user 모듈의 state가 변경시 sessionStorage에 저장됨)
            storage: customStorage(sessionStorage),
        }),
        // vuex state 변화시 LocalStorage에 저장하는 플러그인 (사용 안할 경우 paths를 []로 설정)
        createPersistedState({
            key: 'APP', // prefix key
            paths: ['login'], // localStorage에 저장할 모듈명 (Ex. ['login'] => login 모듈의 state가 변경시 localStorage에 저장됨)
            storage: customStorage(localStorage),
        })
    ]
});