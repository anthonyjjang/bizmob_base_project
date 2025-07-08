<template>
    <ion-page>
        <!-- Ionic Header Tag -->
        <ion-header>
            <AppHeader
                title="등록"
                :leftButtons="['back']"
            />
        </ion-header>

        <!-- Ionic Contents Tag -->
        <ion-content>
            <div class="board-content">

                <div class="board-container">

                    <div class="form-container">
                        <div class="form-field">
                            <div class="form-label">유형</div>
                            <div class="form-input">
                                <AppSelect
                                    v-model="categoryValue"
                                    placeholder="선택"
                                    :options="categoryOptions"
                                />
                            </div>
                        </div>

                        <div class="form-field">
                            <div class="form-label">대상</div>
                            <div class="form-input">
                                <AppSelect
                                    v-model="targetValue"
                                    placeholder="선택"
                                    :options="targetOptions"
                                />
                            </div>
                        </div>

                        <div class="form-field">
                            <div class="form-label">내용</div>
                            <div class="form-input">
                                <input class="input-form" type="text" placeholder="제목을 입력해주세요." v-model="title" />
                            </div>
                            <div class="form-input">
                                <textarea class="input-form" placeholder="문의사항을 입력해주세요." v-model="content"></textarea>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </ion-content>

        <ion-footer>
            <div class="button-group bottom-cta">
                <button type="button" class="button button-blue" :disabled="!isSubmitEnabled" @click="onSubmit">등록</button>
            </div>
        </ion-footer>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useMessage, useNetwork, useModal } from '@/shared';
import { AppSelect } from '@/components';

const { toast } = useMessage();
const { requestTr } = useNetwork();
const { closePopup } = useModal();

const categoryValue = ref<string>('');
const categoryOptions = [
    { text: '시스템', value: 'NC01' },
    { text: '프로모션', value: 'NC11' },
    { text: '이벤트', value: 'NC21' },
];

const targetValue = ref<string>('');
const targetOptions = [
    { text: 'System', value: 'NT01' },
    { text: 'Admin', value: 'NT02' },
    { text: 'User', value: 'NT03' },
];

const title = ref<string>('');
const content = ref<string>('');

const isSubmitEnabled = computed(() => {
    return !!categoryValue.value && !!targetValue.value && !!title.value && !!content.value;
});

const onSubmit = async () => {
    const { result }: Res = await requestTr({
        isMock: true,
        trcode: 'DM0004',
        body: {
            categoryCode: categoryValue.value,
            targetCode: targetValue.value,
            title: title.value,
            content: content.value,
        },
    });

    if (result) {
        toast('게시글이 등록되었습니다.');
        closePopup(true);
    }
};
</script>

<style scoped lang="scss">
.form-field {
    .form-label {
        display: inline-block;
        font-size: 14px;
        line-height: 18px;
        font-weight: 700;
        color: #4d4d4d;
        margin-bottom: 8px;
    }
    .form-input {
        .input-form {
            width: 100%;
        }
        textarea {
            min-height: 198px;
        }
    }
}
</style>

<!-- input 값 관련 -->
<!-- select 넣어야 할까? -->