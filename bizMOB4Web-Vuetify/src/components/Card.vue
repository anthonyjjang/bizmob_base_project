<template>
    <v-card elevation="10" >
        <v-card-item class="py-4 px-6" v-if="title">
            <div class="d-sm-flex align-center justify-space-between">
                <v-card-title class="text-h5">{{ title }}</v-card-title>
                <!-- <template v-slot:append> -->
                <slot name="action"></slot>
                <!-- </template> -->
            </div>
        </v-card-item>
        <v-divider v-if="title"></v-divider>
        <v-card-text>
            <slot />
        </v-card-text>
    </v-card>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';

const props = defineProps({
    title: { type: String as PropType<string> },
});
</script>