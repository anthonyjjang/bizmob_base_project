<template>
    <header>
        <!-- 좌측 버튼 영역-->
        <template v-if="$slots['left']">
            <slot name="left"></slot>
        </template>
        <template v-else>
            <div class="header-toolbar left" v-if="leftButtons.length">
                <button type="button" class="header-icon back" @click="back" v-if="isShow('left', 'back')">Back</button>
            </div>
        </template>

        <!-- 타이틀 -->
        <p class="title">{{ title }}</p>

        <!-- 우측 버튼 영역 -->
        <template v-if="$slots['right']">
            <slot name="right"></slot>
        </template>
        <template v-else>
            <div class="header-toolbar right" v-if="rightButtons.length">
                <button type="button" class="header-icon menu" @click="openMenu" v-if="isShow('right', 'menu')">Menu</button>
                <button type="button" class="header-icon close" @click="closeModal(false)" v-if="isShow('right', 'closeModal')">Close</button>
                <button type="button" class="header-icon close" @click="closePopup(false)" v-if="isShow('right', 'closePopup')">Close</button>
                <button type="button" class="header-icon close" @click="closeMenu()" v-if="isShow('right', 'closeMenu')">Close</button>
            </div>
        </template>
    </header>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { useNavigate, useModal } from '@/shared';

type LEFT_BUTTONS = 'back';
type RIGHT_BUTTONS = 'menu' | 'closeModal' | 'closePopup' | 'closeMenu';

const props = defineProps({
    title: { type: String as PropType<string>, default: '' }, // title
    leftButtons: { type: Array as PropType<Array<LEFT_BUTTONS>>, default: () => [] }, // left buttons
    rightButtons: { type: Array as PropType<Array<RIGHT_BUTTONS>>, default: () => [] }, // right buttons
});

const { back, openMenu, closeMenu } = useNavigate();
const { closeModal, closePopup } = useModal();

const isShow = computed(() => (position: 'left' | 'right', type: LEFT_BUTTONS | RIGHT_BUTTONS): boolean => {
    switch (position) {
        case 'left': return props.leftButtons.includes(type as LEFT_BUTTONS);
        case 'right': return props.rightButtons.includes(type as RIGHT_BUTTONS);
        default: return false;
    }
});
</script>