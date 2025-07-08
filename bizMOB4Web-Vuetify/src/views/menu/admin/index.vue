<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

    <v-row>
        <v-col cols="4">
            <v-card>
                <v-card-text>
                    <v-label class="mb-2 font-weight-medium">Select MvpTreeview Demo</v-label>
                    <!-- <div class="d-flex justify-sm-end ga-2">
                        <v-btn type="submit" class="submit-btn mt-2" flat color="info" @click="setAllSelect">모든 노드 선택</v-btn>
                        <v-btn type="submit" class="submit-btn mt-2" flat color="info" @click="setAllDeselect">모든 노드 선택 해제</v-btn>
                        <v-btn type="submit" class="submit-btn mt-2" flat color="info" @click="allCloseNode">모든 노드 닫기</v-btn>
                        <v-btn type="submit" class="submit-btn mt-2" flat color="info" @click="allOpenNode">모든 노드 펼치기</v-btn>
                    </div> -->
                    <MvpTreeview 
                        ref="selectTreeview"
                        type="select"
                        v-model:selected="selectedNodes"
                        v-model:opened="selectOpenedList"
                        :items="items"
                        :loading="selectLoading"
                        itemValue="userGroupCode"
                        itemTitle="userGroupName"
                        @on-activated-treeview="onActivatedSTreeview"
                    />
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="8">
            <div class="d-flex justify-sm-end gap-2 mb-4">
                <!-- 버튼에 더 넓은 간격과 여백을 추가 -->
                <v-btn
                    type="submit"
                    class="submit-btn"
                    elevation="2"
                    color="primary"
                    @click="openModify"
                >
                수정
                </v-btn>
                <v-btn
                    type="submit"
                    class="submit-btn"
                    elevation="2"
                    color="secondary"
                    @click="deleteSelected"
                >
                삭제
                </v-btn>
            </div>
            <Panel :title="'사용자 그룹'" class="mt-6">
                <v-row>
                    <v-col cols="2" md="2">
                        <v-text-field v-model="userGroupCode" variant="outlined" color="primary" hide-details="true" placeholder="사용자그룹 코드"></v-text-field>
                    </v-col>
                    <v-col cols="2" md="2">
                        <v-text-field v-model="userGroupName" variant="outlined" color="primary" hide-details="true" placeholder="사용자그룹 명"></v-text-field>
                    </v-col>
                    <v-col cols="2" md="2">
                        <v-text-field v-model="userGroupDescription" variant="outlined" color="primary" hide-details="true" placeholder="사용자그룹 설명"></v-text-field>
                    </v-col>
                    <!-- <v-col cols="2" md="2" class="text-right">
                        <v-btn type="submit" flat color="secondary" @click="search">조회</v-btn>
                    </v-col> -->
                </v-row>
            </Panel>
        </v-col>
        <v-col cols="12">
            <div class="d-flex justify-sm-end gap-2 mb-4">
                <!-- 버튼에 더 넓은 간격과 여백을 추가 -->
                <v-btn
                    type="submit"
                    class="submit-btn"
                    elevation="2"
                    color="primary"
                    @click="openModify"
                >
                수정
                </v-btn>
                <v-btn
                    type="submit"
                    class="submit-btn"
                    elevation="2"
                    color="secondary"
                    @click="deleteSelected"
                >
                삭제
                </v-btn>
            </div>
            <v-data-table-server
                :headers="headers"
                :items="pagedItems"
                :item-value="item => item"
                show-select
                v-model="selected"
                :items-per-page="itemsPerPage"
                :items-length="totalItems"
                class="elevation-1 no-wrap-button"
                :loading="loading"
                :hover="true"
            >
                <template v-slot:[`item.accountStartDate`]="{ value }">
                    {{ formatDate(value) }}
                </template>

                <template v-slot:[`item.accountEndDate`]="{ value }">
                    {{ formatDate(value) }}
                </template>

                <template v-slot:[`item.passwordExpireDate`]="{ value }">
                    {{ formatDate(value) }}
                </template>

                <!-- 사용자 정의 슬롯 (사용자ID 클릭 이벤트 추가) -->
                <template v-slot:item.userId="{ item }">
                    <a href="#" @click.prevent="openModifty(item.userId)">
                    {{ item.userId }}
                    </a>
                </template>

                <!-- 사용자 정의 슬롯 -->
                <template v-slot:item.useYn="{ item }">
                    <v-btn
                        :color="item.useYn === 'Y' ? 'primary' : 'secondary'"
                        @click="toggleActive(item)"
                        text
                        outlined
                    >
                    {{ item.useYn === 'Y' ? '사용' : '미사용' }}
                    </v-btn>

                </template>

                <!-- 계정 잠금 사용자 정의 슬롯 -->
                <template v-slot:item.accountLockYn="{ item }">
                    <v-btn
                        :color="item.accountLockYn === 'Y' ? 'primary' : 'secondary'"
                        @click="toggleLocked(item)"
                        text
                        outlined
                    >
                    {{ item.accountLockYn === 'Y' ? 'On' : 'Off' }}
                    </v-btn>
                </template>
                <template v-slot:bottom>
                    <v-divider></v-divider>
                    <div class="d-flex justify-space-between align-center mt-2 mb-3 pl-6">
                        <div class="text-h6">
                            <span>총 {{ totalItems }} 건/ </span><span>선택 {{ selected.length }} 건</span>
                        </div>
                        <div class="d-flex align-center">
                            <MvpSelect
                                v-model="itemsPerPage"
                                :items="itemsPerPageOptions"
                                :placeholder="'선택해주세요.'"
                                itemTitle="title"
                                :is-return-object="true"
                            />
                            <v-pagination
                                class="d-flex align-center ml-4 elevation-0"
                                density="comfortable"
                                v-model="currentPage"
                                :length="totalPages"
                                total-visible="4"
                                @input="pageChange"
                            ></v-pagination>
                        </div>
                    </div>
                </template>
            </v-data-table-server>
        </v-col>
    </v-row>

    <template v-if="isRegisterOpen">
        <RegisterModal :title="'사용자 등록'" @close="closeRegister" />
    </template>
    <template v-if="isModifyOpen">
        <ModifyModal :title="'사용자 수정'" :id="selectedUserId" @close="closeModify" />
    </template>
</template>

<script setup lang="ts">
import { ref, watch, onActivated } from 'vue';
import { parse, format, subDays } from 'date-fns';
import { useNetwork } from '@/shared/composable/useNetwork';
import { useMessage } from '@/shared/composable/useMessage';

import BaseBreadcrumb from '@/components/BaseBreadcrumb.vue';
import { MvpSelect } from '@/components';
import Panel from '@/components/Panel.vue';
import RegisterModal from '@/views/user/modal/RegisterModal.vue';
import ModifyModal from '@/views/user/modal/ModifyModal.vue';

const { alert } = useMessage();
const { requestTr } = useNetwork();

/** 화면 Layout 정보 */
const page = ref({ title: '사용자 그룹' });
const breadcrumbs = ref([
    {
        text: 'User',
        disabled: false,
        href: '#',
    },
    {
        text: 'admin',
        disabled: true,
        href: '#',
    },
]);
const headers: Json[] = [
    { title: '사용자ID', value: 'userId' },
    { title: '이름', value: 'userName' },
    { title: '이메일', value: 'userEmail' },
    { title: '부서', value: 'departmentName' },
    { title: '닉네임', value: 'userNickname' },
    { title: '설명', value: 'userDescription' },
    { title: '계정 시작일', value: 'accountStartDate' },
    { title: '계정 종료일', value: 'accountEndDate' },
    { title: '패스워드 만료일   ', value: 'passwordExpireDate' },
    { title: '사용여부', value: 'useYn', sortable: false },
    { title: '계정잠김', value: 'accountLockYn', sortable: false }
];
const itemsPerPageOptions = ref<Json[]>([
    { title: '10개씩 보기', value: 10 },
    { title: '20개씩 보기', value: 20 },
    { title: '50개씩 보기', value: 50 },
    { title: '100개씩 보기', value: 100 },
]);

const formatDate = (date: string) => {
    return format(parse(date, 'yyyyMMdd', new Date()), 'yyyy-MM-dd');
};

/** 사용자 Req 사용여부, 계정잠김 여부 */
const YnList = ref<Json[]>([
    {title: '사용여부', value: ''},
    {title: '전체', value : 'ALL'},
    {title: '사용', value: 'Y'},
    {title: '미사용', value: 'N'}
]);
const selectedYn = ref<Json | null>(null);
const AccList = ref<Json[]>([
    {title: '계정잠김', value: ''},
    {title: '전체', value: 'ALL'},
    {title: 'ON', value: 'Y'},
    {title: 'OFF', value: 'N'}
]);
const selectedAcc = ref<Json | null>(null);

selectedYn.value = YnList.value[0];
selectedAcc.value = AccList.value[0];

const department = ref('');
const userId = ref('');
const selectedUserId = ref('');
const userNm = ref('');

const loading = ref(false);
const selected = ref([]);  // 선택된 항목을 관리하는 배열
const itemsPerPage = ref(20);
const currentPage = ref(1);
const totalItems = ref(0);
const totalPages = ref(0);
const pagedItems = ref([]);

const isRegisterOpen = ref<any>(false);     //Modal 팝업 관련
const isModifyOpen = ref<any>(false);       //Modal 팝업 관련

/** 코드 */
onActivated(async () => {
    //사용자 
    //await fetchItems(true);   //진입시 조회 하지 않음.
});

// 페이지 변경
watch([itemsPerPage, currentPage], () => fetchItems());

// 검색
function search() {
    if (validateForm()) {
        if (currentPage.value === 1) {
            fetchItems();
        }
        else {
            currentPage.value = 1;
        }
    } else {
        alert('필수값을 입력해주세요.');
    }
}

//등록 버튼 Validation
function validateForm() {
    if (selectedYn.value?.value && selectedAcc.value?.value) {
        return true;
    } else {
        return false;
    }
}

// 데이터 조회
async function fetchItems(isLoading: boolean = false) {
    loading.value = true;

    try {
        const { body }: any = await requestTr({
            trcode: 'MVP9000',
            body: {
                page: currentPage.value, // 현재 페이지
                pageSize: itemsPerPage.value, // 페이지 당 보여지는 게시글의 최대 개수
                userId: userId.value, //  사용자 ID (like 검색)
                userName: userNm.value, // 사용자 이름 (like 검색)
                useYn: selectedYn.value?.value, // 사용 여부 (ALL:전체, Y:사용, N:미사용)
                accountLockYn: selectedAcc.value?.value, // 계정 잠김 여부 (ALL:전체, Y:On, N:Off)
                blockSize: 2,   //  페이징된 버튼의 블럭당 최대 개수
                departmentName: department.value, //  부서 명 (like 검색)
            },
            isMock: false,
            isLoading,
        });

        pagedItems.value = body.userList;
        totalItems.value = Number(body.totalListCount);
        totalPages.value = Number(body.totalPageCnt);
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        loading.value = false;
    }
}

function pageChange(page: number) {
    currentPage.value = page;
    console.log(currentPage);
    // 페이지 전환 처리 로직...
}

async function toggleActive(user:any) {
    loading.value = true;

    try {
        const { body }: any = await requestTr({
            trcode: 'MVP9002',
            body: {
                userId: user.userId, // 사용자 ID
                useYn: user.useYn === 'Y' ? 'N' : 'Y', // 사용 여부 (Y:사용, N:미사용)
            },
            isMock: false,
            isLoading: true,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        loading.value = false;
    }

    user.useYn = user.useYn === 'Y' ? 'N' : 'Y';
}

async function toggleLocked(user:any) {
    loading.value = true;

    try {
        const { body }: any = await requestTr({
            trcode: 'MVP9003',
            body: {
                userId: user.userId, // 사용자 ID
                accountLockYn: user.accountLockYn === 'Y' ? 'N' : 'Y', // 계정 잠김 여부 (Y:On, N:Off)
            },
            isMock: false,
            isLoading: true,
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    } finally {
        loading.value = false;
    }

    user.accountLockYn = user.accountLockYn === 'Y' ? 'N' : 'Y';
}

async function openRegister() {
    isRegisterOpen.value = true;
}

async function deleteSelected(isLoading: boolean = false) {
    if (selected.value && selected.value.length > 0) {
        const result = await alert({
            message: '삭제하시겠습니까?',
            buttons: [
                { text: '취소', value: false },
                { text: '삭제', value: true }
            ]
        });

        if (result) {
            const userList = ref<{ userId: string }[]>([]); // 타입을 명시적으로 지정

            selected.value.forEach((item: { userId: string }) => {
                // 새로운 트리 노드 생성
                const list = { 
                    userId: item.userId,
                };

                userList.value.push(list);
            });

            loading.value = true;

            try {
                const { body }: any = await requestTr({
                    trcode: 'MVP9001',
                    body: {
                        'userList': userList.value
                    },
                    isMock: false,
                    isLoading,
                });

                console.log(body);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                loading.value = false;
            }

            selected.value = [];

            fetchItems();   //재조회
        }
    } else {
        alert('삭제하고자 하는 항목을 선택하세요.');
    }
}

function closeRegister(msg: any) {
    isRegisterOpen.value = false;

    if (msg.result) {
        fetchItems();
    }
}
async function openModifty(userId:any) {
    selectedUserId.value = userId;
    isModifyOpen.value = true;
}

function closeModify(msg: any) {
    isModifyOpen.value = false;

    if (msg.result) {
        fetchItems();
    }
}
</script>

<style>
.v-table .v-table__wrapper {
    border-radius: 7px 7px 0 0;
}

.v-table.v-table--hover > .v-table__wrapper > table > tbody > tr:hover > td::after {
    background-color: rgba(0, 0, 0, 0.1);
}

.no-wrap-button {
  white-space: nowrap;
}
</style>