<template>
    <ion-loading
        spinner="dots"
        :is-open="isShowLoading"
    />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { IonLoading } from '@ionic/vue';
import { StoreService } from '@/shared';

const appStore = new StoreService('app');

const isShowLoading = computed<boolean>(() => appStore.getters('isShowLoading'));
</script>

<style lang="scss">
ion-loading {
    --background: transparent !important;
    --spinner-color: #062f87 !important;

    .loading-wrapper {
    box-shadow: none !important;
    }

    ion-backdrop {
    background: rgba(255, 255, 255, 0.7) !important;
    }

    ion-spinner {
    width: 50px;
    height: 50px;
    }
}
</style>