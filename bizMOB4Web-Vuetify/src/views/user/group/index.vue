<template>
    <BaseBreadcrumb :title="page.title" :breadcrumbs="breadcrumbs"></BaseBreadcrumb>

    <v-row>
        <v-col cols="12">
            <Panel :title="'사용자 그룹'" class="mt-6">
                <v-row>
                    <v-col cols="2" md="2">
                        <v-text-field v-model="userGNm" variant="outlined" color="primary" hide-details="true" placeholder="사용자그룹 명"></v-text-field>
                    </v-col>
                    <v-col cols="2" md="2">
                        <v-text-field v-model="userNm" variant="outlined" color="primary" hide-details="true" placeholder="사용자명"></v-text-field>
                    </v-col>
                    <v-col cols="2" md="2">
                        <v-text-field v-model="userId" variant="outlined" color="primary" hide-details="true" placeholder="사용자ID"></v-text-field>
                    </v-col>
                    <v-col cols="6" md="6" class="text-right">
                        <v-btn type="submit" flat color="secondary" @click="search">조회</v-btn>
                    </v-col>
                </v-row>
            </Panel>
        </v-col>
        <v-col cols="4">
            <v-card>
                <v-card-text>
                    <!-- <v-btn type="submit" class="text-right" flat color="primary" @click="search">사용자그룹 등록</v-btn> -->
                    <!-- <v-card-actions class="justify-end">
                        <v-btn type="submit" flat color="primary" @click="search">사용자그룹 등록</v-btn>
                    </v-card-actions> -->
                    <!-- <v-label class="mb-2 font-weight-medium">Activate MvpTreeview Demo</v-label> -->
                    <div class="d-flex justify-sm-end ga-1">
                        <v-btn type="submit" class="submit-btn mt-2" flat color="info" @click="activateTreeview?.changeActivatedNode('0')">사용자그룹 등록</v-btn>
                    </div>
                    <MvpTreeview 
                        ref="activateTreeview"
                        type="activate"
                        v-model:activated="activatedNode"
                        v-model:opened="activateOpenedList"
                        :items="items"
                        :loading="activateLoading"
                        itemValue="userGroupCode"
                        itemTitle="userGroupName"
                        @on-activated-treeview="onActivatedATreeview"
                    />
                </v-card-text>
            </v-card>
        </v-col>
        <v-col cols="8">

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
import { MvpTreeview, MvpInput, MvpSelect } from '@/components';

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
    { title: '설명', value: 'userDescription' },
    { title: '사용여부', value: 'useYn', sortable: false },
];

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

// 트리구조 변수
const userGroupList = ref<Json[]>([]);
const items = ref<Json[]>([]); // 트리 구조의 데이터

/* MvpTreeview */
const activateTreeview = ref();

const activateLoading = ref<boolean>(true); // Progress Loading
const activatedNode = ref<Json>({}); // 활성화 노드 객체
const activateOpenedList = ref<Json[]>([]); // 오픈된 노드 객체 목록

/* MvpTreeview */
const selectTreeview = ref();

const selectLoading = ref<boolean>(true); // Progress Loading
const selectedNodes = ref<Json[]>([]); // 선택된 노드 객체
const selectOpenedList = ref<Json[]>([]); // 오픈된 노드 객체 목록

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

/**
 * 모든 노드 열기
 * select
 */ 
function allOpenNode() {
    selectTreeview.value.allOpenNode();
}

async function getUserGroupList() {
    activateLoading.value = true;
    selectLoading.value = true;

    const { result, body }: any = await requestTr({
        trcode: 'MVP9009',
        body: {
            userGroupName: '',
            userName: '',
            userId: '',
            useYn: 'ALL',
        },
        isLoading: false,
        isMock: true,
    });
    if (result) {
        activateLoading.value = false;
        selectLoading.value = false;
        return body.userGroupList;
    }
    return null;
}

onActivated(async () => {
    items.value.length = 0;
    setTimeout(async() => {
        try {
            userGroupList.value = await getUserGroupList();
            items.value = listToTree(userGroupList.value);
        } catch (error) {
            console.error('데이터 가져오기 실패:', error);
        } finally {
            allOpenNode();
        }
    }, 1000);
});

/**
 * 트리 구조로 변경
 */
function listToTree(data: Json[]) {
    const rootNodes: Json[] = [];
    const lookup: { [key: number]: Json } = {};

    // 각 항목에 대해 트리 노드 생성
    data.forEach(item => {
        // 새로운 트리 노드 생성
        const node = { 
            userGroupCode: item.userGroupCode,
            parentUserGroupLevel: item.parentUserGroupLevel,
            parentUserGroupCode: item.parentUserGroupCode,
            userGroupName: item.userGroupName,
            userGroupDescription: item.userGroupDescription,
            userGroupLevel: item.userGroupLevel,
            userGroupSortOrder: item.userGroupSortOrder,
            children: null,
        };
        lookup[item.userGroupCode] = node; // id를 키로 하는 맵에 저장

        if (item.parentUserGroupCode === null) {
        // 부모가 없으면 루트 노드로 추가
            rootNodes.push(node);
        } else {
            // 부모가 있으면 부모의 자식으로 추가
            const parentNode = lookup[item.parentUserGroupCode];
            if (parentNode) {
                if (!parentNode.children) {
                    parentNode.children = [];
                }
                parentNode.children.push(node);
            }
        }
    });

    return rootNodes;
}

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

/**
 * MvpTreeview Mounted (activate)
 * treeview Mounted 완료 시 호출
 */
async function onActivatedATreeview() {
    console.log('### onActivated Activate Treeview');
}

/**
 * MvpTreeview Mounted (select)
 * treeview Mounted 완료 시 호출
 */
function onActivatedSTreeview() {
    console.log('### onActivated Select Treeview');
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