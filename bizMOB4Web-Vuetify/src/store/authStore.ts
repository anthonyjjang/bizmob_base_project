import { defineStore } from 'pinia';
import BzToken from '@/bizMOB/BzClass/BzToken';

export const useAuthStore = defineStore('auth', {
    persist: {
        storage: sessionStorage,
    },
    state: () => ({
        accessToken: '',
        refreshToken: '',
        accessTokenExpTime: '',
        refreshTokenExpTime: '',
    }),

    getters: {
    },

    actions: {
        initBzToken() {
            BzToken.init({
                accessToken: this.accessToken,
                accessTokenExpTime: this.accessTokenExpTime,
                refreshToken: this.refreshToken,
                refreshTokenExpTime: this.refreshTokenExpTime,
            });
        },
        setToken(arg: {
            accessToken: string,
            accessTokenExpTime: string,
            refreshToken: string,
            refreshTokenExpTime: string,
        }) {
            this.accessToken = arg.accessToken;
            this.accessTokenExpTime = arg.accessTokenExpTime;
            this.refreshToken = arg.refreshToken;
            this.refreshTokenExpTime = arg.refreshTokenExpTime;
        },
        clearToken() {
            this.accessToken = '';
            this.refreshToken = '';
            this.accessTokenExpTime = '';
            this.refreshTokenExpTime = '';

            BzToken.init({
                accessToken: this.accessToken,
                accessTokenExpTime: this.accessTokenExpTime,
                refreshToken: this.refreshToken,
                refreshTokenExpTime: this.refreshTokenExpTime,
            });
        }
    }
});
