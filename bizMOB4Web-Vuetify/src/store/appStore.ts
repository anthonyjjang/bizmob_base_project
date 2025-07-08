import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
    state: () => {
        return {
            theme: 'BLUE_THEME',
            isHorizontalLayout: false,
            isMiniSidebar: false,
            isBorderCard: true,
            isInputBg: false,
            isSidebar: true,
            isProgress: false,
            backMessage: null,
        };
    },

    getters: {
        // Object 데이터인 백데이터를 전달하면서 초기화
        backData: (state) => {
            const data = state.backMessage;
            state.backMessage = null;
            return data;
        },
    },

    actions: {
        toggleSidebar() {
            this.isSidebar = !this.isSidebar;
        },
        toggleMiniSidebar() {
            this.isMiniSidebar = !this.isMiniSidebar;
        },
        toggleProgress(is?: boolean) {
            if (is !== undefined) {
                this.isProgress = is;
            }
            else {
                this.isProgress = !this.isProgress;
            }
        },
        setBackData(data: any) {
            this.backMessage = data;
        }
    }
});
