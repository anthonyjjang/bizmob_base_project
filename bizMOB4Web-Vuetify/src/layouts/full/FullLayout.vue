<!-- VerticalSidebarVue -->
<template>
    <v-locale-provider>
        <v-app
            :theme="appStore.theme"
            :class="[
                appStore.theme,
                appStore.isMiniSidebar ? 'mini-sidebar' : '',
                appStore.isHorizontalLayout ? 'horizontalLayout' : 'verticalLayout',
                appStore.isBorderCard ? 'cardBordered' : '',
                appStore.isInputBg ? 'inputWithbg' : ''
            ]"
        >
            <Header />
            <Sidebar />
            <!-- class="overflow-hidden" -->
            <v-main>
                <perfect-scrollbar style="height: calc(100vh - 64px)" ref="scroll">
                    <v-overlay
                        v-model="appStore.isProgress"
                        class="align-center justify-center"
                        persistent
                    >
                        <v-progress-circular
                            color="primary"
                            size="64"
                            indeterminate
                        ></v-progress-circular>
                    </v-overlay>
                    <v-container fluid class="page-wrapper pb-sm-15 pb-10">
                        <div class="maxWidth">
                            <router-view v-slot="{ Component }">
                                <keep-alive>
                                    <component :is="Component" :key="componentKey" />
                                </keep-alive>
                            </router-view>
                        </div>
                    </v-container>
                </perfect-scrollbar>
            </v-main>
        </v-app>
    </v-locale-provider>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from 'vue';
import { useRoute, RouterView } from 'vue-router';
import { useAppStore } from '@/store/appStore';

import Header from './header/Header.vue';
import Sidebar from './sidebar/Sidebar.vue';

const appStore = useAppStore();
const route = useRoute();
const componentKey = ref(route.fullPath);
const scroll = ref();

const shouldResetCache = (from, to) => {
    return window.history.state && window.history.state.forward === null;
};

watch(route, (newRoute, oldRoute) => {
    if (shouldResetCache(oldRoute, newRoute)) {
        componentKey.value = newRoute.fullPath + Date.now();
    } else {
        componentKey.value = newRoute.fullPath;
    }

    // 라우터 변경 시 스크롤 위치를 0으로 설정
    nextTick(() => {
        if (scroll.value.$el) {
            scroll.value.$el.scrollTop = 0;
        }
    });
});
</script>

<style scoped lang="scss">
.main-contents {
    height: calc(100vh - 64px) !important;
}
</style>