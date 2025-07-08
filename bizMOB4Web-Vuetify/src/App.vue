<template>
    <RouterView></RouterView>
    <ModalLayout />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router';
import ModalLayout from '@/layouts/modal/ModalLayout.vue';
</script>