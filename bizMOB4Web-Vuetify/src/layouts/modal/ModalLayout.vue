<!-- src/components/ModalLayout.vue -->
<template>
    <template v-if="isVisible">
        <component :is="currentModal" v-bind="currentProps" @close="handleClose" />
    </template>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isVisible = ref(false);
const currentModal = ref<any>(null);
const currentProps = ref<any>(null);
let resolvePromise: (data: any) => void;

const showModal = (resolve: (data: any) => void, modalComponent: any, options?: any) => {
    currentModal.value = modalComponent;
    currentProps.value = options.props;
    isVisible.value = true;
    resolvePromise = resolve;
};

const handleClose = (data: any) => {
    isVisible.value = false;
    currentModal.value = null;
    currentProps.value = null;

    if (resolvePromise) {
        resolvePromise(data);
    }
};

defineExpose({
    showModal
});
</script>