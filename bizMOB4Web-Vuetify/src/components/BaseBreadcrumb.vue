<template>
    <div class="mt-3">
        <div class="d-flex justify-space-between">
            <div class="d-flex py-0 align-center">
                <div>
                    <h3 class="text-h3 mb-2">{{ title }}</h3>
                    <v-breadcrumbs :items="breadcrumbs" class="text-h6 font-weight-regular pa-0 ml-n1">
                        <template v-slot:divider v-if="breadcrumbs">
                            <v-icon>mdi-chevron-right</v-icon>
                        </template>
                        <template v-slot:title="{ item }">
                            <h6 class="text-h6">{{ item.text }}</h6>
                        </template>
                    </v-breadcrumbs>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';

const props = defineProps({
    title: { type: String as PropType<string> },
    breadcrumbs: { type: Array as PropType<any[]> },
    icon: { type: String as PropType<string> },
    text: { type: String as PropType<string> },
});
</script>

<style lang="scss">
.page-breadcrumb {
    .v-toolbar {
        background: transparent;
    }
}
</style>
