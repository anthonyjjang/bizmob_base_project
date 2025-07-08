<template>
    <!-- side: start = 왼쪽, end = 오른쪽 -->
    <ion-menu
        side="end"
        menu-id="side-menu"
        content-id="ion-router-outlet"
        :max-edge-start="0"
        @ion-will-close="appStore.dispatch('setMenuState', false)"
        @ion-will-open="appStore.dispatch('setMenuState', true)"
    >
        <slot></slot>
    </ion-menu>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { IonMenu, menuController } from '@ionic/vue';
import { StoreService } from '@/shared';

const appStore = new StoreService('app');

watch(
    () => appStore.getters('isShowMenu'),
    async(value) => {
        if (value) {
            await menuController.open('side-menu');
        } else {
            await menuController.close();
        }
    }
);
</script>