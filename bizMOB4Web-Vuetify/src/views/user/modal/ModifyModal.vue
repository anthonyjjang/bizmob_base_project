<template>
    <!-- class="dialog-mw" -->
    <v-dialog
        :model-value="true"
        transition="dialog-right-transition"
        content-class="dialog-content"
        fullscreen
        :style="{
            height: '100vh',
            width: '36%',
            justifySelf: 'self-end',
            margin: '0',
        }"
        @after-leave="emit('close', { message: '닫기' })"
    >
        <v-card height="100vh" class="overflow-auto rounded-e-0">
            <v-container v-if="isDataFetch">
                <v-card-title class="pa-5">
                    <span class="text-h5">{{ title }}</span>
                </v-card-title>

                <v-card-text>
                    <v-row class="field-label">
                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium required-label">사용자ID<span class="required-field">*</span></v-label>
                            <v-text-field v-model="userId" color="primary" variant="outlined" hide-details="true"></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium required-label">이름<span class="required-field">*</span></v-label>
                            <v-text-field v-model="userNm" color="primary" variant="outlined" hide-details="true"></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium required-label">이메일<span class="required-field">*</span></v-label>
                            <v-text-field v-model="userEmail" color="primary" variant="outlined" hide-details="true"></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium required-label">부서<span class="required-field">*</span></v-label>
                            <v-select
                                v-model="selectedGroup"
                                :items="departmentList"
                                item-title="locationFullName"
                                item-value="departmentCode"
                                return-object
                                single-line
                                variant="outlined"
                                hide-details
                            ></v-select>
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium">닉네임</v-label>
                            <v-text-field v-model="userNickNm" color="primary" variant="outlined" hide-details="true"></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium">설명</v-label>
                            <v-text-field v-model="userContent" color="primary" variant="outlined" hide-details="true"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium required-label">사용여부<span class="required-field">*</span></v-label>
                            <v-radio-group inline v-model="useYn" hide-details>
                                <v-row>
                                    <v-col cols="12" md="4"><v-radio label="활성화" color="primary"  value="Y"></v-radio></v-col>
                                    <v-col cols="12" md="4"><v-radio label="비활성화" color="primary" value="N"></v-radio></v-col>
                                </v-row>
                            </v-radio-group>
                        </v-col>
                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium required-label">계정잠김<span class="required-field">*</span></v-label>
                            <v-radio-group inline v-model="accountLockYn" hide-details>
                                <v-row>
                                    <v-col cols="12" md="4"><v-radio label="활성화" color="primary"  value="Y"></v-radio></v-col>
                                    <v-col cols="12" md="4"><v-radio label="비활성화" color="primary" value="N"></v-radio></v-col>
                                </v-row>
                            </v-radio-group>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium required-label">계정 시작일<span class="required-field">*</span></v-label>
                            <v-text-field v-model="dStartDate" color="primary" variant="outlined" type="date" hide-details="true"></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium required-label">계정 종료일<span class="required-field">*</span></v-label>
                            <v-text-field v-model="dEndDate" color="primary" variant="outlined" type="date" hide-details="true"></v-text-field>
                        </v-col>

                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium required-label">패스워드 만료일<span class="required-field">*</span></v-label>
                            <v-text-field v-model="passwordExpiredDate" color="primary" variant="outlined" type="date" hide-details="true"></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-label class="mb-2 font-weight-medium required-label">비밀번호<span class="required-field">*</span></v-label>
                            <v-text-field v-model="userPassword" color="primary" variant="outlined" hide-details="true"></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider class="mt-4"></v-divider>
                <div class="d-flex justify-end mt-4">
                    <v-btn flat color="error" variant="outlined" @click="emit('close', { result: false })">취소</v-btn>
                    <v-btn flat color="primary" class="ml-4" @click="submit">저장</v-btn>
                </div>
            </v-container>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { type PropType, ref, onMounted, computed } from 'vue';
import { useMessage } from '@/shared/composable/useMessage';
import { parse, format, subDays, addDays } from 'date-fns';
import { useNetwork } from '@/shared/composable/useNetwork';

const { requestTr } = useNetwork();
const { alert } = useMessage();

const emit = defineEmits([
    'close'
]);
const props = defineProps({
    title: { type: String as PropType<string> },
    id: { type: String as PropType<string> }
});

const isDataFetch = ref(false);
const id = ref(props.id);

const departmentList = ref<Json[]>([]);     //부서 리스트
const selectedGroup = ref<Json | null>(null);
const detail = ref<Json | null>(null);

const userId = ref<string>('');
const userNm = ref<string>('');
const userEmail = ref<string>('');
const userNickNm = ref<string>('');
const userContent = ref<string>('');
const useYn = ref<string>('');
const accountLockYn = ref<string>('');
const passwordExpiredDate = ref(format(addDays(new Date(), 30), 'yyyy-MM-dd'));
const userPassword = ref<string>('');
const dStartDate = ref(format(new Date(), 'yyyy-MM-dd'));
const dEndDate = ref(format(new Date(), 'yyyy-MM-dd'));

const formatDate = (date: string) => {
    return format(parse(date, 'yyyyMMdd', new Date()), 'yyyy-MM-dd');
};

onMounted(async() => {
    if (id.value) {
        [departmentList.value, detail.value] = await Promise.all([
            fetchNoticeGroupList(),
            fetchItem()
        ]);

        if (detail.value) {
            selectedGroup.value = { departmentName: detail.value.departmentName, departmentCode: detail.value.departmentCode, locationFullName: detail.value.locationFullName };

            userId.value = id.value;
            dStartDate.value = formatDate(detail.value.accountStartDate);
            dEndDate.value = formatDate(detail.value.accountEndDate);
            userNm.value = detail.value.userName;
            userEmail.value = detail.value.userEmail;
            passwordExpiredDate.value = formatDate(detail.value.passwordExpireDate);
            accountLockYn.value = detail.value.accountLockYn;
            userContent.value = detail.value.userDescription;
            useYn.value = detail.value.useYn;
            userNickNm.value = detail.value.userNickname;
            userPassword.value = detail.value.userPassword;
        }
        else {
            emit('close', { result: false });
        }
    }
    else {
        departmentList.value = await fetchNoticeGroupList();
        selectedGroup.value = departmentList.value[0];
    }

    isDataFetch.value = true;
});

async function fetchNoticeGroupList() {
    const { result, body }: any = await requestTr({
        trcode: 'MVP9004',
        body: {
        },
        isMock: false,
        isLoading: true,
    });

    if (result) {
        return body.departmentList;
    }
    else {
        return [];
    }
}

// 데이터 조회
async function fetchItem() {
    const { result, body }: any = await requestTr({
        trcode: 'MVP9006',
        body: {
            userId: id.value
        },
        isMock: false,
        isLoading: true,
    });

    if (result) {
        return body;
    }
    else {
        return null;
    }
}

// 첨부파일 조회
async function fetchFiles() {
    if (!detail.value || !detail.value.attachNo) {
        return [];
    }

    const { result, body }: any = await requestTr({
        trcode: 'MVP0003',
        body: {
            attachFileNoList: [{
                attachFileNo: detail.value.attachNo
            }]
        },
        isMock: false,
        isLoading: true,
    });

    return result ? body.attachFileNoList[0]?.attachFileList || [] : [];
}

async function submit() {
    if (validateForm()) {
        const { result }: any = await requestTr({
            trcode: 'MVP9007',
            body: {
                accountEndDate: dEndDate.value.replace(/-/gi, ''), //계정 종료 일 (YYYYMMDD)
                accountLockYn: accountLockYn.value, //계정 잠김 여부 (Y:On, N:Off)
                accountStartDate: dStartDate.value.replace(/-/gi, ''), //계정 시작 일 (YYYYMMDD)
                departmentCode: selectedGroup.value?.departmentCode, //부서 코드
                departmentName: selectedGroup.value?.departmentName, //부서 명
                passwordExpireDate: passwordExpiredDate.value.replace(/-/gi, ''), //패스워드 만료 일 (YYYYMMDD)
                userDescription: userContent.value, //사용자 설명
                userEmail: userEmail.value, //사용자 이메일
                userId: userId.value, //사용자 ID
                userName: userNm.value, //사용자 이름
                userNickname: userNickNm.value, //사용자 닉네임
                userPassword: userPassword.value, //사용자 비밀번호
                useYn: useYn.value, //사용 여부 (Y:사용, N:미사용)
            },
            isMock: false,
            isLoading: true,
        });

        if (result) {
            const result = await alert({
                message: '수정을 완료하였습니다.',
                buttons: [
                    { text: '확인', value: true },
                ]
            });

            if (result) {
                return emit('close', { result: true });
            }
        }
        else {
            return null;
        }
    } else {
        alert('필수값을 입력해주세요.');
    }
}

//등록 버튼 Validation
function validateForm() {
    if (userId.value && userNm.value && userEmail.value && selectedGroup.value?.departmentCode && useYn.value && 
    accountLockYn.value && dStartDate.value && dEndDate.value && passwordExpiredDate.value && userPassword.value) {
        return true;
    } else {
        return false;
    }
}
</script>

<style lang="scss">
.editor-menubar {
    border: 1px solid rgba(var(--v-border-color)) !important;
}
.editor-content > div {
    min-height: 300px;
    border: 1px solid rgba(var(--v-border-color)) !important;
}
.field-label {
  display: flex;
  flex-direction: column;
}
.required-label {
  display: flex;
  align-items: center;
  font-weight: bold;
}
.required-field {
  color: red;
  margin-left: 4px;
  font-size: 12px; /* 필수 기호 크기 조절 */
}
</style>