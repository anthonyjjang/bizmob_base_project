<template>
    <ion-header>
        <div class="sheet-header">
            <h2 class="title">Filter</h2>
        </div>
    </ion-header>
    <ion-content>
        <div class="sheet-content">
            <div class="form-field">
                <div class="form-label">공지기준</div>
                <div class="form-input">
                    <div class="grid-item grid-col-2">
                        <label class="input-radio">
                            <input type="radio" name="target" value="" v-model="targetCode" />
                            <span class="label-text">전체</span>
                        </label>
                    </div>
                    <div class="grid-item">
                        <label class="input-radio">
                            <input type="radio" name="target" value="NT01" v-model="targetCode" />
                            <span class="label-text">System</span>
                        </label>
                    </div>
                    <div class="grid-item">
                        <label class="input-radio">
                            <input type="radio" name="target" value="NT02" v-model="targetCode" />
                            <span class="label-text">Admin</span>
                        </label>
                    </div>
                    <div class="grid-item">
                        <label class="input-radio">
                            <input type="radio" name="target" value="NT03" v-model="targetCode" />
                            <span class="label-text">User</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="form-field">
                <div class="form-label">카테고리</div>
                <div class="form-input">
                    <div class="grid-item grid-col-2">
                        <label class="input-radio">
                            <input type="radio" name="category" value="" v-model="categoryCode" />
                            <span class="label-text">전체</span>
                        </label>
                    </div>
                    <div class="grid-item">
                        <label class="input-radio">
                            <input type="radio" name="category" value="NC01" v-model="categoryCode" />
                            <span class="label-text">시스템</span>
                        </label>
                    </div>
                    <div class="grid-item">
                        <label class="input-radio">
                            <input type="radio" name="category" value="NC11" v-model="categoryCode" />
                            <span class="label-text">프로모션</span>
                        </label>
                    </div>
                    <div class="grid-item">
                        <label class="input-radio">
                            <input type="radio" name="category" value="NC21" v-model="categoryCode" />
                            <span class="label-text">이벤트</span>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    </ion-content>
    <ion-footer>
        <div class="sheet-footer">
            <div class="button-group">
                <button type="button" class="button button-line" @click="closeSheet(false)">닫기</button>
                <button type="button" class="button button-blue" @click="closeSheet(true, { targetCode, categoryCode })">검색</button>
            </div>
        </div>
    </ion-footer>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { useModal } from '@/shared';

const props = defineProps({
    targetCode: { type: String as PropType<string>, default: '' }, // 공지기준 코드
    categoryCode: { type: String as PropType<string>, default: '' }, // 카테고리 코드
});

const { closeSheet } = useModal();

const targetCode = ref<string>(props.targetCode);
const categoryCode = ref<string>(props.categoryCode);
</script>

<style scoped lang="scss"></style>
