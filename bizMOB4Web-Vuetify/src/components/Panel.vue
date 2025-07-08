<template>
    <v-expansion-panels v-model="openPanel">
        <v-expansion-panel elevation="10" static eager>
            <v-expansion-panel-title class="text-h8 font-weight-bold">{{ title }}</v-expansion-panel-title>
            <v-divider v-if="title"></v-divider>
            <v-expansion-panel-text class="mt-4">
                <slot />
            </v-expansion-panel-text>
        </v-expansion-panel>
    </v-expansion-panels>
</template>

<script setup lang="ts">
import { type PropType, ref } from 'vue';

const props = defineProps({
    title: { type: String as PropType<string> },
    show: { type: Boolean as PropType<boolean>, default: true },
});
const openPanel = ref(props.show ? 0 : null);
</script>