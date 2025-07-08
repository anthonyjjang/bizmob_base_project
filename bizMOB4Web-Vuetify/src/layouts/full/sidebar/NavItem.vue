<template>
    <!---Single Item-->
    <!-- :to="item.type === 'external' ? '' : item.menuUri" -->
    <!-- :href="item.type === 'external' ? item.menuUri : ''" -->
    <!-- :target="item.type === 'external' ? '_blank' : ''" -->
    <v-list-item
        :to="item.menuUri"
        :target="''"
        rounded
        class="mb-1"
        :disabled="item.disabled"
        v-scroll-to="{ el: '#top' }"
    >
        <!---If icon-->
        <template v-slot:prepend>
            <component
            :is="Message2Icon"
            :size="20"
            stroke-width="1.5"
            class="iconClass"
            ></component>
        </template>
        <v-list-item-title>{{ $t(item.menuName) }}</v-list-item-title>
    </v-list-item>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import { Message2Icon } from 'vue-tabler-icons';

const props = defineProps({
    item: { type: Object as PropType<any> },
});
</script>