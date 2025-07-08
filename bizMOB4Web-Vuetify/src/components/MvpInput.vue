<template>
    <v-text-field
        v-model="modelValue"
        :type="props.type === 'password' && isShow ? 'text' : props.type"
        :placeholder="props.placeholder ? props.placeholder : undefined"
        :variant="props.variant"
        :append-inner-icon="props.type === 'password' ? isShow ? 'mdi-eye' : 'mdi-eye-off' : undefined"
        :color="props.color"
        :hide-details="props.isHideDetails"
        :disabled="props.disabled"
        :autofocus="props.isFocus"
        :single-line="props.isSingleLine"
        :clearable="(props.type !== 'date') ? true : false"
        @click="onClick"
        @blur="onBlur"
        @input="onInput"
        @keyup.enter="onEnter"
        @focusin="(event: Event) => $emit('focusin', event)"
        @focusout="(event: Event) => $emit('focusout', event)"
        @click:appendInner="isShow = !isShow"
    >
    </v-text-field>
</template>
<script setup lang="ts">
/**
 * 공통 Input 컴포넌트
 */
import type { PropType } from 'vue';
import { computed, ref } from 'vue';

type Variant = 'underlined' | 'outlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled' | 'plain';

const props = defineProps({
    modelValue: { type: String as PropType<string>, default: '', required: true },
    placeholder: { type: String as PropType<string>, defualt: undefined },
    type: { type: String as PropType<string>, default: 'text' },
    variant: { type: String as PropType<Variant>, default: 'outlined' },
    color: { type: String as PropType<string>, default: '' },
    isHideDetails: { type: Boolean as PropType<boolean>, default: true },
    isSingleLine: { type: Boolean as PropType<boolean>, default: true },
    disabled: { type: Boolean as PropType<boolean>, default: false },
    isFocus: { type: Boolean as PropType<boolean>, default: false },
    maxLength: { type: [String, Number] as PropType<string | number>, default: undefined },
});

const emit = defineEmits([
    'update:modelValue',
    'click',
    'blur',
    'enter',
    'focusin',
    'focusout',
]);

const isShow = ref<boolean>(false);

const modelValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});

/**
 * Click
 */
function onClick(event: Event) {
    const inputVal = (event.target as HTMLInputElement).value;

    emit('click', inputVal);
}

function onBlur(event: Event) {
    const inputVal = (event.target as HTMLInputElement).value;

    emit('blur', inputVal);
}

/**
 * Input
 */
function onInput(event: Event) {
    const inputVal = (event.target as HTMLInputElement).value;

    // Max Length 값이 존재하고, input 값이 MaxLength보다 길 경우
    if (props.maxLength && inputVal.length > Number(props.maxLength)) {
        emit('update:modelValue', inputVal.substring(0, Number(props.maxLength)));
    }
}

/**
 * Enter Key Up
 */
function onEnter(event: Event) {
    const inputVal = (event.target as HTMLInputElement).value;

    emit('enter', inputVal);
}
</script>