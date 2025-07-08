import { defineStore } from 'pinia';

type MenuItem = {
    menuUri: string | null;
    leftMenuYn: string;
    menuId: string;
    menuSeq: string;
    menuLvl: string;
    adminMenuYn: string;
    upperMenuId: string | null;
    menuName: string;
    children?: MenuItem[];
};

export const useMenuStore = defineStore('menu', {
    persist: {
        storage: sessionStorage,
    },
    state: () => ({
        menus: null as any,
    }),

    getters: {
        menuTree: (state) => (isAdmin: boolean = false): MenuItem[] => {
            // Step 1: leftMenuYn이 'Y'인 항목만 필터링
            const filteredMenu = state.menus.filter((menu: any) => menu.leftMenuYn === 'Y');

            // Step 2: menuLvl 순서에 따라 먼저 정렬하고, 그 다음 menuSeq 순서에 따라 정렬
            filteredMenu.sort((a: any, b: any) => {
                const levelDiff = parseInt(a.menuLvl) - parseInt(b.menuLvl);
                if (levelDiff !== 0) {
                    return levelDiff;
                }
                return parseInt(a.menuSeq) - parseInt(b.menuSeq);
            });

            // Step 3: 메뉴 트리 생성
            const menuDict: { [key: string]: MenuItem } = {};
            const tree: MenuItem[] = [];

            // 모든 메뉴 항목을 딕셔너리에 저장
            filteredMenu.forEach((menu: any) => {
                if (menu.adminMenuYn === 'Y' && !isAdmin) {
                    return;
                }

                menu.children = [];

                menuDict[menu.menuId] = menu;
            });

            // 부모-자식 관계를 설정하여 트리 구조를 생성
            filteredMenu.forEach((menu: any) => {
                if (menu.upperMenuId === null) {
                    tree.push(menu);
                } else {
                    const parentMenu = menuDict[menu.upperMenuId];
                    if (parentMenu) {
                        parentMenu.children?.push(menu);
                    }
                }
            });

            return tree;
        }
    },

    actions: {
        setMenus(menus: any) {
            this.menus = menus;
        },
    }
});