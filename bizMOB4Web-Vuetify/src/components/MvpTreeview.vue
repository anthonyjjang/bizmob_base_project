<template>
    <perfect-scrollbar :style="{height: `${props.height ? props.height : 500}px`}">
        <div class="tree-container">
            <v-progress-circular
                v-if="loading"
                indeterminate
                color="primary"
                size="40"
            ></v-progress-circular>

            <v-treeview
                ref="treeview"
                :activated="type === 'activate' ? activatedNode : undefined"
                v-model:selected="selectedNodes"
                v-model:opened="opened"
                :items="items"
                :item-title="props.itemTitle"
                :item-value="props.itemValue"
                :item-children="props.itemChildren"
                :select-strategy="props.selectStrategy"
                :activatable="type === 'activate' ? true : false"
                :selectable="type === 'select' ? true : false"
                return-object
                @update:activated="(v) => setActivateNode((v as Json[])[0]?.[props.itemValue])"
            >
                <template v-slot:prepend="{ item, isOpen }">
                    <v-icon v-if="item.children && item.children?.length">
                        {{ isOpen ? 'mdi-folder-open' : 'mdi-folder' }}
                    </v-icon>
                    <v-icon v-else>
                        {{ 'mdi-file' }}
                    </v-icon>
                </template>
            </v-treeview>
        </div>
    </perfect-scrollbar>
</template>

<script setup lang="ts">
import { type PropType, computed, ref, toRaw, onActivated } from 'vue';

type SelectStrategy = 'single-leaf' | 'leaf' | 'independent' | 'single-independent' | 'classic';

const props = defineProps({
    type: { type: String as PropType<'select' | 'activate'>, required: true }, // 선택과 활성
    items: { type: Object as PropType<Json[]>, required: true }, // 트리 목록
    activated: { type: Object as PropType<Json> }, // 활성화한 노드
    selected: { type: Object as PropType<Json[]>, default: [] as Json[] }, // 선택한 노드
    opened: { type: Object as PropType<Json[]>, default: [] as Json[] }, // 활성화된 그룹 노드
    itemTitle: { type: String as PropType<string>, default: 'title' },
    itemValue: { type: String as PropType<string>, default: 'value' }, // 노드의 value값
    itemChildren: { type: String as PropType<string>, defualt: 'children' }, // 자식노드의 변수명
    height: { type: String as PropType<string>, defualt: '500' },
    selectStrategy: { type: String as PropType<SelectStrategy>, default: 'independent' }, // 선택한 항목 동작 유형
    isOpenAll: { type: Boolean as PropType<boolean>, default: false }, // 선택한 항목 동작 유형
    loading: { type: Boolean as PropType<boolean>, default: true }, // loading 여부
});

const emit = defineEmits([
    'update:activated',
    'update:opened',
    'update:selected',
    'onActivatedTreeview'
]);
const treeview = ref();
const loading = computed(() => props.loading);

const activatedNode = computed({
    get() {
        return props.activated;
    },
    set(value) {
        emit('update:activated', value);
    }
});
const items = computed(() => props.items);
const opened = computed({
    get() {
        return props.opened;
    },
    set(value) {
        emit('update:opened', value);
    }
});
// 선택
const selectedNodes = computed({
    get() {
        return props.selected;
    },
    set(value) {
        emit('update:selected', value);
    }
});

/**
 * 노드 활성화 이벤트 처리
 */
function setActivateNode(itemValue: any) {
    const item = findNode(items.value, itemValue);
    /* item값이 존재하는 경우:      비활성화된 노드 클릭 시 활성화 */
    /* item값이 미존재하는 경우:    활성화된 노드 클릭 시 활성화 해제 */
    emit('update:activated', item ? item : {});
}

/**
 * 단일 노드 반환
 */
function findNode(items: Json[], itemValue: any): Json | null {
    for (let item of items) {
        if (item[props.itemValue] === itemValue) {
            return item;
        }
        if (item.children) {
            const found: Json | null = findNode(item.children, itemValue);
            if (found) return found;
        }
    }
    return null;
}

/**
 * 자식 노드를 가진 노드 반환
 */
function getNodesWithChildren(items: Json[]) {
    let result: Json[] = [];
    items.forEach(item => {
        // 자식 노드가 존재할 경우
        if (item.children?.length) {
            result.push(item);  // 각 항목의 객체를 배열에 추가
            result = result.concat(getNodesWithChildren(item.children));  // 하위 항목도 재귀적으로 처리
        }
    });
    return result;
}

function getAllNodes(items: Json[]) {
    let result: Json[] = [];
    items.forEach((item: Json) => {
        result.push(item);
        if (item?.children?.length) {
            result = result.concat(getAllNodes(item.children));
        }
    });
    return result;
}

onActivated(() => {
    emit('onActivatedTreeview');
});

defineExpose({
    /**
     * 선택된 노드 변경 함수 방출
     */
    changeActivatedNode(value: any) {
        setActivateNode(value);
    },
    /**
     * 모든 노드 펼치기
     */
    allOpenNode() {
        const rawData = getNodesWithChildren(items.value)?.map((item: Json) => toRaw(item));
        emit('update:opened', rawData);
    },
    /**
     * 모든 노드 닫기
     */
    allCloseNode() {
        emit('update:opened', []);
    },
    /**
     * 모든 노드 선택
     */
    allSelectedNodes() {
        const rawData = getAllNodes(items.value)?.map((item: Json) => toRaw(item));
        emit('update:selected', rawData);
    },
    /**
     * 모든 노드 선택 해제
     */
    allDeselectNodes() {
        emit('update:selected', []);
    }
    
}); 

</script>
<style scoped lang="scss">
/* 스크롤이 생겨도 로딩바가 중앙에 고정되도록 설정 */
.v-progress-circular {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1;
}
</style>