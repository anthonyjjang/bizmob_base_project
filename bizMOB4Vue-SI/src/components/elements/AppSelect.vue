<template>
    <!-- Select Slot-->
    <template v-if="$slots['select']">
    <slot
        name="select"
        v-bind="{ selected, placeholder }"
        :toggleOpen="toggleOpen"
    />
    </template>
    <!-- Default Select-->
    <template v-else>
    <div class="styled-select" :class="{ 'is-focus': isOpen }">
        <button type="button" class="select" :disabled="disabled" @click="toggleOpen">
            <span v-if="selected" class="selected">{{ selected.text }}</span>
            <span v-else class="placeholder">{{ placeholder }}</span>
        </button>
    </div>
    </template>

    <Teleport to="#app" >
        <!-- 노출 애니메이션을 넣는 경우, 선택된 Option으로 scroll 위치를 옮기는 UX가 어색해짐. (올라오고 나서 스크롤 변경) -->
        <ion-modal
            css-class="ion-select-wrapper"
            :is-open="isOpen"
            :keyboard-close="false"
            :animated="false"
            :show-backdrop="true"
            :backdrop-dismiss="true"
            @did-dismiss="isOpen = false"
            @did-present="onPresent"
        >
            <!-- 이벤트 버블링을 안막으면 스크롤시 같이 내려감 -->
            <div class="modal-layout-wrapper" id="selectBox" @touchstart.stop="false">
                <ul class="ui-select">
                    <!-- 선택됨(selected) -->
                    <li
                        class="ui-select-item"
                        v-for="(option, index) in options"
                        :key="index"
                        :class="{ 'selected': option.value === modelValue }"
                    >
                        <button
                            type="button"
                            @click="emitSelected(option)"
                        >{{ option.text }}</button>
                    </li>
                </ul>
            </div>
        </ion-modal>
    </Teleport>
</template>

<script setup lang="ts">
import { ref, PropType, computed, watch, onMounted } from 'vue';

/** props **/
const props = defineProps({
    options: { type: Array as PropType<Option[]>, default: [] as Option[], required: true }, // Option 목록
    modelValue: { type: [ String, Number ] as PropType<string | number>, default: '' }, // 선택 값
    placeholder: { type: String as PropType<string>, default: '' }, // 노출 Placeholder
    disabled: { type: Boolean as PropType<boolean>, default: false }, // Input disabled
    hook: { type: Function as PropType<(option: any) => boolean> }, // 변경전 Hook 캐치
});

/** emit **/
const emit = defineEmits([
    'update:modelValue', // Value 변경
    'change', // Option을 직접 선택하여 변경한 경우
    'update', // modelValue 값이 업데이트 된 경우
    'trace', // init + change 상황에서 전부 발생
]);

/** setup **/
const isOpen = ref<boolean>(false); // Options Open 여부
const modelValue = computed(() => props.modelValue);
const selected = computed(() => {
    return props.options.find((opt: Option) => opt.value === modelValue.value);
});

const onPresent = () => {
    const container = document.querySelector('#selectBox') as HTMLDivElement;
    const selectedElem = container.querySelector('.selected') as HTMLLIElement;

    if (selectedElem) {
        container.scrollTop = (selectedElem.offsetTop - selectedElem.offsetHeight);
    }
};

// Toggle Open
const toggleOpen = () => {
    if (props.disabled) {
        isOpen.value = false;
    }
    else {
        isOpen.value = !isOpen.value;
    }
};

// Option 선택
const emitSelected = (option: Option) => {
    toggleOpen();

    // Option Select Hook이 있는 경우 실행 후 result 확인
    if (props.hook) {
        if (props.hook(option)) {
            emit('change', option); // 선택하여 변경
            emit('update:modelValue', option.value);
            emit('trace', option);
        }
    }
    else {
        emit('change', option); // 선택하여 변경
        emit('update:modelValue', option.value);
        emit('trace', option);
    }
};

const initSelected = () => {
    // placeholder가 없고, 최초 선택 값이 없는 경우 첫 번째 값을 자동 선택
    if (!props.modelValue && !props.placeholder && props.options.length) {
        const option = props.options[0];
        emit('update:modelValue', option.value);
        emit('trace', option);
    }
    else {
        emit('trace', selected.value);
    }
};

// 목록이 갱신되면 최초 선택 다시 확인
watch(
    () => props.options,
    (n, o) => {
        const isDiffLength = (n.length !== o.length);
        let isDiffValue = false;

        n.forEach((newItem, idx) => {
            const oldItem = o[idx];

            if (newItem.value !== oldItem?.value) {
                isDiffValue = true;
            }
        });

        // 길이가 다르거나, Value가 다른 경우 init 호출
        if (isDiffLength || isDiffValue) {
            initSelected();
        }
    }
);

// 선택값 update watch
watch(
    () => selected.value,
    (n, o) => {
        // Value가 달라진 경우에만 update 호출 (주소값이 바껴서 호출되는 경우가 존재)
        if (n?.value !== o?.value) {
            emit('update', selected.value);
        }
    }
);

onMounted(() => {
    initSelected();
});
</script>

<style scoped lang="scss">
ion-modal {
    --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4) !important;
    --backdrop-opacity: var(--ion-backdrop-opacity, 0.32) !important;
    --height: fit-content;
    --border-radius: 20px;

    &::part(content) {
        margin-left: 16px;
        margin-right: 16px;
    }
    .modal-layout-wrapper {
        max-height: calc(50vh - 80px);
        margin: 40px 0;
        overflow-y: auto;
    }

    .ui-select {
        display: flex;
        flex-direction: column;
        & > * + * {
            margin-top: 1px;
        }

        .ui-select-item {
            position: relative;
            margin: 0;
            padding: 0;

            button {
                text-align: var(--text-align);
                font-size: 14px;
                line-height: 18px;
                font-weight: 400;
                color: #202020;
                width: 100%;
                padding: 11px 32px 11px;
                border: 0;
                background-color: transparent;
            }

            &.selected {
                button {
                    font-weight: 700;
                    color: #2f4592;
                    background-color: #eff4ff;
                }
                &:after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    right: 24px;
                    width: 24px;
                    height: 24px;
                    background: url('@/assets/images/toggle_check_s_b.svg') no-repeat 0 0/100%;
                    transform: translate(0, -50%);
                }
            }
        }
    }
}
</style>