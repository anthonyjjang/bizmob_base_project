<template>
    <v-locale-provider>
        <v-app :theme="appStore.theme">
            <RouterView />
        </v-app>
    </v-locale-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import { useAppStore } from '@/store/appStore';

const appStore = useAppStore();
</script>