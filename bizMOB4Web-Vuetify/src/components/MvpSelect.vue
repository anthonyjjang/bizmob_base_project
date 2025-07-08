<template>
    <v-select
        v-model="modelValue"
        :items="props.items"
        :placeholder="props.placeholder ? props.placeholder : undefined"
        :item-title="props.itemTitle"
        :item-value="props.itemValue"
        :disabled="props.disabled"
        :return-object="props.isReturnObject"
        :variant="props.variant"
        :hide-details="props.isHideDetails"
        :single-line="props.isSingleLine"
        @update:modelValue="(val: any) => updateModel(val)"
    >
    </v-select>
</template>

<script setup lang="ts">
/**
 * 공통 Select 컴포넌트
 */
import type { PropType } from 'vue';
import { computed } from 'vue';

type Variant = 'outlined' | 'plain' | 'underlined' | 'filled' | 'solo' | 'solo-inverted' | 'solo-filled';

const props = defineProps({
    modelValue: { type: [String, Number, Object] as PropType<string | number | Json>, default: '', requird: true },
    items: { type: Object as PropType<any[]>, default: [] as any[], required: true },
    placeholder: { type: String as PropType<string>, defualt: undefined },
    itemTitle: { type: String as PropType<string>, default: 'text' },
    itemValue: { type: String as PropType<string>, default: 'value' },
    variant: { type: String as PropType<Variant>, default: 'outlined' },   // 구성요소 스타일
    disabled: { type: Boolean as PropType<boolean>, default: false },
    isReturnObject: { type: Boolean as PropType<boolean>, default: false }, // 지정값이 아닌 객체로 반환할지에 대한 여부
    isHideDetails: { type: Boolean as PropType<boolean>, default: true },
    isSingleLine: { type: Boolean as PropType<boolean>, default: false },
});
const emit = defineEmits([
    'update:modelValue',
]);

const modelValue = computed({
    get() {
        return props.modelValue;
    },
    set(value) {
        emit('update:modelValue', value);
    }
});

// model 값 변경 시 상위 컴포넌트의 값 갱신
function updateModel(val: any) {
    emit('update:modelValue', val);
}
</script>