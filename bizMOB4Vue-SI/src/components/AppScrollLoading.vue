<template>
    <ion-infinite-scroll
        v-if="!isEOF"
        @ionInfinite="onMoreItems"
    >
        <ion-infinite-scroll-content></ion-infinite-scroll-content>
    </ion-infinite-scroll>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { IonInfiniteScroll, IonInfiniteScrollContent, InfiniteScrollCustomEvent } from '@ionic/vue';

const emit = defineEmits([ 'more' ]);
const props = defineProps({
    pageIndex: { type: Number as PropType<number>, default: 0 },
    maxIndex: { type: Number as PropType<number>, default: 0 },
});

const pageMaxIndex = computed(() => {
    return props.maxIndex;
});
const pageIndex = computed(() => {
    return props.pageIndex;
});
const isEOF = computed(() => { // 페이지 종료 여부
    return pageIndex.value >= pageMaxIndex.value;
});

const onMoreItems = (ev: InfiniteScrollCustomEvent) => {
    console.log(ev);
    emit('more', {
        pageIndex: pageIndex.value,
        next: pageIndex.value + 1,
        complete: () => {
            ev.target.complete();
        }
    });
};
</script>