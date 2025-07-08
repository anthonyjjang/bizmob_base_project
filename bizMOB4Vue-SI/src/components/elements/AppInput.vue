<template>
    <div :class="wrapClass">
        <input
            autocomplete="off"
            v-bind="type === 'number' ? { inputmode: 'numeric', pattern: '[0-9\\s\\-]+' } : undefined"
            :type="type === 'number' ? 'text' : (isPasswordShow ? 'text' : type)"
            :class="inputClass"
            :placeholder="placeholder"
            :disabled="disabled"
            :readonly="readonly"
            :maxLength="maxLength ? Number(maxLength) : undefined"
            :value="modelValue"
            @keyup="onKeyup"
            @input="onInput"
            @focusin="onFocusin"
            @focusout="onFocusout"
            @blur="onBlur"
            @click="onClick"
            @paste.prevent="onPast"
            @keydown.enter="onEnter"
        />
        <template v-if="isButtons && $slots['buttons']">
            <slot name="buttons"></slot>
        </template>
        <template v-if="isButtons && !$slots['buttons']">
            <!-- Input 삭제 버튼 -->
            <button
                type="button"
                class="input-clear"
                v-if="modelValue && !disabled"
                @click="onClearInput"
            >Clear</button>
            <!-- 패스워드 노출 버튼 -->
            <button
                type="button"
                class="input-toggle-type show"
                v-if="modelValue && !disabled && type === 'password'"
                :class="isPasswordShow ? 'show' : 'hide'"
                @click="isPasswordShow = !isPasswordShow"
            >Show/Hide</button>
        </template>
    </div>
</template>

<script setup lang="ts">
import { PropType, ref, computed, watch } from 'vue';

const props = defineProps({
    modelValue: { type: String as PropType<string | null>, default: '' }, // Input value
    type: { type: String as PropType<string>, default: 'text' }, // Input type (+ number)
    placeholder: { type: String as PropType<string>, default: '' }, // Input placeholder
    readonly: { type: Boolean as PropType<boolean>, default: false }, // Input readonly
    disabled: { type: Boolean as PropType<boolean>, default: false }, // Input disabled
    disabledPaste: { type: Boolean as PropType<boolean>, default: false }, // Input Paste Event disabled
    delay: { type: Number as PropType<number>, default: 300 }, // Input Delay Time
    maxLength: { type: [Number, String] as PropType<number | string> }, // Input Max Length
    wrapClass: { type: Array as PropType<string[]>, default: [] as string[] }, // div class 목록
    inputClass: { type: Array as PropType<string[]>, default: [] as string[] }, // input class명 목록
    isButtons: { type: Boolean as PropType<boolean>, default: true }, // button 여부
    hook: { type: Function as PropType<(option: any) => boolean | string | number> }, // 값 변경전 callback hook
});

const emit = defineEmits([
    'update:modelValue',
    'keyup',
    'input',
    'delayInput',
    'focusin',
    'focusout',
    'blur',
    'clear',
    'click',
    'enter',
    'past',
]);

// modelValue 변경 감지 후 변경된 값 저장
watch(() => props.modelValue, (newValue) => {
    prevValue.value = newValue;
});

// 이전 Value
const prevValue = ref<any>('');

// div css 클래스
const wrapClass = computed(() => {
    if (props.type === 'password') {
        return ['styled-input', 'styled-input-password', ...props.wrapClass];
    }
    else {
        return ['styled-input', ...props.wrapClass];
    }
});

// input css 클래스
const inputClass = computed(() => {
    return ['input-form', ...props.inputClass];
});

// password 타입인 경우 show/hide 버튼 토글 여부
const isPasswordShow = ref(false);

// 입력 완료 후 callback 주는 딜레이 타임
let delayTimer: NodeJS.Timeout;

// keyup 이벤트
const onKeyup = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('keyup', target.value);
};

// input 이벤트
const onInput = (event: Event) => {
    const target = event.target as HTMLInputElement;
    const hookResult: any = props.hook && props.hook(target.value);

    if ((event as any).code === 'Backspace') {
        return true;
    }
    else {
        if (props.hook && !hookResult) {
            if (typeof hookResult === 'boolean') {
                target.value = prevValue.value;
                return false;
            }
            else {
                target.value = hookResult;
            }
        }
    }

    emit('update:modelValue', target.value);
    emit('input', target.value);

    // 딜레이 Input 이벤트
    clearTimeout(delayTimer);
    delayTimer = setTimeout(() => {
        emit('delayInput', target.value);
    }, props.delay);

    // prevValue = target.value;
    return true;
};

// input focusin 이벤트
const onFocusin = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('focusin', target.value);
};

// input focusout 이벤트
const onFocusout = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('focusout', target.value);
};

// input blur 이벤트
const onBlur = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('blur', target.value);
};

// input click 이벤트
const onClick = (event: Event) => {
    const target = event.target as HTMLInputElement;
    emit('click', target.value);
};

// input paste 이벤트
const onPast = (event: Event) => {
    const target = (event.target as HTMLInputElement); // 각 Element에서 온 타입으로 변환 필요
    const pastedData = (event as ClipboardEvent).clipboardData;
    const pastedText = pastedData?.getData('text') || '';

    // 붙여넣기 막기인 경우 기존 값으로 대체
    if (props.disabledPaste) {
        target.value = prevValue.value;
    }
    else {
        target.value = pastedText;
    }

    emit('update:modelValue', target.value);
    emit('past', target.value);
};

// input enter 이벤트
const onEnter = (event: Event) => {
    const target = (event.target as HTMLInputElement); // 각 Element에서 온 타입으로 변환 필요
    emit('enter', target.value);
};

// input clear 버튼 클릭 이벤트
const onClearInput = () => {
    emit('update:modelValue', '');
};
</script>