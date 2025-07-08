import { defineStore } from 'pinia';
import profileImg from '@/assets/images/favicon.png';

export const useUserStore = defineStore('user', {
    persist: {
        storage: sessionStorage,
    },
    state: () => ({
        user: null as any, // Replace 'any' with the actual type of 'user'
    }),

    getters: {
        userName(): string {
            return this.user?.userName || '';
        },
        userNick(): string {
            return this.user?.userNick || '';
        },
        userEmail(): string {
            return this.user?.userEmail || '';
        },
        userProfileImg(): any {
            return profileImg;
        }
    },

    actions: {
        setUser(user: any) {
            this.user = user;
        },
        clearUser() {
            this.user = null;
        },
        logout() {
            location.href = '/';
            this.user = null;
        }
    }
});
