<template>
    <ion-page>
        <ion-header>
            <AppHeader
                title="메뉴"
                :rightButtons="['closeMenu']"
            />
        </ion-header>

        <ion-content>
            <div class="menu-content">
                <ul class="menu-list_1">
                    <!-- 1depth -->
                    <li class="menu-item">
                        <p class="menu-name">Sample</p>
                        <ul class="menu-list_2">
                            <!-- 2depth -->
                            <li class="menu-item">
                                <div class="menu-title">
                                    <button type="button" class="menu-link" @click="onClickMenu('MAIN0100')">
                                        <span class="menu-name">메인</span>
                                    </button>
                                </div>
                            </li>
                            <li class="menu-item">
                                <div class="menu-title">
                                    <button type="button" class="menu-link" @click="onClickMenu('BOARD0100')">
                                        <span class="menu-name">게시판</span>
                                    </button>
                                </div>
                            </li>
                            <li class="menu-item">
                                <div class="menu-title">
                                    <button type="button" class="menu-link" @click="onClickMenu('MAIN0200')">
                                        <span class="menu-name">Sandbox</span>
                                    </button>
                                </div>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { useNavigate } from '@/shared';

const { openPage, closeMenu } = useNavigate();

const onClickMenu = (menu: string) => {
    closeMenu();
    openPage(menu);
};
</script>

<style scoped lang="scss">
ion-content {
    .menu-content {
        margin: 0 16px;
        padding: 20px 0 30px;

        .menu-name {
            padding: 8px 0 12px;
            font-size: 18px;
            line-height: 23px;
            font-weight: 700;
            color: #2f4592;
            display: flex;
            min-width: 0;
        }
        .menu-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .menu-link {
            width: 100%;
            text-align: left;
            display: flex;
            align-items: center;
            padding: 10px 5px;
            text-decoration: none;
            box-sizing: border-box;
        }
        .menu-list_2 {
            & > .menu-item {
                & ~ .menu-item {
                    border-top: 1px solid #f3f3f3;
                }
                .menu-name {
                    font-size: 16px;
                    line-height: 20px;
                    font-weight: 700;
                    padding: 2px 0;
                    color: #4d4d4d;
                    display: inline-block;
                    text-align: left;
                }
            }
        }
    }
}
</style>